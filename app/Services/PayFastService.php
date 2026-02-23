<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class PayFastService
{
    protected $merchantId;
    protected $merchantKey;
    protected $passphrase;
    protected $testMode;
    protected $apiUrl;

    public function __construct()
    {
        $this->merchantId = config('payfast.merchant_id');
        $this->merchantKey = config('payfast.merchant_key');
        $this->passphrase = config('payfast.passphrase');
        $this->testMode = config('payfast.test_mode');
        
        $mode = $this->testMode ? 'testing' : 'live';
        $this->apiUrl = config("payfast.urls.{$mode}.api");
    }
    /**
 * Get the PayFast API URL
 */
public function getApiUrl(): string
{
    return $this->apiUrl;
}

    /**
     * Generate payment form data for PayFast
     */
    public function generatePaymentData(Order $order)
    {
        $data = [
            // Merchant details
            'merchant_id' => $this->merchantId,
            'merchant_key' => $this->merchantKey,
            'return_url' => route('payfast.return', ['order' => $order->id]),
            'cancel_url' => route('payfast.cancel', ['order' => $order->id]),
            'notify_url' => route('payfast.notify'),
            
            // Buyer details
            'name_first' => $order->user->first_name,
            'name_last' => $order->user->last_name,
            'email_address' => $order->user->email,
            'cell_number' => $order->user->phone,
            
            // Transaction details
            'm_payment_id' => $order->order_number,
            'amount' => number_format($order->total_amount, 2, '.', ''),
            'item_name' => 'Order #' . $order->order_number,
            'item_description' => 'Greycode Shop Order',
            
            // Custom fields
            'custom_int1' => $order->id,
            'custom_str1' => 'greycode_shop',
        ];

        // Add passphrase if set
        if ($this->passphrase) {
            $data['passphrase'] = $this->passphrase;
        }

        // Generate signature
        $data['signature'] = $this->generateSignature($data);

        return $data;
    }

    /**
     * Generate PayFast signature
     */
    protected function generateSignature($data)
    {
        // Exclude signature field if it exists
        unset($data['signature']);

        // Sort the data by key
        ksort($data);

        // Create parameter string
        $paramString = '';
        foreach ($data as $key => $value) {
            if (!empty($value) && $key !== 'passphrase') {
                $paramString .= $key . '=' . urlencode(trim($value)) . '&';
            }
        }

        // Remove trailing &
        $paramString = rtrim($paramString, '&');

        // Generate signature
        return md5($paramString);
    }

    /**
     * Validate ITN (Instant Transaction Notification)
     */
    public function validateItn($data)
    {
        // Clean the data
        $cleanData = $this->cleanItnData($data);

        // Generate signature for comparison
        $signature = $this->generateSignature($cleanData);

        // Check if signature matches
        if (!isset($data['signature']) || $data['signature'] !== $signature) {
            Log::warning('PayFast ITN: Invalid signature');
            return false;
        }

        // Verify with PayFast
        return $this->verifyWithPayFast($data);
    }

    /**
     * Clean ITN data
     */
    protected function cleanItnData($data)
    {
        $cleanData = [];
        foreach ($data as $key => $value) {
            if ($key !== 'signature' && !str_starts_with($key, 'payment_status')) {
                $cleanData[$key] = $value;
            }
        }
        return $cleanData;
    }

    /**
     * Verify transaction with PayFast
     */
    protected function verifyWithPayFast($data)
    {
        $validateUrl = $this->testMode 
            ? 'https://sandbox.payfast.co.za/eng/query/validate' 
            : 'https://www.payfast.co.za/eng/query/validate';

        // Prepare POST data
        $postData = http_build_query($data);

        // Initialize cURL
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $validateUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_SSL_VERIFYPEER => false, // Set to true in production
            CURLOPT_SSL_VERIFYHOST => false, // Set to 2 in production
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_USERAGENT => 'Greycode Shop',
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Check response
        if ($httpCode === 200 && strtoupper($response) === 'VALID') {
            return true;
        }

        Log::warning('PayFast ITN: Verification failed', [
            'response' => $response,
            'http_code' => $httpCode
        ]);

        return false;
    }
}
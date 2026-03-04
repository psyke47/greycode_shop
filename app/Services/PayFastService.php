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

    public function getApiUrl(): string
    {
        return $this->apiUrl;
    }

    /**
     * Generate payment data for PayFast (without passphrase field)
     */
    public function generatePaymentData(Order $order): array
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
            'name_last'  => $order->user->last_name,
            'email_address' => $order->user->email,
            'cell_number' => $order->user->phone,
            
            // Transaction details
            'm_payment_id' => $order->order_number,
            'amount' => number_format($order->total_amount, 2, '.', ''),
            'item_name' => 'Order #' . $order->order_number,
            'item_description' => 'Greycode Shop Order',
            
            // Custom fields (optional)
            'custom_int1' => $order->id,
            'custom_str1' => 'greycode_shop',
        ];

        // Generate signature using the correct order (no sorting, passphrase only in hash)
        $signature = $this->generateSignature($data, $this->passphrase);
        $data['signature'] = $signature;

        return $data;
    }

    /**
     * Generate PayFast signature as per official documentation
     */
    protected function generateSignature(array $data, ?string $passPhrase = null): string
    {
        // Build parameter string in the EXACT order of the $data array
        $pfOutput = '';
        foreach ($data as $key => $value) {
            if ($value !== '') { // exclude empty values
                // Use urlencode (spaces become '+', uppercase hex)
                $pfOutput .= $key . '=' . urlencode(trim($value)) . '&';
            }
        }
        // Remove trailing '&'
        $getString = rtrim($pfOutput, '&');

        // Append passphrase if provided (NOT sent as field, only for hash)
        if ($passPhrase !== null) {
            $getString .= '&passphrase=' . urlencode(trim($passPhrase));
        }

        // Optional debug log
        Log::info('PayFast signature string: ' . $getString);

        return md5($getString);
    }

    /**
     * Validate ITN (Instant Transaction Notification)
     */
    public function validateItn(array $data): bool
    {
        $cleanData = $this->cleanItnData($data);
        $signature = $this->generateSignature($cleanData, $this->passphrase);

        if (!isset($data['signature']) || $data['signature'] !== $signature) {
            Log::warning('PayFast ITN: Invalid signature');
            return false;
        }

        return $this->verifyWithPayFast($data);
    }

    protected function cleanItnData(array $data): array
    {
        $cleanData = [];
        foreach ($data as $key => $value) {
            if ($key !== 'signature' && !str_starts_with($key, 'payment_status')) {
                $cleanData[$key] = $value;
            }
        }
        return $cleanData;
    }

    protected function verifyWithPayFast(array $data): bool
    {
        $validateUrl = $this->testMode 
            ? 'https://sandbox.payfast.co.za/eng/query/validate' 
            : 'https://www.payfast.co.za/eng/query/validate';

        $postData = http_build_query($data);

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $validateUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_SSL_VERIFYPEER => false, // Set true in production
            CURLOPT_SSL_VERIFYHOST => false, // Set 2 in production
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_USERAGENT => 'Greycode Shop',
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

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
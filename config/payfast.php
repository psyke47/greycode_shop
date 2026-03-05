<?php

return [
    'merchant_id' => env('PAYFAST_MERCHANT_ID'),
    'merchant_key' => env('PAYFAST_MERCHANT_KEY'),
    'passphrase' => env('PAYFAST_PASSPHRASE', ''),
    'test_mode' => env('PAYFAST_TEST_MODE', true),
    
    'urls' => [
        'testing' => [
            'api' => 'https://sandbox.payfast.co.za/eng/process',
            'validate' => 'https://sandbox.payfast.co.za/eng/query/validate',
        ],
        'live' => [
            'api' => 'https://www.payfast.co.za/eng/process',
            'validate' => 'https://www.payfast.co.za/eng/query/validate',
        ],
    ],
];
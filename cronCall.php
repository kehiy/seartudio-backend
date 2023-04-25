<?php

// Set up API endpoints
$api1Endpoint = 'https://api.seartudio.com/cron/checkExpier';
$api2Endpoint = 'https://api.seartudio.com/cron/checkPromotExpier';

// Set up request payloads
$payload1 = json_encode(array('cornKey' => 'qAMEaJC7nSAzLmfxsRiWEyN0EFF'));
$payload2 = json_encode(array('cornKey' => 'qAMEaJC7nSAzLmfxsRiWEyN0EFF'));

// Initialize cURL handles
$ch1 = curl_init();
$ch2 = curl_init();

// Set cURL options for first API call
curl_setopt($ch1, CURLOPT_URL, $api1Endpoint);
curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch1, CURLOPT_POST, true);
curl_setopt($ch1, CURLOPT_POSTFIELDS, $payload1);

// Set cURL options for second API call
curl_setopt($ch2, CURLOPT_URL, $api2Endpoint);
curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_POST, true);
curl_setopt($ch2, CURLOPT_POSTFIELDS, $payload2);

// Execute both cURL handles in parallel using multi-cURL
$mh = curl_multi_init();
curl_multi_add_handle($mh, $ch1);
curl_multi_add_handle($mh, $ch2);
$active = null;
do {
    $mrc = curl_multi_exec($mh, $active);
} while ($mrc == CURLM_CALL_MULTI_PERFORM);
while ($active && $mrc == CURLM_OK) {
    if (curl_multi_select($mh) != -1) {
        do {
            $mrc = curl_multi_exec($mh, $active);
        } while ($mrc == CURLM_CALL_MULTI_PERFORM);
    }
}

// Get response data from both API calls
$response1 = curl_multi_getcontent($ch1);
$response2 = curl_multi_getcontent($ch2);

// Close cURL handles and multi-cURL handle
curl_multi_remove_handle($mh, $ch1);
curl_multi_remove_handle($mh, $ch2);
curl_multi_close($mh);

// Process response data as needed
echo "API 1 response: " . $response1 . "\n";
echo "API 2 response: " . $response2 . "\n";

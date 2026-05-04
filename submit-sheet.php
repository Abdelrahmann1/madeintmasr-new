<?php
// submit-sheet.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Only POST method allowed"]);
    exit;
}

// Get form data
$name     = trim($_POST['name'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$compound = trim($_POST['compound'] ?? '');

if (empty($name) || empty($phone) || empty($compound)) {
    echo json_encode(["success" => false, "error" => "Missing required fields"]);
    exit;
}

// ─── 1. Send to Google Sheets ────────────────────────────────────────────────

$scriptURL = "https://script.google.com/macros/s/AKfycby5io5W_E8_PHm9XkFC1JqX7LXiNTrNZMSe9Wnb9Jy38GyLxU6N4iSvjv2nb5Od120L/exec";

$postData = http_build_query([
    'Name'     => $name,
    'Phone'    => $phone,
    'Compound' => $compound
]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $scriptURL);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$sheetSuccess = ($httpCode === 200 && !empty($response));

// ─── 2. Send Email Notification ──────────────────────────────────────────────

$to      = "landing.pages@ureeg.com";
$subject = "New Lead: $compound";

$body  = "You have a new submission:\n\n";
$body .= "Name:     $name\n";
$body .= "Phone:    $phone\n";
$body .= "Compound: $compound\n";
$body .= "\nSubmitted at: " . date('Y-m-d H:i:s') . "\n";

$headers  = "From: Your Lead <no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'yourdomain.com') . ">\r\n";
$headers .= "Reply-To: $to\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$mailSent = mail($to, $subject, $body, $headers);

// ─── 3. Respond ──────────────────────────────────────────────────────────────

if ($sheetSuccess) {
    echo json_encode([
        "success"   => true,
        "message"   => $response,
        "mail_sent" => $mailSent
    ]);
} else {
    error_log("GAS Error: HTTP $httpCode, Response: $response");
    echo json_encode(["success" => false, "error" => "Failed to submit data to sheet"]);
}
?>

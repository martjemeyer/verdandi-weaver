<?php
declare(strict_types=1);

require __DIR__ . '/vendor/phpmailer/Exception.php';
require __DIR__ . '/vendor/phpmailer/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

// smtp-config.php is generated at deploy time from GitHub Actions
// secrets (see .github/workflows/deploy.yml) — it is never committed
// to git. Locally it won't exist, which is fine: the dev server can't
// send mail anyway.
$configPath = __DIR__ . '/smtp-config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'message' => 'Mail is not configured on this environment.']);
    exit;
}
$config = require $configPath;

$mailbox = $config['username']; // verdandi@verdandiweaver.com — also the receiving inbox

function respond(bool $wantsJson, bool $ok, string $message, int $status = 200): void {
    http_response_code($status);
    if ($wantsJson) {
        header('Content-Type: application/json');
        echo json_encode(['ok' => $ok, 'message' => $message]);
    } else {
        header('Location: /contact.html?sent=' . ($ok ? '1' : '0'));
    }
    exit;
}

$wantsJson = strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond($wantsJson, false, 'Method not allowed', 405);
}

// Honeypot — bots fill hidden fields, real visitors never do
if (!empty($_POST['_gotcha'])) {
    respond($wantsJson, true, 'Thank you.');
}

$name    = trim(str_replace(["\r", "\n"], '', $_POST['name'] ?? ''));
$email   = trim(str_replace(["\r", "\n"], '', $_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
    respond($wantsJson, false, 'Please provide a valid email and a message.', 422);
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $config['host'];
    $mail->Port       = $config['port'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['username'];
    $mail->Password   = $config['password'];
    $mail->SMTPSecure = $config['encryption']; // 'ssl' (port 465) or 'tls' (port 587)
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($mailbox, 'Verdandi Weaver Website');
    $mail->addAddress($mailbox);
    $mail->addReplyTo($email, $name !== '' ? $name : $email);

    $mail->Subject = 'New message from the Verdandi Weaver contact form';
    $mail->Body    = "Name: " . ($name !== '' ? $name : '(not provided)') . "\n"
                   . "Email: {$email}\n\n"
                   . "Message:\n{$message}\n";

    $mail->send();
    respond($wantsJson, true, 'Thank you — your message has been sent.');
} catch (PHPMailerException $e) {
    // TEMP DEBUG — remove once delivery is confirmed working
    respond($wantsJson, false, 'DEBUG: ' . $mail->ErrorInfo . ' | ' . $e->getMessage(), 500);
}

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
        $back = $_SERVER['HTTP_REFERER'] ?? '/';
        $sep  = strpos($back, '?') === false ? '?' : '&';
        header('Location: ' . $back . $sep . 'subscribed=' . ($ok ? '1' : '0'));
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

$email = trim(str_replace(["\r", "\n"], '', $_POST['email'] ?? ''));
$page  = trim(str_replace(["\r", "\n"], '', $_POST['page'] ?? ($_SERVER['HTTP_REFERER'] ?? 'unknown page')));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond($wantsJson, false, 'Please provide a valid email address.', 422);
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
    $mail->addReplyTo($email, $email);

    // Subject line makes it unmistakable this is a newsletter signup,
    // not a contact-form message, so it can never be confused for one.
    $mail->Subject = '[Newsletter signup] New "Stay near" subscriber';
    $mail->Body    = "Someone asked to join the \"Stay near\" newsletter.\n\n"
                   . "Email: {$email}\n"
                   . "From page: {$page}\n";

    $mail->send();
    respond($wantsJson, true, "Thank you — you're on the list.");
} catch (PHPMailerException $e) {
    respond($wantsJson, false, 'Something went wrong sending that. Please try again in a moment.', 500);
}

<?php
// Template only — never filled in or committed with real values.
// In production, deploy.yml generates src/smtp-config.php (gitignored)
// from GitHub Actions secrets SMTP_USERNAME / SMTP_PASSWORD before the
// FTP upload. For local testing, copy this file to smtp-config.php
// and fill in real values (it will stay untracked).
return [
    'host'       => 'smtp.titan.email', // Hostinger's default mailboxes are Titan Mail under the hood
    'port'       => 465,
    'encryption' => 'ssl', // 'ssl' for port 465, 'tls' for port 587
    'username'   => 'verdandi@verdandiweaver.com',
    'password'   => 'REPLACE_ME',
];

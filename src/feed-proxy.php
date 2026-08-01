<?php
declare(strict_types=1);

// Fetches a Substack feed server-side, from this site's own hosting,
// and hands the XML back to the browser untouched. Exists because
// Substack's feeds have no Access-Control-Allow-Origin header, so a
// direct browser fetch from verdandiweaver.com to substack.com is
// blocked by CORS; this endpoint is same-origin with the page calling
// it, so no CORS problem exists for that request at all. Separately,
// GitHub Actions' shared IPs get a hard 403 from Substack regardless
// of domain — this endpoint runs per real visitor request from this
// site's own hosting, not from a CI runner, and was never blocked.
//
// A closed allow-list, not an open proxy — never forwards an
// arbitrary caller-supplied URL, only one of the publication's own
// known feeds, so this can't be abused as a general relay.
$allowedFeeds = [
    'main' => 'https://verdandiweaver.substack.com/feed',
    'vagaTanka' => 'https://api.substack.com/feed/podcast/5888631/s/431727.rss',
    'rethinkingEverything' => 'https://api.substack.com/feed/podcast/5888631.rss',
];

$key = $_GET['feed'] ?? '';
if (!isset($allowedFeeds[$key])) {
    http_response_code(404);
    header('Content-Type: text/plain');
    echo 'Not found';
    exit;
}

$target = $allowedFeeds[$key];
$userAgent = 'Mozilla/5.0 (compatible; VerdandiWeaverFeedProxy/1.0)';

// cURL is the primary path — near-universally available on shared
// hosting and not gated by the allow_url_fopen setting some hosts
// disable for security. Falls back to file_get_contents only if the
// curl extension genuinely isn't present.
if (function_exists('curl_init')) {
    $ch = curl_init($target);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_USERAGENT => $userAgent,
    ]);
    $body = curl_exec($ch);
    $status = $body === false ? 502 : (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
} else {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => "User-Agent: {$userAgent}\r\n",
            'timeout' => 10,
            'ignore_errors' => true,
        ],
    ]);
    $body = @file_get_contents($target, false, $context);
    $status = 200;
    foreach ($http_response_header ?? [] as $header) {
        if (preg_match('#^HTTP/\S+\s+(\d{3})#', $header, $m)) {
            $status = (int) $m[1];
        }
    }
    if ($body === false) $status = 502;
}

if ($body === false || $body === '') {
    http_response_code(502);
    header('Content-Type: text/plain');
    echo 'Could not reach the feed.';
    exit;
}

http_response_code($status);
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=1800');
header('Access-Control-Allow-Origin: *');
echo $body;

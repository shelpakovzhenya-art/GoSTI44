<?php

namespace App\Support;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

final class ContentSanitizer
{
    public static function clean(array $data): array
    {
        $sanitizer = new HtmlSanitizer((new HtmlSanitizerConfig)->allowSafeElements()->allowLinkSchemes(['https', 'http', 'mailto', 'tel'])->allowRelativeLinks());
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = self::clean($value);
            } elseif (is_string($value) && in_array($key, ['body', 'html'], true)) {
                $data[$key] = $sanitizer->sanitize($value);
            }
        }

        return $data;
    }
}

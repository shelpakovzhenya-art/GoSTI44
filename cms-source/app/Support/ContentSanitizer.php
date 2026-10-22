<?php

namespace App\Support;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

final class ContentSanitizer
{
    public static function clean(array $data): array
    {
        $config = (new HtmlSanitizerConfig)
            ->withMaxInputLength(100_000)
            ->allowSafeElements()
            ->allowLinkSchemes(['https', 'http', 'mailto', 'tel'])
            ->allowRelativeLinks()
            ->allowAttribute('class', '*')
            ->allowAttribute('aria-label', '*')
            ->allowAttribute('aria-hidden', '*')
            ->allowAttribute('fetchpriority', ['img'])
            ->allowMediaSchemes(['https'])
            ->allowMediaHosts(['tangerin.ru'])
            ->allowRelativeMedias();
        $sanitizer = new HtmlSanitizer($config);
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

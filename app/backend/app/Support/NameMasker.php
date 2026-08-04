<?php

namespace App\Support;

class NameMasker
{
    /**
     * Masks a full name for public display, e.g. "Rendra Kusuma" -> "R***a K***".
     */
    public static function mask(string $fullName): string
    {
        $words = preg_split('/\s+/', trim($fullName));

        return implode(' ', array_map(function (string $word) {
            $length = mb_strlen($word);
            if ($length <= 1) {
                return $word.'*';
            }

            return mb_substr($word, 0, 1).str_repeat('*', max(1, $length - 2)).mb_substr($word, -1);
        }, $words));
    }
}

<?php

namespace App\Exceptions;

class KycNotVerifiedException extends ApiException
{
    protected string $errorCode = 'KYC_NOT_VERIFIED';

    protected int $status = 403;

    public static function make(): self
    {
        return new self('Lengkapi verifikasi KYC dulu sebelum berinvestasi. Cek status di halaman Profil.');
    }
}

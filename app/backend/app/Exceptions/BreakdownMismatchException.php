<?php

namespace App\Exceptions;

class BreakdownMismatchException extends ApiException
{
    protected string $errorCode = 'BREAKDOWN_MISMATCH';

    protected int $status = 422;

    public static function make(): self
    {
        return new self('Total breakdown tidak sesuai dengan total bagi hasil. Periksa kembali data pengajuan.');
    }
}

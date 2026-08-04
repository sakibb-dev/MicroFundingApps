<?php

namespace App\Exceptions;

class NegativeNetProfitException extends ApiException
{
    protected string $errorCode = 'NEGATIVE_NET_PROFIT';

    protected int $status = 422;

    public static function make(): self
    {
        return new self('Biaya operasional tidak boleh melebihi keuntungan kotor. Periksa kembali angkanya.');
    }
}

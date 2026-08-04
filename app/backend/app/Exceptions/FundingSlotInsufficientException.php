<?php

namespace App\Exceptions;

class FundingSlotInsufficientException extends ApiException
{
    protected string $errorCode = 'FUNDING_SLOT_INSUFFICIENT';

    protected int $status = 422;

    public static function forRemainingSlot(int $remaining): self
    {
        return new self("Sisa slot funding tidak cukup untuk nominal ini. Sisa slot: Rp {$remaining}.");
    }
}

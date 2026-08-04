<?php

namespace App\Enums;

enum InvestmentStatus: string
{
    case PendingConfirmation = 'pending_confirmation';
    case Confirmed = 'confirmed';
    case Active = 'active';
    case Completed = 'completed';
    case Rejected = 'rejected';
}

<?php

namespace App\Enums;

enum ProfitDistributionStatus: string
{
    case Pending = 'pending';
    case Processed = 'processed';
    case Failed = 'failed';
}

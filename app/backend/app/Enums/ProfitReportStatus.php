<?php

namespace App\Enums;

enum ProfitReportStatus: string
{
    case Draft = 'draft';
    case Submitted = 'submitted';
    case Approved = 'approved';
    case Processed = 'processed';
    case Overdue = 'overdue';
    case Rejected = 'rejected';
}

<?php

namespace App\Enums;

enum UmkmStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}

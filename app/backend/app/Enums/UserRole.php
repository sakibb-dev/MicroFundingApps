<?php

namespace App\Enums;

enum UserRole: string
{
    case Investor = 'investor';
    case Umkm = 'umkm';
    case Admin = 'admin';
}

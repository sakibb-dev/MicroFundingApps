<?php

namespace App\Http\Middleware;

use App\Exceptions\KycNotVerifiedException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureKycApproved
{
    public function handle(Request $request, Closure $next): Response
    {
        $investor = $request->user()?->investor;

        if (! $investor || ! $investor->isKycApproved()) {
            throw KycNotVerifiedException::make();
        }

        return $next($request);
    }
}

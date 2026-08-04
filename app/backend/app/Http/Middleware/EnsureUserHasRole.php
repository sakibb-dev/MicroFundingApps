<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Defense in depth: a request must pass BOTH checks to reach the route --
 * the Sanctum token's ability scope (set at login, e.g. 'investor') AND the
 * user's role column in the database. Checking only one would let a stolen
 * token from a differently-scoped session, or a stale role after an admin
 * change, slip through.
 */
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user || $user->role->value !== $role) {
            return ApiResponse::error('Kamu tidak punya akses untuk melakukan ini.', null, null, 403);
        }

        $token = $user->currentAccessToken();
        if ($token && method_exists($token, 'can') && ! $token->can($role)) {
            return ApiResponse::error('Kamu tidak punya akses untuk melakukan ini.', null, null, 403);
        }

        return $next($request);
    }
}

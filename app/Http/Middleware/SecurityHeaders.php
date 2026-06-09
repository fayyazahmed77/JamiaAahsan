<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * C1: SecurityHeaders — adds essential HTTP security headers to every response.
 *
 * Register in bootstrap/app.php:
 *   ->withMiddleware(function (Middleware $middleware) {
 *       $middleware->append(SecurityHeaders::class);
 *   })
 *
 * Test at: https://securityheaders.com (target: A or A+)
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevent clickjacking — only allow framing from same origin.
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME-type sniffing.
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // XSS filter (legacy browsers).
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Control referrer information sent to third parties.
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Restrict browser feature APIs — deny unnecessary permissions.
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

        // Remove the server fingerprint header.
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        // HSTS — force HTTPS for 1 year (only meaningful in production behind HTTPS).
        // In local dev this is harmless (ignored by HTTP).
        if (app()->environment('production')) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        return $response;
    }
}

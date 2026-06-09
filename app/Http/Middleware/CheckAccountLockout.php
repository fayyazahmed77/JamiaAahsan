<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAccountLockout
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->has('email')) {
            $user = User::where('email', $request->email)->first();
            
            if ($user && $user->locked_until && Carbon::now()->isBefore($user->locked_until)) {
                $minutes = Carbon::now()->diffInMinutes($user->locked_until) + 1;
                
                // If it's an Inertia/JSON request, we return validation error
                if ($request->wantsJson()) {
                    return response()->json([
                        'errors' => [
                            'email' => ["This account is temporarily locked due to 5 consecutive failed login attempts. Please try again in {$minutes} minutes."]
                        ]
                    ], 422);
                }

                return back()->withErrors([
                    'email' => "This account is temporarily locked due to 5 consecutive failed login attempts. Please try again in {$minutes} minutes.",
                ])->onlyInput('email');
            }
        }

        return $next($request);
    }
}

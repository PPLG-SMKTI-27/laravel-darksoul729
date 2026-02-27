<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsTeacher
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Assuming role is checked here. Adjust logic as per specific 'isTeacher' requirement.
        // For now, checks if user has 'teacher' role or attribute.
        if ($request->user() && $request->user()->role === 'teacher') {
            return $next($request);
        }

        abort(403, 'Unauthorized. Teachers only.');
    }
}

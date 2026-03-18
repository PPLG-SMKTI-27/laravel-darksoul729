<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        RateLimiter::for('contact-submissions', function (Request $request) {
            return Limit::perMinute(3)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    $message = 'Terlalu banyak percobaan kirim pesan. Tunggu sebentar lalu coba lagi.';

                    if ($request->expectsJson()) {
                        return response()->json([
                            'status' => 'error',
                            'message' => $message,
                        ], 429, $headers);
                    }

                    return back()->withErrors([
                        'form' => $message,
                    ]);
                });
        });
    }
}

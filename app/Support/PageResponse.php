<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PageResponse
{
    public static function render(Request $request, string $page, array $props = []): View|JsonResponse
    {
        if (self::isAppNavigation($request)) {
            return response()->json([
                'page' => $page,
                'props' => $props,
            ]);
        }

        return view('index', [
            'page' => $page,
            'props' => $props,
        ]);
    }

    public static function isAppNavigation(Request $request): bool
    {
        return $request->header('X-App-Navigation') === '1'
            || $request->expectsJson()
            || $request->ajax();
    }
}

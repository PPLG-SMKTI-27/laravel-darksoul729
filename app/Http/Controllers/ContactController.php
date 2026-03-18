<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactMessageRequest;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

class ContactController extends Controller
{
    public function store(ContactMessageRequest $request): JsonResponse|RedirectResponse
    {
        Message::create($request->safe()->only([
            'name',
            'email',
            'message',
        ]));

        $message = 'Pesan berhasil dikirim. Saya akan balas secepatnya.';

        if ($request->expectsJson()) {
            return response()->json([
                'status' => 'success',
                'message' => $message,
            ], 201);
        }

        return redirect()->back()->with('success', $message);
    }
}

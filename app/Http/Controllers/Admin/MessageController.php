<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Support\PageResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class MessageController extends Controller
{
    public function index(Request $request): View|JsonResponse
    {
        $messages = Message::latest()->get();

        return PageResponse::render($request, 'AdminMessages', [
            'messages' => $messages,
        ]);
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json(['success' => true]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::latest()->get();

        return view('index', [
            'page' => 'AdminMessages',
            'props' => [
                'messages' => $messages,
            ],
        ]);
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json(['success' => true]);
    }
}

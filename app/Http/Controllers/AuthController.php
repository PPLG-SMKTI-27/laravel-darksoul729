<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // DEBUGGING BLOCK
        $user = \App\Models\User::where('email', $request->email)->first();
        $check = $user ? (\Illuminate\Support\Facades\Hash::check($request->password, $user->password) ? 'MATCH' : 'FAIL') : 'USER_NOT_FOUND';

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended('/dashboard')->with('success', 'Welcome back! You have successfully logged in.');
        }

        \Illuminate\Support\Facades\Log::info('Login failed for email: '.$request->email);

        return back()->withErrors([
            'email' => "Debug: Status=$check. Hash=".($user ? substr($user->password, 0, 10).'...' : 'N/A'),
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}

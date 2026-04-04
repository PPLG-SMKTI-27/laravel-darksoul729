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

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = $request->user();

            // Redirect based on role
            if ($user->role === 'teacher') {
                return redirect()->intended('/teacher');
            }

            // Default redirect for admin and other roles
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])->onlyInput('email');
    }

    public function showregisterForm()
    {
        return view('auth.register');
    }

    public function logout(Request $request)
    {
        $email = $request->user()?->email;

        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if ($email) {
            $request->session()->flash('show_sddm_login', true);
            $request->session()->flash('sddm_user', $email);
        }

        return redirect()->route('login', [
            'screen' => 'sddm',
            'user' => $email,
        ]);
    }
}

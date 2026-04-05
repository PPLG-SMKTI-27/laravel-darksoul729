<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthController extends Controller
{
    public function showLoginForm(): View
    {
        return view('auth.login');
    }

    public function login(Request $request): RedirectResponse|JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $user = $request->user();
            $redirectTo = $user->role === 'teacher' ? '/teacher' : '/dashboard';

            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'redirect' => $redirectTo,
                ]);
            }

            return redirect()->intended($redirectTo);
        }

        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'message' => 'Email atau password salah.',
                'errors' => [
                    'email' => ['Email atau password salah.'],
                ],
            ], 422);
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])->onlyInput('email');
    }

    public function showregisterForm(): View
    {
        return view('auth.register');
    }

    public function logout(Request $request): RedirectResponse
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

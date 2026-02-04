<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);

Route::get('/about', function () {
    return view('index', ['page' => 'About', 'props' => []]);
});

Route::get('/contact', function () {
    return view('index', ['page' => 'Contact', 'props' => []]);
});

// Map /skills to the Feature page for now
Route::get('/skills', function () {
    return view('index', ['page' => 'Skills', 'props' => []]);
});

Route::get('/test-image', function () {
    return view('test.test-image');
});

Route::controller(AuthController::class)->group(function () {
    Route::get('/login', 'showLoginForm')->name('login');
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->name('logout');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::resource('admin/projects', App\Http\Controllers\Admin\ProjectController::class)->names('admin.projects');

    // Messages Routes
    Route::get('admin/messages', [App\Http\Controllers\Admin\MessageController::class, 'index'])->name('admin.messages.index');
    Route::delete('admin/messages/{message}', [App\Http\Controllers\Admin\MessageController::class, 'destroy'])->name('admin.messages.destroy');
});

Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');

// Updated to plural /projects to match Navbar
Route::get('/projects', [ProjectController::class, 'index']);
// Keep singular for backward compatibility if needed, or redirect
Route::get('/project', [ProjectController::class, 'index']);

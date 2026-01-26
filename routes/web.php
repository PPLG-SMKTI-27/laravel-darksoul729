<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index']);

Route::get('/about', function () {
    return view('pages.about');
});

Route::get('/contact', function () {
    return view('pages.contact');
});

Route::get('/feature', function () {
    return view('pages.feature');
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
Route::get('/contact', function () {
    return view('pages.contact');
})->name('contact');

Route::get('/project', action: [ProjectController::class, 'index']);

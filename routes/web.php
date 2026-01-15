<?php

use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('index');
});

Route::get('/about', function () {
    return view('about');
});

Route::get('/contact', function () {
    return view('contact');
});

Route::get('/feature', function () {
    return view('feature');
});


Route::get('/test-image', function () {
    return view('test-image');
});

Route::get('/login', function () {
    return view('auth.login');
});

Route::get('/project', action: [ProjectController::class, 'index']);

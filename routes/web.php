<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SkillsRoomController;
use Illuminate\Support\Facades\Route;

// ==================== PUBLIC ROUTES ====================
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', function () {
    return view('index', ['page' => 'About', 'props' => []]);
})->name('about');
Route::get('/contact', function () {
    return view('index', ['page' => 'Contact', 'props' => []]);
})->name('contact');
Route::get('/skills', function () {
    return view('index', ['page' => 'Skills', 'props' => []]);
})->name('skills');
Route::get('/test-image', function () {
    return view('test.test-image');
});
Route::get('/projects', [ProjectController::class, 'index'])->name('projects');
Route::get('/project', [ProjectController::class, 'index']);
Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store'])
    ->middleware('throttle:contact-submissions')
    ->name('contact.store');
Route::post('/skills/rooms', [SkillsRoomController::class, 'store'])->name('skills.rooms.store');
Route::post('/skills/rooms/join', [SkillsRoomController::class, 'join'])->name('skills.rooms.join');
Route::post('/skills/rooms/sync', [SkillsRoomController::class, 'sync'])->name('skills.rooms.sync');
Route::post('/chat/register', [ChatController::class, 'register'])->name('chat.register');
Route::get('/chat/state/{deviceId}', [ChatController::class, 'state'])->name('chat.state');
Route::get('/chat/users/search', [ChatController::class, 'search'])->name('chat.users.search');
Route::post('/chat/contacts', [ChatController::class, 'storeContact'])->name('chat.contacts.store');
Route::post('/chat/messages', [ChatController::class, 'storeMessage'])->name('chat.messages.store');

// ==================== AUTHENTICATED ROUTES ====================
Route::middleware('auth')->group(function () {

    // ===== ADMIN DASHBOARD =====
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    // Admin Project Management
    Route::resource('admin/projects', App\Http\Controllers\Admin\ProjectController::class)->names('admin.projects');

    // Admin Messages
    Route::get('admin/messages', [App\Http\Controllers\Admin\MessageController::class, 'index'])->name('admin.messages.index');
    Route::delete('admin/messages/{message}', [App\Http\Controllers\Admin\MessageController::class, 'destroy'])->name('admin.messages.destroy');

    // Admin Settings
    Route::get('admin/settings', [\App\Http\Controllers\SettingController::class, 'edit'])->name('admin.settings.edit');
    Route::put('admin/settings', [\App\Http\Controllers\SettingController::class, 'update'])->name('admin.settings.update');

    // Profile Management (Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ===== TEACHER ROUTES =====
    Route::get('/teacher', function () {
        return '
            <h1>ini adalah halamam guru</h1>
            <form method="POST" action="'.route('logout').'">
                '.csrf_field().'
                <button type="submit">Logout</button>
            </form>
        ';
    })->name('teacher')->middleware(['isTeacher', 'checkAge', 'logActivity']);
});

require __DIR__.'/auth.php';

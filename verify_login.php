<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

$user = \App\Models\User::where('email', 'admin@panzekk.com')->first();

if (!$user) {
    echo "User not found!\n";
    exit(1);
}

echo "User found: " . $user->email . "\n";
echo "Stored Hash: " . $user->password . "\n";

if (\Illuminate\Support\Facades\Hash::check('password', $user->password)) {
    echo "Password Check: MATCH\n";
} else {
    echo "Password Check: FAIL\n";
}

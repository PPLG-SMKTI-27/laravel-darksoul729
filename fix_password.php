<?php
$user = \App\Models\User::where('email', 'admin@panzekk.com')->first();
if ($user) {
    $user->password = 'password';
    $user->save();
    echo "User updated successfully. New hash: " . $user->password . "\n";
} else {
    echo "User not found.\n";
}

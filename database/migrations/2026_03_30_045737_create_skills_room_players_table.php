<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('skills_room_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('skills_room_id')->constrained('skills_rooms')->cascadeOnDelete();
            $table->uuid('player_uuid')->unique();
            $table->string('display_name', 50);
            $table->string('role', 20);
            $table->json('state')->nullable();
            $table->timestamp('last_seen_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills_room_players');
    }
};

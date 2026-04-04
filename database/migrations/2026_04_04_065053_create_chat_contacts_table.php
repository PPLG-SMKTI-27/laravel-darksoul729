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
        Schema::create('chat_contacts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('owner_chat_user_id');
            $table->unsignedBigInteger('contact_chat_user_id');
            $table->timestamps();

            $table->unique(['owner_chat_user_id', 'contact_chat_user_id']);
            $table->index('owner_chat_user_id');
            $table->index('contact_chat_user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_contacts');
    }
};

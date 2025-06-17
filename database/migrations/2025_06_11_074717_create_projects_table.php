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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Ganti 'title' menjadi 'name' jika sebelumnya berbeda
            $table->text('description')->nullable();
            $table->string('status')->default('to-do'); // Tambahkan kolom status
            $table->date('due_date')->nullable(); // Tambahkan kolom due_date
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
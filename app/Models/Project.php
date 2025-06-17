<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',          // Pastikan ini 'name', bukan 'title' jika di migrasi
        'description',
        'status',        // Tambahkan ini
        'due_date',      // Tambahkan ini
        'created_by',
    ];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relasi tasks() yang hilang
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status', // e.g., 'to-do', 'in-progress', 'completed', 'canceled'
        'due_date',
        'created_by', // Foreign key to users table
    ];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    // Relasi dengan User (yang membuat proyek)
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Anda bisa tambahkan relasi ke tasks di sini nanti jika diperlukan
    // public function tasks()
    // {
    //     return $this->hasMany(Task::class);
    // }
}
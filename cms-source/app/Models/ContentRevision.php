<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentRevision extends Model
{
    protected $fillable = ['user_id', 'action', 'data'];

    protected function casts(): array
    {
        return ['data' => 'array'];
    }
}

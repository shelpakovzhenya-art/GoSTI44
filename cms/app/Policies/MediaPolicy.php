<?php

namespace App\Policies;

use App\Models\Media;
use App\Models\User;

class MediaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->active;
    }

    public function view(User $user, Media $record): bool
    {
        return $user->active;
    }

    public function create(User $user): bool
    {
        return $user->active;
    }

    public function update(User $user, Media $record): bool
    {
        return $user->active;
    }

    public function delete(User $user, Media $record): bool
    {
        return false;
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }
}

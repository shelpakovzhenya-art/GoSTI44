<?php

namespace App\Policies;

use App\Models\ContentEntry;
use App\Models\User;

class ContentEntryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->active;
    }

    public function view(User $user, ContentEntry $record): bool
    {
        return $user->active;
    }

    public function create(User $user): bool
    {
        return $user->active;
    }

    public function update(User $user, ContentEntry $record): bool
    {
        return $user->active;
    }

    public function publish(User $user, ContentEntry $record): bool
    {
        return $user->canPublish();
    }

    public function unpublish(User $user, ContentEntry $record): bool
    {
        return $user->canPublish() && ! in_array($record->kind, ['section', 'settings', 'menu'], true) && $record->key !== 'home';
    }

    public function delete(User $user, ContentEntry $record): bool
    {
        return $user->role === 'admin' && $user->active && $record->published === null;
    }

    public function deleteAny(User $user): bool
    {
        return false;
    }
}

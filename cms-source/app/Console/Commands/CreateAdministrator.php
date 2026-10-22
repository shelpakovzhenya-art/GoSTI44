<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateAdministrator extends Command
{
    protected $signature = 'cms:admin';

    protected $description = 'Создать администратора с вводом пароля без отображения';

    public function handle(): int
    {
        $name = $this->ask('Имя');
        $email = $this->ask('Email для входа');
        $password = $this->secret('Пароль (не менее 12 символов)');
        $validation = Validator::make(compact('name', 'email', 'password'), [
            'name' => 'required|string|max:200', 'email' => 'required|email|unique:users,email', 'password' => 'required|string|min:12',
        ]);
        if ($validation->fails()) {
            foreach ($validation->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }
        $user = new User(compact('name', 'email', 'password'));
        $user->role = 'admin';
        $user->active = true;
        $user->save();
        $this->info('Администратор создан. Пароль нигде не выводился.');

        return self::SUCCESS;
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('editor');
            $table->boolean('active')->default(true);
        });
        Schema::create('content_entries', function (Blueprint $table) {
            $table->id();
            $table->string('kind')->index();
            $table->string('key')->unique();
            $table->string('name');
            $table->json('draft');
            $table->json('published')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
        Schema::create('content_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_entry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->json('data');
            $table->timestamps();
        });
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('path');
            $table->string('alt');
            $table->text('caption')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
        Schema::dropIfExists('content_revisions');
        Schema::dropIfExists('content_entries');
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn(['role', 'active']));
    }
};

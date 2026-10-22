<?php

use App\Http\Controllers\PreviewContentController;
use App\Http\Controllers\PublishedContentController;
use Illuminate\Support\Facades\Route;

Route::get('/api/content', PublishedContentController::class);
Route::get('/api/preview/editor', \App\Http\Controllers\VisualPreviewController::class)->middleware('signed:relative')->name('content.visual-preview');
Route::get('/api/preview/{entry}', PreviewContentController::class)->middleware('signed:relative')->name('content.preview');

Route::get('/', function () {
    return view('welcome');
});

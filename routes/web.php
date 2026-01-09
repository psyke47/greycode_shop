<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Homepage', ['name' => 'Greycode Shop']);
});

Route::get('/about', function () {
    return Inertia::render('About');
});
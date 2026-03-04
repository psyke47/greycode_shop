<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" type="image/png" href="/images/favicons/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/images/favicons/favicon.svg" />
    <link rel="shortcut icon" href="/images/favicons/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/images/favicons/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Greycode" />
    <link rel="manifest" href="/images/favicons/site.webmanifest" />
    
    <!-- Production assets (replace with your actual built file names) -->
    {{-- <link rel="stylesheet" href="{{ asset('build/assets/app.css') }}">
    <script type="module" src="{{ asset('build/assets/app.js') }}"></script> --}}
    {{-- Comment out @viteReactRefresh in production --}}
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body>
    @inertia
    
</body>
</html>
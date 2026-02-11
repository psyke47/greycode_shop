<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="icon" type="image/png" href="/images/favicons/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/images/favicons/favicon.svg" />
    <link rel="shortcut icon" href="/images/favicons/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/images/favicons/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Greycode" />
    <link rel="manifest" href="/images/favicons/site.webmanifest" />
    <title>Greycode Shop</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body>
    @inertia
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <h1 class="text-9xl text-white">Greycode Shop</h1>
    </div>
</body>
</html>
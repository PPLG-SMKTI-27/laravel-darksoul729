<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Plastic World</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/react-app.jsx'])
</head>
<body class="bg-blue-50 text-slate-800 antialiased selection:bg-pink-300 selection:text-pink-900">
    <!-- 
        Pass data from Laravel Controller to React via data attributes.
        'page' determines which component to render.
        'props' contains dynamic data like projects ($repos).
    -->
    <div id="app" 
         data-page="{{ $page ?? '' }}"
         data-props='@json($props ?? [])'>
    </div>
</body>
</html>

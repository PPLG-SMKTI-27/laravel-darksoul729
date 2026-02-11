<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Dashboard - Plastic World</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/react-app.jsx'])
</head>
<body class="bg-blue-50 text-slate-800 antialiased">
    <div id="app" 
         data-page="Admin/Dashboard"
         data-props='@json(['stats' => $stats, 'recentProjects' => $recentProjects])'>
    </div>
</body>
</html>

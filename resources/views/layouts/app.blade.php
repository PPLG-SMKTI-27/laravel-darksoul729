<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
    @include('partials.head')
</head>
<body data-scroll-container>

    @include('partials.ui')
    @include('partials.navbar')

    @yield('content')

    @include('partials.scripts')
    @stack('scripts')
</body>
</html>

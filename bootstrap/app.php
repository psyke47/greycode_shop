<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        using: function () {
            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/console.php'));
        },
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias(['admin' => AdminMiddleware::class]);

        $middleware->web(append: [
            HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {

            // Check if we are in production and it's an HTTP exception
            if (!app()->environment('local') && method_exists($e, 'getStatusCode')) {
                $status = $e->getStatusCode();

                $pages = [
                    403 => 'Errors/Forbidden',
                    404 => 'Errors/NotFound',
                    500 => 'Errors/ServerError',
                    503 => 'Errors/ServiceUnavailable',
                ];

                if (isset($pages[$status])) {
                    return inertia($pages[$status])->toResponse($request)->setStatusCode($status);
                }
            }

            // Return null to let Laravel fall back to its default rendering
            return null;
        });
    })->create();

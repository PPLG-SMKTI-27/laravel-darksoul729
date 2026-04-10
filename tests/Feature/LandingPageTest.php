<?php

namespace Tests\Feature;

use App\Http\Controllers\HomeController;
use App\Support\PageResponse;
use Illuminate\Http\Request;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    public function test_landing_page_returns_application_shell(): void
    {
        $this->mockHomeController();

        $response = $this->get('/');

        $response
            ->assertOk()
            ->assertSee('id="app"', false)
            ->assertSee('data-page="LandingPage"', false);
    }

    public function test_landing_page_returns_navigation_payload_for_app_requests(): void
    {
        $this->mockHomeController();

        $response = $this->withHeaders([
            'X-App-Navigation' => '1',
            'Accept' => 'application/json',
        ])->get('/');

        $response
            ->assertOk()
            ->assertJson([
                'page' => 'LandingPage',
            ])
            ->assertJsonStructure([
                'page',
                'props' => [
                    'repos',
                ],
            ]);
    }

    protected function mockHomeController(): void
    {
        $this->mock(HomeController::class, function (object $mock): void {
            $mock->shouldReceive('index')
                ->andReturnUsing(function (Request $request) {
                    return PageResponse::render($request, 'LandingPage', [
                        'repos' => [],
                    ]);
                });
        });
    }
}

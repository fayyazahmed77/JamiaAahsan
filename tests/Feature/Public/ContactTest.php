<?php

namespace Tests\Feature\Public;

use App\Models\Feedback;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_form_renders()
    {
        $this->get(route('public.contact.index'))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Public/Contact'));
    }

    public function test_can_submit_contact_form()
    {
        $response = $this->post(route('public.contact.store'), [
            'name' => 'Ahmad Khan',
            'email' => 'ahmad@example.com',
            'country' => 'Pakistan',
            'phone' => '+923001234567',
            'comment' => 'This is a test comment.',
            'rating' => 5,
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('feedback', [
            'name' => 'Ahmad Khan',
            'email' => 'ahmad@example.com',
            'comment' => 'This is a test comment.',
        ]);
    }
}

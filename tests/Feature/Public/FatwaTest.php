<?php

namespace Tests\Feature\Public;

use App\Models\Topic;
use App\Models\QuestionAnswer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FatwaTest extends TestCase
{
    use RefreshDatabase;

    public function test_fatwa_index_renders()
    {
        $this->get(route('public.fatwa.index'))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Public/Fatwa/Index'));
    }

    public function test_can_submit_fatwa_question()
    {
        $topic = Topic::create([
            'title' => 'Prayer & Worship',
            'slug' => 'prayer-worship',
            'status' => true,
        ]);

        $response = $this->post(route('public.fatwa.store'), [
            'topic_id' => $topic->id,
            'title' => 'Basement Prayer Question',
            'question' => 'Is praying in the basement permissible?',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('question_answers', [
            'topic_id' => $topic->id,
            'title' => 'Basement Prayer Question',
            'question' => 'Is praying in the basement permissible?',
            'status' => 0, // Should be false until answered
        ]);
    }
}

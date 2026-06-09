<?php

namespace App\Http\Controllers\Admin\Feedback;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Feedback::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('comment', 'like', "%{$search}%");
            });
        }

        if ($request->filled('rating')) {
            $query->where('rating', $request->input('rating'));
        }

        if ($request->has('status')) {
            if ($request->input('status') === 'read') {
                $query->where('is_read', true);
            } elseif ($request->input('status') === 'unread') {
                $query->where('is_read', false);
            }
        }

        $feedbacks = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Cms/Feedback', [
            'feedbacks' => $feedbacks,
            'filters'   => $request->only(['search', 'rating', 'status']),
        ]);
    }

    public function update(Request $request, Feedback $feedback): RedirectResponse
    {
        if ($request->has('is_read')) {
            $feedback->update(['is_read' => $request->boolean('is_read')]);
            return redirect()->back()->with('success', 'Feedback status updated.');
        }

        $request->validate([
            'reply' => 'required|string',
        ]);

        $feedback->update([
            'is_read'    => true,
            'replied_at' => now(),
            'replied_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Feedback reply saved successfully.');
    }

    public function destroy(Feedback $feedback): RedirectResponse
    {
        $feedback->delete();

        return redirect()->route('admin.feedback.index')->with('success', 'Feedback deleted successfully.');
    }
}

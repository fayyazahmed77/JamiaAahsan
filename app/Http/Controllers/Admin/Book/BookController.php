<?php

namespace App\Http\Controllers\Admin\Book;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

use App\Http\Requests\Admin\Book\StoreBookRequest;

class BookController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Book::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('urdu_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->boolean('status'));
        }

        $books = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Book/Index', [
            'books'   => $books,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(StoreBookRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Book::create($validated);

        return redirect()->back()->with('success', 'Book created successfully.');
    }

    public function update(StoreBookRequest $request, Book $book): RedirectResponse
    {
        $validated = $request->validated();

        $book->update($validated);

        return redirect()->back()->with('success', 'Book updated successfully.');
    }

    public function destroy(Book $book): RedirectResponse
    {
        // Prevent deletion if book is associated with class sessions
        if ($book->classSessions()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete book with associated class sessions.');
        }

        $book->delete();

        return redirect()->back()->with('success', 'Book deleted successfully.');
    }
}

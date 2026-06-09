<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Http\Resources\BookResource;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $books = Book::where('status', true)->latest()->get();

        return response()->json([
            'error' => false,
            'data' => BookResource::collection($books)
        ]);
    }

    public function show($id)
    {
        $book = Book::where('status', true)->findOrFail($id);

        return response()->json([
            'error' => false,
            'data' => new BookResource($book)
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserSubscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'phone' => 'nullable|string|max:255',
            'country' => 'required|string|max:255',
        ]);

        $sub = UserSubscription::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'phone' => $request->phone,
                'country' => $request->country,
            ]
        );

        return response()->json([
            'error' => false,
            'data' => $sub,
            'message' => 'Subscription updated successfully',
        ], 200);
    }
}

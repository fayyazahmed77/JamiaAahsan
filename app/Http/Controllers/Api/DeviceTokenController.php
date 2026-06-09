<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DeviceToken;
use Illuminate\Http\Request;

class DeviceTokenController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required|string|unique:device_tokens,token',
            'platform' => 'required|in:android,ios',
        ]);

        $deviceToken = DeviceToken::create([
            'user_id' => $request->user()->id,
            'token' => $request->token,
            'platform' => $request->platform,
        ]);

        return response()->json([
            'error' => false,
            'data' => $deviceToken,
            'message' => 'Device token registered successfully',
        ], 201);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        DeviceToken::where('user_id', $request->user()->id)
            ->where('token', $request->token)
            ->delete();

        return response()->json([
            'error' => false,
            'message' => 'Device token removed successfully',
        ]);
    }
}

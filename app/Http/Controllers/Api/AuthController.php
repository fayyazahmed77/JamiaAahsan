<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserDetail;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(\App\Http\Requests\Api\Auth\RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign default Student role
        $user->assignRole('Student');

        UserDetail::create([
            'user_id' => $user->id,
            'class_id' => $request->class_id,
            'guardian_name' => $request->guardian_name,
            'gender' => $request->gender,
            'address' => $request->address,
            'id_card_no' => $request->id_card_no,
            'qualification' => $request->qualification,
            'phone' => $request->phone,
            'country' => $request->country,
            'admission_type' => $request->admission_type,
            'is_approved' => 0,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'error' => false,
            'data' => new UserResource($user->load('userDetail.class')),
            'token' => $token,
        ], 201);
    }

    public function login(\App\Http\Requests\Api\Auth\LoginRequest $request)
    {

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => true, 'message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'error' => false,
            'data' => new UserResource($user->load('userDetail.class')),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'error' => false,
            'message' => 'Logged out successfully',
        ]);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink($request->only('email'));

        return response()->json([
            'error'   => $status !== Password::RESET_LINK_SENT,
            'message' => __($status),
        ]);
    }

    public function sessions(Request $request)
    {
        $sessions = $request->user()->tokens->map(function ($token) {
            return [
                'id' => $token->id,
                'name' => $token->name,
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
            ];
        });

        return response()->json([
            'error' => false,
            'data' => $sessions,
        ]);
    }

    public function revokeAllTokens(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'error' => false,
            'message' => 'All sessions/tokens revoked successfully',
        ]);
    }
}

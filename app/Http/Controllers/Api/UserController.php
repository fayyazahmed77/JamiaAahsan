<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json([
            'error' => false,
            'data' => new UserResource($request->user()->load('userDetail.class')),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
        ]);

        $user->update([
            'name' => $request->name,
        ]);

        if ($user->userDetail) {
            $user->userDetail->update([
                'phone' => $request->phone ?? $user->userDetail->phone,
                'address' => $request->address ?? $user->userDetail->address,
            ]);
        }

        return response()->json([
            'error' => false,
            'data' => new UserResource($user->load('userDetail.class')),
            'message' => 'Profile updated successfully',
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!\Illuminate\Support\Facades\Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'error' => true,
                'message' => 'The provided current password does not match our records.'
            ], 422);
        }

        $user->update([
            'password' => \Illuminate\Support\Facades\Hash::make($request->new_password)
        ]);

        return response()->json([
            'error' => false,
            'message' => 'Password changed successfully'
        ]);
    }

    public function admissionStatus(Request $request)
    {
        $userDetail = $request->user()->userDetail;

        if (!$userDetail) {
            return response()->json([
                'error' => true,
                'message' => 'No admission record found for this user.'
            ], 404);
        }

        return response()->json([
            'error' => false,
            'data' => [
                'is_approved' => (bool)$userDetail->is_approved,
                'registration_no' => $userDetail->registration_no,
                'class_id' => $userDetail->class_id,
                'class_name' => $userDetail->class ? $userDetail->class->name : null,
                'admission_type' => $userDetail->admission_type,
                'birth_certificate_path' => $userDetail->birth_certificate_path ? asset('storage/' . $userDetail->birth_certificate_path) : null,
                'education_degree_path' => $userDetail->education_degree_path ? asset('storage/' . $userDetail->education_degree_path) : null,
            ]
        ]);
    }

    public function uploadDocuments(Request $request)
    {
        $request->validate([
            'birth_certificate' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'education_degree' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $user = $request->user();
        $userDetail = $user->userDetail;

        if (!$userDetail) {
            return response()->json([
                'error' => true,
                'message' => 'No admission record found to upload documents to.'
            ], 404);
        }

        $updated = false;

        if ($request->hasFile('birth_certificate')) {
            if ($userDetail->birth_certificate_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($userDetail->birth_certificate_path);
            }
            $userDetail->birth_certificate_path = $request->file('birth_certificate')->store('documents', 'public');
            $updated = true;
        }

        if ($request->hasFile('education_degree')) {
            if ($userDetail->education_degree_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($userDetail->education_degree_path);
            }
            $userDetail->education_degree_path = $request->file('education_degree')->store('documents', 'public');
            $updated = true;
        }

        if ($updated) {
            $userDetail->save();
        }

        return response()->json([
            'error' => false,
            'message' => 'Documents uploaded successfully.',
            'data' => [
                'birth_certificate_path' => $userDetail->birth_certificate_path ? asset('storage/' . $userDetail->birth_certificate_path) : null,
                'education_degree_path' => $userDetail->education_degree_path ? asset('storage/' . $userDetail->education_degree_path) : null,
            ]
        ]);
    }
}

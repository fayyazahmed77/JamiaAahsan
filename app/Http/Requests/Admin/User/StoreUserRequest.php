<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user   = $this->route('user');
        $userId = is_object($user) ? $user->id : $user;

        return [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email' . ($userId ? ",{$userId}" : ''),
            'password' => $userId
                ? ['nullable', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()]
                : ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            'status'   => 'required|boolean',
            'roles'    => 'required|array',
            'roles.*'  => 'required|exists:roles,name',
            'phone'    => 'nullable|string|max:50',
            'country'  => 'nullable|string|max:100',
            'job_title' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'bio'      => 'nullable|string|max:1000',
            'linkedin_url' => 'nullable|url|max:255',
            'facebook_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'twitter_url' => 'nullable|url|max:255',
            'portfolio_url' => 'nullable|url|max:255',
            'profile_image' => 'nullable|image|max:2048',
            'remove_profile_image' => 'nullable|boolean',
        ];
    }
}

<?php

namespace App\Http\Requests\Api\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'class_id' => 'required|exists:classes,id',
            'guardian_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other',
            'address' => 'required|string',
            'id_card_no' => 'required|string|max:255',
            'qualification' => 'required|string',
            'phone' => 'required|string|max:255',
            'country' => 'nullable|string|max:255',
            'admission_type' => 'nullable|string|max:255',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new \Illuminate\Http\Exceptions\HttpResponseException(
            response()->json(['error' => true, 'messages' => $validator->errors()], 422)
        );
    }
}

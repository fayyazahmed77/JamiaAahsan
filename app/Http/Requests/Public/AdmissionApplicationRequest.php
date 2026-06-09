<?php

namespace App\Http\Requests\Public;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AdmissionApplicationRequest extends FormRequest
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
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            'class_id' => 'required|exists:classes,id',
            'guardian_name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other',
            'address' => 'required|string',
            'id_card_no' => 'required|string|max:50',
            'qualification' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'country' => 'nullable|string|max:100',
            'admission_type' => 'nullable|string|max:100',
            'birth_certificate' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'education_degree' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ];
    }
}

<?php

namespace App\Http\Requests\Admin\Download;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreDownloadRequest extends FormRequest
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
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'year_id'      => 'required|exists:years,id',
            'url'         => 'required|url|max:255',
            'file_size'   => 'nullable|string|max:50',
            'status'      => 'required|boolean',
            'sort_order'  => 'required|integer',
        ];
    }
}

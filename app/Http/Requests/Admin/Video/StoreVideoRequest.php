<?php

namespace App\Http\Requests\Admin\Video;

use Illuminate\Foundation\Http\FormRequest;

class StoreVideoRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|max:255|unique:videos,slug',
            'urdu_title'       => 'nullable|string|max:255',
            'video_file'       => 'nullable|file|mimes:mp4,mov,avi,wmv,mkv,flv,webm|max:512000', // max 500MB
            'uri'              => 'nullable|string|max:2000',
            'youtube_url'      => 'nullable|string|url|max:255',
            'description'      => 'nullable|string',
            'thumbnail'        => 'nullable|image|max:5120',
            'thumbnail_uri'    => 'nullable|string|max:2000',
            'status'           => 'required|boolean',
            'speaker_id'       => 'required|exists:speakers,id',
            'category_id'      => 'required|exists:categories,id',
            'year_id'          => 'required|exists:years,id',
            'duration'         => 'nullable|integer',
            'width'            => 'nullable|integer',
            'height'           => 'nullable|integer',
            'file_size'        => 'nullable|integer',
            'mime_type'        => 'nullable|string|max:100',
            'meta_title'       => 'nullable|string|max:60',
            'meta_description' => 'nullable|string|max:160',
            'tags'             => 'nullable|array',
            'tags.*'           => 'string|max:50',
        ];
    }
}

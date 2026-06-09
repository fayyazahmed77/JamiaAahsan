<?php

namespace App\Http\Requests\Admin\Audio;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAudioRequest extends FormRequest
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
            'title'         => 'required|string|max:255',
            'user_title'    => 'nullable|string|max:255',
            'audio_file'    => 'nullable|file|mimes:mp3,wav,ogg,aac,m4a,wma|max:102400',
            'uri'           => 'nullable|string|max:2000',
            'youtube_url'   => 'nullable|string|url|max:255',
            'description'   => 'nullable|string',
            'thumbnail'     => 'nullable|image|max:5120',
            'thumbnail_uri' => 'nullable|string|max:2000',
            'publish_date'  => 'nullable|date',
            'status'        => 'required|boolean',
            'speaker_id'    => 'required|exists:speakers,id',
            'category_id'   => 'required|exists:categories,id',
            'year_id'       => 'required|exists:years,id',
            'tags'          => 'nullable|array',
            'tags.*'        => 'string|max:50',
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'live_link' => $this->live_link,
            'youtube_live_link' => $this->youtube_live_link,
            'sort' => $this->sort,
            'status' => $this->status,
        ];
    }
}

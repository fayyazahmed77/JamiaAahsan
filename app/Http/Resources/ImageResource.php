<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'url' => $this->uri,
            'description' => $this->description,
            'btn_title' => $this->btn_title,
            'btn_link' => $this->btn_link,
            'weight' => $this->weight,
            'parent_id' => $this->parent_id,
            'status' => $this->status,
        ];
    }
}

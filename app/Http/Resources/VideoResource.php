<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'urdu_title'    => $this->urdu_title,
            'url'           => $this->uri,
            'youtube_url'   => $this->youtube_url,
            'description'   => $this->description,
            'views'         => $this->views,
            'thumbnail_uri' => $this->thumbnail_uri,
            'status'        => $this->status,
            'tags'          => $this->tags ? $this->tags->pluck('name') : [],
            'speaker'       => $this->whenLoaded('media', fn () =>
                $this->media?->speaker ? new SpeakerResource($this->media->speaker) : null
            ),
            'category'      => $this->whenLoaded('media', fn () =>
                $this->media?->category ? new CategoryResource($this->media->category) : null
            ),
            'year'          => $this->whenLoaded('media', fn () =>
                $this->media?->year ? new YearResource($this->media->year) : null
            ),
            'created_at'    => $this->created_at?->toIso8601String(),
            'updated_at'    => $this->updated_at?->toIso8601String(),
        ];
    }
}

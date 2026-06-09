<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassSessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'class' => new ClassResource($this->whenLoaded('class')),
            'teacher' => new TeacherResource($this->whenLoaded('teacher')),
            'book' => new BookResource($this->whenLoaded('book')),
            'year' => new YearResource($this->whenLoaded('year')),
            'lecture_link' => $this->lecture_link,
            'created_by' => $this->created_by,
            'status' => $this->status,
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'email'             => $this->email,
            'status'            => (bool) $this->status,
            'roles'             => $this->relationLoaded('roles')
                ? $this->roles->map(fn($r) => ['id' => $r->id, 'name' => $r->name])
                : [],
            'class'             => ($this->relationLoaded('userDetail') && $this->userDetail && $this->userDetail->class)
                ? new ClassResource($this->userDetail->class)
                : null,
            'registration_no'   => ($this->relationLoaded('userDetail') && $this->userDetail)
                ? $this->userDetail->registration_no
                : null,
            'is_approved'       => ($this->relationLoaded('userDetail') && $this->userDetail)
                ? (bool) $this->userDetail->is_approved
                : false,
            'profile_image'     => $this->profile_image,
            'profile_image_url' => $this->profile_image ? asset('storage/' . $this->profile_image) : null,
            'phone'             => $this->phone,
            'country'           => $this->country,
            'job_title'         => $this->job_title,
            'department'        => $this->department,
            'bio'               => $this->bio,
            'linkedin_url'      => $this->linkedin_url,
            'facebook_url'      => $this->facebook_url,
            'instagram_url'     => $this->instagram_url,
            'twitter_url'       => $this->twitter_url,
            'portfolio_url'     => $this->portfolio_url,
        ];
    }
}

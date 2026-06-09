<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Permission extends SpatiePermission
{
    public function category(): BelongsTo
    {
        return $this->belongsTo(PermissionCategory::class, 'category_id');
    }
}

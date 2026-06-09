<?php

namespace App\Http\Requests\Admin\Role;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreRoleRequest extends FormRequest
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
        $role = $this->route('role');
        $roleId = is_object($role) ? $role->id : $role;

        return [
            'name'          => ($roleId ? 'sometimes|required' : 'required') . '|string|unique:roles,name' . ($roleId ? ",{$roleId}" : ''),
            'permissions'   => ($roleId ? 'required' : 'nullable') . '|array',
            'permissions.*' => 'required|exists:permissions,name',
        ];
    }
}

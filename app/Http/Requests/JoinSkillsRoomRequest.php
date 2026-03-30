<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JoinSkillsRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'size:6'],
            'role' => ['required', 'string', 'in:host,guest'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode room wajib diisi.',
            'code.size' => 'Kode room harus 6 karakter.',
            'role.in' => 'Role room tidak valid.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => strtoupper(trim((string) $this->input('code'))),
            'role' => strtolower(trim((string) $this->input('role'))),
        ]);
    }
}

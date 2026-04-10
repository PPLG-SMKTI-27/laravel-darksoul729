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
            'display_name' => ['required', 'string', 'min:2', 'max:24'],
            'role' => ['required', 'string', 'in:host,guest'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode room wajib diisi.',
            'code.size' => 'Kode room harus 6 karakter.',
            'display_name.required' => 'Nama player wajib diisi.',
            'display_name.min' => 'Nama player minimal 2 karakter.',
            'display_name.max' => 'Nama player maksimal 24 karakter.',
            'role.in' => 'Role room tidak valid.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => strtoupper(trim((string) $this->input('code'))),
            'display_name' => trim(preg_replace('/\s+/', ' ', (string) $this->input('display_name')) ?? ''),
            'role' => strtolower(trim((string) $this->input('role'))),
        ]);
    }
}

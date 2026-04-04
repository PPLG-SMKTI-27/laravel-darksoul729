<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterChatUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_id' => ['required', 'string', 'min:12', 'max:80'],
            'name' => ['required', 'string', 'min:2', 'max:120'],
        ];
    }

    public function messages(): array
    {
        return [
            'device_id.required' => 'Perangkat chat tidak valid.',
            'name.required' => 'Nama wajib diisi.',
            'name.min' => 'Nama minimal 2 karakter.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'device_id' => trim((string) $this->input('device_id')),
            'name' => trim((string) $this->input('name')),
        ]);
    }
}

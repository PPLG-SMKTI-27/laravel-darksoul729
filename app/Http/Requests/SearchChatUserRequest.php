<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchChatUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_id' => ['required', 'string', 'min:12', 'max:80'],
            'code' => ['required', 'string', 'regex:/^PZ-\d{6}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'device_id.required' => 'Perangkat chat tidak valid.',
            'code.required' => 'Code teman wajib diisi.',
            'code.regex' => 'Format code tidak valid.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'device_id' => trim((string) $this->input('device_id')),
            'code' => strtoupper(trim((string) $this->input('code'))),
        ]);
    }
}

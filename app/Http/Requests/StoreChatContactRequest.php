<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChatContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_id' => ['required', 'string', 'min:12', 'max:80'],
            'contact_code' => ['required', 'string', 'regex:/^PZ-\d{6}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'device_id.required' => 'Perangkat chat tidak valid.',
            'contact_code.required' => 'Code teman wajib diisi.',
            'contact_code.regex' => 'Format code tidak valid.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'device_id' => trim((string) $this->input('device_id')),
            'contact_code' => strtoupper(trim((string) $this->input('contact_code'))),
        ]);
    }
}

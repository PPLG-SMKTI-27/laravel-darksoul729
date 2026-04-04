<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreChatMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_id' => ['required', 'string', 'min:12', 'max:80'],
            'recipient_code' => ['required', 'string', 'regex:/^PZ-\d{6}$/'],
            'body' => ['required', 'string', 'min:1', 'max:3000'],
        ];
    }

    public function messages(): array
    {
        return [
            'device_id.required' => 'Perangkat chat tidak valid.',
            'recipient_code.required' => 'Penerima tidak valid.',
            'recipient_code.regex' => 'Format code penerima tidak valid.',
            'body.required' => 'Pesan tidak boleh kosong.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'device_id' => trim((string) $this->input('device_id')),
            'recipient_code' => strtoupper(trim((string) $this->input('recipient_code'))),
            'body' => trim((string) $this->input('body')),
        ]);
    }
}

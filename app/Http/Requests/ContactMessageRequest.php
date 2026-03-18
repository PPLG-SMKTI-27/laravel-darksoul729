<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'company' => ['nullable', 'max:0'],
            'form_started_at' => ['required', 'integer'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.min' => 'Nama minimal 2 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'message.required' => 'Pesan wajib diisi.',
            'message.min' => 'Pesan minimal 10 karakter.',
            'company.max' => 'Permintaan ditolak.',
            'form_started_at.required' => 'Form tidak valid. Muat ulang halaman lalu coba lagi.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'email' => strtolower(trim((string) $this->input('email'))),
            'message' => trim((string) $this->input('message')),
            'company' => trim((string) $this->input('company')),
            'form_started_at' => (int) $this->input('form_started_at'),
        ]);
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $startedAt = (int) $this->input('form_started_at');
                $secondsOnForm = now()->timestamp - $startedAt;

                if ($startedAt <= 0 || $secondsOnForm < 3) {
                    $validator->errors()->add('form', 'Pengiriman terlalu cepat. Coba isi form dengan wajar lalu kirim lagi.');
                }
            },
        ];
    }
}

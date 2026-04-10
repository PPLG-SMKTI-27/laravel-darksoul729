<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncSkillsRoomPlayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'size:6'],
            'player_uuid' => ['required', 'uuid'],
            'state' => ['required', 'array'],
            'state.mode' => ['required', 'string', 'in:boat,land'],
            'state.x' => ['required', 'numeric'],
            'state.y' => ['required', 'numeric'],
            'state.z' => ['required', 'numeric'],
            'state.heading' => ['required', 'numeric'],
            'state.boat' => ['required', 'array'],
            'state.boat.x' => ['required', 'numeric'],
            'state.boat.y' => ['required', 'numeric'],
            'state.boat.z' => ['required', 'numeric'],
            'state.boat.heading' => ['required', 'numeric'],
            'state.land' => ['required', 'array'],
            'state.land.x' => ['required', 'numeric'],
            'state.land.y' => ['required', 'numeric'],
            'state.land.z' => ['required', 'numeric'],
            'state.land.heading' => ['required', 'numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode room wajib diisi.',
            'player_uuid.required' => 'Player room tidak valid.',
            'state.required' => 'State player wajib dikirim.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => strtoupper(trim((string) $this->input('code'))),
            'player_uuid' => trim((string) $this->input('player_uuid')),
        ]);
    }
}

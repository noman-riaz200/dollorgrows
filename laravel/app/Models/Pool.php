<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pool extends Model
{
    use HasFactory;

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the primary key ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'name',
        'description',
        'minimum_investment',
        'maximum_investment',
        'daily_return',
        'duration_days',
        'is_active',
        'total_capacity',
        'total_invested',
        'level1_commission',
        'level2_commission',
        'level3_commission',
        'bonus_percent',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'minimum_investment' => 'float',
            'maximum_investment' => 'float',
            'daily_return' => 'float',
            'total_capacity' => 'float',
            'total_invested' => 'float',
            'level1_commission' => 'float',
            'level2_commission' => 'float',
            'level3_commission' => 'float',
            'bonus_percent' => 'float',
        ];
    }

    /**
     * Get the investments for the pool.
     */
    public function investments()
    {
        return $this->hasMany(Investment::class);
    }
}
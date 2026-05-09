<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends Model
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
        'user_id',
        'pool_id',
        'amount',
        'status',
        'start_date',
        'end_date',
        'is_active',
        'last_claim_date',
        'total_claimed',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'last_claim_date' => 'datetime',
            'is_active' => 'boolean',
            'amount' => 'float',
            'total_claimed' => 'float',
        ];
    }

    /**
     * Get the user that owns the investment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the pool that the investment belongs to.
     */
    public function pool()
    {
        return $this->belongsTo(Pool::class);
    }

    /**
     * Get the commissions for this investment.
     */
    public function commissions()
    {
        return $this->hasMany(Commission::class);
    }
}
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

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
        'email',
        'password',
        'security_pin',
        'referral_code',
        'sponsor_id',
        'phone',
        'country',
        'phone_code',
        'avatar',
        'role',
        'status',
        'last_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'security_pin',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_login' => 'datetime',
        ];
    }

    /**
     * Get the wallet associated with the user.
     */
    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * Get the investments for the user.
     */
    public function investments()
    {
        return $this->hasMany(Investment::class);
    }

    /**
     * Get the commissions received by the user.
     */
    public function commissionsReceived()
    {
        return $this->hasMany(Commission::class, 'to_user_id');
    }

    /**
     * Get the commissions given by the user.
     */
    public function commissionsGiven()
    {
        return $this->hasMany(Commission::class, 'from_user_id');
    }

    /**
     * Get the sponsor (referrer) of this user.
     */
    public function sponsor()
    {
        return $this->belongsTo(User::class, 'sponsor_id');
    }

    /**
     * Get the referrals (users sponsored by this user).
     */
    public function referrals()
    {
        return $this->hasMany(User::class, 'sponsor_id');
    }
}

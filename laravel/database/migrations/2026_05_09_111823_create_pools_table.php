<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('pools')) {
            Schema::create('pools', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('name');
                $table->text('description')->nullable();
                $table->float('minimum_investment')->default(0);
                $table->float('maximum_investment')->nullable();
                $table->float('daily_return');
                $table->integer('duration_days')->default(30);
                $table->boolean('is_active')->default(true);
                $table->float('total_capacity')->nullable();
                $table->float('total_invested')->default(0);
                $table->float('level1_commission')->default(10);
                $table->float('level2_commission')->default(5);
                $table->float('level3_commission')->default(3);
                $table->float('bonus_percent')->default(30);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pools');
    }
};

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
        if (!Schema::hasTable('investments')) {
            Schema::create('investments', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('user_id');
                $table->string('pool_id');
                $table->float('amount');
                $table->string('status')->default('active');
                $table->timestamp('start_date')->useCurrent();
                $table->timestamp('end_date');
                $table->boolean('is_active')->default(true);
                $table->timestamp('last_claim_date')->nullable();
                $table->float('total_claimed')->default(0);
                $table->timestamps();

                $table->unique(['user_id', 'pool_id']);
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('pool_id')->references('id')->on('pools')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};

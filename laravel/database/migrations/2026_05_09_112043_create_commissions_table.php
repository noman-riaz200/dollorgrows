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
        if (!Schema::hasTable('commissions')) {
            Schema::create('commissions', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('from_user_id');
                $table->string('to_user_id');
                $table->string('investment_id')->nullable();
                $table->float('amount');
                $table->integer('level');
                $table->float('percentage')->default(0);
                $table->string('status')->default('pending');
                $table->string('description')->nullable();
                $table->timestamps();
                $table->timestamp('processed_at')->nullable();

                $table->foreign('from_user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('to_user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('investment_id')->references('id')->on('investments')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};

<?php

use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\InvestmentController as AdminInvestmentController;
use App\Http\Controllers\Api\Admin\KycController;
use App\Http\Controllers\Api\Admin\ProfitReportController as AdminProfitReportController;
use App\Http\Controllers\Api\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Api\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Api\Admin\UmkmReviewController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Investor\InvestmentController;
use App\Http\Controllers\Api\Investor\NotificationController;
use App\Http\Controllers\Api\Investor\PlatformInfoController;
use App\Http\Controllers\Api\Investor\PortfolioController;
use App\Http\Controllers\Api\Investor\ProfileController as InvestorProfileController;
use App\Http\Controllers\Api\Investor\UmkmController;
use App\Http\Controllers\Api\Umkm\DashboardController as UmkmDashboardController;
use App\Http\Controllers\Api\Umkm\InvestorListController;
use App\Http\Controllers\Api\Umkm\PlatformInfoController as UmkmPlatformInfoController;
use App\Http\Controllers\Api\Umkm\ProfileController as UmkmProfileController;
use App\Http\Controllers\Api\Umkm\ProfitReportController;
use Illuminate\Support\Facades\Route;

// ── AUTH ─────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/investor/register', [AuthController::class, 'registerInvestor']);
    Route::post('/umkm/register', [AuthController::class, 'registerUmkm']);
    Route::post('/{role}/login', [AuthController::class, 'login'])->whereIn('role', ['investor', 'umkm', 'admin']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

// ── INVESTOR ─────────────────────────────────────────────────────────
Route::prefix('investor')->middleware(['auth:sanctum', 'role:investor'])->group(function () {
    Route::get('/umkm', [UmkmController::class, 'index']);
    Route::get('/umkm/{umkm}', [UmkmController::class, 'show']);

    Route::middleware('kyc.approved')->group(function () {
        Route::post('/investments', [InvestmentController::class, 'store']);
    });
    Route::get('/investments', [InvestmentController::class, 'index']);

    Route::get('/portfolio', [PortfolioController::class, 'index']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);

    Route::get('/profile', [InvestorProfileController::class, 'show']);
    Route::patch('/profile', [InvestorProfileController::class, 'update']);

    Route::get('/platform-bank', [PlatformInfoController::class, 'bankInfo']);
});

// ── UMKM ─────────────────────────────────────────────────────────────
Route::prefix('umkm-panel')->middleware(['auth:sanctum', 'role:umkm'])->group(function () {
    Route::get('/dashboard', [UmkmDashboardController::class, 'index']);
    Route::get('/investors', [InvestorListController::class, 'index']);

    Route::get('/profit-reports', [ProfitReportController::class, 'index']);
    Route::post('/profit-reports', [ProfitReportController::class, 'store']);

    Route::get('/profile', [UmkmProfileController::class, 'show']);
    Route::patch('/profile', [UmkmProfileController::class, 'update']);

    Route::get('/platform-fee', [UmkmPlatformInfoController::class, 'feeInfo']);
});

// ── ADMIN ────────────────────────────────────────────────────────────
Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    Route::get('/kyc', [KycController::class, 'index']);
    Route::post('/kyc/{investor}/approve', [KycController::class, 'approve']);
    Route::post('/kyc/{investor}/reject', [KycController::class, 'reject']);

    Route::get('/umkm', [UmkmReviewController::class, 'index']);
    Route::post('/umkm/{umkm}/approve', [UmkmReviewController::class, 'approve']);
    Route::post('/umkm/{umkm}/reject', [UmkmReviewController::class, 'reject']);

    Route::get('/investments', [AdminInvestmentController::class, 'index']);
    Route::post('/investments/{investment}/confirm', [AdminInvestmentController::class, 'confirm']);
    Route::post('/investments/{investment}/reject', [AdminInvestmentController::class, 'reject']);
    Route::post('/investments/{investment}/forward', [AdminInvestmentController::class, 'forward']);

    Route::get('/profit-reports', [AdminProfitReportController::class, 'index']);
    Route::post('/profit-reports/{profitReport}/approve', [AdminProfitReportController::class, 'approve']);
    Route::post('/profit-reports/{profitReport}/reject', [AdminProfitReportController::class, 'reject']);

    Route::get('/reports', [AdminReportController::class, 'index']);

    Route::get('/settings', [AdminSettingsController::class, 'index']);
    Route::patch('/settings', [AdminSettingsController::class, 'update']);
});

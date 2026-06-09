<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AudioController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\YearController;
use App\Http\Controllers\Api\SpeakerController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\ClassSessionController;
use App\Http\Controllers\Api\TopicController;
use App\Http\Controllers\Api\QuestionAnswerController;
use App\Http\Controllers\Api\PrayerTimingController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\DownloadController;
use App\Http\Controllers\Api\LatestNewsController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\DeviceTokenController;
use App\Http\Controllers\Api\YoutubeFetchController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\NotificationController;

Route::prefix('v1')->group(function () {
    Route::get('/youtube/fetch', [YoutubeFetchController::class, 'fetch']);

    // ── Public Routes ──────────────────────────────────────
    Route::prefix('audio')->group(function () {
        Route::get('/', [AudioController::class, 'index']);
        Route::get('/latest', [AudioController::class, 'latest']);
        Route::get('/{id}', [AudioController::class, 'show']);
        Route::get('/categories/{cat}/years/{year}', [AudioController::class, 'byCategory']);
        Route::post('/{id}/mark-view', [AudioController::class, 'markView']);
    });

    Route::prefix('videos')->group(function () {
        Route::get('/', [VideoController::class, 'index']);
        Route::get('/{id}', [VideoController::class, 'show']);
        Route::post('/{id}/mark-view', [VideoController::class, 'markView']);
    });

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/years', [YearController::class, 'index']);
    Route::get('/speakers', [SpeakerController::class, 'index']);
    Route::get('/prayer-timings', [PrayerTimingController::class, 'index']);
    Route::get('/images', [ImageController::class, 'index']);
    Route::get('/downloads', [DownloadController::class, 'index']);
    Route::get('/latest-news', [LatestNewsController::class, 'index']);
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::get('/teachers', [TeacherController::class, 'index']);
    Route::get('/teachers/{id}', [TeacherController::class, 'show']);

    Route::prefix('classes')->group(function () {
        Route::get('/', [ClassController::class, 'index']);
        Route::get('/{id}', [ClassController::class, 'show']);
        Route::get('/{class}/sessions', [ClassSessionController::class, 'index']);
    });

    Route::get('/topics', [TopicController::class, 'index']);
    Route::prefix('question-answers')->group(function () {
        Route::get('/', [QuestionAnswerController::class, 'index']);
        Route::get('/{id}', [QuestionAnswerController::class, 'show']);
    });

    // ── Auth Routes ────────────────────────────────────────
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);

    // ── Authenticated Routes ───────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/sessions', [AuthController::class, 'sessions']);
        Route::delete('/auth/revoke-all-tokens', [AuthController::class, 'revokeAllTokens']);
        
        Route::prefix('user')->group(function () {
            Route::get('/profile', [UserController::class, 'profile']);
            Route::put('/profile', [UserController::class, 'updateProfile']);
            Route::post('/change-password', [UserController::class, 'changePassword']);
            Route::get('/admission-status', [UserController::class, 'admissionStatus']);
            Route::post('/admission/documents', [UserController::class, 'uploadDocuments']);
        });

        Route::post('/feedback', [FeedbackController::class, 'store']);
        Route::post('/subscriptions', [SubscriptionController::class, 'store']);

        Route::post('/device-tokens', [DeviceTokenController::class, 'store']);
        Route::delete('/device-tokens', [DeviceTokenController::class, 'destroy']);

        Route::prefix('notifications')->group(function () {
            Route::get('/', [NotificationController::class, 'index']);
            Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
            Route::post('/{id}/read', [NotificationController::class, 'markRead']);
            Route::post('/read-all', [NotificationController::class, 'markAllRead']);
        });
    });

});


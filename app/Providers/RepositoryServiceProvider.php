<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\StudentRepositoryInterface;
use App\Repositories\Eloquent\EloquentStudentRepository;
use App\Repositories\Contracts\MediaRepositoryInterface;
use App\Repositories\Eloquent\EloquentMediaRepository;
use App\Repositories\Contracts\AdmissionRepositoryInterface;
use App\Repositories\Eloquent\EloquentAdmissionRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(StudentRepositoryInterface::class, EloquentStudentRepository::class);
        $this->app->bind(MediaRepositoryInterface::class, EloquentMediaRepository::class);
        $this->app->bind(AdmissionRepositoryInterface::class, EloquentAdmissionRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}

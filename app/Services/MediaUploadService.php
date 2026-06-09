<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Exception;

class MediaUploadService
{
    public function uploadAudio(UploadedFile $file): string
    {
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        Storage::disk('media')->putFileAs('', $file, $filename);
        return $filename;
    }

    public function uploadVideo(UploadedFile $file): string
    {
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        Storage::disk('media')->putFileAs('', $file, $filename);
        return $filename;
    }

    public function uploadThumbnail(UploadedFile $file): string
    {
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

        try {
            // Resize to 400x225 (16:9 standard thumbnail size)
            $image = Image::read($file);
            $image->cover(400, 225); // Cover fits and crops if necessary
            
            $tempPath = tempnam(sys_get_temp_dir(), 'thumb');
            $image->save($tempPath);
            
            Storage::disk('thumbnails')->put($filename, file_get_contents($tempPath));
            @unlink($tempPath);
        } catch (Exception $e) {
            // Fallback to storing raw file if Intervention fails
            Storage::disk('thumbnails')->putFileAs('', $file, $filename);
        }

        return $filename;
    }

    public function uploadImage(UploadedFile $file): string
    {
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

        try {
            // Resize to 1920x1080 (standard HD image banner size)
            $image = Image::read($file);
            $image->scaleDown(1920, 1080); // Scales down preserving aspect ratio
            
            $tempPath = tempnam(sys_get_temp_dir(), 'img');
            $image->save($tempPath);
            
            Storage::disk('media')->put($filename, file_get_contents($tempPath));
            @unlink($tempPath);
        } catch (Exception $e) {
            // Fallback to storing raw file if Intervention fails
            Storage::disk('media')->putFileAs('', $file, $filename);
        }

        return $filename;
    }

    public function deleteFile(string $disk, ?string $filename): void
    {
        if ($filename && Storage::disk($disk)->exists($filename)) {
            Storage::disk($disk)->delete($filename);
        }
    }
}

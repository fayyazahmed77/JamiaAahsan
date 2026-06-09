<?php

namespace App\Http\Controllers\Admin\Cms;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\MediaUploadService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SettingController extends Controller
{
    protected $uploadService;

    public function __construct(MediaUploadService $uploadService)
    {
        $this->uploadService = $uploadService;
    }

    public function index(): Response
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Cms/Settings', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $rules = [
            'site_name'        => 'nullable|string|max:255',
            'site_name_urdu'   => 'nullable|string|max:255',
            'contact_email'    => 'nullable|email|max:255',
            'contact_phone'    => 'nullable|string|max:100',
            'contact_address'  => 'nullable|string',
            'social_facebook'  => 'nullable|url|max:255',
            'social_youtube'   => 'nullable|url|max:255',
            'social_twitter'   => 'nullable|url|max:255',
            'seo_title'        => 'nullable|string|max:255',
            'seo_description'  => 'nullable|string',
            'seo_keywords'     => 'nullable|string',
            'logo'             => 'nullable|image|max:2048',
            'favicon'          => 'nullable|image|max:1024',
        ];

        $validated = $request->validate($rules);

        // Handle File Uploads
        if ($request->hasFile('logo')) {
            $oldLogo = Setting::where('key', 'logo_uri')->value('value');
            if ($oldLogo && !str_starts_with($oldLogo, 'http')) {
                $this->uploadService->deleteFile('media', $oldLogo);
            }
            $logoUri = $this->uploadService->uploadImage($request->file('logo'));
            Setting::updateOrCreate(['key' => 'logo_uri'], ['value' => $logoUri]);
        }

        if ($request->hasFile('favicon')) {
            $oldFavicon = Setting::where('key', 'favicon_uri')->value('value');
            if ($oldFavicon && !str_starts_with($oldFavicon, 'http')) {
                $this->uploadService->deleteFile('media', $oldFavicon);
            }
            $faviconUri = $this->uploadService->uploadImage($request->file('favicon'));
            Setting::updateOrCreate(['key' => 'favicon_uri'], ['value' => $faviconUri]);
        }

        // Update other settings
        foreach ($request->except(['logo', 'favicon']) as $key => $value) {
            if (array_key_exists($key, $rules)) {
                Setting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $value]
                );
            }
        }

        return redirect()->route('admin.settings.index')->with('success', 'Settings updated successfully.');
    }
}

<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Klass;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdmissionsController extends Controller
{
    /**
     * Display the admission guidelines and course eligibility page.
     */
    public function index(): Response
    {
        return Inertia::render('Public/Admissions/Index', [
            'classes' => Klass::where('status', true)->orderBy('sort', 'asc')->get()
        ]);
    }

    /**
     * Display the online admission registration form.
     */
    public function apply(): Response
    {
        return Inertia::render('Public/Admissions/Apply', [
            'classes' => Klass::where('status', true)->orderBy('sort', 'asc')->get()
        ]);
    }

    /**
     * Handle public student admission application submission.
     */
    public function store(\App\Http\Requests\Public\AdmissionApplicationRequest $request): RedirectResponse
    {

        $birthCertificatePath = null;
        if ($request->hasFile('birth_certificate')) {
            $birthCertificatePath = $request->file('birth_certificate')->store('documents', 'public');
        }

        $educationDegreePath = null;
        if ($request->hasFile('education_degree')) {
            $educationDegreePath = $request->file('education_degree')->store('documents', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => true,
        ]);

        // Assign default Student role (Spatie Permissions)
        $user->assignRole('Student');

        $detail = UserDetail::create([
            'user_id' => $user->id,
            'class_id' => $request->class_id,
            'guardian_name' => $request->guardian_name,
            'gender' => $request->gender,
            'address' => $request->address,
            'id_card_no' => $request->id_card_no,
            'qualification' => $request->qualification,
            'phone' => $request->phone,
            'country' => $request->country ?? 'Pakistan',
            'admission_type' => $request->admission_type ?? 'regular',
            'is_approved' => false,
            'birth_certificate_path' => $birthCertificatePath,
            'education_degree_path' => $educationDegreePath,
        ]);

        // Fire AdmissionSubmitted event
        event(new \App\Events\AdmissionSubmitted($detail));

        // Log the new user in
        Auth::login($user);

        return redirect()->route('public.home')->with('success', 'Your admission application has been submitted successfully! We will review your application soon.');
    }
}
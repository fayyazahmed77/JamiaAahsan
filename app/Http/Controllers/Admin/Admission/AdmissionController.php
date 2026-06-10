<?php

namespace App\Http\Controllers\Admin\Admission;

use App\Http\Controllers\Controller;
use App\Models\UserDetail;
use App\Models\Klass;
use App\Models\LogAdmissionClass;
use App\Services\AdmissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class AdmissionController extends Controller
{
    public function __construct(private readonly AdmissionService $admissionService) {}

    public function index(Request $request): Response
    {
        $query = UserDetail::with(['user', 'class']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('registration_no', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('id_card_no', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->input('gender'));
        }

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->input('class_id'));
        }

        if ($request->has('status')) {
            if ($request->input('status') === 'approved') {
                $query->where('is_approved', true);
            } elseif ($request->input('status') === 'pending') {
                $query->where('is_approved', false);
            }
        }

        $admissions = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Admissions/Index', [
            'admissions' => $admissions,
            'classes'    => Klass::where('status', true)->get(['id', 'name']),
            'filters'    => $request->only(['search', 'gender', 'class_id', 'status']),
        ]);
    }

    public function show($id): Response
    {
        $admission = UserDetail::with(['user', 'class'])->findOrFail($id);
        $logs = LogAdmissionClass::where('student_id', $admission->user_id)->with(['admin', 'class'])->latest()->get();

        return Inertia::render('Admin/Admissions/Show', [
            'admission' => $admission,
            'logs'      => $logs,
            'classes'   => Klass::where('status', true)->get(['id', 'name']),
        ]);
    }

    public function approve(\App\Http\Requests\Admin\Admission\ApproveAdmissionRequest $request, $id): RedirectResponse
    {
        $detail = UserDetail::findOrFail($id);

        $this->admissionService->approve($detail, Auth::id());

        return redirect()->back()->with('success', 'Admission application approved successfully.');
    }

    public function reject(Request $request, $id): RedirectResponse
    {
        $detail = UserDetail::findOrFail($id);
        $note   = $request->input('note', 'No details provided.');

        $this->admissionService->reject($detail, Auth::id(), $note);

        return redirect()->back()->with('success', 'Admission application rejected/pending.');
    }

    public function transfer(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'note'     => 'nullable|string',
        ]);

        $detail = UserDetail::findOrFail($id);

        $this->admissionService->transfer(
            $detail,
            Auth::id(),
            (int) $request->input('class_id'),
            $request->input('note'),
        );

        return redirect()->back()->with('success', 'Student class transferred successfully.');
    }
}

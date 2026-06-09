<?php

namespace App\Http\Controllers\Admin\Admission;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserDetail;
use App\Models\Klass;
use App\Models\LogAdmissionClass;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class AdmissionController extends Controller
{
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

        if (!$detail->is_approved) {
            // Generate registration number if not exists
            if (empty($detail->registration_no)) {
                $year = date('Y');
                $detail->registration_no = 'REG-' . $year . '-' . $detail->class_id . '-' . $detail->id;
            }
            $detail->is_approved = true;
            $detail->save();

            LogAdmissionClass::create([
                'student_id' => $detail->user_id,
                'user_id'    => Auth::id(),
                'class_id'   => $detail->class_id,
                'note'       => 'Admission application approved. Registration number: ' . $detail->registration_no,
            ]);

            // C5: Audit trail
            \App\Models\AuditLog::record(
                'admission.approved',
                $detail,
                ['is_approved' => false],
                ['is_approved' => true, 'registration_no' => $detail->registration_no],
            );

            event(new \App\Events\AdmissionApproved($detail));
        }

        return redirect()->back()->with('success', 'Admission application approved successfully.');
    }

    public function reject(Request $request, $id): RedirectResponse
    {
        $detail = UserDetail::findOrFail($id);

        $detail->is_approved = false;
        $detail->save();

        $note = $request->input('note', 'No details provided.');

        LogAdmissionClass::create([
            'student_id' => $detail->user_id,
            'user_id'    => Auth::id(),
            'class_id'   => $detail->class_id,
            'note'       => 'Admission application set to pending/rejected: ' . $note,
        ]);

        // C5: Audit trail
        \App\Models\AuditLog::record(
            'admission.rejected',
            $detail,
            ['is_approved' => true],
            ['is_approved' => false, 'rejection_note' => $note],
        );

        event(new \App\Events\AdmissionRejected($detail, $note));

        return redirect()->back()->with('success', 'Admission application rejected/pending.');
    }


    public function transfer(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'note'     => 'nullable|string',
        ]);

        $detail = UserDetail::findOrFail($id);
        $oldClassId = $detail->class_id;
        $newClassId = $request->input('class_id');

        $detail->class_id = $newClassId;
        $detail->save();

        LogAdmissionClass::create([
            'student_id' => $detail->user_id,
            'user_id'    => Auth::id(),
            'class_id'   => $newClassId,
            'note'       => 'Student class transferred. Note: ' . $request->input('note', 'Class changed.'),
        ]);

        return redirect()->back()->with('success', 'Student class transferred successfully.');
    }
}

<?php

namespace App\Services;

use App\Models\UserDetail;
use App\Models\LogAdmissionClass;
use App\Models\AuditLog;
use App\Events\AdmissionApproved;
use App\Events\AdmissionRejected;

class AdmissionService
{
    /**
     * Approve an admission application.
     */
    public function approve(UserDetail $detail, int $adminId): void
    {
        if ($detail->is_approved) {
            return;
        }

        // Generate registration number if not exists
        if (empty($detail->registration_no)) {
            $year = date('Y');
            $detail->registration_no = 'REG-' . $year . '-' . $detail->class_id . '-' . $detail->id;
        }
        
        $detail->is_approved = true;
        $detail->save();

        LogAdmissionClass::create([
            'student_id' => $detail->user_id,
            'user_id'    => $adminId,
            'class_id'   => $detail->class_id,
            'note'       => 'Admission application approved. Registration number: ' . $detail->registration_no,
        ]);

        // C5: Audit trail
        AuditLog::record(
            'admission.approved',
            $detail,
            ['is_approved' => false],
            ['is_approved' => true, 'registration_no' => $detail->registration_no],
        );

        event(new AdmissionApproved($detail));
    }

    /**
     * Reject or set to pending an admission application.
     */
    public function reject(UserDetail $detail, int $adminId, string $note): void
    {
        $detail->is_approved = false;
        $detail->save();

        LogAdmissionClass::create([
            'student_id' => $detail->user_id,
            'user_id'    => $adminId,
            'class_id'   => $detail->class_id,
            'note'       => 'Admission application set to pending/rejected: ' . $note,
        ]);

        // C5: Audit trail
        AuditLog::record(
            'admission.rejected',
            $detail,
            ['is_approved' => true],
            ['is_approved' => false, 'rejection_note' => $note],
        );

        event(new AdmissionRejected($detail, $note));
    }

    /**
     * Transfer student to a new class.
     */
    public function transfer(UserDetail $detail, int $adminId, int $newClassId, ?string $note): void
    {
        $oldClassId = $detail->class_id;
        $detail->class_id = $newClassId;
        $detail->save();

        LogAdmissionClass::create([
            'student_id' => $detail->user_id,
            'user_id'    => $adminId,
            'class_id'   => $newClassId,
            'note'       => 'Student class transferred. Note: ' . ($note ?: 'Class changed.'),
        ]);
        
        // Audit log for transfer can also be added here if needed
        AuditLog::record(
            'admission.transferred',
            $detail,
            ['class_id' => $oldClassId],
            ['class_id' => $newClassId, 'note' => $note],
        );
    }
}

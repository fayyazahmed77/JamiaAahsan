<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hifz Progress Card — {{ $student->name }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm;
        }
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            color: #2b2b2b;
            font-size: 13px;
            line-height: 1.5;
        }
        .header-table {
            width: 100%;
            border-bottom: 3px double #1e6b3e;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .logo {
            width: 70px;
            height: auto;
        }
        .institution-name {
            font-size: 20px;
            font-weight: bold;
            color: #1e6b3e;
            text-transform: uppercase;
            margin: 0;
        }
        .institution-sub {
            font-size: 11px;
            color: #d4af37;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 2px 0 0;
        }
        .report-title {
            text-align: right;
            font-size: 18px;
            font-style: italic;
            color: #333;
            margin: 0;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e6b3e;
            border-bottom: 1px solid #d4af37;
            padding-bottom: 4px;
            margin-top: 20px;
            margin-bottom: 10px;
            text-transform: uppercase;
        }

        .info-grid {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
        }
        .info-grid td {
            padding: 5px 0;
            vertical-align: top;
        }
        .info-label {
            font-weight: bold;
            color: #555;
            width: 25%;
        }
        .info-value {
            color: #222;
            width: 25%;
        }

        /* Progress Bar */
        .progress-container {
            margin: 15px 0;
            background-color: #f0f0f0;
            border-radius: 4px;
            height: 18px;
            width: 100%;
            position: relative;
            border: 1px solid #ccc;
        }
        .progress-bar {
            background-color: #1e6b3e;
            height: 100%;
            border-radius: 3px;
        }
        .progress-text {
            position: absolute;
            width: 100%;
            text-align: center;
            top: 0;
            left: 0;
            line-height: 18px;
            font-size: 11px;
            font-weight: bold;
            color: #333;
        }

        /* Session Table */
        .session-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .session-table th, .session-table td {
            border: 1px solid #dddddd;
            padding: 6px 8px;
            text-align: left;
            font-size: 11px;
        }
        .session-table th {
            background-color: #f7f9f6;
            color: #1e6b3e;
            font-weight: bold;
        }
        .session-table tr:nth-child(even) {
            background-color: #fafbfc;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .badge-excellent { background-color: #d4edda; color: #155724; }
        .badge-good { background-color: #cce5ff; color: #004085; }
        .badge-average { background-color: #fff3cd; color: #856404; }
        .badge-needs_revision { background-color: #f8d7da; color: #721c24; }

        .footer {
            margin-top: 40px;
            width: 100%;
            font-size: 11px;
            color: #666;
            text-align: center;
        }
        .signature-table {
            width: 100%;
            margin-top: 50px;
        }
        .signature-line {
            border-top: 1px solid #777;
            width: 200px;
            margin: 0 auto 5px;
        }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td style="width: 80px;">
                <img src="https://jamiaahsan.edu.pk/images/logo.png" alt="Logo" class="logo" onerror="this.style.display='none';" />
            </td>
            <td>
                <h1 class="institution-name">Jamia Arabia Ahsan Ul Uloom</h1>
                <div class="institution-sub">Hifz Al-Quran Program Progress Card</div>
            </td>
            <td style="text-align: right; vertical-align: bottom;">
                <div class="report-title">Progress Report</div>
                <div style="font-size: 11px; color: #666;">Generated: {{ now()->format('d M Y') }}</div>
            </td>
        </tr>
    </table>

    <div class="section-title">Student Profile</div>
    <table class="info-grid">
        <tr>
            <td class="info-label">Student Name:</td>
            <td class="info-value">{{ $student->name }}</td>
            <td class="info-label">Student ID:</td>
            <td class="info-value">{{ $student->student_id_number }}</td>
        </tr>
        <tr>
            <td class="info-label">Assigned Teacher:</td>
            <td class="info-value">{{ $enrollment?->teacher?->name ?? 'Not Assigned' }}</td>
            <td class="info-label">Enrollment Status:</td>
            <td class="info-value"><span style="font-weight: bold; color: {{ ($enrollment?->status ?? '') === 'active' ? '#1e6b3e' : '#888' }}">{{ ucfirst($enrollment?->status ?? 'N/A') }}</span></td>
        </tr>
        <tr>
            <td class="info-label">Start Date:</td>
            <td class="info-value">{{ $enrollment?->start_date ? $enrollment->start_date->format('d M Y') : 'N/A' }}</td>
            <td class="info-label">Target Completion:</td>
            <td class="info-value">{{ $enrollment?->target_completion_date ? $enrollment->target_completion_date->format('d M Y') : 'N/A' }}</td>
        </tr>
    </table>

    <div class="section-title">Hifz Progress Metrics</div>
    <table class="info-grid">
        <tr>
            <td class="info-label">Juz Completed:</td>
            <td class="info-value" style="font-weight: bold;">{{ $enrollment?->juz_completed ?? 0 }} / {{ $enrollment?->total_juz_target ?? 30 }} Juz</td>
            <td class="info-label">Current Position:</td>
            <td class="info-value">Surah {{ $enrollment?->current_surah ?? 'N/A' }} (Ayah {{ $enrollment?->current_ayah ?? 'N/A' }})</td>
        </tr>
    </table>

    <div style="margin-top: 5px; margin-bottom: 25px;">
        <div style="font-size: 11px; font-weight: bold; margin-bottom: 5px; color: #555;">Completion Progress ({{ $completionRate }}%):</div>
        <div class="progress-container">
            <div class="progress-bar" style="width: {{ $completionRate }}%;"></div>
            <div class="progress-text" style="color: #000;">{{ $completionRate }}% Completed</div>
        </div>
    </div>

    @if($enrollment && $enrollment->notes)
        <div class="section-title">Remarks</div>
        <div style="background-color: #fafbfc; border-left: 3px solid #1e6b3e; padding: 10px; margin-bottom: 20px; font-style: italic; font-size: 12px; color: #444;">
            "{{ $enrollment->notes }}"
        </div>
    @endif

    <div class="section-title">Recent Session Details (Last 15 Sessions)</div>
    @if($sessions->isEmpty())
        <div style="text-align: center; color: #888; padding: 20px;">No daily session history found for this student.</div>
    @else
        <table class="session-table">
            <thead>
                <tr>
                    <th style="width: 85px;">Date</th>
                    <th>New Lesson (Sabaq)</th>
                    <th style="width: 60px; text-align: center;">New Pages</th>
                    <th>Sabqi (Recent)</th>
                    <th style="text-align: center;">Sabqi Qual.</th>
                    <th>Manzil (Old)</th>
                    <th style="text-align: center;">Manzil Qual.</th>
                    <th style="width: 45px; text-align: center;">Mistakes</th>
                </tr>
            </thead>
            <tbody>
                @foreach($sessions as $session)
                    <tr>
                        <td>{{ $session->session_date ? $session->session_date->format('d M Y') : 'N/A' }}</td>
                        <td>
                            @if($session->new_lesson_from || $session->new_lesson_to)
                                {{ $session->new_lesson_from }} to {{ $session->new_lesson_to }}
                            @else
                                <span style="color: #999;">—</span>
                            @endif
                        </td>
                        <td style="text-align: center;">{{ $session->new_lesson_pages ?? 0 }}</td>
                        <td>
                            @if($session->sabqi_from || $session->sabqi_to)
                                {{ $session->sabqi_from }} to {{ $session->sabqi_to }}
                            @else
                                <span style="color: #999;">—</span>
                            @endif
                        </td>
                        <td style="text-align: center;">
                            @if($session->sabqi_quality)
                                <span class="badge badge-{{ $session->sabqi_quality }}">{{ str_replace('_', ' ', $session->sabqi_quality) }}</span>
                            @else
                                <span style="color: #999;">—</span>
                            @endif
                        </td>
                        <td>
                            @if($session->manzil_from || $session->manzil_to)
                                {{ $session->manzil_from }} to {{ $session->manzil_to }}
                            @else
                                <span style="color: #999;">—</span>
                            @endif
                        </td>
                        <td style="text-align: center;">
                            @if($session->manzil_quality)
                                <span class="badge badge-{{ $session->manzil_quality }}">{{ str_replace('_', ' ', $session->manzil_quality) }}</span>
                            @else
                                <span style="color: #999;">—</span>
                            @endif
                        </td>
                        <td style="text-align: center; font-weight: bold; color: {{ ($session->mistakes_count ?? 0) > 2 ? '#d9534f' : '#2b2b2b' }}">{{ $session->mistakes_count ?? 0 }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <table class="signature-table">
        <tr>
            <td style="width: 50%; text-align: center;">
                <div class="signature-line"></div>
                <div style="font-size: 11px; color: #666;">Teacher Signature</div>
            </td>
            <td style="width: 50%; text-align: center;">
                <div class="signature-line"></div>
                <div style="font-size: 11px; color: #666;">Principal / Supervisor</div>
            </td>
        </tr>
    </table>

    <div class="footer">
        <p>Jamia Arabia Ahsan Ul Uloom, Gulshan-e-Iqbal, Karachi, Pakistan</p>
    </div>
</body>
</html>

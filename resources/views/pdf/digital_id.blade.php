<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Student ID Card</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #faf8f5;
        }
        .card-container {
            width: 324px;
            height: 204px;
            border: 3px solid #d4af37;
            border-radius: 12px;
            background: #113969;
            color: white;
            padding: 12px;
            box-sizing: border-box;
            position: relative;
        }
        .header {
            border-bottom: 1px solid rgba(255,255,255,0.25);
            padding-bottom: 4px;
            margin-bottom: 6px;
        }
        .header-title {
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .header-sub {
            font-size: 7px;
            opacity: 0.8;
        }
        .photo {
            width: 65px;
            height: 65px;
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 6px;
            float: left;
            margin-right: 12px;
            background: rgba(255,255,255,0.1);
        }
        .photo-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .details {
            float: left;
            width: 200px;
        }
        .name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .detail-row {
            font-size: 9px;
            margin-bottom: 2px;
            opacity: 0.9;
        }
        .footer {
            position: absolute;
            bottom: 10px;
            left: 12px;
            right: 12px;
            font-size: 8px;
            opacity: 0.8;
            border-top: 1px solid rgba(255,255,255,0.15);
            padding-top: 4px;
        }
        .qr-code {
            position: absolute;
            right: 12px;
            top: 50px;
            width: 60px;
            height: 60px;
            background: white;
            padding: 2px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="card-container">
        <div class="header">
            <span style="font-size: 14px; float: left; margin-right: 6px; margin-top: -2px;">🕌</span>
            <div style="float: left;">
                <div class="header-title">JAMIA ARABIA AHSAN UL ULOOM</div>
                <div class="header-sub">KARACHI, PAKISTAN · STUDENT ID CARD</div>
            </div>
            <div style="clear: both;"></div>
        </div>

        <div class="body" style="margin-top: 8px;">
            <div class="photo">
                @if($student->profile_photo)
                    <img src="{{ public_path('storage/' . $student->profile_photo) }}" class="photo-img" />
                @else
                    <div style="text-align: center; line-height: 65px; font-size: 20px; font-weight: bold; color: rgba(255,255,255,0.4);">JA</div>
                @endif
            </div>

            <div class="details">
                <div class="name">{{ $student->name }}</div>
                <div class="detail-row">ID: <strong style="color: #d4af37;">{{ $student->student_id_number }}</strong></div>
                <div class="detail-row">Course: {{ $student->program?->name }}</div>
                <div class="detail-row">Enrollment: {{ $student->student_type_label }}</div>
            </div>

            <!-- QR code verification -->
            @php
                $verifyUrl = route('certificate.verify', $student->student_id_number);
                $qrUrl = "https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=" . urlencode($verifyUrl) . "&choe=UTF-8";
            @endphp
            <img src="{{ $qrUrl }}" class="qr-code" />

            <div style="clear: both;"></div>
        </div>

        <div class="footer">
            <span style="float: left;">CARD NO: {{ $student->digitalId?->card_number }}</span>
            <span style="float: right;">VALID UNTIL: {{ $student->digitalId?->valid_until?->format('M Y') }}</span>
        </div>
    </div>
</body>
</html>

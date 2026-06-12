<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Certificate of Achievement</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            margin: 0;
            padding: 0;
            background-color: #faf8f5;
            color: #2b2b2b;
            -webkit-print-color-adjust: exact;
        }
        .cert-container {
            width: 297mm;
            height: 210mm;
            box-sizing: border-box;
            padding: 20mm;
            position: relative;
            background-color: #ffffff;
        }
        /* Double Border with Gold and Green Accent */
        .outer-border {
            width: 100%;
            height: 100%;
            border: 4px solid #1e6b3e;
            box-sizing: border-box;
            padding: 4px;
            position: relative;
        }
        .inner-border {
            width: 100%;
            height: 100%;
            border: 2px solid #d4af37;
            box-sizing: border-box;
            padding: 15mm;
            text-align: center;
            position: relative;
        }
        /* Corners decoration */
        .corner {
            position: absolute;
            width: 30px;
            height: 30px;
            border-color: #d4af37;
            border-style: solid;
        }
        .top-left { top: 10px; left: 10px; border-width: 3px 0 0 3px; }
        .top-right { top: 10px; right: 10px; border-width: 3px 3px 0 0; }
        .bottom-left { bottom: 10px; left: 10px; border-width: 0 0 3px 3px; }
        .bottom-right { bottom: 10px; right: 10px; border-width: 0 3px 3px 0; }

        .logo {
            width: 80px;
            height: auto;
            margin-bottom: 10px;
        }
        .institution-name {
            font-size: 24px;
            font-weight: bold;
            color: #1e6b3e;
            letter-spacing: 1px;
            margin: 0 0 5px;
            text-transform: uppercase;
        }
        .institution-sub {
            font-size: 12px;
            color: #d4af37;
            letter-spacing: 2px;
            margin: 0 0 25px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .cert-title {
            font-size: 38px;
            font-family: 'Times New Roman', serif;
            font-style: italic;
            color: #222;
            margin: 0 0 15px;
        }
        .cert-presentation {
            font-size: 14px;
            letter-spacing: 1px;
            color: #666;
            margin: 0 0 10px;
            text-transform: uppercase;
        }
        .student-name {
            font-size: 32px;
            font-weight: bold;
            color: #1e6b3e;
            border-bottom: 2px solid #eaeaea;
            display: inline-block;
            padding-bottom: 5px;
            margin: 5px 0 15px;
            min-width: 60%;
        }
        .cert-text {
            font-size: 16px;
            line-height: 1.6;
            color: #444;
            max-width: 80%;
            margin: 0 auto 30px;
        }
        /* Signatures and QR Code */
        .cert-footer {
            width: 100%;
            position: absolute;
            bottom: 20mm;
            left: 0;
            padding: 0 30mm;
            box-sizing: border-box;
        }
        .footer-col {
            float: left;
            width: 33.33%;
            text-align: center;
        }
        .signature-line {
            width: 80%;
            border-top: 1px solid #777;
            margin: 40px auto 5px;
        }
        .footer-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .qr-code {
            width: 75px;
            height: 75px;
            margin-top: 5px;
        }
        .cert-code {
            font-size: 9px;
            color: #999;
            margin-top: 4px;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div class="cert-container">
        <div class="outer-border">
            <div class="inner-border">
                <div class="corner top-left"></div>
                <div class="corner top-right"></div>
                <div class="corner bottom-left"></div>
                <div class="corner bottom-right"></div>

                <!-- Logo placeholder -->
                <img src="https://jamiaahsan.edu.pk/images/logo.png" alt="Logo" class="logo" onerror="this.style.display='none';" />
                
                <h2 class="institution-name">Jamia Arabia Ahsan Ul Uloom</h2>
                <div class="institution-sub">Karachi, Pakistan</div>

                <div class="cert-title">Certificate of {{ ucfirst($certificate->type) }}</div>
                <div class="cert-presentation">This is proudly presented to</div>
                
                <div class="student-name">{{ $certificate->student->name }}</div>
                
                <div class="cert-text">
                    for successfully fulfilling all academic regulations and demonstrating commendable proficiency in
                    <strong>{{ $certificate->title }}</strong>
                    issued on this day {{ $certificate->issued_date->format('F d, Y') }}.
                </div>

                <div class="cert-footer">
                    <!-- Head Signature -->
                    <div class="footer-col">
                        <div class="signature-line"></div>
                        <div class="footer-label">Head of Institution</div>
                    </div>

                    <!-- QR Code Validation -->
                    <div class="footer-col" style="margin-top: -15px;">
                        @php
                            $verifyUrl = route('certificate.verify', $certificate->code);
                            $qrUrl = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=" . urlencode($verifyUrl) . "&choe=UTF-8";
                        @endphp
                        <img src="{{ $qrUrl }}" alt="Verify QR" class="qr-code" />
                        <div class="cert-code">CODE: {{ $certificate->code }}</div>
                    </div>

                    <!-- Registrar Signature -->
                    <div class="footer-col">
                        <div class="signature-line"></div>
                        <div class="footer-label">Registrar Academics</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

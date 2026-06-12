<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice - {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 30px;
            color: #333;
            background-color: #fff;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            padding: 30px;
            border-radius: 8px;
        }
        .header {
            border-bottom: 2px solid #113969;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .title {
            color: #113969;
            font-size: 24px;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0;
        }
        .sub-title {
            font-size: 14px;
            color: #d4af37;
            margin: 5px 0 0;
            font-weight: bold;
        }
        .meta-table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }
        .meta-table td {
            padding: 4px 0;
            font-size: 13px;
        }
        .meta-label {
            font-weight: bold;
            color: #666;
            width: 120px;
        }
        .details-table {
            width: 100%;
            margin-top: 30px;
            border-collapse: collapse;
        }
        .details-table th {
            background-color: #113969;
            color: white;
            text-align: left;
            padding: 10px;
            font-size: 14px;
        }
        .details-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }
        .total-row td {
            font-weight: bold;
            font-size: 16px;
            color: #113969;
            border-top: 2px solid #113969;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-paid {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-unpaid {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .status-overdue {
            background-color: #ffedd5;
            color: #9a3412;
        }
        .footer {
            margin-top: 50px;
            border-top: 1px solid #eee;
            padding-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <table style="width: 100%;">
                <tr>
                    <td>
                        <h1 class="title">JAMIA ARABIA AHSAN UL ULOOM</h1>
                        <p class="sub-title">OFFICIAL FEE INVOICE</p>
                    </td>
                    <td style="text-align: right; vertical-align: top;">
                        <span class="status-badge status-{{ $invoice->status }}">
                            {{ $invoice->status }}
                        </span>
                    </td>
                </tr>
            </table>
        </div>

        <table style="width: 100%;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <h3 style="margin-top: 0; color: #113969;">Billed To:</h3>
                    <table class="meta-table">
                        <tr>
                            <td class="meta-label">Student Name:</td>
                            <td>{{ $student->name }}</td>
                        </tr>
                        <tr>
                            <td class="meta-label">Student ID:</td>
                            <td>{{ $student->student_id_number }}</td>
                        </tr>
                        <tr>
                            <td class="meta-label">Program:</td>
                            <td>{{ $student->program?->name }}</td>
                        </tr>
                        <tr>
                            <td class="meta-label">Email:</td>
                            <td>{{ $student->email }}</td>
                        </tr>
                    </table>
                </td>
                <td style="width: 50%; vertical-align: top; padding-left: 40px;">
                    <h3 style="margin-top: 0; color: #113969;">Invoice Details:</h3>
                    <table class="meta-table">
                        <tr>
                            <td class="meta-label">Invoice No:</td>
                            <td><strong>{{ $invoice->invoice_number }}</strong></td>
                        </tr>
                        <tr>
                            <td class="meta-label">Issue Date:</td>
                            <td>{{ $invoice->created_at->format('M d, Y') }}</td>
                        </tr>
                        <tr>
                            <td class="meta-label">Due Date:</td>
                            <td style="color: #991b1b; font-weight: bold;">{{ $invoice->due_date->format('M d, Y') }}</td>
                        </tr>
                        @if($invoice->paid_at)
                            <tr>
                                <td class="meta-label">Paid At:</td>
                                <td>{{ $invoice->paid_at->format('M d, Y H:i') }}</td>
                            </tr>
                            <tr>
                                <td class="meta-label">Method:</td>
                                <td>{{ strtoupper(str_replace('_', ' ', $invoice->payment_method)) }}</td>
                            </tr>
                        @endif
                    </table>
                </td>
            </tr>
        </table>

        <table class="details-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right; width: 150px;">Amount (PKR)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <strong>{{ $invoice->title }}</strong>
                        @if($invoice->title_ur)
                            <br/><span style="font-size: 11px; color: #666;">{{ $invoice->title_ur }}</span>
                        @endif
                    </td>
                    <td style="text-align: right;">{{ number_format($invoice->amount, 2) }}</td>
                </tr>
                <tr class="total-row">
                    <td>Total:</td>
                    <td style="text-align: right;">PKR {{ number_format($invoice->amount, 2) }}</td>
                </tr>
            </tbody>
        </table>

        @if($invoice->admin_notes)
            <div style="margin-top: 30px; background-color: #fafafa; padding: 15px; border-radius: 4px; border-left: 4px solid #113969;">
                <h4 style="margin: 0 0 5px; font-size: 12px; color: #666; text-transform: uppercase;">Notes:</h4>
                <p style="margin: 0; font-size: 13px; line-height: 1.4;">{{ $invoice->admin_notes }}</p>
            </div>
        @endif

        <div class="footer">
            <p>This is a computer-generated official document. No signature required.</p>
            <p>Jamia Arabia Ahsan Ul Uloom, Gulshan-e-Iqbal, Karachi, Pakistan.</p>
        </div>
    </div>
</body>
</html>

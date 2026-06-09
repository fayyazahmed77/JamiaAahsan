<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Admission Application Status Update</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7fafc; color: #2d3748; padding: 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { border-bottom: 2px solid #e53e3e; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #9b2c2c; font-size: 24px; }
        .content { font-size: 16px; margin-bottom: 25px; }
        .reason-box { background: #fff5f5; border: 1px solid #fed7d7; padding: 15px; border-radius: 5px; margin: 20px 0; color: #9b2c2c; }
        .footer { font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Admission Status Update</h1>
        </div>
        <div class="content">
            <p>Dear {{ $name }},</p>
            <p>Thank you for your interest in joining <strong>Jamia Arabia Ahsan Ul Uloom</strong>.</p>
            <p>After a careful review of your application for admission to class <strong>{{ $className }}</strong>, we regret to inform you that we are unable to accept your application at this time.</p>
            
            <p><strong>Reason / Note from Admin Office:</strong></p>
            <div class="reason-box">
                {{ $note }}
            </div>

            <p>If you believe there has been a misunderstanding, or if you wish to upload missing documents, please log in to your dashboard to update your application details or contact the admissions helpdesk.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Jamia Arabia Ahsan Ul Uloom. All rights reserved.</p>
            <p>Gulshan-e-Iqbal, Karachi, Pakistan</p>
        </div>
    </div>
</body>
</html>

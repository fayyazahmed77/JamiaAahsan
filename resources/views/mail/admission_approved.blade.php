<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Admission Application Approved</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7fafc; color: #2d3748; padding: 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { border-bottom: 2px solid #38a169; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #276749; font-size: 24px; }
        .content { font-size: 16px; margin-bottom: 25px; }
        .detail-box { background: #f0fff4; border: 1px solid #c6f6d5; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .detail-row { display: flex; margin-bottom: 8px; }
        .detail-label { font-weight: bold; width: 150px; color: #22543d; }
        .footer { font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; }
        .success-banner { background-color: #48bb78; color: #ffffff; text-align: center; padding: 10px; border-radius: 5px; font-weight: bold; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Admission Approved!</h1>
        </div>
        <div class="success-banner">
            Congratulations! Your Admission has been Approved.
        </div>
        <div class="content">
            <p>Dear {{ $name }},</p>
            <p>We are pleased to inform you that your application for admission to <strong>Jamia Arabia Ahsan Ul Uloom</strong> has been reviewed and successfully approved.</p>
            <p>Your official admission details are below:</p>
            
            <div class="detail-box">
                <div class="detail-row">
                    <span class="detail-label">Registration No:</span>
                    <strong style="color: #2f855a;">{{ $registrationNo }}</strong>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Class:</span>
                    <span>{{ $className }}</span>
                </div>
            </div>

            <p>Please log in to your student portal to download your official Admission Letter and view the timetable, calendar, and orientation schedule.</p>
            <p>If you have any questions or require further assistance, please feel free to reply to this email or contact the admin office.</p>
            <p>We wish you a successful and rewarding academic journey with us.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Jamia Arabia Ahsan Ul Uloom. All rights reserved.</p>
            <p>Gulshan-e-Iqbal, Karachi, Pakistan</p>
        </div>
    </div>
</body>
</html>

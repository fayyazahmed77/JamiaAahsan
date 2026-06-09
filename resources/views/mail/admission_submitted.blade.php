<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Admission Application Submitted</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7fafc; color: #2d3748; padding: 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { border-bottom: 2px solid #3182ce; padding-bottom: 15px; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #2b6cb0; font-size: 24px; }
        .content { font-size: 16px; margin-bottom: 25px; }
        .detail-box { background: #ebf8ff; border: 1px solid #bee3f8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .detail-row { display: flex; margin-bottom: 8px; }
        .detail-label { font-weight: bold; width: 150px; color: #2c5282; }
        .footer { font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Admission Application Received</h1>
        </div>
        <div class="content">
            <p>Dear {{ $name }},</p>
            <p>Thank you for submitting your admission application to <strong>Jamia Arabia Ahsan Ul Uloom</strong>.</p>
            <p>We have successfully received your application. Below are your initial application details:</p>
            
            <div class="detail-box">
                <div class="detail-row">
                    <span class="detail-label">Application ID:</span>
                    <span>{{ $detailId }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Desired Class:</span>
                    <span>{{ $className }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Submission Date:</span>
                    <span>{{ $date }}</span>
                </div>
            </div>

            <p>Our administration team will review your credentials, certificates, and uploaded files. You will be notified via email and SMS/Push notification once your admission is approved or if any additional information is required.</p>
            <p>You can check the status of your application anytime by logging into your account on our website or mobile app.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Jamia Arabia Ahsan Ul Uloom. All rights reserved.</p>
            <p>Gulshan-e-Iqbal, Karachi, Pakistan</p>
        </div>
    </div>
</body>
</html>

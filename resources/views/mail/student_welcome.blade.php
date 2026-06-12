<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to Student Portal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            border-top: 4px solid #1e6b3e;
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .header h1 {
            color: #1e6b3e;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px 0;
        }
        .credentials {
            background: #f9f9f9;
            border: 1px solid #e0e0e0;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .credentials p {
            margin: 8px 0;
            font-size: 15px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            background-color: #1e6b3e;
            color: #fff !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Jamia Arabia Ahsan Ul Uloom</h1>
            <p>Karachi, Pakistan</p>
        </div>
        <div class="content">
            <p>Assalamu Alaikum <strong>{{ $name }}</strong>,</p>
            <p>Congratulations! Your admission has been approved, and your Student Portal account is now active. You can use the portal to track your classes, view attendance records, check exam marks, submit assignments, and manage your certificates.</p>
            
            <p>Below are your student login credentials:</p>
            <div class="credentials">
                <p><strong>Student ID Number:</strong> {{ $studentId }}</p>
                <p><strong>Login Email:</strong> {{ $email }}</p>
                <p><strong>Temporary Password:</strong> <code style="background:#fff; padding:2px 6px; border:1px solid #ccc; border-radius:4px; font-weight:bold;">{{ $password }}</code></p>
            </div>
            
            <p style="color: #c08b10; font-weight: bold;">⚠️ Note: For security reasons, please change your password immediately after your first login via the Settings tab.</p>
            
            <div class="button-container">
                <a href="{{ url('/student/login') }}" class="btn">Log In to Portal</a>
            </div>
            
            <p>If you have any questions or face login issues, please contact the administration office.</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
            <p>&copy; {{ date('Y') }} Jamia Arabia Ahsan Ul Uloom. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

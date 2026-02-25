<!DOCTYPE html>
<html>
<head>
    <title>Greycode Shop Contact Form</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9f9f9; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center; font-size: 20px; font-weight: bold;">
                            Greycode Shop Contact Form Submission
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 20px; color: #333333; font-size: 14px; line-height: 1.6;">
                            <h2 style="color: #2c3e50; font-size: 18px; margin-top: 0;">You have received a new message</h2>
                            <p><strong>Name:</strong> {{ $data['name'] }}</p>
                            <p><strong>Surname:</strong> {{ $data['surname'] ?? '' }}</p>
                            <p><strong>Email:</strong> {{ $data['email'] }}</p>
                            <p><strong>Message:</strong></p>
                            <p style="background-color: #f1f1f1; padding: 10px; border-radius: 5px;">{{ $data['message'] }}</p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #ecf0f1; color: #555555; padding: 15px; text-align: center; font-size: 12px;">
                            This message was sent via the Greycode Shop contact form.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>

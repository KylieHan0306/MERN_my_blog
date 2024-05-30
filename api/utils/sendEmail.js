const nodemailer = require('nodemailer')

function sendEmail(email, token, type) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.APP_PASS
        }
    });
    const verificationUrl = `${process.env.CLIENT_URL}/email-verify?token=${token}`;
    const updateEmailUrl = `${process.env.CLIENT_URL}/email-change?token=${token}`;
    const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const verifyMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `
            <h1>Verify Your Email</h1>
            <p>Thank you for registering. Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}">Verify Email Here</a>
        `,
    };

    const changeEmailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Change Email Verification',
        html: `
            <h1>Verify Your New Email</h1>
            <p>You have requested to change your email address. Please verify your new email address by clicking the link below:</p>
            <a href="${updateEmailUrl}">Verify New Email Here</a>
        `,
    };

    const resetMailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: email, // List of receivers
        subject: 'Password Reset Request', // Subject line
        html: `
            <h1>Reset Your Password</h1>    
            <p>You have requested a password reset. Please click the link below to reset your password:</p>
            <a href="${resetPasswordUrl}">Reset Password Here</a>
            <p>If you did not request this, please ignore this email.</p>
        `,
    };
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(type === 'verify' ? verifyMailOptions : type === 'reset'? resetMailOptions : changeEmailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }
            resolve(true);
        });
    });
}

module.exports = sendEmail;
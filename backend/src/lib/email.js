import nodemailer from 'nodemailer';
import { createHash } from 'crypto';

// Cache transporter instance
let transporterInstance = null;

const createTransporter = async () => {
    if (transporterInstance) return transporterInstance;

    const requiredVars = [
        'EMAIL_HOST', 'EMAIL_PORT',
        'EMAIL_USER', 'EMAIL_PASS',
        'FRONTEND_URL', 'EMAIL_FROM'
    ];

    const missingVars = requiredVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
        throw new Error(`Missing email environment variables: ${missingVars.join(', ')}`);
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            pool: true,
            rateLimit: 5, // Max 5 messages per second
            maxConnections: 5,
        });

        // Verify connection once
        await transporter.verify();
        console.log("SMTP connection verified");
        transporterInstance = transporter;
        return transporter;

    } catch (error) {
        console.error("SMTP connection failed:", error);
        throw new Error('Email service configuration error');
    }
};

const sendEmail = async (mailOptions) => {
    try {
        const transporter = await createTransporter();
        const sanitizedOptions = {
            ...mailOptions,
            from: `"Echo Talk" <${process.env.EMAIL_FROM}>`,
            to: mailOptions.to,
            subject: mailOptions.subject,
            html: mailOptions.html
        };

        console.log(`Sending email to ${sanitizedOptions.to}`);
        const info = await transporter.sendMail(sanitizedOptions);
        console.log(`Email sent: ${info.messageId}`);
        return true;

    } catch (error) {
        console.error("Email send failed:", error);
        throw new Error('Failed to send email');
    }
};

// Generic email template
const baseEmailTemplate = (content) => `
    <div style="
        max-width: 600px;
        margin: 20px auto;
        padding: 30px;
        border-radius: 10px;
        background: #f8f9fa;
        font-family: 'Segoe UI', system-ui, sans-serif;
    ">
        <div style="
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">
            ${content}
        </div>
        <p style="
            margin-top: 20px;
            color: #6c757d;
            font-size: 0.9em;
            text-align: center;
        ">
            This is an automated message. Please do not reply directly.
        </p>
    </div>
`;

export const sendVerificationEmail = async (email, verificationToken) => {
    const encodedToken = encodeURIComponent(verificationToken);
    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${encodedToken}`;

    const content = `
        <h2 style="color: #2d3748; margin-bottom: 25px;">Verify Your Email</h2>
        <p style="color: #4a5568; line-height: 1.6;">
            Welcome to Echo Talk! Please verify your email address by clicking the link below:
        </p>
        <div style="margin: 30px 0; text-align: center;">
            <a href="${verificationLink}" 
               style="
                   background: #4299e1;
                   color: white;
                   padding: 12px 25px;
                   border-radius: 5px;
                   text-decoration: none;
                   display: inline-block;
                   font-weight: 500;
               ">
                Verify Email
            </a>
        </div>
        <p style="color: #718096; font-size: 0.9em;">
            Link expires in 24 hours. If you didn't create an account, please ignore this email.
        </p>
    `;

    return sendEmail({
        to: email,
        subject: "Confirm Your Echo Talk Account",
        html: baseEmailTemplate(content)
    });
};


export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        // Double encoding protection
        const safeToken = encodeURIComponent(resetToken);
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${safeToken}`;

        // Add plaintext alternative for email clients that don't render HTML
        const textContent = `Password Reset Request:\n\n
Please click the link below to reset your password:\n
${resetLink}\n\n
This link expires in 1 hour. If you didn't request this, please secure your account.`;

        const htmlContent = `
            <h2 style="color: #2d3748; margin-bottom: 25px;">Password Reset Request</h2>
            <p style="color: #4a5568; line-height: 1.6;">
                We received a request to reset your Echo Talk password. Click the button below to continue:
            </p>
            <div style="margin: 30px 0; text-align: center;">
                <a href="${resetLink}" 
                   style="
                       background: #48bb78;
                       color: white;
                       padding: 12px 25px;
                       border-radius: 5px;
                       text-decoration: none;
                       display: inline-block;
                       font-weight: 500;
                       border: 1px solid #38a169; /* Add hover state */
                       transition: all 0.3s ease;
                   "
                   onmouseover="this.style.backgroundColor='#38a169'; this.style.borderColor='#2f855a';"
                   onmouseout="this.style.backgroundColor='#48bb78'; this.style.borderColor='#38a169';">
                    Reset Password
                </a>
            </div>
            <p style="color: #718096; font-size: 0.9em; margin-top: 20px;">
                Can't click the button? Copy this link:<br>
                <code style="
                    background: #f7fafc;
                    padding: 8px 12px;
                    border-radius: 4px;
                    word-break: break-all;
                ">${resetLink}</code>
            </p>
            <p style="color: #e53e3e; font-size: 0.9em; margin-top: 25px;">
                ⚠️ Link expires in 1 hour. Do not share this with anyone.
            </p>`;

        return await sendEmail({
            to: email,
            subject: "🔒 Echo Talk Password Reset Instructions",
            text: textContent, // Plaintext version
            html: baseEmailTemplate(htmlContent),
            headers: {
                'X-Priority': '1', // High priority
                'Importance': 'high'
            }
        });
        
    } catch (error) {
        console.error("Password reset email error:", error);
        throw new Error('Failed to send password reset email');
    }
};


export const sendWelcomeEmail = async (email, name) => {
    const sanitizedName = name.replace(/[^a-zA-Z0-9 ]/g, '');
    
    const content = `
        <h2 style="color: #2d3748; margin-bottom: 25px;">Welcome to Echo Talk, ${sanitizedName}!</h2>
        <p style="color: #4a5568; line-height: 1.6;">
            Your account setup is complete. Start connecting with your community!
        </p>
        <div style="margin: 30px 0; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/login" 
               style="
                   background: #4299e1;
                   color: white;
                   padding: 12px 25px;
                   border-radius: 5px;
                   text-decoration: none;
                   display: inline-block;
                   font-weight: 500;
               ">
                Start Chatting
            </a>
        </div>
        <p style="color: #718096; font-size: 0.9em;">
            Need help? Visit our <a href="${process.env.FRONTEND_URL}/support">support page</a>.
        </p>
    `;

    return sendEmail({
        to: email,
        subject: `Welcome to Echo Talk, ${sanitizedName}!`,
        html: baseEmailTemplate(content)
    });
};
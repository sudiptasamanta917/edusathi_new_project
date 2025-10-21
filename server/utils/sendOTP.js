import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_OTP_SENDING_API_KEY);

export const sendOTP = async (toEmail, otp) => {
    try {
        console.log("Sending OTP to", toEmail);
        const res = await resend.emails.send({
            from: 'noreplay <onboarding@resend.dev>',
            to: toEmail,
            subject: 'hello world',
            html: `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`
        });
        console.log("Response from Resend:", res);
        console.log("OTP email sent successfully to", toEmail);
    } catch (e) {
        console.error("OTP email send error:", e);
    }
};

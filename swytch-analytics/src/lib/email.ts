/**
 * Email service utilities.
 * Handles sending analytics report emails.
 */

type EmailPayload = {
    to: string;
    subject: string;
    body: string;
};

/**
 * Send an analytics report email.
 * TODO: Integrate with an email provider (e.g., Resend, SendGrid, Nodemailer).
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
    console.log("Email send — not yet implemented", payload);
    // TODO: Implement actual email sending
    return false;
}

/**
 * Build analytics report email body from metrics data.
 */
export function buildReportEmail(
    userName: string,
    propertyId: string,
    metrics: Record<string, unknown>
): EmailPayload {
    return {
        to: "",
        subject: `SwytchAnalytics Report — ${propertyId}`,
        body: `Hi ${userName},\n\nHere is your analytics report for property ${propertyId}.\n\n${JSON.stringify(metrics, null, 2)}`,
    };
}

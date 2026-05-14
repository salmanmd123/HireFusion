const nodemailer = require('nodemailer');

async function sendEmails(jobs, resumePath, userEmail, userAppPassword) {
    let successCount = 0;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: userEmail, pass: userAppPassword }
    });

    for (const job of jobs) {
        try {
            await transporter.sendMail({
                from: userEmail,
                to: job.email,
                subject: `Application for ${job.title}`,
                text: `Dear Hiring Team,\n\nI am interested in the ${job.title} role at ${job.company}.\n\nLink: ${job.link}`,
                attachments: [{ filename: 'Resume.pdf', path: resumePath }]
            });
            successCount++;
        } catch (e) { console.error("Mail failed", e); }
    }
    return { successCount };
}

module.exports = { sendEmails };
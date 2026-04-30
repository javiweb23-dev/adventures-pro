import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type LeadPayload = {
  name?: string;
  email?: string;
  phone?: string;
  travelDates?: string;
  guests?: number;
  tripType?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;

    const lead = {
      name: String(body.name ?? "").trim(),
      email: String(body.email ?? "").trim(),
      phone: String(body.phone ?? "").trim(),
      travelDates: String(body.travelDates ?? "").trim(),
      guests: Number(body.guests),
      tripType: String(body.tripType ?? "").trim(),
    };

    if (
      !lead.name ||
      !lead.email ||
      !lead.phone ||
      !lead.travelDates ||
      !Number.isFinite(lead.guests) ||
      lead.guests <= 0 ||
      !lead.tripType
    ) {
      return NextResponse.json({ error: "Invalid lead payload." }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;

    if (!host || !user || !pass || !from) {
      return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const mailBody = {
      lead,
      source: "Home Lead Form",
      submittedAt: new Date().toISOString(),
    };

    await transporter.sendMail({
      from,
      to: "commercial@adventuresfinder.com",
      replyTo: lead.email,
      subject: `New lead: ${lead.name}`,
      text: JSON.stringify(mailBody, null, 2),
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Phone:</strong> ${lead.phone}</p>
        <p><strong>Travel Dates:</strong> ${lead.travelDates}</p>
        <p><strong>Guests:</strong> ${lead.guests}</p>
        <p><strong>Trip Type:</strong> ${lead.tripType}</p>
        <p><strong>Source:</strong> Home Lead Form</p>
        <p><strong>Submitted At:</strong> ${mailBody.submittedAt}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to send lead." }, { status: 500 });
  }
}

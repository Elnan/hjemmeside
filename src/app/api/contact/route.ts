// THIS FILE IS NOT USED BY NEXT.JS APP ROUTER!
// Move all code to /src/app/api/contact/route.ts and delete this file.

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, message, service } = await req.json();

  console.log("API/contact: About to send email", {
    name,
    email,
    message,
    service,
  });

  try {
    const result = await resend.emails.send({
      from: "kontakt@olavelnan.no",
      to: "Olavelnan@gmail.com",
      subject: `Kontakt fra nettsiden: ${service || "Generell henvendelse"}`,
      html: `
        <h2>Ny henvendelse fra nettsiden</h2>
        <p><strong>Navn:</strong> ${name}</p>
        <p><strong>E-post:</strong> ${email}</p>
        <p><strong>Tjeneste:</strong> ${service}</p>
        <p><strong>Melding:</strong><br/>${message}</p>
      `,
      text: `Ny henvendelse fra nettsiden\nNavn: ${name}\nE-post: ${email}\nTjeneste: ${service}\nMelding: ${message}`,
    });
    console.log("API/contact: Resend result", result);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API/contact: Resend error", error);
    return NextResponse.json(
      { error: "Noe gikk galt, prøv igjen senere." },
      { status: 500 }
    );
  }
}

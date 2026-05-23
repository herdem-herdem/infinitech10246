/// <reference types="@cloudflare/workers-types" />

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const formData = await context.request.formData();

    const name = formData.get("name")?.toString().trim() ?? "";
    const email = formData.get("email")?.toString().trim() ?? "";
    const message = formData.get("message")?.toString().trim() ?? "";

    // Basic validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const emailPayload = {
      personalizations: [
        {
          to: [{ email: "herdem09@proton.me", name: "Infinitech Support" }],
          reply_to: { email, name },
        },
      ],
      from: {
        email: "noreply@infinitech-hub.pages.dev",
        name: "Infinitech Website",
      },
      subject: `Yeni İletişim Mesajı - ${name}`,
      content: [
        {
          type: "text/html",
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0d0d; color: #ffffff; padding: 32px; border-radius: 12px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #f5a524; font-size: 28px; margin: 0; letter-spacing: 0.2em;">INFINITECH</h1>
                <p style="color: #888; font-size: 12px; margin-top: 4px; letter-spacing: 0.3em;">TEAM #10246 · YENİ MESAJ</p>
              </div>
              <hr style="border-color: #f5a52433; margin-bottom: 24px;" />
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #f5a524; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; width: 80px;">İsim</td>
                  <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #f5a524; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">E-posta</td>
                  <td style="padding: 8px 0; color: #ffffff;"><a href="mailto:${email}" style="color: #f5a524;">${email}</a></td>
                </tr>
              </table>
              <hr style="border-color: #f5a52433; margin: 20px 0;" />
              <div>
                <p style="color: #f5a524; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px;">Mesaj</p>
                <p style="color: #cccccc; line-height: 1.7; white-space: pre-wrap;">${message}</p>
              </div>
              <hr style="border-color: #f5a52433; margin-top: 24px;" />
              <p style="color: #555; font-size: 11px; text-align: center; margin-top: 16px;">Bu e-posta infinitech-hub.pages.dev üzerinden otomatik olarak gönderilmiştir.</p>
            </div>
          `,
        },
      ],
    };

    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload),
    });

    // MailChannels returns 202 Accepted on success
    if (response.status !== 202) {
      const err = await response.text();
      console.error("MailChannels error:", err);
      return new Response(JSON.stringify({ error: "Mail gönderilemedi" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Contact handler error:", err);
    return new Response(JSON.stringify({ error: "Sunucu hatası" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

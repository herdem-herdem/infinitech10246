type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

function withCors(response: Response, request: Request) {
  const origin = request.headers.get("Origin");
  const headers = new Headers(response.headers);

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }

  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export const onRequestOptions: PagesFunction = async ({ request }) => {
  return withCors(new Response(null, { status: 204 }), request);
};

export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return withCors(jsonResponse({ ok: false, error: "invalid_content_type" }, { status: 415 }), request);
    }

    const data = (await request.json()) as Partial<ContactPayload>;
    const name = (data.name || "").toString().trim();
    const email = (data.email || "").toString().trim();
    const message = (data.message || "").toString().trim();

    if (!name || !email || !message) {
      return withCors(jsonResponse({ ok: false, error: "missing_fields" }, { status: 400 }), request);
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
                <p style="color: #888; font-size: 12px; margin-top: 4px; letter-spacing: 0.3em;">TEAM #10246 &middot; YENİ MESAJ</p>
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
              <p style="color: #555; font-size: 11px; text-align: center; margin-top: 16px;">Bu e-posta otomatik olarak gönderilmiştir.</p>
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

    if (response.status !== 202) {
      const details = await response.text().catch(() => "");
      return withCors(jsonResponse({ ok: false, error: "mailchannels_error", details }, { status: 502 }), request);
    }

    return withCors(jsonResponse({ ok: true }, { status: 200 }), request);
  } catch {
    return withCors(jsonResponse({ ok: false, error: "internal_error" }, { status: 500 }), request);
  }
};


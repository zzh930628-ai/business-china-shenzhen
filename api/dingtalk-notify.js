module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, message: "Method not allowed." });
    return;
  }

  const webhookUrl = process.env.DINGTALK_WEBHOOK_URL || "";
  if (!webhookUrl) {
    res.status(500).json({ ok: false, message: "DingTalk webhook is not configured." });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const lines = [
      "signup New Application Received",
      "",
      `Programme: ${body.tripName || "-"}`,
      `Submission ID: ${body.submissionId || "-"}`,
      `Name: ${body.fullName || "-"}`,
      `Email: ${body.email || "-"}`,
      `Phone: ${body.contactNumber || "-"}`,
      `Company Name: ${body.companyName || "-"}`,
      `Designation: ${body.designation || "-"}`,
      `Company / Designation: ${body.companyDesignation || "-"}`,
      `Invoice Required: ${body.requireInvoice || "-"}`,
      `Invoice Title: ${body.invoiceName || "-"}`,
      `Status: ${body.status || "-"}`,
      `Amount: ${body.amountDisplay || "-"}`,
      `Payee: ${body.payeeName || "-"}`,
      `Submitted At: ${body.createdAt || "-"}`
    ];

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        msgtype: "text",
        text: {
          content: lines.join("\n")
        }
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.errcode) {
      res.status(502).json({
        ok: false,
        message: result.errmsg || "DingTalk notification failed.",
        details: result
      });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message || "Unable to send DingTalk notification."
    });
  }
};

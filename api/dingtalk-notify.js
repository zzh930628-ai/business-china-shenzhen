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
      "signup New registration received",
      "",
      `Programme: ${body.tripName || "-"}`,
      `Submission ID: ${body.submissionId || "-"}`,
      `Full Name: ${body.fullName || "-"}`,
      `Email: ${body.email || "-"}`,
      `Contact Number: ${body.contactNumber || "-"}`,
      `Company & Designation: ${body.companyDesignation || "-"}`,
      `Invoice Required: ${body.requireInvoice || "-"}`,
      `Invoice Information: ${body.invoiceName || "-"}`,
      `Amount: ${body.amountDisplay || "-"}`,
      `Payee: ${body.payeeName || "-"}`,
      `Created At: ${body.createdAt || new Date().toISOString()}`
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

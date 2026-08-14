const form = document.getElementById("registrationForm");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const isFilePreview = window.location.protocol === "file:";
const appConfig = window.APP_CONFIG || {};
const supabaseUrl = appConfig.supabaseUrl || "";
const supabaseAnonKey = appConfig.supabaseAnonKey || "";
const supabaseClient =
  supabaseUrl && supabaseAnonKey && window.supabase
    ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;

const tripConfig = {
  submissionPrefix: "YLP",
  tripName: "Business China YLP Immersion Programme - Shenzhen",
  amountValue: 2650,
  amountDisplay: "SGD 2,650.00",
  payeeName: "Sing-China",
  successPath: "/success.html",
  idleButtonLabel: "Submit Application"
};

submitButton.dataset.idleLabel = tripConfig.idleButtonLabel;

function setMessage(message, state) {
  formMessage.textContent = message;
  if (state) {
    formMessage.dataset.state = state;
  } else {
    delete formMessage.dataset.state;
  }
}

function createSubmissionId() {
  const prefix = tripConfig.submissionPrefix;
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now()}-${randomPart}`;
}

async function notifyDingTalk(payload) {
  const response = await fetch("/api/dingtalk-notify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "DingTalk notification failed.");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (isFilePreview) {
    setMessage("This is preview mode only. To submit the form, please deploy it with Supabase configured.", "error");
    return;
  }

  if (!supabaseClient) {
    setMessage("Supabase is not configured yet. Please complete public/config.js before going live.", "error");
    return;
  }

  if (!form.reportValidity()) {
    setMessage("Please complete all required fields before submitting.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  setMessage("Submitting your application, please wait.", "");

  try {
    const formData = new FormData(form);
    const submissionId = createSubmissionId();
    const companyName = String(formData.get("companyName") || "").trim();
    const designation = String(formData.get("designation") || "").trim();
    const companyDesignation = [companyName, designation].filter(Boolean).join(" - ");

    const payload = {
      submission_id: submissionId,
      trip_name: tripConfig.tripName,
      amount_sgd: tripConfig.amountValue,
      payee: tripConfig.payeeName,
      full_name: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      contact_number: String(formData.get("contactNumber") || "").trim(),
      company_designation: companyDesignation,
      require_invoice: "to_be_collected_later",
      invoice_name: null,
      payment_proof_path: "not_required_at_application_stage",
      payment_proof_name: "not_required_at_application_stage",
      payment_proof_type: null,
      payment_proof_size: null,
      status: "pending_shortlist_review"
    };

    const { error } = await supabaseClient.from("registrations").insert(payload);
    if (error) {
      throw error;
    }

    const result = {
      ok: true,
      message: "Application submitted successfully. Our team will review your submission and contact shortlisted applicants with the next steps.",
      submissionId
    };

    window.sessionStorage.setItem(
      "registrationSuccess",
      JSON.stringify({
        submissionId: result.submissionId,
        email: payload.email,
        fullName: payload.full_name
      })
    );

    try {
      await notifyDingTalk({
        tripName: tripConfig.tripName,
        submissionId: result.submissionId,
        fullName: payload.full_name,
        email: payload.email,
        contactNumber: payload.contact_number,
        companyDesignation: payload.company_designation,
        requireInvoice: "To be collected later",
        invoiceName: "To be collected later",
        amountDisplay: tripConfig.amountDisplay,
        payeeName: tripConfig.payeeName,
        createdAt: new Date().toISOString()
      });
    } catch (notificationError) {
      console.error(notificationError);
    }

    form.reset();
    const successUrl = new URL(tripConfig.successPath, window.location.origin);
    successUrl.searchParams.set("submissionId", result.submissionId);
    successUrl.searchParams.set("email", payload.email);
    successUrl.searchParams.set("fullName", payload.full_name);
    window.location.href = successUrl.toString();
  } catch (error) {
    setMessage(error.message || "Submission failed. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = submitButton.dataset.idleLabel || "Submit Application";
  }
});

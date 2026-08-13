const form = document.getElementById("registrationForm");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const isFilePreview = window.location.protocol === "file:";
const invoiceInputs = Array.from(document.querySelectorAll('input[name="requireInvoice"]'));
const invoiceNameInput = document.querySelector('input[name="invoiceName"]');
const appConfig = window.APP_CONFIG || {};
const supabaseUrl = appConfig.supabaseUrl || "";
const supabaseAnonKey = appConfig.supabaseAnonKey || "";
const supabaseBucket = appConfig.supabaseBucket || "payment-proofs";
const supabaseClient =
  supabaseUrl && supabaseAnonKey && window.supabase
    ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;
const tripConfig = {
  submissionPrefix: "YLP",
  tripName: "Business China YLP Immersion Programme - Shenzhen",
  amountValue: 2650,
  payeeName: "Sing-China",
  successPath: "/success.html",
  idleButtonLabel: "Register"
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

async function uploadPaymentProof(file, submissionId) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `${submissionId}/${Date.now()}-${safeName}`;
  const { error } = await supabaseClient.storage.from(supabaseBucket).upload(storagePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream"
  });

  if (error) {
    throw error;
  }

  return {
    path: storagePath,
    name: file.name,
    type: file.type || null,
    size: file.size || null
  };
}

function syncInvoiceField() {
  const selected = form.querySelector('input[name="requireInvoice"]:checked')?.value;
  const required = selected === "Yes";

  invoiceNameInput.disabled = !required;
  invoiceNameInput.required = required;

  if (!required) {
    invoiceNameInput.value = "";
  }
}

invoiceInputs.forEach((input) => {
  input.addEventListener("change", syncInvoiceField);
});

syncInvoiceField();

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
  setMessage("Saving your registration, please wait.", "");

  try {
    const formData = new FormData(form);
    const paymentProof = formData.get("paymentProof");
    if (!(paymentProof instanceof File) || paymentProof.size === 0) {
      throw new Error("Payment proof is required.");
    }

    const submissionId = createSubmissionId();
    const uploadedProof = await uploadPaymentProof(paymentProof, submissionId);

    const payload = {
      submission_id: submissionId,
      trip_name: tripConfig.tripName,
      amount_sgd: tripConfig.amountValue,
      payee: tripConfig.payeeName,
      full_name: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      contact_number: String(formData.get("contactNumber") || "").trim(),
      company_designation: String(formData.get("companyDesignation") || "").trim(),
      require_invoice: String(formData.get("requireInvoice") || "").trim(),
      invoice_name: String(formData.get("invoiceName") || "").trim() || null,
      payment_proof_path: uploadedProof.path,
      payment_proof_name: uploadedProof.name,
      payment_proof_type: uploadedProof.type,
      payment_proof_size: uploadedProof.size,
      status: "pending_payment_verification"
    };

    const { error } = await supabaseClient.from("registrations").insert(payload);
    if (error) {
      throw error;
    }

    const result = {
      ok: true,
      message: "Registration submitted successfully. We will verify your PayNow payment and contact you by email.",
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

    form.reset();
    syncInvoiceField();
    const successUrl = new URL(tripConfig.successPath, window.location.origin);
    successUrl.searchParams.set("submissionId", result.submissionId);
    successUrl.searchParams.set("email", payload.email);
    successUrl.searchParams.set("fullName", payload.full_name);
    window.location.href = successUrl.toString();
  } catch (error) {
    setMessage(error.message || "Submission failed. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = submitButton.dataset.idleLabel || "Register";
  }
});

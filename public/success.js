const successSubmissionId = document.getElementById("successSubmissionId");
const successEmail = document.getElementById("successEmail");

function applySuccessData(data) {
  successSubmissionId.textContent = data.submissionId || "-";
  successEmail.textContent = data.email || "-";
}

function getStoredSuccessData() {
  try {
    const raw = window.sessionStorage.getItem("registrationSuccess");
    return raw ? JSON.parse(raw) : {};
  } catch (_error) {
    return {};
  }
}

try {
  const params = new URLSearchParams(window.location.search);
  const storedData = getStoredSuccessData();
  const dataFromQuery = {
    submissionId: params.get("submissionId") || "",
    email: params.get("email") || "",
    fullName: params.get("fullName") || ""
  };

  if (dataFromQuery.submissionId || dataFromQuery.email || dataFromQuery.fullName) {
    window.sessionStorage.setItem("registrationSuccess", JSON.stringify(dataFromQuery));
    applySuccessData(dataFromQuery);
  } else {
    applySuccessData(storedData);
  }
} catch (_error) {
  successSubmissionId.textContent = "-";
  successEmail.textContent = "-";
}

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const form = document.getElementById("notifyForm");
  const messageEl = document.getElementById("formMessage");

  if (form && messageEl) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const emailInput = document.getElementById("emailInput");
      const email = emailInput.value.trim();

      if (!email) {
        messageEl.textContent = "Please enter your email address.";
        messageEl.style.color = "#f97373";
        return;
      }

      // For now, just show a local confirmation.
      // Later you can plug this into an API / backend.
      messageEl.textContent = "Got it. We will notify you when the beta is ready.";
      messageEl.style.color = "#4ade80";
      form.reset();
    });
  }
});
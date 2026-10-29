// --- Google Analytics 4 (GA4) Event Tracking Helper ---
function trackGAEvent(eventName, eventParams = {}) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventParams);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...eventParams });
    }
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.protocol === "file:"
    ) {
      console.log(`[GA4 Track] ${eventName}:`, eventParams);
    }
  } catch (err) {
    console.warn("[GA4 Tracking Error]", err);
  }
}

// --- Automated GA4 Lead & Pricing Click Instrumentation ---
function initGA4EventTracking() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const trackType = link.getAttribute("data-track");
    const trackLocation =
      link.getAttribute("data-track-location") ||
      (link.closest("section")?.id || link.closest("header") ? "header" : link.closest("footer") ? "footer" : "general");
    const label =
      link.textContent.trim().replace(/\s+/g, " ") ||
      link.getAttribute("aria-label") ||
      "link";

    // 1. WhatsApp Leads Tracking (Strict Ending-in-98 value: 998)
    if (trackType === "whatsapp" || href.includes("wa.me")) {
      trackGAEvent("generate_lead", {
        method: "whatsapp",
        event_category: "lead_generation",
        event_label: label,
        lead_location: trackLocation,
        link_url: href,
        value: 998,
        currency: "INR",
      });
      trackGAEvent("whatsapp_lead_click", {
        event_category: "contact",
        event_label: label,
        lead_location: trackLocation,
      });
      return;
    }

    // 2. Intake Form Leads (Google Forms Free Assessment)
    if (trackType === "intake" || href.includes("forms.gle")) {
      trackGAEvent("generate_lead", {
        method: "google_form_intake",
        event_category: "lead_generation",
        event_label: label,
        lead_location: trackLocation,
        link_url: href,
        value: 998,
        currency: "INR",
      });
      trackGAEvent("intake_form_click", {
        event_category: "form_submission",
        event_label: label,
        lead_location: trackLocation,
      });
      return;
    }

    // 3. Pricing & Services Clicks
    if (trackType === "pricing" || href === "#services" || /services & pricing|pricing/i.test(label)) {
      trackGAEvent("pricing_click", {
        event_category: "engagement",
        event_label: label,
        click_location: trackLocation,
        destination: href,
      });
      trackGAEvent("view_pricing", {
        event_category: "ecommerce",
        item_category: "asset_discovery_pricing",
      });
      return;
    }

    // 4. Phone & Email Contact Clicks
    if (trackType === "contact_phone" || href.startsWith("tel:")) {
      trackGAEvent("contact", {
        method: "phone",
        event_category: "contact",
        event_label: href.replace("tel:", ""),
        contact_location: trackLocation,
      });
      return;
    }

    if (trackType === "contact_email" || href.startsWith("mailto:")) {
      trackGAEvent("contact", {
        method: "email",
        event_category: "contact",
        event_label: href.replace("mailto:", ""),
        contact_location: trackLocation,
      });
      return;
    }
  });
}

// --- Interactive Fixed-Fee vs. Broker Commission Savings Estimator ---
function initFeeEstimator() {
  const tierSelect = document.getElementById("estTierSelect");
  const amountInput = document.getElementById("estAssetAmount");
  const outAmountLbl = document.getElementById("outEstAssetLbl");
  const outRpFee = document.getElementById("outEstRpFee");
  const outBrokerFee = document.getElementById("outEstBrokerFee");
  const outSavings = document.getElementById("outEstSavings");
  const outPayLink = document.getElementById("outEstPayBtn");

  if (!tierSelect || !amountInput) return;

  const tiers = {
    "998": {
      fee: 998,
      name: "Tier 1 · Discovery & Evidence Pack",
      url: "https://rzp.io/rzp/ebihggYp",
    },
    "2498": {
      fee: 2498,
      name: "Tier 2 · Bank & EPFO Claim Dossier",
      url: "https://rzp.io/rzp/unL0ZyZx",
    },
    "4998": {
      fee: 4998,
      name: "Tier 3 · IEPF & Share Reclamation",
      url: "https://rzp.io/rzp/d5tkRCG",
    },
  };

  const fmtINR = (n) => "₹" + Number(n).toLocaleString("en-IN");

  const update = () => {
    const t = tiers[tierSelect.value] || tiers["998"];
    const assetVal = Number(amountInput.value) || 500000;
    const brokerCut = Math.round(assetVal * 0.20); // Typical 20% agent cut
    const saved = Math.max(0, brokerCut - t.fee);

    if (outAmountLbl) outAmountLbl.textContent = fmtINR(assetVal);
    if (outRpFee) outRpFee.textContent = `${fmtINR(t.fee)} (Fixed · 0% Cut)`;
    if (outBrokerFee) outBrokerFee.textContent = `${fmtINR(brokerCut)} (at 20% commission)`;
    if (outSavings) outSavings.textContent = fmtINR(saved);
    if (outPayLink) {
      outPayLink.href = t.url;
      outPayLink.textContent = `💳 Select ${t.name} (${fmtINR(t.fee)})`;
    }
  };

  tierSelect.addEventListener("change", update);
  amountInput.addEventListener("input", update);
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  initGA4EventTracking();
  initFeeEstimator();

  const darkToggle = document.getElementById("darkToggle");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.querySelector(".rp-nav");

  // Restore saved theme preference
  if (localStorage.getItem("rp-theme") === "dark") {
    document.body.classList.add("dark");
    if (darkToggle) darkToggle.textContent = "☀";
  }

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      darkToggle.textContent = isDark ? "☀" : "☾";
      localStorage.setItem("rp-theme", isDark ? "dark" : "light");
    });
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menuToggle.textContent = isOpen ? "✕" : "☰ Menu";
    });
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰ Menu";
      });
    });
  }

  if (!localStorage.getItem("rp-privacy-dismissed")) {
    const banner = document.createElement("div");
    banner.className = "rp-privacy-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Privacy notice");
    banner.innerHTML =
      '<span>We process personal data strictly under India\'s DPDP Act, 2023. <a href="privacy.html">Privacy Policy</a> · <a href="consent.html">Client Consent Form</a></span>' +
      '<button type="button" id="rpPrivacyDismiss">Accept &amp; Close</button>';
    document.body.appendChild(banner);
    document.body.classList.add("has-privacy-banner");
    document.getElementById("rpPrivacyDismiss")?.addEventListener("click", () => {
      localStorage.setItem("rp-privacy-dismissed", "1");
      banner.remove();
      document.body.classList.remove("has-privacy-banner");
    });
  }
});

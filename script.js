// --- Google Analytics 4 (GA4) Event Tracking Helper ---
function trackGAEvent(eventName, eventParams = {}) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, eventParams);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...eventParams });
    }
    // Debug logging for local verification
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

    // 1. WhatsApp Leads Tracking
    if (trackType === "whatsapp" || href.includes("wa.me")) {
      trackGAEvent("generate_lead", {
        method: "whatsapp",
        event_category: "lead_generation",
        event_label: label,
        lead_location: trackLocation,
        link_url: href,
        value: 999,
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
        value: 999,
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

document.addEventListener("DOMContentLoaded", () => {
  // Initialize analytics click tracking
  initGA4EventTracking();

  const darkToggle = document.getElementById("darkToggle");
  const hero = document.querySelector(".rp-hero");

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      darkToggle.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
    });
  }

  if (hero) {
    const updateHeroParallax = () => {
      const scrollY = window.scrollY;
      const shift = Math.min(24, scrollY * 0.08);
      document.documentElement.style.setProperty("--hero-shift", `${shift}px`);
    };

    window.addEventListener("scroll", updateHeroParallax, { passive: true });
    window.addEventListener("resize", updateHeroParallax);
    updateHeroParallax();
  }

  if (!localStorage.getItem("rp-privacy-dismissed")) {
    const banner = document.createElement("div");
    banner.className = "rp-privacy-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Privacy notice");
    banner.innerHTML =
      '<span>We process personal data under India\'s DPDP Act, 2023. <a href="privacy.html">Privacy Policy</a></span>' +
      '<button type="button" id="rpPrivacyDismiss">Got it</button>';
    document.body.appendChild(banner);
    document.body.classList.add("has-privacy-banner");
    document.getElementById("rpPrivacyDismiss")?.addEventListener("click", () => {
      localStorage.setItem("rp-privacy-dismissed", "1");
      banner.remove();
      document.body.classList.remove("has-privacy-banner");
    });
  }
});


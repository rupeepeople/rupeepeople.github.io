document.addEventListener("DOMContentLoaded", () => {
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

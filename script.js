document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("darkToggle");
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const siteHeader = document.getElementById("siteHeader");
  const hero = document.querySelector(".rp-hero");

  if (localStorage.getItem("rp-dark") === "1") {
    document.body.classList.add("dark");
    if (darkToggle) darkToggle.textContent = "☀";
  }

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      darkToggle.textContent = isDark ? "☀" : "☾";
      localStorage.setItem("rp-dark", isDark ? "1" : "0");
    });
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const open = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.textContent = open ? "✕" : "☰";
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.textContent = "☰";
      });
    });
  }

  const onScroll = () => {
    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    if (hero) {
      const shift = Math.min(32, window.scrollY * 0.06);
      document.documentElement.style.setProperty("--hero-shift", `${shift}px`);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const revealEls = document.querySelectorAll(".rp-reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
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

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
});

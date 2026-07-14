document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("darkToggle");

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      darkToggle.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
    });
  }
});

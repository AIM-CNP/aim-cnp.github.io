// app.js (ES module)
import { initIconFollowAnimation } from "./icon-follow-animation.js";
import { startQuoteCarousel } from "./quote-carousel.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1) Icon/emoji dat de muis volgt (Strategy pattern)
  initIconFollowAnimation({
    bean: "#bean",
    radiosSelector: 'input[name="bean-mode"]'
  });

  // 2) Wisselende quotes (elke 10s)
  startQuoteCarousel("#quote-box", [
    "Tell me and I forget, teach me and I may remember, involve me and I learn. – Benjamin Franklin",
    "The best way to predict the future is to invent it. – Alan Kay",
    "Programs must be written for people to read, and only incidentally for machines to execute. – Harold Abelson",
    "Simplicity is the soul of efficiency. – Austin Freeman",
    "In theory, theory and practice are the same. In practice, they are not. – Jan L. A. van de Snepscheut",
    "First, solve the problem. Then, write the code. – John Johnson"
  ], 10000);
});

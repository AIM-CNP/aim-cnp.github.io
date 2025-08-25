// quote-carousel.js
// Wisselt elke N ms tussen quotes.

function $(elOrSelector) {
  return (typeof elOrSelector === "string")
    ? document.querySelector(elOrSelector)
    : elOrSelector;
}

/**
 * Start een quote-carousel.
 * @param {string|HTMLElement} container Element of selector voor de quote.
 * @param {string[]} quotes Lijst met quotes.
 * @param {number} intervalMs Interval in milliseconden (default 10000).
 * @returns {{stop: Function}} object met stop()
 */
export function startQuoteCarousel(container, quotes, intervalMs = 10000) {
  const box = $(container);
  if (!box || !quotes?.length) return { stop(){} };

  let i = 0;
  let timerId = null;

  box.setAttribute("aria-live", "polite");
  box.style.whiteSpace = "pre-wrap";

  const show = () => { box.textContent = quotes[i]; i = (i + 1) % quotes.length; };
  show();
  timerId = setInterval(show, intervalMs);

  return { stop: () => clearInterval(timerId) };
}

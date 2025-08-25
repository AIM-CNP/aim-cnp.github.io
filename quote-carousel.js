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
 * @param {Array<{quote: string, author: string}>|string[]} quotes Lijst met quotes (objecten of strings).
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

  // Create visual indicators (dots)
  const indicatorsContainer = document.createElement('div');
  indicatorsContainer.className = 'quote-indicators';
  indicatorsContainer.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 10px;
  `;
  
  // Create dots for each quote
  const indicators = quotes.map((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'quote-dot';
    dot.style.cssText = `
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #ccc;
      cursor: pointer;
      transition: background-color 0.3s ease;
    `;
    dot.addEventListener('click', () => {
      i = index;
      show();
      resetTimer();
    });
    indicatorsContainer.appendChild(dot);
    return dot;
  });

  // Insert indicators after the quote box
  box.parentNode.insertBefore(indicatorsContainer, box.nextSibling);

  const formatQuote = (quoteData) => {
    if (typeof quoteData === 'string') {
      // Handle legacy string format
      return quoteData;
    } else if (quoteData.quote && quoteData.author) {
      // Handle new object format with HTML formatting
      // Only the quote text is italic, author remains regular
      return `"<i>${quoteData.quote}</i>" – ${quoteData.author}`;
    }
    return '';
  };

  const updateIndicators = () => {
    indicators.forEach((dot, index) => {
      dot.style.backgroundColor = index === i ? '#333' : '#ccc';
    });
  };

  const resetTimer = () => {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(show, intervalMs);
  };

  const show = () => { 
    const formattedQuote = formatQuote(quotes[i]);
    console.log('Formatted quote:', formattedQuote);
    box.innerHTML = formattedQuote; 
    updateIndicators();
    i = (i + 1) % quotes.length; 
  };

  show();
  timerId = setInterval(show, intervalMs);

  return { stop: () => clearInterval(timerId) };
}

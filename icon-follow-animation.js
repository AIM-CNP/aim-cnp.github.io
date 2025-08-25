// icon-follow-animation.js
// Volgt de muis met een icoon/emoji volgens Strategy pattern.

class Effect {
  move(_bean, _x, _y) {
    throw new Error("Subclass must implement move()");
  }
}

class NoEffect extends Effect {
  move(bean, x, y) {
    bean.style.left = x + "px";
    bean.style.top = y + "px";
    bean.style.transform = "translate(-50%, -50%)";
  }
}

class LeafEffect extends Effect {
  constructor() {
    super();
    this.x = 0; this.y = 0;
    this.hop = 0; this.rotation = 0;
    this._hopTimer = setInterval(() => {
      this.hop = Math.random() * 20 - 10;
    }, 500);
  }
  move(bean, x, y) {
    this.x += (x - this.x) * 0.1;
    this.y += (y - this.y) * 0.1;
    const wiggle = Math.sin(Date.now() / 200) * 15;
    this.rotation = Math.sin(Date.now() / 300) * 15;
    bean.style.left = (this.x + wiggle) + "px";
    bean.style.top  = (this.y + this.hop) + "px";
    bean.style.transform = `translate(-50%, -50%) rotate(${this.rotation}deg)`;
  }
  destroy() { clearInterval(this._hopTimer); }
}

class BeanEffect extends Effect {
  constructor() { super(); this.x = 0; this.y = 0; this.jump = 0; }
  move(bean, x, y) {
    this.x += (x - this.x) * 0.1;
    this.y += (y - this.y) * 0.1;
    this.jump = Math.abs(Math.sin(Date.now() / 300) * 15);
    bean.style.left = this.x + "px";
    bean.style.top  = (this.y - this.jump) + "px";
    bean.style.transform = "translate(-50%, -50%)";
  }
}

/**
 * Initialiseert de muis-volg animatie.
 * @param {Object} opts
 * @param {string|HTMLElement} opts.bean Element of selector van het icoon.
 * @param {string} opts.radiosSelector Selector voor de radio buttons (name="bean-mode").
 * @returns {Function} cleanup() om listeners/loops op te ruimen.
 */
export function initIconFollowAnimation({ bean, radiosSelector }) {
  const beanEl = typeof bean === "string" ? document.querySelector(bean) : bean;
  if (!beanEl) return () => {};

  let targetX = 0, targetY = 0;
  let strategy = new NoEffect();
  let rafId = null;

  const onMouseMove = (e) => { targetX = e.pageX; targetY = e.pageY; };
  document.addEventListener("mousemove", onMouseMove, { passive: true });

  function animate() {
    strategy.move(beanEl, targetX, targetY);
    rafId = requestAnimationFrame(animate);
  }
  rafId = requestAnimationFrame(animate);

  // Strategy wisselen
  document.querySelectorAll(radiosSelector).forEach(radio => {
    radio.addEventListener("change", (e) => {
      const mode = e.target.value;
      // opruimen vorige strategy (indien nodig)
      if (typeof strategy.destroy === "function") strategy.destroy();

      if (mode === "leaf") {
        strategy = new LeafEffect();
        beanEl.textContent = "🍃";
      } else if (mode === "bean") {
        strategy = new BeanEffect();
        beanEl.textContent = "🫘";
      } else {
        strategy = new NoEffect();
        beanEl.textContent = ""; // geen icoon
      }
    }, { passive: true });
  });

  // cleanup API
  return function cleanup() {
    cancelAnimationFrame(rafId);
    document.removeEventListener("mousemove", onMouseMove);
    if (typeof strategy.destroy === "function") strategy.destroy();
  };
}

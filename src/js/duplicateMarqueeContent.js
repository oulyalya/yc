const duplicateMarqueeContent = (
  marqueeClass = 'marquee',
  wrapClass = 'marquee__line',
  elClass = 'marquee__item',
  copiesNumber = 2,
) => {
  const marquees = document.querySelectorAll(`.${marqueeClass}`);

  marquees.forEach((marquee) => {
    const wrap = marquee.querySelector(`.${wrapClass}`);
    const el = marquee.querySelector(`.${elClass}`);

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < copiesNumber; i++) {
      const clone = el.cloneNode(true);
      fragment.appendChild(clone);
    }

    wrap.append(fragment);
  });
};

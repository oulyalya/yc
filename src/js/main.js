//= swiper.js
//= duplicateMarqueeContent.js
//= initSliders.js

function DOM_Ready() {
  duplicateMarqueeContent();
  initStagesSlider();
  initParticipantsSlider();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', DOM_Ready);
} else {
  DOM_Ready();
}

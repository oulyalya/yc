const renderFractionPagination = (current, total) => {
  return `<span>${current}</span>/<span>${total}</span>`;
};

const initStagesSlider = () => {
  const block = document.querySelector('.stages');
  const sliderEl = block.querySelector('.swiper-container');
  const paginationEl = block.querySelector('.pagination');
  const prevBtn = block.querySelector('.arrow--prev');
  const nextBtn = block.querySelector('.arrow--next');

  let swiper = undefined;

  function resize() {
    if (document.body.clientWidth <= 1029) {
      if (swiper === undefined) {
        swiper = new Swiper(sliderEl, {
          slidesPerView: 2,
          observer: true,
          observeParents: true,
          observeSlideChildren: true,
          speed: 800,
          spaceBetween: 20,
          watchOverflow: true,

          navigation: {
            prevEl: prevBtn,
            nextEl: nextBtn,
            disabledClass: 'arrow--disabled',
          },

          pagination: {
            el: paginationEl,
            clickable: true,
          },

          breakpoints: {
            699: {
              slidesPerView: 1,
            },
          },
        });
      }
    } else {
      if (swiper && swiper !== undefined) {
        swiper.destroy(true, true);
        swiper = undefined;
      }
    }
  }

  window.addEventListener('resize', function () {
    return resize();
  });

  resize();
};

const initParticipantsSlider = () => {
  const block = document.querySelector('.participants');
  const sliderEl = block.querySelector('.swiper-container');
  const paginationEl = block.querySelector('.pagination');
  const prevBtn = block.querySelector('.arrow--prev');
  const nextBtn = block.querySelector('.arrow--next');

  const swiper = new Swiper(sliderEl, {
    slidesPerView: 3,
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    speed: 800,
    spaceBetween: 20,
    allowTouchMove: true,
    loop: true,
    watchOverflow: true,

    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },

    navigation: {
      prevEl: prevBtn,
      nextEl: nextBtn,
      disabledClass: 'arrow--disabled',
    },

    pagination: {
      el: paginationEl,
      type: 'custom',

      renderCustom: function (swiper, current, total) {
        return renderFractionPagination(current, total);
      },
    },

    breakpoints: {
      1029: {
        slidesPerView: 2,
      },

      699: {
        slidesPerView: 1,
      },
    },
  });
};

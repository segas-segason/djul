document.addEventListener('DOMContentLoaded', () => {
  const imagePaths = [
    '/images/01.jpg',
    '/images/02.jpg',
    '/images/03.jpg',
    '/images/04.jpg',
    '/images/05.jpg'
  ];

  const carousel = {
    prev: document.querySelector('.carousel__slide.prev'),
    active: document.querySelector('.carousel__slide.active'),
    next: document.querySelector('.carousel__slide.next'),
    track: document.querySelector('.carousel__track'),
    progressBar: document.querySelector('.progress-bar'),
    progressFill: document.querySelector('.progress-bar span')
  };

  const intervalTime = 5000;
  let activeIndex = 0;
  let autoSlideTimer;
  let isAnimating = false;

  function resetProgressBar() {
    carousel.progressFill.style.transition = 'none';
    carousel.progressFill.style.width = '0%';
    void carousel.progressFill.offsetWidth;
  }

  function animateProgressBar() {
    resetProgressBar();
    carousel.progressFill.style.transition = `width ${intervalTime}ms linear`;
    carousel.progressFill.style.width = '100%';
  }

  function animateImageTransition(container, newSrc, role) {
    const oldImg = container.querySelector('img');
    if (!oldImg) return;

    const newImg = document.createElement('img');
    newImg.src = newSrc;
    newImg.classList.add('carousel__image', 'animate-in', role);

    // Удаляем у старого изображение "stable"
    oldImg.classList.remove('stable', 'prev', 'active', 'next');

    container.appendChild(newImg);

    oldImg.classList.add('animate-out');

    newImg.addEventListener('animationend', () => {
      oldImg.remove();
      newImg.classList.remove('animate-in', 'prev', 'active', 'next');
      newImg.classList.add('stable', role);
      isAnimating = false;
      carousel.track.style.pointerEvents = 'auto';
    }, { once: true });
  }

  function updateSlides(index) {
    if (isAnimating) return;
    isAnimating = true;
    carousel.track.style.pointerEvents = 'none';

    const total = imagePaths.length;
    const prevIndex = (index - 1 + total) % total;
    const nextIndex = (index + 1) % total;

    animateImageTransition(carousel.prev, imagePaths[prevIndex], 'prev');
    animateImageTransition(carousel.active, imagePaths[index], 'active');
    animateImageTransition(carousel.next, imagePaths[nextIndex], 'next');

    activeIndex = index;
    animateProgressBar();
  }

  function goToNext() {
    updateSlides((activeIndex + 1) % imagePaths.length);
  }

  function startAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(goToNext, intervalTime);
  }

  function setupEventListeners() {
    carousel.track.addEventListener('click', (e) => {
      if (isAnimating) return;

      const clicked = e.target.closest('.carousel__slide');
      if (!clicked || clicked.classList.contains('active')) return;

      if (clicked.classList.contains('prev')) {
        updateSlides((activeIndex - 1 + imagePaths.length) % imagePaths.length);
      } else if (clicked.classList.contains('next')) {
        updateSlides((activeIndex + 1) % imagePaths.length);
      }

      startAutoSlide();
    });

    carousel.progressBar.addEventListener('click', () => {
      if (isAnimating) return;
      goToNext();
      startAutoSlide();
    });
  }

  function initCarousel() {
    updateSlides(0);
    startAutoSlide();
    setupEventListeners();
  }

  initCarousel();
});

// Кнопка копирования с тултипом
function setupCopyButtons() {
  document.querySelectorAll('.store-card__copy-btn').forEach(button => {
    const tooltip = button.nextElementSibling;
    if (!tooltip || !tooltip.classList.contains('tooltip')) return;

    button.addEventListener('click', async function () {
      try {
        const textToCopy = this.getAttribute('data-copy-text') || '';

        // Modern clipboard API
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(textToCopy);
        }
        // Fallback для старых браузеров
        else {
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        // Обновление тултипа
        tooltip.textContent = 'Скопировано!';
        tooltip.classList.add('copied');

        setTimeout(() => {
          tooltip.textContent = 'Скопировать адрес';
          tooltip.classList.remove('copied');
        }, 2000);

      } catch (err) {
        console.error('Ошибка копирования:', err);
        tooltip.textContent = 'Ошибка!';
        setTimeout(() => {
          tooltip.textContent = 'Скопировать адрес';
        }, 2000);
      }
    });
  });
}

// Инициализация всех компонентов
document.addEventListener('DOMContentLoaded', () => {
  setupCopyButtons();
});


//Кнопка наверх
document.querySelector('.to-top-btn').addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});


//Menu
// Функция для обновления состояния навигации
function updateNavStyle() {
  const nav = document.querySelector('nav');
  const scrollPosition = window.scrollY;

  if (scrollPosition > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

// Обработчик скролла
window.addEventListener('scroll', function () {
  updateNavStyle();
});

// Проверяем позицию при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
  updateNavStyle();
});

// Дополнительная проверка на случай, если страница загрузилась уже прокрученной
window.addEventListener('load', function () {
  updateNavStyle();
});

// Parallax
document.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const parallaxItems = document.querySelectorAll('.parallax-item');

  parallaxItems.forEach(item => {
    const speed = parseFloat(item.getAttribute('data-speed'));
    item.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

//Анимация для заголовка
document.addEventListener('DOMContentLoaded', function () {
  // Варианты слов для замены
  const words = ['модных', 'стильных', 'красивых', 'лучших'];

  // Находим элемент для замены слов
  const wordElement = document.querySelector('.changing-word');

  // Если элемент не найден - прекращаем выполнение
  if (!wordElement) {
    console.error('Элемент .changing-word не найден');
    return;
  }

  // Создаем внутренний контейнер для анимации
  const innerSpan = document.createElement('span');
  innerSpan.className = 'changing-word-inner';
  innerSpan.textContent = words[0];
  wordElement.innerHTML = '';
  wordElement.appendChild(innerSpan);

  let currentIndex = 0;

  // Функция замены слова с анимацией
  function changeWord() {
    const nextIndex = (currentIndex + 1) % words.length;

    // 1. Фаза исчезновения текущего слова
    innerSpan.style.opacity = '0';
    innerSpan.style.transform = 'translateY(-15px)';

    setTimeout(() => {
      // 2. Замена текста
      innerSpan.textContent = words[nextIndex];
      currentIndex = nextIndex;

      // 3. Фаза появления нового слова
      innerSpan.style.opacity = '0';
      innerSpan.style.transform = 'translateY(15px)';

      // Небольшая задержка перед анимацией появления
      requestAnimationFrame(() => {
        innerSpan.style.opacity = '1';
        innerSpan.style.transform = 'translateY(0)';
      });
    }, 500);
  }

  // Настройка анимации
  Object.assign(innerSpan.style, {
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'block',
    backfaceVisibility: 'hidden'
  });

  // Запускаем анимацию каждые 3 секунды
  setInterval(changeWord, 3000);

  // Первый запуск с небольшой задержкой
  setTimeout(changeWord, 1000);
});

//Фильтры для магазинов
document.addEventListener('DOMContentLoaded', function () {
  const config = {
    activeClass: 'filter-button--active',
    storeCardSelector: '.store-card',
    filterButtonSelector: '.filter-button',
    filtersContainer: '.stores__filters',
    defaultFilter: 'all'
  };

  // Получаем элементы
  const filterButtons = document.querySelectorAll(config.filterButtonSelector);
  const storeCards = document.querySelectorAll(config.storeCardSelector);
  const filtersContainer = document.querySelector(config.filtersContainer);

  if (!filterButtons.length || !storeCards.length || !filtersContainer) {
    console.warn('Не найдены элементы для фильтрации');
    return;
  }

  // Функция фильтрации
  const filterStores = (filter) => {
    storeCards.forEach(card => {
      const location = card.dataset.location;
      const shouldShow = filter === config.defaultFilter || location === filter;
      card.style.display = shouldShow ? 'block' : 'none';
    });
  };

  // Обработчик кликов
  filtersContainer.addEventListener('click', (e) => {
    const button = e.target.closest(config.filterButtonSelector);
    if (!button) return;

    // Обновляем активную кнопку
    filterButtons.forEach(btn => {
      btn.classList.toggle(config.activeClass, btn === button);
    });

    // Применяем фильтр
    filterStores(button.dataset.filter);
  });

  // Инициализация - показываем все карточки
  const initialize = () => {
    storeCards.forEach(card => {
      card.style.display = 'block';
    });

    // Активируем кнопку "Все"
    filterButtons.forEach(btn => {
      btn.classList.remove(config.activeClass);
    });
    document.querySelector(`[data-filter="${config.defaultFilter}"]`)
      .classList.add(config.activeClass);
  };

  // Запускаем
  initialize();
});

//Модальное окно Телеграм
document.addEventListener('DOMContentLoaded', () => {
  const telegramLinks = document.querySelectorAll('.telegram-link');
  const modal = document.getElementById('telegramModal');
  const closeBtn = document.getElementById('closeTelegramModal');

  telegramLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });
});
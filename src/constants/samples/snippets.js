/**
 * 코드 스니펫 샘플 (각 기본 카테고리당 2개).
 * 고정 id(sample-s-*)로 중복 시드를 방지한다.
 * meta: { kind:'snippet', lang, usage, trigger }
 */
const j = (...lines) => lines.join('\n');

export const SNIPPET_SAMPLES = [
  // ===== Scroll Event =====
  {
    id: 'sample-s-scroll-progress',
    title: '스크롤 진행률 바',
    categoryId: 'seed-snippet-scroll',
    description: '페이지 스크롤 비율을 상단 바로 표시.',
    tags: ['scroll', 'progress'],
    lang: 'js',
    usage: '상단에 고정된 #progress 요소의 너비를 갱신합니다.',
    trigger: 'window scroll 이벤트',
    javascript: j(
      "window.addEventListener('scroll', function () {",
      '  var h = document.documentElement;',
      '  var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;',
      "  var bar = document.getElementById('progress');",
      "  if (bar) bar.style.width = scrolled + '%';",
      '});'
    ),
  },
  {
    id: 'sample-s-scroll-reveal',
    title: '스크롤 등장(Reveal)',
    categoryId: 'seed-snippet-scroll',
    description: 'IntersectionObserver로 요소를 스크롤 시 등장시킴.',
    tags: ['scroll', 'reveal', 'observer'],
    lang: 'js',
    usage: '.reveal 클래스 요소에 적용. 뷰포트 진입 시 .is-visible 부여.',
    trigger: 'IntersectionObserver 교차 시점',
    javascript: j(
      "var io = new IntersectionObserver(function (entries) {",
      '  entries.forEach(function (e) {',
      "    if (e.isIntersecting) e.target.classList.add('is-visible');",
      '  });',
      '}, { threshold: 0.15 });',
      "document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });"
    ),
  },

  // ===== Smooth Scroll =====
  {
    id: 'sample-s-smooth-top',
    title: '맨 위로 스크롤',
    categoryId: 'seed-snippet-smooth-scroll',
    description: '버튼 클릭 시 페이지 최상단으로 부드럽게 이동.',
    tags: ['scroll', 'top', 'smooth'],
    lang: 'js',
    usage: '#toTop 버튼 클릭 시 호출됩니다.',
    trigger: '버튼 click',
    javascript: j(
      "var btn = document.getElementById('toTop');",
      "if (btn) btn.addEventListener('click', function () {",
      "  window.scrollTo({ top: 0, behavior: 'smooth' });",
      '});'
    ),
  },
  {
    id: 'sample-s-smooth-section',
    title: '섹션 스냅 이동',
    categoryId: 'seed-snippet-smooth-scroll',
    description: '다음 섹션으로 순차 이동하는 헬퍼.',
    tags: ['scroll', 'section'],
    lang: 'js',
    usage: 'goToSection(index)로 N번째 .section 으로 이동.',
    trigger: '함수 호출 시',
    javascript: j(
      'function goToSection(index) {',
      "  var sections = document.querySelectorAll('.section');",
      "  if (sections[index]) sections[index].scrollIntoView({ behavior: 'smooth' });",
      '}'
    ),
  },

  // ===== Tab Interaction =====
  {
    id: 'sample-s-tab-delegate',
    title: '탭 이벤트 위임',
    categoryId: 'seed-snippet-tab',
    description: '이벤트 위임으로 탭 전환을 한 번에 처리.',
    tags: ['tab', 'delegation'],
    lang: 'js',
    usage: '.tabs 컨테이너 안의 [data-tab] 버튼과 [data-panel] 패널에 적용.',
    trigger: '.tabs 컨테이너 click (위임)',
    javascript: j(
      "var tabs = document.querySelector('.tabs');",
      "if (tabs) tabs.addEventListener('click', function (e) {",
      "  var btn = e.target.closest('[data-tab]');",
      '  if (!btn) return;',
      '  var key = btn.dataset.tab;',
      "  tabs.querySelectorAll('[data-tab]').forEach(function (b) { b.classList.toggle('is-active', b === btn); });",
      "  tabs.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== key; });",
      '});'
    ),
  },
  {
    id: 'sample-s-tab-hash',
    title: '해시 연동 탭',
    categoryId: 'seed-snippet-tab',
    description: 'URL 해시(#tab)와 탭 상태를 동기화.',
    tags: ['tab', 'hash', 'url'],
    lang: 'js',
    usage: '[data-panel] 패널 id 와 location.hash 를 매칭합니다.',
    trigger: 'hashchange 및 초기 로드',
    javascript: j(
      'function syncTabFromHash() {',
      "  var key = location.hash.replace('#', '') || 'default';",
      "  document.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== key; });",
      '}',
      "window.addEventListener('hashchange', syncTabFromHash);",
      'syncTabFromHash();'
    ),
  },

  // ===== Accordion Interaction =====
  {
    id: 'sample-s-accordion-toggle',
    title: '아코디언 토글',
    categoryId: 'seed-snippet-accordion',
    description: 'max-height 트랜지션으로 패널을 펼치고 접음.',
    tags: ['accordion', 'toggle'],
    lang: 'js',
    usage: '.acc-head 클릭 시 바로 다음 .acc-panel 을 토글.',
    trigger: '.acc-head click',
    javascript: j(
      "document.querySelectorAll('.acc-head').forEach(function (head) {",
      "  head.addEventListener('click', function () {",
      '    var panel = this.nextElementSibling;',
      "    var open = panel.style.maxHeight && panel.style.maxHeight !== '0px';",
      "    panel.style.maxHeight = open ? '0' : panel.scrollHeight + 'px';",
      '  });',
      '});'
    ),
  },
  {
    id: 'sample-s-accordion-exclusive',
    title: '아코디언 단일 오픈',
    categoryId: 'seed-snippet-accordion',
    description: '하나를 열면 다른 패널을 자동으로 닫음.',
    tags: ['accordion', 'exclusive'],
    lang: 'js',
    usage: '.acc-item(내부 .acc-head/.acc-panel) 구조에 적용.',
    trigger: '.acc-head click',
    javascript: j(
      "var items = document.querySelectorAll('.acc-item');",
      'items.forEach(function (item) {',
      "  item.querySelector('.acc-head').addEventListener('click', function () {",
      "    var panel = item.querySelector('.acc-panel');",
      "    var open = panel.style.maxHeight && panel.style.maxHeight !== '0px';",
      "    items.forEach(function (x) { x.querySelector('.acc-panel').style.maxHeight = '0'; });",
      "    if (!open) panel.style.maxHeight = panel.scrollHeight + 'px';",
      '  });',
      '});'
    ),
  },

  // ===== Modal Control =====
  {
    id: 'sample-s-modal-open',
    title: '모달 열기/닫기',
    categoryId: 'seed-snippet-modal',
    description: '데이터 속성으로 모달을 제어하는 범용 컨트롤러.',
    tags: ['modal', 'control'],
    lang: 'js',
    usage: '[data-open="모달id"] 로 열기, .modal 내 [data-close] 로 닫기.',
    trigger: 'document click (위임)',
    javascript: j(
      "document.addEventListener('click', function (e) {",
      "  var opener = e.target.closest('[data-open]');",
      '  if (opener) { var m = document.getElementById(opener.dataset.open); if (m) m.hidden = false; }',
      "  if (e.target.matches('[data-close]')) { var p = e.target.closest('.modal'); if (p) p.hidden = true; }",
      '});'
    ),
  },
  {
    id: 'sample-s-modal-esc',
    title: 'ESC로 모달 닫기',
    categoryId: 'seed-snippet-modal',
    description: 'Escape 키로 열린 모달을 닫음.',
    tags: ['modal', 'keyboard', 'a11y'],
    lang: 'js',
    usage: '.modal:not([hidden]) 를 모두 닫습니다.',
    trigger: 'document keydown (Escape)',
    javascript: j(
      "document.addEventListener('keydown', function (e) {",
      "  if (e.key !== 'Escape') return;",
      "  document.querySelectorAll('.modal:not([hidden])').forEach(function (m) { m.hidden = true; });",
      '});'
    ),
  },

  // ===== Bottom Sheet Control =====
  {
    id: 'sample-s-sheet-drag',
    title: '바텀 시트 드래그 닫기',
    categoryId: 'seed-snippet-bottom-sheet',
    description: '아래로 드래그하면 바텀 시트를 닫는 터치 제어.',
    tags: ['bottom-sheet', 'drag', 'touch'],
    lang: 'js',
    usage: '.sheet 요소에 터치 드래그로 닫기를 부여.',
    trigger: 'touchstart/touchmove/touchend',
    javascript: j(
      "var sheet = document.querySelector('.sheet');",
      'if (sheet) {',
      '  var startY = 0;',
      "  sheet.addEventListener('touchstart', function (e) { startY = e.touches[0].clientY; });",
      "  sheet.addEventListener('touchend', function (e) {",
      '    var diff = e.changedTouches[0].clientY - startY;',
      "    if (diff > 80) sheet.hidden = true;",
      '  });',
      '}'
    ),
  },
  {
    id: 'sample-s-sheet-toggle',
    title: '바텀 시트 토글',
    categoryId: 'seed-snippet-bottom-sheet',
    description: '열림 상태에 따라 바디 스크롤을 잠그는 토글.',
    tags: ['bottom-sheet', 'scroll-lock'],
    lang: 'js',
    usage: 'toggleSheet(true/false)로 열고 닫으며 배경 스크롤 제어.',
    trigger: '함수 호출 시',
    javascript: j(
      'function toggleSheet(open) {',
      "  var sheet = document.querySelector('.sheet');",
      '  if (!sheet) return;',
      '  sheet.hidden = !open;',
      "  document.body.style.overflow = open ? 'hidden' : '';",
      '}'
    ),
  },

  // ===== Swiper Initialization =====
  {
    id: 'sample-s-swiper-basic',
    title: 'Swiper 기본 초기화',
    categoryId: 'seed-snippet-swiper',
    description: '페이지네이션/루프를 포함한 Swiper 초기화.',
    tags: ['swiper', 'init', 'carousel'],
    lang: 'js',
    usage: 'Swiper CDN 로드 후 .swiper 컨테이너를 초기화합니다.',
    trigger: 'DOMContentLoaded 이후',
    javascript: j(
      'var swiper = new Swiper(".swiper", {',
      '  loop: true,',
      '  pagination: { el: ".swiper-pagination", clickable: true },',
      '  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },',
      '});'
    ),
  },
  {
    id: 'sample-s-swiper-autoplay',
    title: 'Swiper 자동재생',
    categoryId: 'seed-snippet-swiper',
    description: '3초 간격 자동재생 Swiper 설정.',
    tags: ['swiper', 'autoplay'],
    lang: 'js',
    usage: 'autoplay 옵션으로 자동 전환되는 슬라이더.',
    trigger: 'DOMContentLoaded 이후',
    javascript: j(
      'var swiper = new Swiper(".swiper", {',
      '  loop: true,',
      '  autoplay: { delay: 3000, disableOnInteraction: false },',
      '});'
    ),
  },

  // ===== Form Validation =====
  {
    id: 'sample-s-valid-required',
    title: '필수 입력 검사',
    categoryId: 'seed-snippet-form-validation',
    description: '빈 필수 입력에 에러 표시를 붙이는 검사.',
    tags: ['form', 'validation', 'required'],
    lang: 'js',
    usage: 'validateRequired(form) 호출. [required] 빈 값에 .error 부여.',
    trigger: '폼 submit 시',
    javascript: j(
      'function validateRequired(form) {',
      '  var ok = true;',
      "  form.querySelectorAll('[required]').forEach(function (el) {",
      '    var empty = !el.value.trim();',
      "    el.classList.toggle('error', empty);",
      '    if (empty) ok = false;',
      '  });',
      '  return ok;',
      '}'
    ),
  },
  {
    id: 'sample-s-valid-phone',
    title: '전화번호 포맷 검사',
    categoryId: 'seed-snippet-form-validation',
    description: '한국 휴대폰 번호 형식을 검사/포맷팅.',
    tags: ['form', 'validation', 'phone'],
    lang: 'js',
    usage: 'formatPhone(value)로 010-0000-0000 포맷 반환.',
    trigger: 'input 이벤트 또는 제출 시',
    javascript: j(
      'function formatPhone(value) {',
      "  var n = value.replace(/\\D/g, '').slice(0, 11);",
      "  if (n.length < 4) return n;",
      "  if (n.length < 8) return n.replace(/(\\d{3})(\\d+)/, '$1-$2');",
      "  return n.replace(/(\\d{3})(\\d{4})(\\d+)/, '$1-$2-$3');",
      '}'
    ),
  },

  // ===== Common Utility Functions =====
  {
    id: 'sample-s-util-debounce',
    title: 'debounce 유틸',
    categoryId: 'seed-snippet-utility',
    description: '연속 호출을 지연·병합하는 디바운스 함수.',
    tags: ['utility', 'debounce', 'performance'],
    lang: 'js',
    usage: 'var fn = debounce(handler, 300); input.addEventListener("input", fn);',
    trigger: '함수 래핑 후 이벤트에 연결',
    javascript: j(
      'function debounce(fn, delay) {',
      '  var t;',
      '  return function () {',
      '    var ctx = this, args = arguments;',
      '    clearTimeout(t);',
      '    t = setTimeout(function () { fn.apply(ctx, args); }, delay || 300);',
      '  };',
      '}'
    ),
  },
  {
    id: 'sample-s-util-throttle',
    title: 'throttle 유틸',
    categoryId: 'seed-snippet-utility',
    description: '일정 간격으로만 실행되게 제한하는 스로틀.',
    tags: ['utility', 'throttle', 'performance'],
    lang: 'js',
    usage: 'window.addEventListener("scroll", throttle(onScroll, 200));',
    trigger: '함수 래핑 후 이벤트에 연결',
    javascript: j(
      'function throttle(fn, limit) {',
      '  var wait = false;',
      '  return function () {',
      '    if (wait) return;',
      '    fn.apply(this, arguments);',
      '    wait = true;',
      '    setTimeout(function () { wait = false; }, limit || 200);',
      '  };',
      '}'
    ),
  },
];

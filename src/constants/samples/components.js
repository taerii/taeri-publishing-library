/**
 * 컴포넌트 샘플 (각 기본 카테고리당 2개).
 * 고정 id(sample-c-*)로 중복 시드를 방지한다.
 * categoryId 는 defaultCategories 의 seed-component-* 를 참조.
 */
const j = (...lines) => lines.join('\n');

export const COMPONENT_SAMPLES = [
  // ===== Layout =====
  {
    id: 'sample-c-layout-holy-grail',
    title: '홀리 그레일 레이아웃',
    categoryId: 'seed-component-layout',
    description: '헤더/사이드바/본문/푸터로 구성된 기본 페이지 레이아웃.',
    tags: ['layout', 'grid', 'structure'],
    html: j(
      '<div class="hg">',
      '  <header class="hg__h">Header</header>',
      '  <div class="hg__mid">',
      '    <aside class="hg__s">Sidebar</aside>',
      '    <main class="hg__m">Main Content</main>',
      '  </div>',
      '  <footer class="hg__f">Footer</footer>',
      '</div>'
    ),
    css: j(
      '.hg { display:flex; flex-direction:column; min-height:260px; border:1px solid #eee; border-radius:10px; overflow:hidden; font-family:sans-serif; }',
      '.hg__h,.hg__f { background:#f43f5e; color:#fff; padding:14px; text-align:center; }',
      '.hg__mid { display:flex; flex:1; }',
      '.hg__s { width:140px; background:#fff1f4; padding:14px; }',
      '.hg__m { flex:1; padding:14px; }',
      '@media (max-width:480px){ .hg__mid{ flex-direction:column; } .hg__s{ width:auto; } }'
    ),
    javascript: '',
    favorite: false,
  },
  {
    id: 'sample-c-layout-split',
    title: '좌우 분할 섹션',
    categoryId: 'seed-component-layout',
    description: '이미지와 텍스트를 좌우로 나눈 반응형 2단 섹션.',
    tags: ['layout', 'split', 'responsive'],
    html: j(
      '<section class="sp">',
      '  <div class="sp__media"></div>',
      '  <div class="sp__text"><h3>제목</h3><p>좌우로 나뉜 섹션입니다. 좁은 화면에서는 세로로 쌓입니다.</p></div>',
      '</section>'
    ),
    css: j(
      '.sp { display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:center; font-family:sans-serif; }',
      '.sp__media { height:180px; border-radius:12px; background:linear-gradient(135deg,#f43f5e,#f06ba8); }',
      '.sp__text h3 { margin:0 0 8px; }',
      '.sp__text p { margin:0; color:#555; line-height:1.6; }',
      '@media (max-width:560px){ .sp{ grid-template-columns:1fr; } }'
    ),
    javascript: '',
    favorite: false,
  },

  // ===== Header / Navigation =====
  {
    id: 'sample-c-header-sticky',
    title: '스티키 헤더',
    categoryId: 'seed-component-header-nav',
    description: '스크롤 시 상단에 고정되는 네비게이션 헤더.',
    tags: ['header', 'nav', 'sticky'],
    html: j(
      '<header class="hd">',
      '  <span class="hd__logo">Brand</span>',
      '  <nav class="hd__nav"><a href="#">홈</a><a href="#">소개</a><a href="#">문의</a></nav>',
      '</header>',
      '<div style="height:600px;padding:16px;font-family:sans-serif;">스크롤하면 헤더가 상단에 고정됩니다.</div>'
    ),
    css: j(
      '.hd { position:sticky; top:0; display:flex; align-items:center; justify-content:space-between; padding:14px 20px; background:#fff; box-shadow:0 2px 8px rgba(0,0,0,.08); font-family:sans-serif; }',
      '.hd__logo { font-weight:700; color:#f43f5e; }',
      '.hd__nav a { margin-left:16px; color:#444; text-decoration:none; }',
      '.hd__nav a:hover { color:#f43f5e; }'
    ),
    javascript: '',
    favorite: false,
  },
  {
    id: 'sample-c-header-hamburger',
    title: '햄버거 모바일 메뉴',
    categoryId: 'seed-component-header-nav',
    description: '토글 버튼으로 열고 닫는 모바일 내비게이션.',
    tags: ['nav', 'mobile', 'hamburger'],
    html: j(
      '<header class="mh">',
      '  <span class="mh__logo">Brand</span>',
      '  <button class="mh__btn" aria-label="메뉴" aria-expanded="false">☰</button>',
      '  <nav class="mh__nav"><a href="#">홈</a><a href="#">제품</a><a href="#">연락처</a></nav>',
      '</header>'
    ),
    css: j(
      '.mh { position:relative; display:flex; align-items:center; justify-content:space-between; padding:14px 18px; background:#2e1a26; color:#fff; font-family:sans-serif; }',
      '.mh__logo { font-weight:700; }',
      '.mh__btn { background:none; border:none; color:#fff; font-size:22px; cursor:pointer; }',
      '.mh__nav { display:none; position:absolute; top:100%; left:0; right:0; background:#2e1a26; flex-direction:column; }',
      '.mh__nav.open { display:flex; }',
      '.mh__nav a { padding:12px 18px; color:#fff; text-decoration:none; border-top:1px solid rgba(255,255,255,.1); }'
    ),
    javascript: j(
      "var btn = document.querySelector('.mh__btn');",
      "var nav = document.querySelector('.mh__nav');",
      "btn.addEventListener('click', function () {",
      "  var open = nav.classList.toggle('open');",
      "  btn.setAttribute('aria-expanded', String(open));",
      '});'
    ),
    favorite: false,
  },

  // ===== Tab =====
  {
    id: 'sample-c-tab-basic',
    title: '기본 탭',
    categoryId: 'seed-component-tab',
    description: '탭 버튼으로 패널을 전환하는 기본 탭 UI.',
    tags: ['tab', 'toggle'],
    html: j(
      '<div class="tab">',
      '  <div class="tab__nav" role="tablist">',
      '    <button class="tab__btn is-active" data-i="0">탭 1</button>',
      '    <button class="tab__btn" data-i="1">탭 2</button>',
      '    <button class="tab__btn" data-i="2">탭 3</button>',
      '  </div>',
      '  <div class="tab__panel is-active">첫 번째 내용</div>',
      '  <div class="tab__panel">두 번째 내용</div>',
      '  <div class="tab__panel">세 번째 내용</div>',
      '</div>'
    ),
    css: j(
      '.tab { font-family:sans-serif; max-width:420px; }',
      '.tab__nav { display:flex; border-bottom:1px solid #eee; }',
      '.tab__btn { padding:10px 16px; border:none; background:none; cursor:pointer; border-bottom:2px solid transparent; }',
      '.tab__btn.is-active { color:#f43f5e; border-bottom-color:#f43f5e; font-weight:600; }',
      '.tab__panel { display:none; padding:16px 0; color:#555; }',
      '.tab__panel.is-active { display:block; }'
    ),
    javascript: j(
      "var btns = document.querySelectorAll('.tab__btn');",
      "var panels = document.querySelectorAll('.tab__panel');",
      "btns.forEach(function (b) {",
      "  b.addEventListener('click', function () {",
      '    var i = +this.dataset.i;',
      "    btns.forEach(function (x){ x.classList.remove('is-active'); });",
      "    panels.forEach(function (x){ x.classList.remove('is-active'); });",
      "    this.classList.add('is-active');",
      "    panels[i].classList.add('is-active');",
      '  });',
      '});'
    ),
    favorite: false,
  },
  {
    id: 'sample-c-tab-underline',
    title: '언더라인 애니메이션 탭',
    categoryId: 'seed-component-tab',
    description: '선택 시 밑줄이 부드럽게 이동하는 탭.',
    tags: ['tab', 'animation'],
    html: j(
      '<div class="utab">',
      '  <button class="utab__b is-active">전체</button>',
      '  <button class="utab__b">진행중</button>',
      '  <button class="utab__b">완료</button>',
      '</div>'
    ),
    css: j(
      '.utab { display:inline-flex; gap:4px; background:#fff1f4; padding:4px; border-radius:10px; font-family:sans-serif; }',
      '.utab__b { padding:8px 16px; border:none; background:none; cursor:pointer; border-radius:8px; transition:all .2s; }',
      '.utab__b.is-active { background:#fff; color:#f43f5e; font-weight:600; box-shadow:0 1px 3px rgba(0,0,0,.1); }'
    ),
    javascript: j(
      "document.querySelectorAll('.utab__b').forEach(function (b) {",
      "  b.addEventListener('click', function () {",
      "    document.querySelectorAll('.utab__b').forEach(function(x){x.classList.remove('is-active');});",
      "    this.classList.add('is-active');",
      '  });',
      '});'
    ),
    favorite: false,
  },

  // ===== Accordion =====
  {
    id: 'sample-c-accordion-single',
    title: '단일 오픈 아코디언',
    categoryId: 'seed-component-accordion',
    description: '하나를 열면 나머지가 닫히는 아코디언.',
    tags: ['accordion', 'single'],
    html: j(
      '<div class="sacc">',
      '  <div class="sacc__item"><button class="sacc__h">섹션 A</button><div class="sacc__p"><p>A 내용</p></div></div>',
      '  <div class="sacc__item"><button class="sacc__h">섹션 B</button><div class="sacc__p"><p>B 내용</p></div></div>',
      '  <div class="sacc__item"><button class="sacc__h">섹션 C</button><div class="sacc__p"><p>C 내용</p></div></div>',
      '</div>'
    ),
    css: j(
      '.sacc { max-width:460px; font-family:sans-serif; border:1px solid #eee; border-radius:10px; overflow:hidden; }',
      '.sacc__h { width:100%; text-align:left; padding:14px 16px; border:none; background:#fafafa; cursor:pointer; font-weight:600; border-top:1px solid #eee; }',
      '.sacc__item:first-child .sacc__h { border-top:none; }',
      '.sacc__p { max-height:0; overflow:hidden; transition:max-height .25s ease; }',
      '.sacc__p p { margin:0; padding:14px 16px; color:#555; }'
    ),
    javascript: j(
      "var items = document.querySelectorAll('.sacc__item');",
      "items.forEach(function (item) {",
      "  item.querySelector('.sacc__h').addEventListener('click', function () {",
      "    var panel = item.querySelector('.sacc__p');",
      "    var isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';",
      "    items.forEach(function (x){ x.querySelector('.sacc__p').style.maxHeight = '0'; });",
      "    if (!isOpen) panel.style.maxHeight = panel.scrollHeight + 'px';",
      '  });',
      '});'
    ),
    favorite: false,
  },
  {
    id: 'sample-c-accordion-plus',
    title: '플러스 아이콘 아코디언',
    categoryId: 'seed-component-accordion',
    description: '+/- 아이콘이 토글되는 아코디언.',
    tags: ['accordion', 'icon'],
    html: j(
      '<div class="pacc">',
      '  <button class="pacc__h">자주 묻는 질문 1 <span class="pacc__i">+</span></button>',
      '  <div class="pacc__p"><p>답변 내용입니다.</p></div>',
      '</div>'
    ),
    css: j(
      '.pacc { max-width:460px; font-family:sans-serif; border:1px solid #eee; border-radius:10px; overflow:hidden; }',
      '.pacc__h { width:100%; display:flex; justify-content:space-between; padding:14px 16px; border:none; background:#fff; cursor:pointer; font-weight:600; }',
      '.pacc__i { color:#f43f5e; }',
      '.pacc__p { max-height:0; overflow:hidden; transition:max-height .25s; }',
      '.pacc__p p { margin:0; padding:14px 16px; color:#555; }'
    ),
    javascript: j(
      "var h = document.querySelector('.pacc__h');",
      "h.addEventListener('click', function () {",
      "  var p = document.querySelector('.pacc__p');",
      "  var open = p.style.maxHeight && p.style.maxHeight !== '0px';",
      "  p.style.maxHeight = open ? '0' : p.scrollHeight + 'px';",
      "  this.querySelector('.pacc__i').textContent = open ? '+' : '−';",
      '});'
    ),
    favorite: false,
  },

  // ===== Modal / Popup =====
  {
    id: 'sample-c-modal-basic',
    title: '기본 모달',
    categoryId: 'seed-component-modal',
    description: '오버레이 클릭/닫기 버튼으로 닫히는 모달.',
    tags: ['modal', 'popup', 'dialog'],
    html: j(
      '<button class="mo__open">모달 열기</button>',
      '<div class="mo" hidden>',
      '  <div class="mo__panel">',
      '    <h3>알림</h3><p>모달 내용입니다.</p>',
      '    <button class="mo__close">닫기</button>',
      '  </div>',
      '</div>'
    ),
    css: j(
      'body{font-family:sans-serif;} .mo__open{padding:10px 18px;border:none;border-radius:8px;background:#f43f5e;color:#fff;cursor:pointer;}',
      '.mo { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; }',
      '.mo[hidden]{ display:none; }',
      '.mo__panel { background:#fff; padding:24px; border-radius:12px; max-width:320px; }',
      '.mo__close { margin-top:12px; padding:8px 16px; border:1px solid #ddd; border-radius:8px; background:#fff; cursor:pointer; }'
    ),
    javascript: j(
      "var mo = document.querySelector('.mo');",
      "document.querySelector('.mo__open').addEventListener('click', function(){ mo.hidden = false; });",
      "document.querySelector('.mo__close').addEventListener('click', function(){ mo.hidden = true; });",
      "mo.addEventListener('click', function(e){ if(e.target === mo) mo.hidden = true; });"
    ),
    favorite: false,
  },
  {
    id: 'sample-c-modal-toast',
    title: '토스트 알림',
    categoryId: 'seed-component-modal',
    description: '잠시 나타났다 사라지는 토스트 메시지.',
    tags: ['toast', 'notification', 'popup'],
    html: j(
      '<button class="ts__btn">토스트 띄우기</button>',
      '<div class="ts" id="toast">저장되었습니다!</div>'
    ),
    css: j(
      'body{font-family:sans-serif;} .ts__btn{padding:10px 18px;border:none;border-radius:8px;background:#f43f5e;color:#fff;cursor:pointer;}',
      '.ts { position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(20px); background:#2e1a26; color:#fff; padding:12px 20px; border-radius:10px; opacity:0; pointer-events:none; transition:all .3s; }',
      '.ts.show { opacity:1; transform:translateX(-50%) translateY(0); }'
    ),
    javascript: j(
      "var toast = document.getElementById('toast');",
      "document.querySelector('.ts__btn').addEventListener('click', function(){",
      "  toast.classList.add('show');",
      "  setTimeout(function(){ toast.classList.remove('show'); }, 2000);",
      '});'
    ),
    favorite: false,
  },

  // ===== Bottom Sheet =====
  {
    id: 'sample-c-sheet-basic',
    title: '바텀 시트',
    categoryId: 'seed-component-bottom-sheet',
    description: '하단에서 올라오는 모바일 바텀 시트.',
    tags: ['bottom-sheet', 'mobile'],
    html: j(
      '<button class="bs__open">바텀 시트 열기</button>',
      '<div class="bs" hidden><div class="bs__dim"></div>',
      '  <div class="bs__panel"><span class="bs__grip"></span><h3>옵션 선택</h3><p>내용이 아래에서 올라옵니다.</p></div>',
      '</div>'
    ),
    css: j(
      'body{font-family:sans-serif;} .bs__open{padding:10px 18px;border:none;border-radius:8px;background:#f43f5e;color:#fff;cursor:pointer;}',
      '.bs{ position:fixed; inset:0; } .bs[hidden]{display:none;}',
      '.bs__dim{ position:absolute; inset:0; background:rgba(0,0,0,.4); }',
      '.bs__panel{ position:absolute; left:0; right:0; bottom:0; background:#fff; border-radius:16px 16px 0 0; padding:20px; animation:up .3s ease; }',
      '.bs__grip{ display:block; width:40px; height:4px; background:#ddd; border-radius:2px; margin:0 auto 14px; }',
      '@keyframes up{ from{ transform:translateY(100%);} to{ transform:translateY(0);} }'
    ),
    javascript: j(
      "var bs = document.querySelector('.bs');",
      "document.querySelector('.bs__open').addEventListener('click', function(){ bs.hidden=false; });",
      "document.querySelector('.bs__dim').addEventListener('click', function(){ bs.hidden=true; });"
    ),
    favorite: false,
  },
  {
    id: 'sample-c-sheet-actions',
    title: '액션 시트',
    categoryId: 'seed-component-bottom-sheet',
    description: '여러 액션 버튼이 있는 하단 시트.',
    tags: ['action-sheet', 'mobile'],
    html: j(
      '<button class="as__open">액션 열기</button>',
      '<div class="as" hidden><div class="as__dim"></div>',
      '  <div class="as__panel"><button>공유하기</button><button>수정하기</button><button class="danger">삭제하기</button></div>',
      '</div>'
    ),
    css: j(
      'body{font-family:sans-serif;} .as__open{padding:10px 18px;border:none;border-radius:8px;background:#f43f5e;color:#fff;cursor:pointer;}',
      '.as{ position:fixed; inset:0; } .as[hidden]{display:none;}',
      '.as__dim{ position:absolute; inset:0; background:rgba(0,0,0,.4); }',
      '.as__panel{ position:absolute; left:12px; right:12px; bottom:12px; display:flex; flex-direction:column; gap:1px; background:#eee; border-radius:12px; overflow:hidden; }',
      '.as__panel button{ padding:16px; border:none; background:#fff; cursor:pointer; font-size:15px; }',
      '.as__panel .danger{ color:#dc2626; }'
    ),
    javascript: j(
      "var as = document.querySelector('.as');",
      "document.querySelector('.as__open').addEventListener('click', function(){ as.hidden=false; });",
      "document.querySelector('.as__dim').addEventListener('click', function(){ as.hidden=true; });"
    ),
    favorite: false,
  },

  // ===== Slider / Swiper =====
  {
    id: 'sample-c-slider-dots',
    title: '도트 이미지 슬라이더',
    categoryId: 'seed-component-slider',
    description: '도트 인디케이터로 전환하는 순수 JS 슬라이더.',
    tags: ['slider', 'carousel'],
    html: j(
      '<div class="sl">',
      '  <div class="sl__track" id="track"><div class="sl__s" style="background:#f43f5e">1</div><div class="sl__s" style="background:#f06ba8">2</div><div class="sl__s" style="background:#be123c">3</div></div>',
      '  <div class="sl__dots"><button class="is-active"></button><button></button><button></button></div>',
      '</div>'
    ),
    css: j(
      '.sl{ max-width:360px; font-family:sans-serif; } .sl__track{ display:flex; overflow:hidden; border-radius:12px; }',
      '.sl__s{ min-width:100%; height:160px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:32px; transition:none; }',
      '.sl__track{ scroll-behavior:smooth; } .sl__dots{ display:flex; gap:6px; justify-content:center; margin-top:10px; }',
      '.sl__dots button{ width:8px; height:8px; border-radius:50%; border:none; background:#ddd; cursor:pointer; } .sl__dots button.is-active{ background:#f43f5e; }'
    ),
    javascript: j(
      "var track = document.getElementById('track');",
      "var dots = document.querySelectorAll('.sl__dots button');",
      "dots.forEach(function (d, i) {",
      "  d.addEventListener('click', function () {",
      '    track.style.transform = "translateX(-" + (i * 100) + "%)";',
      "    dots.forEach(function(x){ x.classList.remove('is-active'); });",
      "    d.classList.add('is-active');",
      '  });',
      '});',
      "track.style.transition = 'transform .3s ease';"
    ),
    favorite: false,
  },
  {
    id: 'sample-c-slider-swiper',
    title: 'Swiper 캐러셀',
    categoryId: 'seed-component-slider',
    description: 'Swiper 라이브러리(CDN)를 사용하는 캐러셀.',
    tags: ['swiper', 'carousel', 'cdn'],
    html: j(
      '<div class="swiper">',
      '  <div class="swiper-wrapper">',
      '    <div class="swiper-slide" style="background:#f43f5e">Slide 1</div>',
      '    <div class="swiper-slide" style="background:#f06ba8">Slide 2</div>',
      '    <div class="swiper-slide" style="background:#be123c">Slide 3</div>',
      '  </div>',
      '  <div class="swiper-pagination"></div>',
      '</div>'
    ),
    css: j(
      '.swiper{ width:100%; height:180px; border-radius:12px; } .swiper-slide{ display:flex; align-items:center; justify-content:center; color:#fff; font-size:24px; font-family:sans-serif; }'
    ),
    javascript: j(
      'new Swiper(".swiper", { loop:true, pagination:{ el:".swiper-pagination" } });'
    ),
    dependencies: [
      { name: 'Swiper CSS', url: 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', kind: 'css' },
      { name: 'Swiper JS', url: 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', kind: 'js' },
    ],
    favorite: false,
  },

  // ===== Form =====
  {
    id: 'sample-c-form-login',
    title: '로그인 폼',
    categoryId: 'seed-component-form',
    description: '이메일/비밀번호 입력의 기본 로그인 폼.',
    tags: ['form', 'login', 'auth'],
    html: j(
      '<form class="lf" onsubmit="return false">',
      '  <h3>로그인</h3>',
      '  <label>이메일<input type="email" required></label>',
      '  <label>비밀번호<input type="password" required></label>',
      '  <button type="submit">로그인</button>',
      '</form>'
    ),
    css: j(
      '.lf{ max-width:300px; font-family:sans-serif; display:flex; flex-direction:column; gap:12px; padding:24px; border:1px solid #eee; border-radius:12px; }',
      '.lf h3{ margin:0; } .lf label{ display:flex; flex-direction:column; gap:6px; font-size:13px; color:#555; }',
      '.lf input{ padding:10px; border:1px solid #ddd; border-radius:8px; }',
      '.lf button{ padding:12px; border:none; border-radius:8px; background:#f43f5e; color:#fff; font-weight:600; cursor:pointer; }'
    ),
    javascript: '',
    favorite: false,
  },
  {
    id: 'sample-c-form-toggle',
    title: '토글 스위치',
    categoryId: 'seed-component-form',
    description: 'on/off 상태를 표시하는 토글 스위치.',
    tags: ['form', 'toggle', 'switch'],
    html: j(
      '<label class="sw"><input type="checkbox"><span class="sw__track"></span> 알림 받기</label>'
    ),
    css: j(
      '.sw{ display:inline-flex; align-items:center; gap:10px; font-family:sans-serif; cursor:pointer; }',
      '.sw input{ display:none; } .sw__track{ width:44px; height:24px; border-radius:12px; background:#ccc; position:relative; transition:.2s; }',
      '.sw__track::after{ content:""; position:absolute; top:2px; left:2px; width:20px; height:20px; border-radius:50%; background:#fff; transition:.2s; }',
      '.sw input:checked + .sw__track{ background:#f43f5e; } .sw input:checked + .sw__track::after{ left:22px; }'
    ),
    javascript: '',
    favorite: false,
  },

  // ===== Button =====
  {
    id: 'sample-c-button-outline',
    title: '아웃라인 버튼 세트',
    categoryId: 'seed-component-button',
    description: '채움/외곽선/고스트 3종 버튼.',
    tags: ['button', 'variants'],
    html: j(
      '<div class="bs2"><button class="b b--fill">Fill</button><button class="b b--out">Outline</button><button class="b b--ghost">Ghost</button></div>'
    ),
    css: j(
      '.bs2{ display:flex; gap:10px; font-family:sans-serif; } .b{ padding:10px 18px; border-radius:8px; cursor:pointer; font-weight:600; }',
      '.b--fill{ border:none; background:#f43f5e; color:#fff; }',
      '.b--out{ border:1px solid #f43f5e; background:#fff; color:#f43f5e; }',
      '.b--ghost{ border:none; background:transparent; color:#f43f5e; }'
    ),
    javascript: '',
    favorite: false,
  },
  {
    id: 'sample-c-button-loading',
    title: '로딩 버튼',
    categoryId: 'seed-component-button',
    description: '클릭 시 스피너가 도는 로딩 상태 버튼.',
    tags: ['button', 'loading', 'spinner'],
    html: '<button class="ld">제출</button>',
    css: j(
      '.ld{ display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border:none; border-radius:8px; background:#f43f5e; color:#fff; font-weight:600; cursor:pointer; font-family:sans-serif; }',
      '.ld.is-loading{ opacity:.8; pointer-events:none; }',
      '.ld .sp{ width:14px; height:14px; border:2px solid rgba(255,255,255,.4); border-top-color:#fff; border-radius:50%; animation:spin .6s linear infinite; }',
      '@keyframes spin{ to{ transform:rotate(360deg);} }'
    ),
    javascript: j(
      "var ld = document.querySelector('.ld');",
      "ld.addEventListener('click', function () {",
      "  if (ld.classList.contains('is-loading')) return;",
      "  ld.classList.add('is-loading');",
      "  ld.innerHTML = '<span class=\"sp\"></span> 처리 중';",
      '  setTimeout(function () {',
      "    ld.classList.remove('is-loading'); ld.textContent = '완료!';",
      '  }, 1500);',
      '});'
    ),
    favorite: false,
  },

  // ===== Banner =====
  {
    id: 'sample-c-banner-top',
    title: '상단 공지 배너',
    categoryId: 'seed-component-banner',
    description: '닫기 버튼이 있는 상단 공지 바.',
    tags: ['banner', 'notice'],
    html: j(
      '<div class="nb" id="nb"><span>🎉 신규 가입 시 10% 할인 쿠폰 증정!</span><button class="nb__x" aria-label="닫기">×</button></div>'
    ),
    css: j(
      '.nb{ display:flex; align-items:center; justify-content:center; gap:12px; padding:12px; background:linear-gradient(135deg,#f43f5e,#f06ba8); color:#fff; font-family:sans-serif; position:relative; }',
      '.nb__x{ position:absolute; right:12px; background:none; border:none; color:#fff; font-size:20px; cursor:pointer; }'
    ),
    javascript: "document.querySelector('.nb__x').addEventListener('click', function(){ document.getElementById('nb').style.display='none'; });",
    favorite: false,
  },
  {
    id: 'sample-c-banner-promo',
    title: '프로모션 카드 배너',
    categoryId: 'seed-component-banner',
    description: 'CTA가 포함된 프로모션 배너 카드.',
    tags: ['banner', 'promo', 'cta'],
    html: j(
      '<div class="pb"><div><h3>여름 세일 최대 50%</h3><p>지금 바로 확인하세요.</p></div><a href="#" class="pb__cta">보러가기</a></div>'
    ),
    css: j(
      '.pb{ display:flex; align-items:center; justify-content:space-between; gap:16px; padding:24px; border-radius:14px; background:#fff1f4; font-family:sans-serif; flex-wrap:wrap; }',
      '.pb h3{ margin:0 0 4px; color:#be123c; } .pb p{ margin:0; color:#555; }',
      '.pb__cta{ padding:10px 20px; background:#f43f5e; color:#fff; border-radius:8px; text-decoration:none; font-weight:600; }'
    ),
    javascript: '',
    favorite: false,
  },

  // ===== Animation =====
  {
    id: 'sample-c-anim-fadein',
    title: '페이드인 등장',
    categoryId: 'seed-component-animation',
    description: '스크롤/로드 시 아래에서 떠오르는 등장 애니메이션.',
    tags: ['animation', 'fade'],
    html: '<div class="fi">Fade In Up</div>',
    css: j(
      '.fi{ font-family:sans-serif; padding:40px; text-align:center; background:#fff1f4; border-radius:12px; animation:fiu .6s ease both; }',
      '@keyframes fiu{ from{ opacity:0; transform:translateY(20px);} to{ opacity:1; transform:translateY(0);} }'
    ),
    javascript: '',
    favorite: false,
  },
  {
    id: 'sample-c-anim-pulse',
    title: '펄스 하이라이트',
    categoryId: 'seed-component-animation',
    description: '주목을 끄는 맥박(pulse) 애니메이션 뱃지.',
    tags: ['animation', 'pulse'],
    html: '<span class="pl">NEW</span>',
    css: j(
      '.pl{ display:inline-block; padding:6px 14px; border-radius:20px; background:#f43f5e; color:#fff; font-family:sans-serif; font-weight:700; animation:pulse 1.4s infinite; }',
      '@keyframes pulse{ 0%{ box-shadow:0 0 0 0 rgba(244,63,94,.5);} 70%{ box-shadow:0 0 0 12px rgba(244,63,94,0);} 100%{ box-shadow:0 0 0 0 rgba(244,63,94,0);} }'
    ),
    javascript: '',
    favorite: false,
  },

  // ===== Table =====
  {
    id: 'sample-c-table-basic',
    title: '스트라이프 테이블',
    categoryId: 'seed-component-table',
    description: '줄무늬와 호버 효과가 있는 데이터 테이블.',
    tags: ['table', 'data'],
    html: j(
      '<table class="tb"><thead><tr><th>이름</th><th>역할</th><th>상태</th></tr></thead>',
      '<tbody><tr><td>김하나</td><td>디자이너</td><td>활성</td></tr><tr><td>이두리</td><td>개발자</td><td>활성</td></tr><tr><td>박세찬</td><td>기획자</td><td>휴면</td></tr></tbody></table>'
    ),
    css: j(
      '.tb{ width:100%; border-collapse:collapse; font-family:sans-serif; }',
      '.tb th,.tb td{ padding:12px 14px; text-align:left; border-bottom:1px solid #eee; }',
      '.tb th{ background:#fff1f4; color:#be123c; }',
      '.tb tbody tr:nth-child(even){ background:#fafafa; }',
      '.tb tbody tr:hover{ background:#fff1f4; }'
    ),
    javascript: '',
    favorite: false,
  },
  {
    id: 'sample-c-table-responsive',
    title: '반응형 카드 테이블',
    categoryId: 'seed-component-table',
    description: '좁은 화면에서 카드로 바뀌는 테이블.',
    tags: ['table', 'responsive'],
    html: j(
      '<table class="rt"><thead><tr><th>상품</th><th>가격</th><th>재고</th></tr></thead>',
      '<tbody><tr><td data-l="상품">티셔츠</td><td data-l="가격">19,000원</td><td data-l="재고">120</td></tr>',
      '<tr><td data-l="상품">모자</td><td data-l="가격">15,000원</td><td data-l="재고">40</td></tr></tbody></table>'
    ),
    css: j(
      '.rt{ width:100%; border-collapse:collapse; font-family:sans-serif; } .rt th,.rt td{ padding:12px; border-bottom:1px solid #eee; text-align:left; }',
      '@media(max-width:480px){ .rt thead{ display:none; } .rt tr{ display:block; margin-bottom:12px; border:1px solid #eee; border-radius:8px; } .rt td{ display:flex; justify-content:space-between; border:none; } .rt td::before{ content:attr(data-l); font-weight:600; color:#be123c; } }'
    ),
    javascript: '',
    favorite: false,
  },

  // ===== Navigation =====
  {
    id: 'sample-c-nav-breadcrumb',
    title: '브레드크럼',
    categoryId: 'seed-component-navigation',
    description: '현재 위치를 표시하는 경로 네비게이션.',
    tags: ['navigation', 'breadcrumb'],
    html: j(
      '<nav class="bc"><a href="#">홈</a><span>/</span><a href="#">카테고리</a><span>/</span><b>상세</b></nav>'
    ),
    css: j(
      '.bc{ display:flex; align-items:center; gap:8px; font-family:sans-serif; font-size:14px; color:#888; }',
      '.bc a{ color:#f43f5e; text-decoration:none; } .bc b{ color:#333; }'
    ),
    javascript: '',
    favorite: false,
  },
  {
    id: 'sample-c-nav-pagination',
    title: '페이지네이션',
    categoryId: 'seed-component-navigation',
    description: '페이지 번호 이동 네비게이션.',
    tags: ['navigation', 'pagination'],
    html: j(
      '<nav class="pg"><button>‹</button><button class="is-active">1</button><button>2</button><button>3</button><button>›</button></nav>'
    ),
    css: j(
      '.pg{ display:flex; gap:6px; font-family:sans-serif; } .pg button{ min-width:36px; height:36px; border:1px solid #eee; background:#fff; border-radius:8px; cursor:pointer; }',
      '.pg button.is-active{ background:#f43f5e; color:#fff; border-color:#f43f5e; }'
    ),
    javascript: j(
      "document.querySelectorAll('.pg button').forEach(function(b){",
      "  if(b.textContent.match(/\\d/)) b.addEventListener('click', function(){",
      "    document.querySelectorAll('.pg button').forEach(function(x){x.classList.remove('is-active');});",
      "    this.classList.add('is-active');",
      '  });',
      '});'
    ),
    favorite: false,
  },

  // ===== Utility =====
  {
    id: 'sample-c-util-badge',
    title: '상태 뱃지 세트',
    categoryId: 'seed-component-utility',
    description: '성공/경고/위험 상태 뱃지.',
    tags: ['utility', 'badge'],
    html: j(
      '<div class="bd"><span class="bd__i bd--s">성공</span><span class="bd__i bd--w">대기</span><span class="bd__i bd--d">실패</span></div>'
    ),
    css: j(
      '.bd{ display:flex; gap:8px; font-family:sans-serif; } .bd__i{ padding:4px 10px; border-radius:12px; font-size:12px; font-weight:600; }',
      '.bd--s{ background:#dcfce7; color:#16a34a; } .bd--w{ background:#fef3c7; color:#d97706; } .bd--d{ background:#fee2e2; color:#dc2626; }'
    ),
    javascript: '',
    favorite: false,
  },
  {
    id: 'sample-c-util-tooltip',
    title: '툴팁',
    categoryId: 'seed-component-utility',
    description: '호버 시 설명을 보여주는 CSS 툴팁.',
    tags: ['utility', 'tooltip'],
    html: '<span class="tp" data-tip="추가 설명입니다">마우스를 올려보세요</span>',
    css: j(
      '.tp{ position:relative; border-bottom:1px dashed #f43f5e; cursor:help; font-family:sans-serif; }',
      '.tp::after{ content:attr(data-tip); position:absolute; bottom:130%; left:50%; transform:translateX(-50%); background:#2e1a26; color:#fff; padding:6px 10px; border-radius:6px; font-size:12px; white-space:nowrap; opacity:0; pointer-events:none; transition:.2s; }',
      '.tp:hover::after{ opacity:1; }'
    ),
    javascript: '',
    favorite: false,
  },
];

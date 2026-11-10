/**
 * 요구사항 3-2 / 3-3 / 3-4 의 기본 카테고리.
 * 초기 1회 시드되며, 이후 사용자가 자유롭게 추가/수정/삭제 가능.
 * id 는 'seed-{type}-{slug}' 규칙으로 고정해 재실행 시 중복 삽입을 막는다.
 *
 * @typedef {{ id: string, name: string, type: 'component'|'page'|'snippet' }} DefaultCategorySeed
 * @type {DefaultCategorySeed[]}
 */
export const DEFAULT_CATEGORIES = [
  // UI Components
  { id: 'seed-component-layout', name: 'Layout', type: 'component' },
  { id: 'seed-component-header-nav', name: 'Header / Navigation', type: 'component' },
  { id: 'seed-component-tab', name: 'Tab', type: 'component' },
  { id: 'seed-component-accordion', name: 'Accordion', type: 'component' },
  { id: 'seed-component-modal', name: 'Modal / Popup', type: 'component' },
  { id: 'seed-component-bottom-sheet', name: 'Bottom Sheet', type: 'component' },
  { id: 'seed-component-slider', name: 'Slider / Swiper', type: 'component' },
  { id: 'seed-component-form', name: 'Form', type: 'component' },
  { id: 'seed-component-button', name: 'Button', type: 'component' },
  { id: 'seed-component-banner', name: 'Banner', type: 'component' },
  { id: 'seed-component-animation', name: 'Animation', type: 'component' },
  { id: 'seed-component-table', name: 'Table', type: 'component' },
  { id: 'seed-component-navigation', name: 'Navigation', type: 'component' },
  { id: 'seed-component-utility', name: 'Utility', type: 'component' },

  // Page Templates
  { id: 'seed-page-event', name: 'Event Page', type: 'page' },
  { id: 'seed-page-landing', name: 'Landing Page', type: 'page' },
  { id: 'seed-page-promotion', name: 'Promotion Page', type: 'page' },
  { id: 'seed-page-product-detail', name: 'Product Detail', type: 'page' },
  { id: 'seed-page-main', name: 'Main Page', type: 'page' },
  { id: 'seed-page-sub', name: 'Sub Page', type: 'page' },
  { id: 'seed-page-form', name: 'Form Page', type: 'page' },
  { id: 'seed-page-other', name: 'Other', type: 'page' },

  // Code Snippets
  { id: 'seed-snippet-scroll', name: 'Scroll Event', type: 'snippet' },
  { id: 'seed-snippet-smooth-scroll', name: 'Smooth Scroll', type: 'snippet' },
  { id: 'seed-snippet-tab', name: 'Tab Interaction', type: 'snippet' },
  { id: 'seed-snippet-accordion', name: 'Accordion Interaction', type: 'snippet' },
  { id: 'seed-snippet-modal', name: 'Modal Control', type: 'snippet' },
  { id: 'seed-snippet-bottom-sheet', name: 'Bottom Sheet Control', type: 'snippet' },
  { id: 'seed-snippet-swiper', name: 'Swiper Initialization', type: 'snippet' },
  { id: 'seed-snippet-form-validation', name: 'Form Validation', type: 'snippet' },
  { id: 'seed-snippet-utility', name: 'Common Utility Functions', type: 'snippet' },
];

import { COMPONENT_SAMPLES } from './components';
import { PAGE_SAMPLES } from './pages';
import { SNIPPET_SAMPLES } from './snippets';

/**
 * 그룹별 축약 샘플을 완전한 Template draft 형태로 정규화한다.
 * (각 그룹 파일은 공통 필드를 생략해 간결하게 유지하고,
 *  여기서 type/dependencies/responsive/meta 등을 채운다.)
 */

function normalizeComponent(s) {
  return {
    id: s.id,
    title: s.title,
    type: 'component',
    categoryId: s.categoryId,
    description: s.description || '',
    tags: s.tags || [],
    html: s.html || '',
    css: s.css || '',
    javascript: s.javascript || '',
    dependencies: s.dependencies || [],
    responsive: s.responsive !== undefined ? s.responsive : true,
    favorite: !!s.favorite,
    meta: { kind: 'component', variant: s.variant || '' },
  };
}

function normalizePage(s) {
  return {
    id: s.id,
    title: s.title,
    type: 'page',
    categoryId: s.categoryId,
    description: s.description || '',
    tags: s.tags || [],
    html: s.html || '',
    css: s.css || '',
    javascript: s.javascript || '',
    dependencies: s.dependencies || [],
    responsive: s.responsive !== undefined ? s.responsive : true,
    favorite: !!s.favorite,
    meta: { kind: 'page', usedComponents: s.usedComponents || [] },
  };
}

function normalizeSnippet(s) {
  return {
    id: s.id,
    title: s.title,
    type: 'snippet',
    categoryId: s.categoryId,
    description: s.description || '',
    tags: s.tags || [],
    html: s.html || '',
    css: s.css || '',
    javascript: s.javascript || '',
    dependencies: s.dependencies || [],
    responsive: false,
    favorite: !!s.favorite,
    meta: {
      kind: 'snippet',
      lang: s.lang || 'js',
      usage: s.usage || '',
      trigger: s.trigger || '',
    },
  };
}

/** 모든 카테고리 샘플 (각 기본 카테고리당 2개) */
export const CATEGORY_SAMPLES = [
  ...COMPONENT_SAMPLES.map(normalizeComponent),
  ...PAGE_SAMPLES.map(normalizePage),
  ...SNIPPET_SAMPLES.map(normalizeSnippet),
];

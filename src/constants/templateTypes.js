/** 템플릿 유형 메타 (라벨/라우트/단수 표현) */
export const TEMPLATE_TYPES = {
  component: { label: 'UI Component', route: '/components', noun: '컴포넌트' },
  page: { label: 'Page Template', route: '/pages', noun: '페이지 템플릿' },
  snippet: { label: 'Code Snippet', route: '/snippets', noun: '스니펫' },
};

/** 스니펫 언어 옵션 */
export const SNIPPET_LANGS = [
  { value: 'js', label: 'JavaScript' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
];

/** 빈 템플릿 draft 생성 (폼 초기값) */
export function createEmptyDraft(type, categoryId = '') {
  const base = {
    title: '',
    type,
    categoryId,
    description: '',
    tags: [],
    html: '',
    css: '',
    javascript: '',
    thumbnailAssetId: undefined,
    dependencies: [],
    responsive: true,
    favorite: false,
    meta: undefined,
  };
  if (type === 'page') {
    base.meta = { kind: 'page', usedComponents: [] };
  } else if (type === 'snippet') {
    base.meta = { kind: 'snippet', usage: '', trigger: '', lang: 'js' };
  } else {
    base.meta = { kind: 'component', variant: '' };
  }
  return base;
}

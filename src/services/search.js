/**
 * 템플릿 검색/필터/정렬 로직 (순수 함수, UI 비종속).
 * TemplateManager 와 통합 검색 페이지가 공유한다.
 */

/**
 * @typedef {Object} FilterOptions
 * @property {string} [query]        이름/설명/태그 검색어
 * @property {string} [type]         'component'|'page'|'snippet' | '' (전체)
 * @property {string} [categoryId]   카테고리 id | '' (전체)
 * @property {string} [tech]         'html'|'css'|'js' | '' (보유 코드 유형)
 * @property {boolean} [favoriteOnly]
 * @property {string} [sort]         'updated'|'created'|'title'
 */

/** 템플릿 1건이 검색어에 매칭되는지 */
function matchesQuery(t, q) {
  if (!q) return true;
  const haystack = [t.title, t.description, ...(t.tags || [])]
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

function hasTech(t, tech) {
  if (!tech) return true;
  if (tech === 'html') return !!t.html;
  if (tech === 'css') return !!t.css;
  if (tech === 'js') return !!t.javascript;
  return true;
}

const SORTERS = {
  updated: (a, b) => b.updatedAt - a.updatedAt,
  created: (a, b) => b.createdAt - a.createdAt,
  title: (a, b) => (a.title || '').localeCompare(b.title || '', 'ko'),
};

/**
 * 템플릿 배열에 필터/정렬을 적용해 새 배열을 반환한다.
 * @param {Array} templates
 * @param {FilterOptions} opts
 */
export function filterTemplates(templates, opts = {}) {
  const q = (opts.query || '').trim().toLowerCase();
  const sorter = SORTERS[opts.sort] || SORTERS.updated;

  return templates
    .filter((t) => {
      if (opts.type && t.type !== opts.type) return false;
      if (opts.categoryId && t.categoryId !== opts.categoryId) return false;
      if (opts.favoriteOnly && !t.favorite) return false;
      if (!hasTech(t, opts.tech)) return false;
      if (!matchesQuery(t, q)) return false;
      return true;
    })
    .sort(sorter);
}

export const SORT_OPTIONS = [
  { value: 'updated', label: '최근 수정순' },
  { value: 'created', label: '최근 등록순' },
  { value: 'title', label: '이름순' },
];

export const TECH_OPTIONS = [
  { value: '', label: '전체 기술' },
  { value: 'html', label: 'HTML 포함' },
  { value: 'css', label: 'CSS 포함' },
  { value: 'js', label: 'JS 포함' },
];

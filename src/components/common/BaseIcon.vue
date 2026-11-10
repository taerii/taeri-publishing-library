<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :aria-hidden="title ? 'false' : 'true'"
    :aria-label="title || undefined"
    :role="title ? 'img' : undefined"
  >
    <title v-if="title">{{ title }}</title>
    <path v-for="(d, i) in paths" :key="i" :d="d" />
    <template v-for="(c, i) in circles">
      <circle :key="'c' + i" :cx="c.cx" :cy="c.cy" :r="c.r" />
    </template>
    <template v-for="(l, i) in lines">
      <line :key="'l' + i" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" />
    </template>
    <template v-for="(r, i) in rects">
      <rect
        :key="'r' + i"
        :x="r.x"
        :y="r.y"
        :width="r.width"
        :height="r.height"
        :rx="r.rx"
      />
    </template>
    <template v-for="(p, i) in polylines">
      <polyline :key="'p' + i" :points="p" />
    </template>
  </svg>
</template>

<script>
/**
 * 경량 인라인 SVG 아이콘.
 * lucide 아이콘 path 를 참고해 필요한 아이콘만 자체 정의 (외부 의존성 제거).
 * 24x24 stroke 기반.
 */
const ICONS = {
  dashboard: {
    rects: [
      { x: 3, y: 3, width: 7, height: 9, rx: 1 },
      { x: 14, y: 3, width: 7, height: 5, rx: 1 },
      { x: 14, y: 12, width: 7, height: 9, rx: 1 },
      { x: 3, y: 16, width: 7, height: 5, rx: 1 },
    ],
  },
  component: {
    paths: [
      'M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z',
      'M12 2l3.5 3.5L12 9 8.5 5.5 12 2Z',
      'M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z',
      'M12 15l3.5 3.5L12 22l-3.5-3.5L12 15Z',
    ],
  },
  template: {
    rects: [{ x: 3, y: 3, width: 18, height: 18, rx: 2 }],
    paths: ['M3 9h18', 'M9 21V9'],
  },
  code: {
    polylines: ['16 18 22 12 16 6', '8 6 2 12 8 18'],
  },
  star: {
    paths: [
      'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z',
    ],
  },
  folder: {
    paths: [
      'M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z',
    ],
  },
  settings: {
    circles: [{ cx: 12, cy: 12, r: 3 }],
    paths: [
      'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z',
    ],
  },
  search: {
    circles: [{ cx: 11, cy: 11, r: 8 }],
    lines: [{ x1: 21, y1: 21, x2: 16.65, y2: 16.65 }],
  },
  menu: {
    lines: [
      { x1: 3, y1: 6, x2: 21, y2: 6 },
      { x1: 3, y1: 12, x2: 21, y2: 12 },
      { x1: 3, y1: 18, x2: 21, y2: 18 },
    ],
  },
  close: {
    lines: [
      { x1: 18, y1: 6, x2: 6, y2: 18 },
      { x1: 6, y1: 6, x2: 18, y2: 18 },
    ],
  },
  plus: {
    lines: [
      { x1: 12, y1: 5, x2: 12, y2: 19 },
      { x1: 5, y1: 12, x2: 19, y2: 12 },
    ],
  },
  edit: {
    paths: [
      'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
      'M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z',
    ],
  },
  trash: {
    paths: [
      'M3 6h18',
      'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    ],
    lines: [
      { x1: 10, y1: 11, x2: 10, y2: 17 },
      { x1: 14, y1: 11, x2: 14, y2: 17 },
    ],
  },
  copy: {
    rects: [{ x: 9, y: 9, width: 13, height: 13, rx: 2 }],
    paths: ['M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'],
  },
  check: {
    polylines: ['20 6 9 17 4 12'],
  },
  inbox: {
    paths: [
      'M22 12h-6l-2 3h-4l-2-3H2',
      'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z',
    ],
  },
  'file-question': {
    paths: [
      'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z',
      'M14 2v6h6',
      'M9.5 11.5a2.5 2.5 0 1 1 3 2.5c-.5.2-1 .7-1 1.5',
    ],
    lines: [{ x1: 11.5, y1: 18, x2: 11.51, y2: 18 }],
  },
  info: {
    circles: [{ cx: 12, cy: 12, r: 10 }],
    lines: [
      { x1: 12, y1: 16, x2: 12, y2: 12 },
      { x1: 12, y1: 8, x2: 12.01, y2: 8 },
    ],
  },
  'alert-circle': {
    circles: [{ cx: 12, cy: 12, r: 10 }],
    lines: [
      { x1: 12, y1: 8, x2: 12, y2: 12 },
      { x1: 12, y1: 16, x2: 12.01, y2: 16 },
    ],
  },
  'alert-triangle': {
    paths: [
      'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z',
    ],
    lines: [
      { x1: 12, y1: 9, x2: 12, y2: 13 },
      { x1: 12, y1: 17, x2: 12.01, y2: 17 },
    ],
  },
  'check-circle': {
    paths: ['M22 11.08V12a10 10 0 1 1-5.93-9.14'],
    polylines: ['22 4 12 14.01 9 11.01'],
  },
  library: {
    paths: ['m16 6 4 14', 'M12 6v14', 'M8 8v12', 'M4 4v16'],
  },
};

export default {
  name: 'BaseIcon',
  props: {
    name: { type: String, required: true },
    size: { type: [Number, String], default: 18 },
    strokeWidth: { type: [Number, String], default: 2 },
    title: { type: String, default: '' },
  },
  computed: {
    def() {
      return ICONS[this.name] || {};
    },
    paths() {
      return this.def.paths || [];
    },
    circles() {
      return this.def.circles || [];
    },
    lines() {
      return this.def.lines || [];
    },
    rects() {
      return this.def.rects || [];
    },
    polylines() {
      return this.def.polylines || [];
    },
  },
};
</script>

/**
 * CodeMirror 6 확장 구성 모듈 (프레임워크 비종속).
 * CodeEditor.vue 가 이 모듈로 EditorState 확장을 조립한다.
 *
 * - 번들 최소화를 위해 basicSetup 전체 대신 필요한 확장만 선택.
 * - 언어별 하이라이팅은 html/css/javascript 중 선택.
 */
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import {
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
  syntaxHighlighting,
  defaultHighlightStyle,
  indentUnit,
} from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';

/** 언어 키 → CodeMirror 언어 확장 */
export function languageExtension(lang) {
  switch (lang) {
    case 'html':
      return html();
    case 'css':
      return css();
    case 'js':
    case 'javascript':
      return javascript();
    default:
      return [];
  }
}

/** 공통 에디터 외형 테마 (디자인 토큰과 조화) */
export const editorTheme = EditorView.theme({
  '&': {
    fontSize: 'var(--font-size-sm)',
    height: '100%',
    backgroundColor: 'var(--surface-raised)',
  },
  '.cm-scroller': {
    fontFamily: 'var(--font-mono)',
    lineHeight: 'var(--line-height-relaxed)',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--surface-sunken)',
    color: 'var(--text-muted)',
    border: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--color-brand-50)',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(199, 70, 112, 0.05)',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-content': {
    caretColor: 'var(--color-brand-600)',
  },
});

/**
 * 읽기전용/편집 공통 확장 세트 생성.
 * @param {Object} opts
 * @param {string} opts.lang - 'html'|'css'|'js'
 * @param {boolean} opts.readOnly
 * @param {(value:string)=>void} opts.onChange
 */
export function buildExtensions({ lang, readOnly, onChange }) {
  const extensions = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    history(),
    drawSelection(),
    foldGutter(),
    indentOnInput(),
    indentUnit.of('  '),
    bracketMatching(),
    closeBrackets(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
      indentWithTab,
    ]),
    languageExtension(lang),
    editorTheme,
    EditorView.lineWrapping,
  ];

  if (readOnly) {
    extensions.push(EditorState.readOnly.of(true));
    extensions.push(EditorView.editable.of(false));
  } else {
    extensions.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged && typeof onChange === 'function') {
          onChange(update.state.doc.toString());
        }
      })
    );
  }

  return extensions;
}

export { EditorState, EditorView };

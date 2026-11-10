/**
 * 미리보기용 완전한 HTML 문서를 조립한다.
 *
 * 보안:
 * - 이 문서는 iframe sandbox="allow-scripts" (allow-same-origin 제외)에
 *   srcdoc 으로 주입된다. 따라서 내부 스크립트는 고유(opaque) origin 에서
 *   실행되어 메인 앱의 IndexedDB/localStorage/쿠키에 접근할 수 없다.
 * - 외부 의존성(CDN)은 dependencies 로 받은 것만 head 에 주입한다.
 *
 * @param {Object} t  템플릿 (html/css/javascript/dependencies)
 * @returns {string}  완성된 HTML 문서 문자열
 */
export function buildPreviewDocument(t) {
  const deps = Array.isArray(t.dependencies) ? t.dependencies : [];
  const cssLinks = deps
    .filter((d) => d && d.kind === 'css' && d.url)
    .map((d) => `<link rel="stylesheet" href="${escapeAttr(d.url)}">`)
    .join('\n    ');
  const jsLinks = deps
    .filter((d) => d && d.kind === 'js' && d.url)
    .map((d) => `<script src="${escapeAttr(d.url)}"><\/script>`)
    .join('\n    ');

  const userCss = t.css || '';
  const userHtml = t.html || '';
  const userJs = t.javascript || '';

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${cssLinks}
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif; }
      ${userCss}
    </style>
  </head>
  <body>
    ${userHtml}
    ${jsLinks}
    <script>
      (function () {
        try {
          ${userJs}
        } catch (err) {
          var pre = document.createElement('pre');
          pre.style.cssText = 'color:#dc2626;white-space:pre-wrap;font-family:monospace;font-size:12px;padding:8px;background:#fee2e2;border-radius:6px;margin-top:12px;';
          pre.textContent = '[Preview JS Error] ' + (err && err.message ? err.message : err);
          document.body.appendChild(pre);
        }
      })();
    <\/script>
  </body>
</html>`;
}

function escapeAttr(value) {
  return String(value).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

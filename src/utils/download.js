/** Blob/문자열을 파일로 다운로드 */
export function downloadBlob(data, filename, mimeType = 'application/octet-stream') {
  const blob =
    data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // 다음 틱에 해제 (일부 브라우저 호환)
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** 백업 파일명 생성 (publishing-library-YYYYMMDD-HHmm.ext) */
export function backupFilename(ext) {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(
    d.getHours()
  )}${p(d.getMinutes())}`;
  return `publishing-library-${stamp}.${ext}`;
}

/** 파일 선택 다이얼로그를 열고 File 을 Promise 로 반환 */
export function pickFile(accept) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    if (accept) input.accept = accept;
    input.onchange = () => {
      const file = input.files && input.files[0];
      resolve(file || null);
    };
    input.click();
  });
}

/** File 을 텍스트로 읽기 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

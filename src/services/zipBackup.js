import JSZip from 'jszip';
import { templateRepo, categoryRepo, assetRepo } from '@/db';
import { CURRENT_SCHEMA_VERSION } from '@/constants/schema';
import { BACKUP_FORMAT, importPayload } from './backup';

/**
 * ZIP 백업/복원 서비스.
 *
 * 구조:
 *   data.json        - 템플릿/카테고리/asset 메타 (바이너리 제외)
 *   assets/<id>      - 이미지 Blob 원본 (확장자 없이 id 로 저장)
 *
 * 이미지를 바이너리로 분리 저장해 JSON(base64) 대비 용량 효율을 높인다.
 * 복원 시 data.json + assets 를 합쳐 backup.importPayload 로 병합한다.
 */

const MIME_EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

/** 전체 데이터를 ZIP Blob 으로 생성 */
export async function exportZip() {
  const [templates, categories, assets] = await Promise.all([
    templateRepo.getAll(),
    categoryRepo.getAll(),
    assetRepo.getAll(),
  ]);

  const zip = new JSZip();
  const assetMeta = assets.map((a) => {
    const ext = MIME_EXT[a.mimeType] || 'bin';
    const path = `assets/${a.id}.${ext}`;
    zip.file(path, a.blob);
    return { id: a.id, mimeType: a.mimeType, createdAt: a.createdAt, path };
  });

  const data = {
    format: BACKUP_FORMAT,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: Date.now(),
    templates,
    categories,
    assetMeta,
  };
  zip.file('data.json', JSON.stringify(data, null, 2));

  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

/**
 * ZIP 파일(File/Blob)에서 복원한다.
 * @param {Blob} file
 * @param {'skip'|'overwrite'|'rename'} strategy
 */
export async function importZip(file, strategy = 'skip') {
  const zip = await JSZip.loadAsync(file);
  const dataFile = zip.file('data.json');
  if (!dataFile) {
    throw new Error('유효한 ZIP 백업이 아닙니다 (data.json 없음).');
  }
  const data = JSON.parse(await dataFile.async('string'));

  // assets 재구성: assetMeta.path 의 바이너리를 dataURL 로 변환해
  // backup.importPayload 포맷(assets[].dataUrl)에 맞춘다.
  const assets = [];
  for (const meta of data.assetMeta || []) {
    const entry = zip.file(meta.path);
    if (!entry) continue;
    const blob = await entry.async('blob');
    const typedBlob = blob.type
      ? blob
      : new Blob([blob], { type: meta.mimeType });
    assets.push({
      id: meta.id,
      mimeType: meta.mimeType,
      createdAt: meta.createdAt,
      dataUrl: await blobToDataUrl(typedBlob),
    });
  }

  const payload = {
    format: data.format,
    schemaVersion: data.schemaVersion,
    templates: data.templates,
    categories: data.categories,
    assets,
  };

  return importPayload(payload, strategy);
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

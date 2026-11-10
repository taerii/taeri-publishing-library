import { templateRepo, categoryRepo, assetRepo, db } from '@/db';
import { CURRENT_SCHEMA_VERSION } from '@/constants/schema';

export const BACKUP_FORMAT = 'publishing-library-backup';

/**
 * 백업/복원 서비스.
 *
 * 설계:
 * - JSON 백업: 템플릿/카테고리 + 이미지(assets)를 하나의 직렬화 payload 로.
 *   Blob 은 JSON 에 담을 수 없으므로 dataURL(base64)로 변환해 포함한다.
 * - ZIP 백업(zipBackup.js): 이미지를 바이너리 파일로 분리 저장 (대용량 효율).
 * - 복원 시 ID 충돌 처리: 'skip' | 'overwrite' | 'rename' 전략 지원.
 * - 스키마 버전을 payload 에 기록해 향후 마이그레이션 가능.
 */

/** 현재 DB 전체를 직렬화 가능한 payload 객체로 수집 (assets 는 dataURL) */
export async function collectBackupPayload() {
  const [templates, categories, assets] = await Promise.all([
    templateRepo.getAll(),
    categoryRepo.getAll(),
    assetRepo.getAll(),
  ]);

  const serializedAssets = await Promise.all(
    assets.map(async (a) => ({
      id: a.id,
      mimeType: a.mimeType,
      createdAt: a.createdAt,
      dataUrl: await blobToDataUrl(a.blob),
    }))
  );

  return {
    format: BACKUP_FORMAT,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: Date.now(),
    templates,
    categories,
    assets: serializedAssets,
  };
}

/** payload → JSON 문자열 */
export async function exportJson() {
  const payload = await collectBackupPayload();
  return JSON.stringify(payload, null, 2);
}

/** payload 유효성 검사 */
export function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('백업 데이터 형식이 올바르지 않습니다.');
  }
  if (payload.format !== BACKUP_FORMAT) {
    throw new Error('이 앱의 백업 파일이 아닙니다.');
  }
  if (!Array.isArray(payload.templates) || !Array.isArray(payload.categories)) {
    throw new Error('백업 데이터에 필수 항목이 없습니다.');
  }
  return true;
}

/**
 * payload 를 DB 에 병합한다.
 * @param {Object} payload
 * @param {'skip'|'overwrite'|'rename'} strategy - ID 충돌 처리 전략
 * @returns {Promise<{templates:{added:number,skipped:number,overwritten:number,renamed:number}, categories:{...}}>}
 */
export async function importPayload(payload, strategy = 'skip') {
  validatePayload(payload);

  // assets 역직렬화 (dataURL → Blob)
  const assetRecords = await Promise.all(
    (payload.assets || []).map(async (a) => ({
      id: a.id,
      mimeType: a.mimeType,
      createdAt: a.createdAt || Date.now(),
      blob: await dataUrlToBlob(a.dataUrl),
    }))
  );

  const result = {
    templates: { added: 0, skipped: 0, overwritten: 0, renamed: 0 },
    categories: { added: 0, skipped: 0, overwritten: 0, renamed: 0 },
  };

  await db.transaction(
    'rw',
    db.templates,
    db.categories,
    db.assets,
    async () => {
      // 카테고리 병합
      const existingCatIds = new Set(
        (await categoryRepo.getAll()).map((c) => c.id)
      );
      const catsToPut = [];
      for (const cat of payload.categories) {
        applyMerge(cat, existingCatIds, strategy, result.categories, catsToPut);
      }
      await categoryRepo.bulkPut(catsToPut);

      // 템플릿 병합
      const existingTplIds = new Set(
        (await templateRepo.getAll()).map((t) => t.id)
      );
      const tplsToPut = [];
      for (const tpl of payload.templates) {
        applyMerge(tpl, existingTplIds, strategy, result.templates, tplsToPut);
      }
      await templateRepo.bulkPut(tplsToPut);

      // assets 는 항상 put (id 동일하면 덮어씀)
      if (assetRecords.length) await assetRepo.bulkPut(assetRecords);
    }
  );

  return result;
}

/** 단일 레코드에 충돌 전략 적용 후 put 목록에 추가 */
function applyMerge(record, existingIds, strategy, counter, putList) {
  const clone = { ...record };
  if (!existingIds.has(clone.id)) {
    putList.push(clone);
    counter.added += 1;
    existingIds.add(clone.id);
    return;
  }
  // 충돌
  if (strategy === 'skip') {
    counter.skipped += 1;
  } else if (strategy === 'overwrite') {
    putList.push(clone);
    counter.overwritten += 1;
  } else if (strategy === 'rename') {
    clone.id = generateUniqueId(clone.id, existingIds);
    putList.push(clone);
    existingIds.add(clone.id);
    counter.renamed += 1;
  }
}

function generateUniqueId(baseId, existingIds) {
  let i = 2;
  let next = `${baseId}-${i}`;
  while (existingIds.has(next)) {
    i += 1;
    next = `${baseId}-${i}`;
  }
  return next;
}

// ---- Blob <-> dataURL 변환 ----
export function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}

import { db } from './database';
import { DEFAULT_CATEGORIES } from '@/constants/defaultCategories';
import { SAMPLE_TEMPLATES } from '@/constants/sampleTemplates';
import { CURRENT_SCHEMA_VERSION } from '@/constants/schema';

const SEED_FLAG_KEY = 'seeded:default-categories';
const SAMPLE_FLAG_KEY = 'seeded:sample-templates';
const SCHEMA_VERSION_KEY = 'schema:version';

/**
 * 최초 1회 기본 카테고리 + 샘플 템플릿을 시드한다.
 * - meta 플래그로 재실행 시 중복 삽입 방지.
 * - 고정 id(seed-*, sample-*) 를 사용하므로 개별 중복도 2차로 방지.
 */
export async function ensureSeedData() {
  await db.transaction('rw', db.categories, db.templates, db.meta, async () => {
    const now = Date.now();

    // 1) 기본 카테고리
    const seeded = await db.meta.get(SEED_FLAG_KEY);
    if (!(seeded && seeded.value === true)) {
      const existingIds = new Set(
        (await db.categories.toArray()).map((c) => c.id)
      );
      const toInsert = DEFAULT_CATEGORIES.filter(
        (seed) => !existingIds.has(seed.id)
      ).map((seed, index) => ({
        id: seed.id,
        name: seed.name,
        type: seed.type,
        isDefault: true,
        order: index,
        createdAt: now,
        updatedAt: now,
      }));
      if (toInsert.length > 0) await db.categories.bulkAdd(toInsert);
      await db.meta.put({ key: SEED_FLAG_KEY, value: true });
    }

    // 2) 샘플 템플릿
    //    "아직 없는 샘플 id 만" 보충한다. 사용자가 삭제한 샘플은 되살리지 않도록
    //    seenList(한 번이라도 시드한 id 목록)를 기록해 제외한다.
    //    → 신규 샘플을 추가하면 기존 사용자도 초기화 없이 받고,
    //      사용자가 지운 샘플은 다시 생기지 않는다.
    const seenRec = await db.meta.get(SAMPLE_FLAG_KEY);
    const alreadySeeded = Array.isArray(seenRec && seenRec.value)
      ? seenRec.value
      : [];
    const seenSet = new Set(alreadySeeded);

    const existingTplIds = new Set(
      (await db.templates.toArray()).map((t) => t.id)
    );
    const tpls = SAMPLE_TEMPLATES.filter(
      (s) => !existingTplIds.has(s.id) && !seenSet.has(s.id)
    ).map((s) => ({
      ...s,
      createdAt: now,
      updatedAt: now,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    }));
    if (tpls.length > 0) await db.templates.bulkAdd(tpls);

    // 전체 샘플 id 를 seen 으로 기록 (이후 삭제해도 재생성 안 함)
    const allSampleIds = SAMPLE_TEMPLATES.map((s) => s.id);
    await db.meta.put({ key: SAMPLE_FLAG_KEY, value: allSampleIds });

    await db.meta.put({ key: SCHEMA_VERSION_KEY, value: CURRENT_SCHEMA_VERSION });
  });
}

/**
 * 전체 데이터 초기화: 모든 테이블을 비우고 기본 카테고리를 다시 시드한다.
 * (데이터 초기화 메뉴용 — 되돌릴 수 없으므로 UI 에서 2단계 확인 후 호출)
 */
export async function resetAllData() {
  await db.transaction(
    'rw',
    db.templates,
    db.categories,
    db.assets,
    db.meta,
    async () => {
      await db.templates.clear();
      await db.categories.clear();
      await db.assets.clear();
      await db.meta.clear();
    }
  );
  await ensureSeedData();
}

/** 저장된 스키마 버전 조회 (마이그레이션 판단용) */
export async function getStoredSchemaVersion() {
  const rec = await db.meta.get(SCHEMA_VERSION_KEY);
  return rec && typeof rec.value === 'number' ? rec.value : 0;
}

import { db } from '../database';
import { createId } from '@/utils/id';
import { CURRENT_SCHEMA_VERSION } from '@/constants/schema';

/**
 * 템플릿 데이터 접근 계층.
 * UI/스토어는 DB 를 직접 다루지 않고 이 repository 를 통해서만 접근한다.
 */
export const templateRepo = {
  async getAll() {
    return db.templates.toArray();
  },

  async getById(id) {
    return db.templates.get(id);
  },

  async getByType(type) {
    return db.templates.where('type').equals(type).toArray();
  },

  async getFavorites() {
    return db.templates.filter((t) => t.favorite === true).toArray();
  },

  async countByType(type) {
    return db.templates.where('type').equals(type).count();
  },

  async countAll() {
    return db.templates.count();
  },

  async countFavorites() {
    return db.templates.filter((t) => t.favorite === true).count();
  },

  async create(draft) {
    const now = Date.now();
    const template = {
      ...draft,
      id: createId(),
      createdAt: now,
      updatedAt: now,
      schemaVersion: CURRENT_SCHEMA_VERSION,
    };
    await db.templates.add(template);
    return template;
  },

  async update(id, patch) {
    const existing = await db.templates.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch, updatedAt: Date.now() };
    await db.templates.put(updated);
    return updated;
  },

  async toggleFavorite(id) {
    const existing = await db.templates.get(id);
    if (!existing) return undefined;
    const favorite = !existing.favorite;
    await db.templates.update(id, { favorite, updatedAt: Date.now() });
    return favorite;
  },

  async remove(id) {
    const t = await db.templates.get(id);
    await db.transaction('rw', db.templates, db.assets, async () => {
      await db.templates.delete(id);
      if (t && t.thumbnailAssetId) {
        await db.assets.delete(t.thumbnailAssetId);
      }
    });
  },

  /** 백업 복원용 일괄 저장 (덮어쓰기 포함) */
  async bulkPut(templates) {
    if (!templates || !templates.length) return;
    await db.templates.bulkPut(templates);
  },

  /** 전체 삭제 (데이터 초기화용) */
  async clear() {
    await db.templates.clear();
  },

  /** 특정 카테고리를 쓰는 템플릿 개수 (카테고리 삭제 보호용) */
  async countByCategory(categoryId) {
    return db.templates.where('categoryId').equals(categoryId).count();
  },

  /** 카테고리 삭제 시 소속 템플릿을 다른 카테고리로 이전 */
  async reassignCategory(fromCategoryId, toCategoryId) {
    const affected = await db.templates
      .where('categoryId')
      .equals(fromCategoryId)
      .toArray();
    const now = Date.now();
    await db.templates.bulkPut(
      affected.map((t) => ({ ...t, categoryId: toCategoryId, updatedAt: now }))
    );
    return affected.length;
  },
};

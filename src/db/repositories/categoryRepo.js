import { db } from '../database';
import { createId } from '@/utils/id';

/**
 * 카테고리 데이터 접근 계층.
 */
export const categoryRepo = {
  async getAll() {
    return db.categories.orderBy('order').toArray();
  },

  async getByType(type) {
    const list = await db.categories.where('type').equals(type).toArray();
    return list.sort((a, b) => a.order - b.order);
  },

  async getById(id) {
    return db.categories.get(id);
  },

  async create(draft) {
    const now = Date.now();
    const count = await db.categories.where('type').equals(draft.type).count();
    const category = {
      ...draft,
      id: createId(),
      isDefault: false,
      order: count,
      createdAt: now,
      updatedAt: now,
    };
    await db.categories.add(category);
    return category;
  },

  async update(id, patch) {
    const existing = await db.categories.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch, updatedAt: Date.now() };
    await db.categories.put(updated);
    return updated;
  },

  async remove(id) {
    await db.categories.delete(id);
  },

  /** 백업 복원용 일괄 저장 (덮어쓰기 포함) */
  async bulkPut(categories) {
    if (!categories || !categories.length) return;
    await db.categories.bulkPut(categories);
  },

  /** 전체 삭제 (데이터 초기화용) */
  async clear() {
    await db.categories.clear();
  },
};

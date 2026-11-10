import { db } from '../database';
import { createId } from '@/utils/id';

/**
 * 이미지 등 바이너리(Blob) 저장 계층.
 * 썸네일은 여기에 저장하고 템플릿에는 assetId 만 참조로 보관.
 */
export const assetRepo = {
  async create(blob) {
    const asset = {
      id: createId(),
      blob,
      mimeType: blob.type || 'application/octet-stream',
      createdAt: Date.now(),
    };
    await db.assets.add(asset);
    return asset;
  },

  async getById(id) {
    return db.assets.get(id);
  },

  async getAll() {
    return db.assets.toArray();
  },

  async bulkPut(assets) {
    if (!assets || !assets.length) return;
    await db.assets.bulkPut(assets);
  },

  async remove(id) {
    await db.assets.delete(id);
  },
};

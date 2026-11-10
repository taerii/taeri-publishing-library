import Dexie from 'dexie';

/**
 * Publishing Library 로컬 데이터베이스 (IndexedDB / Dexie).
 *
 * 설계 원칙
 * - 대용량 코드/이미지는 전부 IndexedDB 에 저장 (localStorage 미사용).
 * - 이미지 등 바이너리는 assets 테이블에 Blob 으로 분리 저장.
 * - 스키마 변경 시 version() 을 올리고 upgrade 콜백으로 마이그레이션.
 */
export const db = new Dexie('publishing-library');

// ---- Schema v1 ----
// 인덱스: 검색/필터/정렬에 쓰이는 필드만 선언 (*tags 는 멀티엔트리).
db.version(1).stores({
  templates: 'id, type, categoryId, favorite, updatedAt, createdAt, *tags',
  categories: 'id, type, name, order',
  assets: 'id, createdAt',
  meta: 'key',
});

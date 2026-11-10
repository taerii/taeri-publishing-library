/**
 * 데이터 스키마 버전.
 * 데이터 구조 변경 시 이 값을 올리고 db/migrations 처리를 추가한다.
 */
export const CURRENT_SCHEMA_VERSION = 1;

/**
 * @typedef {Object} Template
 * @property {string} id
 * @property {string} title
 * @property {'component'|'page'|'snippet'} type
 * @property {string} categoryId
 * @property {string} description
 * @property {string[]} tags
 * @property {string} html
 * @property {string} css
 * @property {string} javascript
 * @property {string} [thumbnailAssetId]
 * @property {{name:string,url:string,kind:'js'|'css'}[]} dependencies
 * @property {boolean} responsive
 * @property {boolean} favorite
 * @property {number} createdAt
 * @property {number} updatedAt
 * @property {number} schemaVersion
 * @property {Object} [meta]
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {'component'|'page'|'snippet'} type
 * @property {boolean} isDefault
 * @property {number} order
 * @property {number} createdAt
 * @property {number} updatedAt
 */

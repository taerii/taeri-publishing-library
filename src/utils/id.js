import { v4 as uuidv4 } from 'uuid';

/** 고유 식별자 생성 */
export function createId() {
  return uuidv4();
}

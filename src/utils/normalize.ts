import { arrayify } from './arrayify';
import { Config } from './config';

export function normalize(labelConfig: Config[keyof Config]): { head: string[]; base: string[] } {
  if (typeof labelConfig === 'string' || Array.isArray(labelConfig)) {
    return { head: arrayify(labelConfig), base: [] };
  } else {
    return { head: arrayify(labelConfig.head), base: arrayify(labelConfig.base) };
  }
}

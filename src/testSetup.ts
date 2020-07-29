import { appHandle } from './index';

export default function setup() {
  (global as any).appHandle = appHandle;
}

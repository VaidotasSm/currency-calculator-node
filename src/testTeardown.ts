export default function teardown() {
  (global as any).appHandle.close();
}

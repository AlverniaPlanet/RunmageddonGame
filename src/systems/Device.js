export function useTouchInstructions(scene) {
  const device = scene?.sys?.game?.device;
  if (device?.os?.desktop === false) {
    return true;
  }

  if (device?.input?.touch) {
    return true;
  }

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return true;
    }
    if (window.matchMedia('(max-width: 900px)').matches) {
      return true;
    }
  }

  return false;
}

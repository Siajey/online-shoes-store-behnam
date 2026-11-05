/** رویداد «نشست از دست رفت» (refresh هم شکست خورد). فیچر ورود به آن گوش می‌دهد تا lib/api به UI وابسته نشود. */
type Listener = () => void;

const listeners = new Set<Listener>();

export function onAuthLost(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitAuthLost(): void {
  listeners.forEach((l) => l());
}

export function Pill({ tone, children }) {
  return <span className={`pill ${tone.toLowerCase().replace(' ', '-')}`}>{children}</span>;
}

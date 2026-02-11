export function ScanLine() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
      <div className="absolute inset-x-0 h-[200px] bg-gradient-to-b from-accent-cyan/20 via-accent-cyan/5 to-transparent animate-scan-line" />
    </div>
  );
}

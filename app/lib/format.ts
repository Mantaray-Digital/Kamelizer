export function egp(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toLocaleString("en-EG", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })} EGP`;
}

export function eta(date?: number | null): string {
  if (!date) return "—";
  const d = new Date(date);
  const mins = Math.max(0, Math.round((d.getTime() - Date.now()) / 60_000));
  if (mins === 0) return "any minute";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

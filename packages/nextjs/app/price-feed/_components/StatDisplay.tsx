export function StatDisplay({
  title = "N/A",
  value = "N/A",
}: {
  title: string | undefined;
  value: string | undefined;
}) {
  return (
    <div className="stats bg-secondary shadow-lg">
      <div className="stat">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value?: number;
  loading: boolean;
  icon: React.ReactNode;
};

const StatCard = ({ label, value, loading, icon }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-violet-500/40">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-400">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold text-white">
        {loading ? "—" : value}
      </p>
    </div>
  );
};

export default StatCard;

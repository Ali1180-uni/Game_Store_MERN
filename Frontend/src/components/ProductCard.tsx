type ProductCardProps = {
  Title: string;
  Price: number;
  img: string;
};

const ProductCard = ({ Title, Price, img }: ProductCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]">
      <div className="relative aspect-square overflow-hidden bg-neutral-950">
        <img
          src={img}
          alt={Title}
          className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-violet-400">
          {Title}
        </h3>
        <p className="mt-1 text-base font-bold text-neutral-300">
          ${Price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
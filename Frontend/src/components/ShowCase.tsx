interface ShowcaseItem {
  id: string;
  image: string;
  name: string;
}

interface ShowCaseProps {
  games: ShowcaseItem[];
  accessories: ShowcaseItem[];
}

const MarqueeRow = ({items,direction}: {
  items: ShowcaseItem[];
  direction: "left" | "right";
}) => {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-linear-to-r from-neutral-950 to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-linear-to-l from-neutral-950 to-transparent z-10" />

      <div
        className={`flex gap-5 w-max ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="w-32 h-44 md:w-40 md:h-52 rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur overflow-hidden shrink-0 hover:border-neutral-600 transition-colors"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ShowCase({ games, accessories }: ShowCaseProps) {
  return (
    <section className="w-full bg-neutral-950 py-20 overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <p className="text-blue-400 text-xs font-medium tracking-[0.2em] uppercase mb-2">
          Games
        </p>
      </div>
      <MarqueeRow items={games} direction="left" />

      <div className="h-8 md:h-10" />

      <MarqueeRow items={accessories} direction="right" />
      <div className="container mx-auto px-6 mt-4">
        <p className="text-purple-400 text-xs font-medium tracking-[0.2em] uppercase text-right">
          Accessories
        </p>
      </div>
    </section>
  );
}
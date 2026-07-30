import { useMemo, useState } from "react";
import SearchBar from "./searchBar";
import games from "../../public/images/Games/data.json";
import ProductCard from "./ProductCard";
import { NavLink } from "react-router-dom";

const Games = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGames = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return games;
    return games.filter((game) => game.title.toLowerCase().includes(query));
  }, [searchTerm]);

  return (
    <div>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
        {filteredGames.map((game) => (
          <NavLink to={`/Product/${game.id}`}>
            <ProductCard
              key={game.id}
              Title={game.title}
              Price={game.price}
              img={game.image}
            />
          </NavLink>
        ))}
      </section>

      {filteredGames.length === 0 && (
        <p className="py-16 text-center text-sm text-neutral-500">
          No games found for "{searchTerm}".
        </p>
      )}
    </div>
  );
};

export default Games;

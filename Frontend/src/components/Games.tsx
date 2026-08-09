import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "./searchBar";
import ProductCard from "./ProductCard";
import { NavLink } from "react-router-dom";
import { fetchProducts } from "../Api/Products.api";

type Game = {
  _id: string;
  title: string;
  price: number;
  image: string;
};  

const Games = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: games = [], isLoading, isError } = useQuery({
    queryKey: ["products", "Game"],
    queryFn: () => fetchProducts("Game"),
  });

  const filteredGames = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return games;
    return games.filter((game: Game) =>
      game.title.toLowerCase().includes(query)
    );
  }, [searchTerm, games]);

  return (
    <div>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {isLoading && (
        <p className="py-16 text-center text-sm text-neutral-500">
          Loading games...
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-red-500">
          Couldn't load games. Try again later.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          <section className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
            {filteredGames.map((game: Game) => (
              <NavLink key={game._id} to={`/Product/${game._id}`}>
                <ProductCard
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
        </>
      )}
    </div>
  );
};

export default Games;
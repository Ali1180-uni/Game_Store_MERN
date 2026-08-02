import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "./searchBar";
import ProductCard from "./ProductCard";
import { NavLink } from "react-router-dom";
import { fetchProducts } from "../Api/api";

type Accessory = {
  _id: string;
  title: string;
  price: number;
  image: string;
};

const Accessories = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: accessories = [], isLoading, isError } = useQuery({
    queryKey: ["products", "Accessory"],
    queryFn: () => fetchProducts("Accessory"),
  });

  const filteredAccessories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return accessories;
    return accessories.filter((accessory: Accessory) =>
      accessory.title.toLowerCase().includes(query)
    );
  }, [searchTerm, accessories]);

  return (
    <div>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {isLoading && (
        <p className="py-16 text-center text-sm text-neutral-500">
          Loading accessories...
        </p>
      )}

      {isError && (
        <p className="py-16 text-center text-sm text-red-500">
          Couldn't load accessories. Try again later.
        </p>
      )}

      {!isLoading && !isError && (
        <>
          <section className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
            {filteredAccessories.map((accessory: Accessory) => (
              <NavLink key={accessory._id} to={`/Product/${accessory._id}`}>
                <ProductCard
                  Title={accessory.title}
                  Price={accessory.price}
                  img={accessory.image}
                />
              </NavLink>
            ))}
          </section>

          {filteredAccessories.length === 0 && (
            <p className="py-16 text-center text-sm text-neutral-500">
              No accessories found for "{searchTerm}".
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Accessories;
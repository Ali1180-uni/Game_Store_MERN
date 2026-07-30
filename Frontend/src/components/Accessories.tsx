import { useMemo, useState } from "react";
import SearchBar from "./searchBar";
import accessories from "../../public/images/Accessories/data.json";
import ProductCard from "./ProductCard";
import { NavLink } from "react-router-dom";

const Accessories = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAccessories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return accessories;
    return accessories.filter((accessory) =>
      accessory.title.toLowerCase().includes(query),
    );
  }, [searchTerm]);

  return (
    <div>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
        {filteredAccessories.map((accessory) => (
          <NavLink to={`/Product/${accessory.id}`}>
            <ProductCard
              key={accessory.id}
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
    </div>
  );
};

export default Accessories;

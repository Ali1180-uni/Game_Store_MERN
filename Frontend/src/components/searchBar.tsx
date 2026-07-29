import SearchIcon from "@mui/icons-material/Search";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="sticky top-20 z-40 flex justify-center bg-transparent p-4">
      <section className="flex w-full max-w-xl items-center gap-4 rounded-full border border-neutral-700 bg-neutral-900 px-5 py-2.5 transition-all duration-300 focus-within:border-violet-500 focus-within:shadow-[0_0_0_4px_rgba(139,92,246,0.15),0_0_24px_rgba(139,92,246,0.25)] hover:border-neutral-500 mx-4">
        <SearchIcon className="text-white" />
        <input
          type="text"
          placeholder="Search games..."
          className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </section>
    </div>
  );
};

export default SearchBar;
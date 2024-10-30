import React, { Dispatch, SetStateAction } from "react";
import "./Searchbar.css";

interface SearchbarProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

const Searchbar: React.FC<SearchbarProps> = ({ query, setQuery }) => {
  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      ></input>
    </div>
  );
};

export default Searchbar;

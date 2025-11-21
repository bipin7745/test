
import AddBook from "./AddUser";

function SearchBar({ searchQuery, setSearchQuery, handleSearch, refresUser }) {
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  return (
    <div className="d-flex align-items-center" style={{ gap: "10px" }}>
      <input
        type="text"
        className="form-control"
        placeholder="Search by name, age, or city..."
        value={searchQuery}
        onChange={handleChange}
        style={{
          height: "45px",
          width: "300px",
          fontSize: "16px",
        }}
      />
      <div style={{ height: "45px" }}>
       <AddBook/>
      </div>
    </div>
  );
}

export default SearchBar;

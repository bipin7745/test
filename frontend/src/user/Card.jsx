import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import backend_url from "../api_url";

export default function BookCardList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch all books from backend
  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${backend_url}/books`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();
    if (!lowerSearch) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerSearch) ||
          book.author.toLowerCase().includes(lowerSearch) ||
          book.genre.toLowerCase().includes(lowerSearch)
      );
      setFilteredBooks(filtered);
    }
  }, [books, searchTerm]);

  const handleBookClick = (id) => {
    navigate(`/books/${id}`);
  };

  return (
    <div className="container mt-5  pt-5">
   
      <h2 className="mb-4 text-center mt-5">All Books</h2>

      <div className="d-flex justify-content-center mb-5 py-3">
        <input
          type="text"
          className="form-control w-50 shadow-sm"
          style={{
            borderRadius: "25px",
            padding: "10px 20px",
            fontSize: "16px",
          }}
          placeholder=" Search by title, author, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <p className="text-center">No books found</p>
      ) : (
        <div className="row g-4">
          {filteredBooks.map((book) => (
            <div className="col-md-3 col-sm-6" key={book._id}>
              <div className="card h-100 shadow-sm border-0 rounded-3">
                {book.imageUrl ? (
                  <img
                    src={`${backend_url}${book.imageUrl}`}
                    className="card-img-top"
                    alt={book.title}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      cursor: "pointer",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                    onClick={() => handleBookClick(book._id)}
                  />
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center bg-secondary text-white"
                    style={{
                      height: "200px",
                      cursor: "pointer",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                    onClick={() => handleBookClick(book._id)}
                  >
                    No Image
                  </div>
                )}

                <div className="card-body d-flex flex-column text-center">
                  <h5
                    className="card-title text-truncate mb-2"
                    onClick={() => handleBookClick(book._id)}
                    style={{ cursor: "pointer", fontWeight: "600" }}
                  >
                    {book.title}
                  </h5>
                  <p className="card-text mb-1">
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Genre:</strong> {book.genre}
                  </p>
                  <p className="card-text">
                    <strong>Year:</strong> {book.year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

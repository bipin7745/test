import React, { useEffect, useState } from "react";
import axios from "axios";
import AddBook from "./AddBook";
import EditBook from "./EditBook";
import DeleteBook from "./DeleteBook"; 
import backend_url from "../api_url";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa"; 

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBookId, setDeletingBookId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

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

  const openDeleteModal = (id) => {
    setDeletingBookId(id);
  };

  const closeDeleteModal = () => {
    setDeletingBookId(null);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const closeEditModal = () => {
    setEditingBook(null);
  };



  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Book List</h2>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by Title or Author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AddBook refreshBooks={fetchBooks} />
        </div>
      </div>

       <div className="container-fluid mt-4">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading...</p>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered table-striped align-middle text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th scope="col">No</th>
                <th scope="col">book Image</th>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Genre</th>
                <th scope="col">Year</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4">
                    No books found
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book, index) => (
                  <tr key={book._id}>
                    <td>{index + 1}</td>
                     <td>
                    {book.imageUrl ? (
                      <img
                        src={`${backend_url}${book.imageUrl}`}
                        alt={book.title}
                        style={{ width: "70px", height: "90px", objectFit: "cover" }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                    <td className="text-break">{book.title}</td>
                    <td className="text-break">{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.year}</td>
                    <td>
                      <div className="d-flex justify-content-center flex-wrap gap-2">
                        
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleEdit(book)}
                          title="Edit Book"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => openDeleteModal(book._id)}
                          title="Delete Book"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>

      {editingBook && (
        <EditBook
          book={editingBook}
          refreshBooks={fetchBooks}
          closeModal={closeEditModal}
        />
      )}

      {deletingBookId && (
        <DeleteBook
          bookId={deletingBookId}
          onClose={closeDeleteModal}
          refreshBooks={fetchBooks}
        />
      )}
    </div>
  );
}

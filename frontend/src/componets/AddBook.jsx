import { useState } from "react";
import axios from "axios";
import backend_url from "../api_url";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddBook.css";

export default function AddBook({ refreshBooks }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    if (!title || !author || !genre || !year)
      return toast.error("All fields required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("genre", genre);
    formData.append("year", year);
    if (image) formData.append("image", image);

    try {
      await axios.post(`${backend_url}/books`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Book added successfully!");
      setTitle("");
      setAuthor("");
      setGenre("");
      setYear("");
      setImage(null);
      setShowModal(false);
      refreshBooks();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add book");
    }
  };

  return (
    <>
      <button className="btn btn-success" onClick={() => setShowModal(true)}>
        Add Book
      </button>

      {showModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <h2>Add Book</h2>
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
            <input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
            <input placeholder="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

            <div className="mt-2">
              <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

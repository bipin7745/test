import React, { useState } from "react";
import axios from "axios";
import backend_url from "../api_url";
import { toast } from "react-toastify";

export default function EditBook({ book, refreshBooks, closeModal }) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre);
  const [year, setYear] = useState(book.year);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(book.imageUrl || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("genre", genre);
      formData.append("year", year);
      if (image) formData.append("image", image);

      await axios.put(`${backend_url}/books/${book._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Book updated successfully");
      refreshBooks();
      closeModal();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update book");
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleUpdate}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Book</h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
              />
              <input
                type="text"
                className="form-control mb-2"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
                required
              />
              <input
                type="text"
                className="form-control mb-2"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Genre"
                required
              />
              <input
                type="number"
                className="form-control mb-2"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year"
                required
              />

              <input
                type="file"
                className="form-control mb-2"
                accept="image/*"
                onChange={handleImageChange}
              />
              {preview && (
                <img
                  src={
                    image
                      ? preview
                      : `${backend_url}${preview}`
                  }
                  alt="Preview"
                  className="img-thumbnail"
                  style={{ width: "120px", marginTop: "10px" }}
                />
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

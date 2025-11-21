import React from "react";
import axios from "axios";
import backend_url from "../api_url";
import { toast } from "react-toastify";

export default function DeleteBook({ bookId, onClose, refreshBooks }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`${backend_url}/books/${bookId}`);
      toast.success("Book deleted successfully!");
      refreshBooks();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="custom-modal">
      <div className="custom-modal-content">
        <h2>Confirm Delete </h2>
        <p>Are You sure you want to delete this book?</p>
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import backend_url from "../api_url";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdStar } from "react-icons/md";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";
import "./AddBook.css";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);

  const user = useSelector((state) => state.user.userInfo);
  const userId = user?.id || null;
  const username = user?.username;

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`${backend_url}/books/${id}`);
      setBook(response.data);
      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error("Error fetching book details:", err);
      toast.error("Failed to load book details.");
    }
  };

  useEffect(() => {
    if (id) fetchBookDetails();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment || !description || rating === 0) {
      toast.error("Please fill all fields including rating.");
      return;
    }
    try {
      await axios.post(`${backend_url}/books/${id}/reviews`, {
        username,
        userId,
        comment,
        description,
        rating,
      });
      toast.success("✅ Review added successfully!");
      fetchBookDetails(); // Refresh reviews
      setComment("");
      setDescription("");
      setRating(0);
    } catch (err) {
      console.error("Error adding review:", err);
      toast.error("❌ Failed to add review.");
    }
  };

  if (!book)
    return <p className="text-center mt-5">Loading book details...</p>;

  return (
    <div className="container mt-5 mb-5">

     
      <div className="card shadow-sm border-0 mb-5 p-4 text-center">
      
        <h2 className="fw-bold text-primary mb-2">{book.title}</h2>
        <h5 className="text-muted mb-3">by {book.author}</h5>
        <div className="row justify-content-center">
          <div className="col-6 col-md-3 mb-2">
            <p><strong>Year:</strong> {book.year}</p>
          </div>
          <div className="col-6 col-md-3 mb-2">
            <p><strong>Genre:</strong> {book.genre}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3 className="text-center mb-4 fw-semibold text-secondary">Reader Reviews</h3>
        {reviews.length === 0 ? (
          <div className="alert alert-secondary text-center">
            No reviews yet. Be the first to add one!
          </div>
        ) : (
          <div className="row justify-content-center">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className={`col-12 col-sm-6 col-md-4 mb-4 
                  ${review.userId === userId ? "border border-success rounded" : ""}`}
              >
                <div className="card border-0 shadow-sm h-100 p-3 text-center" style={{backgroundColor:"#FEFAE0"}}>
                  <h5 className="fw-bold text-primary">
                    <FaUser className="me-2" />
                    {review.username}
                  </h5>
                  <p className="text-secondary small px-3">
                    <i className="fas fa-quote-left pe-2 text-primary"></i>
                    {review.comment}
                  </p>
                  <p className="small text-muted px-3">{review.description}</p>
                  <ul className="list-unstyled d-flex justify-content-center mb-0">
                    {[...Array(5)].map((_, i) => (
                      <li key={i}>
                        <MdStar color={i < review.rating ? "#ffc107" : "#e4e5e9"} size={22} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Review Form */}
      <div className="card mt-5 shadow-sm border-0 p-4">
        <h4 className="fw-semibold text-secondary mb-4 text-center">Add Your Review</h4>
        <form onSubmit={handleSubmitReview}>

          <div className="mb-3 text-center">
            <label className="form-label fw-semibold d-block mb-2">Rating:</label>
            <div className="d-flex justify-content-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <MdStar
                  key={num}
                  onClick={() => setRating(num)}
                  color={num <= rating ? "#ffc107" : "#e4e5e9"}
                  size={30}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Your comment (short summary)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
            />
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Your detailed review"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-5">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookDetails;

import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const client = new MongoClient(process.env.MONGO_URI);
let db;

// MongoDB Connection
async function connectToMongo() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });


// Get all books
app.get("/books", async (req, res) => {
  try {
    const books = await db.collection(process.env.COLLECTION_NAME).find({}).toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Get single book
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await db.collection(process.env.COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// Add new book
app.post("/books", upload.single("image"), async (req, res) => {
  try {
    const { title, author, genre, year } = req.body;
    if (!title || !author || !genre || !year) {
      return res.status(400).json({ error: "All fields required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const newBook = { title, author, genre, year: Number(year), imageUrl };

    const result = await db.collection(process.env.COLLECTION_NAME).insertOne(newBook);
    res.status(201).json({ message: "Book added", book: { _id: result.insertedId, ...newBook } });
  } catch (err) {
    res.status(500).json({ error: "Add book failed" });
  }
});

// Update book
app.put("/books/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, year } = req.body;

    const existingBook = await db.collection(process.env.COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    if (!existingBook) return res.status(404).json({ error: "Book not found" });

    let imageUrl = existingBook.imageUrl;
    if (req.file) {
      if (existingBook.imageUrl) {
        const oldPath = `.${existingBook.imageUrl}`;
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedBook = { title, author, genre, year: Number(year), imageUrl };
    await db.collection(process.env.COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, { $set: updatedBook });

    res.json({ message: "Book updated successfully", book: { _id: id, ...updatedBook } });
  } catch (err) {
    res.status(500).json({ error: "Book update failed" });
  }
});

// Delete book
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection(process.env.COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// Add Review
app.post("/books/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, comment, description, rating } = req.body;

    if (!comment || !description || !rating) {
      return res.status(400).json({ error: "Comment, description, and rating are required" });
    }

    const review = { username, comment, description, rating: Number(rating), createdAt: new Date() };
    const result = await db.collection(process.env.COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $push: { reviews: review } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: "Book not found" });

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ error: "Failed to add review" });
  }
});


// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword, email, role: "user" };

    const result = await db.collection(process.env.COLLECTION_NAME1).insertOne(user);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: result.insertedId, username, email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Username and password are required" });

    const user = await db.collection(process.env.COLLECTION_NAME1).findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid username or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid password" });

    // generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7h" });

    res.json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email, role: user.role, token, },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // user id in req.user.id
    next();
  }
   catch {
    res.status(401).json({ error: "Invalid token" });
  }
};



// Get user profile (protected)
app.get("/users/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) return res.status(403).json({ error: "Unauthorized" });

    const user = await db.collection(process.env.COLLECTION_NAME1).findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { username, role, email } = user;
    res.json({ username, role, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ✅ Get all users//
app.get("/users", async (req, res) => {
  try {
    const users = await db
      .collection(process.env.COLLECTION_NAME1)
      .find({})
      .project({ password: 0 }) 
      .toArray();

    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// User Update
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required" });
    }

    const user = await db.collection(process.env.COLLECTION_NAME1).findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    let updatedData = { username, email ,role };

    await db.collection(process.env.COLLECTION_NAME1).updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection(process.env.COLLECTION_NAME1).deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// forget-password
app.post("/users/forget-password", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.collection(process.env.COLLECTION_NAME1).findOne({ username });

    if (!user) return res.status(404).json({ message: "Username not found!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection(process.env.COLLECTION_NAME1).updateOne(
      { username },
      { $set: { password: hashedPassword } }
    );

    res.json({ message: "Password changed successfully!" });
  } catch (err) {
    console.error("❌ Error resetting password:", err);
    res.status(500).json({ message: "Server error!" });
  }
});

// Start server
connectToMongo().then(() => {
  const PORT = process.env.PORT || 8800;
  app.listen(PORT, () => console.log(`🚀 Server running on this port ${PORT}`));
});

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "realpostgre1",
  port: 5432,
});

db.connect();

/* ============================
   HOMEPAGE – LIST ALL BOOKS
   ============================ */
app.get("/", async (req, res) => {
  let sortQuery = "published_date DESC"; // default sorting

  if (req.query.sort === "rating_asc") sortQuery = "rating_num ASC";
  if (req.query.sort === "rating_desc") sortQuery = "rating_num DESC";

  const result = await db.query(`SELECT * FROM books ORDER BY ${sortQuery}`);
  res.render("index", { books: result.rows });
});

/* ============================
   SHOW "ADD NEW BOOK" FORM
   ============================ */
app.get("/new", (req, res) => {
  res.render("new");
});

/* ============================
   ADD NEW BOOK (FORM SUBMIT)
   ============================ */
app.post("/add", async (req, res) => {
  // Extract form fields (all required)
  const {
    title,
    author,
    display_rating,   // text rating input
    notes,
    published_date,
    link_url
  } = req.body;

  /* -------------------------------------
     CONVERT DISPLAY RATING TO NUMERIC VALUE
     Supports formats like:
       - 4.5
       - 4/5
  ------------------------------------- */
  let ratingInput = display_rating.trim();
  let ratingNum = 0;

  if (ratingInput.includes("/")) {
    const parts = ratingInput.split("/");
    ratingNum = (parseFloat(parts[0]) / parseFloat(parts[1])) * 5;
  } else {
    ratingNum = parseFloat(ratingInput);
  }

  /* -------------------------------------
     FETCH COVER IMAGE FROM OPEN LIBRARY
  ------------------------------------- */
  let cover_url = null;
  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
    );

    if (response.data.docs.length > 0 && response.data.docs[0].cover_i) {
      cover_url = `https://covers.openlibrary.org/b/id/${response.data.docs[0].cover_i}-L.jpg`;
    }
  } catch (error) {
    console.log("Error fetching cover image:", error.message);
  }

  /* -------------------------------------
     INSERT NEW BOOK INTO DATABASE
     IMPORTANT: now includes link_url
  ------------------------------------- */
  await db.query(
    `INSERT INTO books 
      (title, author, display_rating, rating_num, notes, cover_url, published_date, link_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      title,
      author,
      ratingInput,
      ratingNum,
      notes,
      cover_url,
      published_date,
      link_url
    ]
  );

  res.redirect("/");
});

/* ============================
   EDIT BOOK PAGE
   ============================ */
app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
  res.render("edit", { book: result.rows[0] });
});

/* ============================
   UPDATE BOOK (FORM SUBMIT)
   ============================ */
app.post("/update/:id", async (req, res) => {
  const id = req.params.id;

  const {
    title,
    author,
    display_rating,
    notes,
    published_date,
    link_url
  } = req.body;

  // Recalculate numeric rating
  let ratingInput = display_rating.trim();
  let ratingNum = 0;

  if (ratingInput.includes("/")) {
    const parts = ratingInput.split("/");
    ratingNum = (parseFloat(parts[0]) / parseFloat(parts[1])) * 5;
  } else {
    ratingNum = parseFloat(ratingInput);
  }

  /* -------------------------------------
     UPDATE DATABASE RECORD  
     (now includes link_url)
  ------------------------------------- */
  await db.query(
    `UPDATE books SET 
      title=$1,
      author=$2,
      display_rating=$3,
      rating_num=$4,
      notes=$5,
      published_date=$6,
      link_url=$7
     WHERE id=$8`,
    [
      title,
      author,
      ratingInput,
      ratingNum,
      notes,
      published_date,
      link_url,
      id
    ]
  );

  res.redirect("/");
});

/* ============================
   DELETE BOOK
   ============================ */
app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await db.query("DELETE FROM books WHERE id=$1", [id]);
  res.redirect("/");
});

/* ============================
   START SERVER
   ============================ */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

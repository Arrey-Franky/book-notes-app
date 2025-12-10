📚 Book Notes App

A simple and beautiful web application that lets you save, organize, and review your favorite books.
You can add books with ratings, notes, cover images, published dates, and direct links.
The app also lets you edit, delete, and sort your books easily.
Built with Node.js, Express, EJS, and PostgreSQL.



✨Features

Add new books with title, author, rating, notes, published date, cover image, and link.

Edit or delete existing books.

Sort books by rating or published date.

Store fractional ratings like 4.5 or 4/5.

Beautiful responsive design for desktop and mobile.




🛠️ Tech Stack

Node.js

Express

EJS

PostgreSQL (pg module)

Bootstrap 5

Nodemon (dev)




Prerequisites

Make sure you have the following installed on your machine:

Node.js

 (v16 or higher recommended)

npm

 (comes with Node.js)

PostgreSQL




📦 Installation

Follow these steps to run the project locally.

1️⃣ Clone the repository

git clone https://github.com/Arrey-Franky/book-notes-app.git

cd book-notes-app

2️⃣ Install dependencies

npm install

3️⃣ Create a PostgreSQL database

Create a database named:

booknotes

4️⃣ Create a .env file

Create a .env file in the root of your project (DO NOT upload it to GitHub):

DB_USER=your_username

DB_HOST=localhost

DB_NAME=booknotes

DB_PASSWORD=your_password

DB_PORT=5432

PORT=3000




▶️ Run the App

Start the server:

npm start


Or with nodemon (auto-reload):

npm run dev


The app will run at:

http://localhost:3000

🧱 Database Table Structure

Your books table should look like this:

CREATE TABLE books (

  id SERIAL PRIMARY KEY,

  title VARCHAR(255) NOT NULL,

  author VARCHAR(255),

  rating INTEGER,

  notes TEXT,

  cover_url TEXT,

  published_date VARCHAR(50),

  link_url TEXT,

  date_created TIMESTAMP NOT NULL DEFAULT NOW()

);

🌐 Deployment

This app requires a Node server so it cannot run on GitHub Pages.
To deploy online, use one of these:

Render (free)

Railway (free)

Cyclic.sh (free)

📄 License

This project is open source and free to use.
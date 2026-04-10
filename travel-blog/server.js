const express = require("express");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3000;

/* =========================
   Middleware Setup
========================= */

app.use(express.json());
app.use(express.static("public"));

app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false
}));

/* =========================
   Data Path
========================= */

const dataPath = path.join(__dirname, "data", "blogs.json");

/* =========================
   Admin Credentials
========================= */

const ADMIN = {
    username: "admin",
    password: "1234"
};

/* =========================
   Authentication Routes
========================= */

// Login
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN.username && password === ADMIN.password) {
        req.session.isAdmin = true;
        return res.json({ success: true });
    }

    res.status(401).json({ success: false, message: "Invalid credentials" });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

/* =========================
   Blog Routes
========================= */

// Get all blogs
app.get("/blogs", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(dataPath));
    res.json(blogs);
});

// Get single blog
app.get("/blogs/:id", (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(dataPath));
    const blog = blogs.find(b => b.id == req.params.id);
    res.json(blog);
});

// Create blog (Protected)
app.post("/blogs", (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const blogs = JSON.parse(fs.readFileSync(dataPath));

    const newBlog = {
        id: Date.now(),
        ...req.body
    };

    blogs.push(newBlog);
    fs.writeFileSync(dataPath, JSON.stringify(blogs, null, 2));

    res.json(newBlog);
});

// Update blog (Protected)
app.put("/blogs/:id", (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const blogs = JSON.parse(fs.readFileSync(dataPath));

    const updatedBlogs = blogs.map(blog => {
        if (blog.id == req.params.id) {
            return { ...blog, ...req.body };
        }
        return blog;
    });

    fs.writeFileSync(dataPath, JSON.stringify(updatedBlogs, null, 2));

    res.json({ message: "Blog updated" });
});

// Delete blog (Protected)
app.delete("/blogs/:id", (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const blogs = JSON.parse(fs.readFileSync(dataPath));
    const filteredBlogs = blogs.filter(b => b.id != req.params.id);

    fs.writeFileSync(dataPath, JSON.stringify(filteredBlogs, null, 2));

    res.json({ message: "Blog deleted" });
});

/* =========================
   Start Server
========================= */
// Check admin session
app.get("/check-auth", (req, res) => {
    res.json({ isAdmin: req.session.isAdmin || false });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
/* =========================
   Global State
========================= */
let isAdmin = false;
let allBlogs = [];

/* =========================
   Modal Elements
========================= */
const modal = document.getElementById("edit-modal");
const editTitle = document.getElementById("edit-title");
const editCountry = document.getElementById("edit-country");
const editImage = document.getElementById("edit-image");
const editDescription = document.getElementById("edit-description");
const saveEdit = document.getElementById("save-edit");
const cancelEdit = document.getElementById("cancel-edit");

/* =========================
   Check Admin Session
========================= */
async function checkAuth() {
    try {
        const res = await fetch("/check-auth");
        const data = await res.json();
        isAdmin = data.isAdmin;
    } catch (err) {
        isAdmin = false;
    }
}
function updateAuthUI() {
    const authLink = document.getElementById("auth-link");
    if (!authLink) return;

    if (isAdmin) {
        authLink.textContent = "Logout";
        authLink.href = "/logout";
    } else {
        authLink.textContent = "Login";
        authLink.href = "/login.html";
    }
}
/* =========================
   Load Blogs
========================= */
async function loadBlogs() {

    await checkAuth();

    const response = await fetch("/blogs");
    const blogs = await response.json();

    allBlogs = blogs;

    populateCountryFilter(blogs);
    renderBlogs(blogs);
}

/* =========================
   Render Blogs
========================= */
function renderBlogs(blogs) {

    const container = document.getElementById("blog-container");
    if (!container) return;

    container.innerHTML = "";

    if (blogs.length === 0) {
        container.innerHTML = "<p>No blogs found.</p>";
        return;
    }

    blogs.forEach(blog => {

        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        blogCard.innerHTML = `
            <h2>${blog.title}</h2>
            <p>${blog.country}</p>
            <img src="${blog.image}">
            <p>${blog.description}</p>
            ${isAdmin ? `
                <div class="admin-controls">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            ` : ``}
        `;

        blogCard.addEventListener("click", () => {
            window.location.href = `blog.html?id=${blog.id}`;
        });

        if (isAdmin) {
            attachAdminControls(blogCard, blog);
        }

        container.appendChild(blogCard);
    });
}

/* =========================
   Admin Controls
========================= */
function attachAdminControls(blogCard, blog) {

    const editBtn = blogCard.querySelector(".edit-btn");
    const deleteBtn = blogCard.querySelector(".delete-btn");

    if (!editBtn || !deleteBtn) return;

    /* ===== EDIT ===== */
    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        if (!modal) return;

        modal.classList.remove("hidden");

        editTitle.value = blog.title;
        editCountry.value = blog.country;
        editImage.value = blog.image;
        editDescription.value = blog.description;

        saveEdit.onclick = async () => {
            await fetch(`/blogs/${blog.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editTitle.value,
                    country: editCountry.value,
                    image: editImage.value,
                    description: editDescription.value
                })
            });

            modal.classList.add("hidden");
            loadBlogs();
        };

        cancelEdit.onclick = () => {
            modal.classList.add("hidden");
        };
    });

    /* ===== DELETE ===== */
    deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();

        await fetch(`/blogs/${blog.id}`, {
            method: "DELETE"
        });

        loadBlogs();
    });
}

/* =========================
   Populate Country Filter
========================= */
function populateCountryFilter(blogs) {

    const filter = document.getElementById("country-filter");
    if (!filter) return;

    const countries = [...new Set(blogs.map(b => b.country))];

    filter.innerHTML = `<option value="">All Countries</option>`;

    countries.forEach(country => {
        filter.innerHTML += `<option value="${country}">${country}</option>`;
    });
}

/* =========================
   Search Logic
========================= */
const searchInput = document.getElementById("search-input");

if (searchInput) {
    searchInput.addEventListener("input", (e) => {

        const searchText = e.target.value.toLowerCase();

        const filtered = allBlogs.filter(blog =>
            blog.title.toLowerCase().includes(searchText)
        );

        renderBlogs(filtered);
    });
}

/* =========================
   Country Filter Logic
========================= */
const countryFilter = document.getElementById("country-filter");

if (countryFilter) {
    countryFilter.addEventListener("change", (e) => {

        const selected = e.target.value;

        const filtered = selected
            ? allBlogs.filter(blog => blog.country === selected)
            : allBlogs;

        renderBlogs(filtered);
    });
}

/* =========================
   Initialize
========================= */
loadBlogs();
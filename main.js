// =======================
// MAIN.JS (VERSION CORRIGÉE)
// =======================

// ===== CONFIG =====
const API_URL = "https://tarmeezacademy.com/api/v1";
let token = localStorage.getItem("token") || null;
let currentUser = null;
let selectedPostId = null;

let currentPage = 1;
const postsPerPage = 20;
let loadingPosts = false;
let hasMorePosts = true;

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  checkLoginState();
  loadPosts();

  // NAVIGATION
  document.getElementById("navHome").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("posts-container").style.display = "block";
    document.getElementById("profileStats").style.display = "none";
    resetPosts();
  });

  document.getElementById("navProfile").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("posts-container").style.display = "none";
    document.getElementById("profileStats").style.display = "block";
    loadProfile();
  });

  // LOGIN
  document.getElementById("btnLoginSubmit").addEventListener("click", login);

  // REGISTER
  document
    .getElementById("btnRegisterSubmit")
    .addEventListener("click", register);

  // LOGOUT
  document.getElementById("btnLogout").addEventListener("click", logout);

  // ADD POST
  document.getElementById("postForm").addEventListener("submit", addPost);

  // OUVRIR MODAL ADD POST
  document.getElementById("btnAddPost").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById("postModal")).show();
  });

  // REFRESH
  document.getElementById("btnRefresh").addEventListener("click", resetPosts);

  // COMMENT
  document.getElementById("commentForm").addEventListener("submit", addComment);

  // SCROLL INFINI
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
      !loadingPosts &&
      hasMorePosts
    ) {
      currentPage++;
      loadPosts();
    }
  });
});

// =======================
// AUTHENTIFICATION
// =======================

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    token = res.data.token;
    localStorage.setItem("token", token);
    currentUser = res.data.user;
    checkLoginState();
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
  } catch (err) {
    alert("Erreur login : " + err.response.data.message);
  }
}

async function register() {
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const name = username; // pas de champ name, on prend username

  try {
    const res = await axios.post(`${API_URL}/register`, {
      name,
      username,
      email,
      password,
    });
    token = res.data.token;
    localStorage.setItem("token", token);
    currentUser = res.data.user;
    checkLoginState();
    bootstrap.Modal.getInstance(
      document.getElementById("registerModal")
    ).hide();
  } catch (err) {
    alert("Erreur inscription : " + err.response.data.message);
  }
}

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem("token");
  checkLoginState();
  resetPosts();
}

function checkLoginState() {
  if (token) {
    document.getElementById("btnLogin").style.display = "none";
    document.getElementById("btnRegister").style.display = "none";
    document.getElementById("btnLogout").style.display = "inline-block";
    document.getElementById("usernameDisplay").style.display = "inline-block";
    document.getElementById("usernameDisplay").innerText =
      currentUser?.name || "";
  } else {
    document.getElementById("btnLogin").style.display = "inline-block";
    document.getElementById("btnRegister").style.display = "inline-block";
    document.getElementById("btnLogout").style.display = "none";
    document.getElementById("usernameDisplay").style.display = "none";
  }
}

// =======================
// POSTS
// =======================

function resetPosts() {
  document.getElementById("posts-container").innerHTML = "";
  currentPage = 1;
  hasMorePosts = true;
  loadPosts();
}

async function loadPosts() {
  if (!hasMorePosts) return;

  loadingPosts = true;
  try {
    const res = await axios.get(`${API_URL}/posts`, {
      params: { page: currentPage },
    });

    const posts = res.data.data;
    if (posts.length < postsPerPage) hasMorePosts = false;

    const container = document.getElementById("posts-container");

    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "card shadow-sm mb-4";

      card.innerHTML = `
        <div class="card-body" style="min-height: 150px;">
          <h5 class="card-title">${post.title || "Sans titre"}</h5>
          <p class="card-text">${post.body}</p>
          ${
            post.image
              ? `<img src="${post.image}" class="img-fluid rounded mb-2" />`
              : ""
          }
          <div>
            <button class="btn btn-sm btn-outline-secondary me-2 btn-comment" data-id="${
              post.id
            }">
              <i class="bi bi-chat"></i> Commentaires (${post.comments_count})
            </button>
            <button class="btn btn-sm btn-outline-success me-2 btn-share" data-id="${
              post.id
            }">
              <i class="bi bi-share"></i> Share
            </button>
            ${
              token && currentUser?.id === post.author.id
                ? `<button class="btn btn-sm btn-outline-danger btn-delete" data-id="${post.id}">
                    <i class="bi bi-trash"></i> Supprimer
                  </button>`
                : ""
            }
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // BOUTONS
    document
      .querySelectorAll(".btn-comment")
      .forEach((btn) =>
        btn.addEventListener("click", () => openComments(btn.dataset.id))
      );
    document
      .querySelectorAll(".btn-delete")
      .forEach((btn) =>
        btn.addEventListener("click", () => deletePost(btn.dataset.id))
      );
    document
      .querySelectorAll(".btn-share")
      .forEach((btn) =>
        btn.addEventListener("click", () => sharePost(btn.dataset.id))
      );
  } catch (err) {
    alert("Erreur chargement posts");
  }
  loadingPosts = false;
}

// ----- Add post -----
async function addPost(e) {
  e.preventDefault();
  if (!token) {
    alert("Vous devez être connecté pour publier.");
    return;
  }

  const title = document.getElementById("postTitle").value;
  const body = document.getElementById("postBody").value;
  const image = document.getElementById("postImage").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  if (image) formData.append("image", image);

  try {
    await axios.post(`${API_URL}/posts`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    bootstrap.Modal.getInstance(document.getElementById("postModal")).hide();
    resetPosts();
  } catch (err) {
    alert("Erreur ajout post : " + err.response.data.message);
  }
}

// ----- Delete post -----
async function deletePost(postId) {
  if (!confirm("Supprimer ce post ?")) return;
  try {
    await axios.delete(`${API_URL}/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    resetPosts();
  } catch (err) {
    alert("Erreur suppression : " + err.response.data.message);
  }
}

// ----- Share post -----
function sharePost(postId) {
  const url = `${window.location.origin}?post=${postId}`;
  navigator.clipboard.writeText(url);
  alert("Lien copié : " + url);
}

// =======================
// COMMENTS
// =======================

async function openComments(postId) {
  selectedPostId = postId;
  const list = document.getElementById("commentList");
  list.innerHTML = "";

  try {
    const res = await axios.get(`${API_URL}/posts/${postId}`);
    const comments = res.data.data.comments;

    comments.forEach((c) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `${c.author.username}: ${c.body}`;
      list.appendChild(li);
    });

    new bootstrap.Modal(document.getElementById("commentModal")).show();
  } catch (err) {
    alert("Erreur chargement commentaires");
  }
}

async function addComment(e) {
  e.preventDefault();
  if (!token) {
    alert("Vous devez être connecté pour commenter.");
    return;
  }

  const body = document.getElementById("commentBody").value;

  try {
    await axios.post(
      `${API_URL}/posts/${selectedPostId}/comments`,
      { body },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    document.getElementById("commentBody").value = "";
    openComments(selectedPostId);
  } catch (err) {
    alert("Erreur ajout commentaire : " + err.response.data.message);
  }
}

// =======================
// PROFILE
// =======================
async function loadProfile() {
  try {
    const res = await axios.get(`${API_URL}/users/${currentUser.id}`);
    const user = res.data.data;

    document.getElementById("profileUsername").innerText = user.name;
    document.getElementById("profileEmail").innerText = user.email;
    document.getElementById("postCount").innerText = user.posts_count;
    document.getElementById("commentCount").innerText = user.comments_count;
    document.getElementById("likeCount").innerText = user.likes_count;
  } catch (err) {
    alert("Erreur profil");
  }
}

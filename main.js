import {
  showUserPage,
  login,
  logOut,
  register,
  submitPost,
  initLikeButtons,
  initEditButtons,
  initDeleteButtons,
  initCommentButtons,
} from "./shared.js";

let currentPage = 1;
let perPage = 20;
let isLoading = false;
let totalPosts = 0;

document.addEventListener("DOMContentLoaded", () => {
  showUserPage();
  loadPosts(currentPage);

  document.getElementById("btnLogin").addEventListener("click", login);
  document.getElementById("btnMainLogOut").addEventListener("click", logOut);
  document.getElementById("btnRegister")?.addEventListener("click", register);

  const btnAddPost = document.getElementById("btnAddPost");
  const postModal = new bootstrap.Modal(document.getElementById("postModal"));
  btnAddPost.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("⚠️ You need to log in to add a post.");
    postModal.show();
  });

  document.getElementById("postForm").addEventListener("submit", submitPost);
});

async function loadPosts(page = 1) {
  isLoading = true;
  try {
    const res = await axios.get("https://tarmeezacademy.com/api/v1/posts", {
      params: { page, limit: perPage },
    });
    const posts = res.data.data;
    totalPosts = res.data.meta?.total || totalPosts;

    const container = document.getElementById("posts-container");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "card shadow-sm mb-4";
      let editBtn = "",
        deleteBtn = "";
      if (token && user.id === post.author.id) {
        editBtn = `<i class="bi bi-pencil-square btn-edit text-primary me-2" style="cursor:pointer" data-id="${post.id}"></i>`;
        deleteBtn = `<i class="bi bi-trash btn-delete text-danger" style="cursor:pointer" data-id="${post.id}"></i>`;
      }
      card.innerHTML = `
        <div class="card-header bg-white d-flex align-items-center justify-content-between">
          <div>
            <img src="${
              post.author?.profile_image
            }" alt="user" class="rounded-circle me-2" width="35" height="35"/>
            <strong>@${post.author?.username}</strong>
          </div>
          <div>${editBtn}${deleteBtn}</div>
        </div>
        <div class="card-body">
          ${
            post.image
              ? `<img src="${post.image}" class="w-100 mb-3" style="height:300px;object-fit:cover"/>`
              : ""
          }
          <h6 class="text-muted mb-2">${post.created_at}</h6>
          <h4>${post.title || "Sans titre"}</h4>
          <p>${post.body || ""}</p>
          <i class="bi bi-heart btn-like text-danger me-2" data-id="${
            post.id
          }" style="cursor:pointer;"></i>
          <i class="bi bi-chat-left-text btn-comment text-primary" data-id="${
            post.id
          }" style="cursor:pointer;"></i>
        </div>`;
      container.appendChild(card);
    });

    initLikeButtons();
    initEditButtons();
    initDeleteButtons();
    initCommentButtons();
  } catch (err) {
    console.error(err);
  }
  isLoading = false;
}

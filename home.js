import {
  showUserPage,
  logOut,
  initLikeButtons,
  initEditButtons,
  initDeleteButtons,
  initCommentButtons,
} from "./shared.js";

document.addEventListener("DOMContentLoaded", () => {
  showUserPage();
  document.getElementById("btnLogOut").addEventListener("click", logOut);
  loadUserPosts();
});

async function loadUserPosts() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.id) return;

  try {
    const res = await axios.get("https://tarmeezacademy.com/api/v1/posts", {
      params: { limit: 50 },
    });
    const posts = res.data.data.filter((post) => post.author.id === user.id);
    const container = document.getElementById("posts-container");
    container.innerHTML = "";

    posts.forEach((post) => {
      const card = document.createElement("div");
      card.className = "card shadow-sm mb-4";
      card.innerHTML = `
        <div class="card-header d-flex justify-content-between">
          <strong>@${post.author.username}</strong>
        </div>
        <div class="card-body">
          ${post.image ? `<img src="${post.image}" class="w-100 mb-3"/>` : ""}
          <h4>${post.title}</h4>
          <p>${post.body}</p>
          <i class="bi bi-heart btn-like text-danger me-2" data-id="${
            post.id
          }" style="cursor:pointer"></i>
          <i class="bi bi-chat-left-text btn-comment text-primary" data-id="${
            post.id
          }" style="cursor:pointer"></i>
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
}

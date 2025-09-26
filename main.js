// ======= INIT =======
loadPosts();
showUserPage();

// ======== LOGIN ========
document.getElementById("btnLogin").addEventListener("click", login);
document.getElementById("btnMainLogOut").addEventListener("click", logOut);

// ======== BUTTON ADD POST ========
const btnAddPost = document.getElementById("btnAddPost");
const postModal = new bootstrap.Modal(document.getElementById("postModal"));

btnAddPost.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("⚠️ You need to log in to add a post.");
    return;
  }
  postModal.show();
});

// ======== LOGIN FUNCTION ========
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await axios.post(
      "https://tarmeezacademy.com/api/v1/login",
      {
        username: email,
        password: password,
      }
    );

    const token = response.data.token;
    const user = response.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    showLoginPopup();
    showUserPage();
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
  } catch (error) {
    alert("Erreur login ! Vérifiez vos identifiants.");
    console.error(error);
  }
}

// ======== LOGOUT ========
function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showUserPage();
}

// ======== SHOW/HIDE LOGIN/LOGOUT/USERNAME ========
function showUserPage() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const usernameEl = document.getElementById("usernameDisplay");
  if (token && user.username) {
    usernameEl.textContent = `@${user.username}`;
    usernameEl.style.display = "inline-block";
  } else {
    usernameEl.style.display = "none";
  }

  document.getElementById("btnMainLogin").style.display = token
    ? "none"
    : "inline-block";
  document.getElementById("btnMainRegister").style.display = token
    ? "none"
    : "inline-block";
  document.getElementById("btnMainLogOut").style.display = token
    ? "inline-block"
    : "none";
}

// ======== POPUP LOGIN SUCCESS ========
function showLoginPopup() {
  document.getElementById("loginSuccessPopup").style.display = "flex";
  setTimeout(closeLoginPopup, 3000);
}
function closeLoginPopup() {
  document.getElementById("loginSuccessPopup").style.display = "none";
}

// ======== LOAD POSTS ========
function loadPosts() {
  axios
    .get("https://tarmeezacademy.com/api/v1/posts")
    .then((response) => {
      const posts = response.data.data;
      const container = document.getElementById("posts-container");
      container.innerHTML = "";

      posts.forEach((post) => {
        const card = document.createElement("div");
        card.className = "card shadow-sm mb-4";
        card.innerHTML = `
          <div class="card-header bg-white d-flex align-items-center">
            <img src="${
              post.author?.profile_image
            }" alt="user" class="rounded-circle me-2" width="35" height="35"/>
            <strong>@${post.author?.username}</strong>
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
            <i class="bi bi-heart btn-like me-3"></i>
            <i class="bi bi-chat-dots me-3 text-secondary" style="font-size:1.5rem"></i>
            <i class="bi bi-share text-secondary" style="font-size:1.5rem"></i>
          </div>
          <div class="card-footer text-muted small">
            ${post.comments_count} comments, ${post.likes_count} likes
          </div>
        `;
        container.appendChild(card);
      });

      initLikeButtons();
    })
    .catch((error) => console.error(error));
}

// ======== LIKES ========
function initLikeButtons() {
  document.querySelectorAll(".btn-like").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("liked");
      btn.classList.toggle("bi-heart");
      btn.classList.toggle("bi-heart-fill");
    });
  });
}

// ======== ADD POST SUBMISSION ========
document.getElementById("postForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const imageFile = document.getElementById("image").files[0];
  const token = localStorage.getItem("token");

  if (!token) {
    alert("⚠️ You need to log in to add a post.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  if (imageFile) formData.append("image", imageFile);

  axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      alert("Post added successfully!");
      document.getElementById("postForm").reset();
      postModal.hide();
      loadPosts();
    })
    .catch((error) => {
      console.error(error);
      alert("Erreur lors de l'ajout du post !");
    });
});

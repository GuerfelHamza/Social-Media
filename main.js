// ====== GESTION DU LIKE ======
function initLikeButtons() {
  document.querySelectorAll(".btn-like").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("liked"); // toggle style rouge + animation
      btn.classList.toggle("bi-heart"); // alterne icône coeur vide
      btn.classList.toggle("bi-heart-fill"); // alterne icône coeur rempli
    });
  });
}

// ==== AXIOS GET POSTS ======
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
            <img src="${post.author?.profile_image}" 
                 alt="user" 
                 class="rounded-circle me-2" 
                 width="35" 
                 height="35" />
            <strong>@${post.author?.username}</strong>
          </div>
          <div class="card-body">
            ${
              post.image
                ? `<img src="${post.image}" class="w-100 mb-3" style="height: 300px; object-fit: cover" />`
                : ""
            }
            <h6 class="text-muted mb-2">${post.created_at}</h6>
            <h4>${post.title || "Sans titre"}</h4>
            <p>${post.body || ""}</p>
            <!-- Boutons -->
            <i class="bi bi-heart btn-like me-3"></i>
            <i class="bi bi-chat-dots me-3 text-secondary" style="font-size: 1.5rem"></i>
            <i class="bi bi-share text-secondary" style="font-size: 1.5rem"></i>
          </div>
          <div class="card-footer text-muted small">
            ${post.comments_count} comments, ${post.likes_count} likes
          </div>
        `;
        container.appendChild(card);
      });

      // initialiser les likes
      initLikeButtons();
    })
    .catch((error) => {
      console.error("Erreur :", error);
    });
}

// ====== LOGIN AVEC API ======
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

    // récupérer token + user
    const token = response.data.token;
    const user = response.data.user;

    // stocker dans localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // ✅ Popup succès
    showLoginPopup();

    // mettre à jour l’UI
    showUserPage();

    // Fermer modal bootstrap
    bootstrap.Modal.getInstance(document.getElementById("exampleModal")).hide();
  } catch (error) {
    // ❌ Popup erreur
    showLoginErrorPopup();
    console.error("Erreur login :", error.response?.data || error.message);
  }
}

// ====== SHOW/HIDE BUTTONS LOGIN/REGISTER/LOGOUT ======
function showUserPage() {
  const token = localStorage.getItem("token");

  if (token) {
    // connecté
    document.getElementById("btnMainLogin").style.display = "none";
    document.getElementById("btnMainRegister").style.display = "none";
    document.getElementById("btnMainLogOut").style.display = "inline-block";
  } else {
    // pas connecté
    document.getElementById("btnMainLogin").style.display = "inline-block";
    document.getElementById("btnMainRegister").style.display = "inline-block";
    document.getElementById("btnMainLogOut").style.display = "none";
  }
}

function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showUserPage();
}

// ====== POPUP VALIDATION LOGIN ======
function showLoginPopup() {
  document.getElementById("loginSuccessPopup").style.display = "flex";
  // auto close après 3s
  setTimeout(closeLoginPopup, 3000);
}

function closeLoginPopup() {
  document.getElementById("loginSuccessPopup").style.display = "none";
}

// ====== POPUP ERREUR LOGIN ======
function showLoginErrorPopup() {
  document.getElementById("loginErrorPopup").style.display = "flex";
  setTimeout(closeLoginErrorPopup, 3000);
}

function closeLoginErrorPopup() {
  document.getElementById("loginErrorPopup").style.display = "none";
}

// ====== INITIALISATION ======
document.getElementById("btnLogin")?.addEventListener("click", login);
document.getElementById("btnMainLogOut")?.addEventListener("click", logOut);

// Charger les posts au démarrage
loadPosts();

// Vérifier si l’utilisateur est déjà connecté
showUserPage();


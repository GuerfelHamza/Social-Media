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

// ====== CALCUL "time ago" ======
function timeAgo(dateString) {
  const past = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (let key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value >= 1) {
      return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

// ====== METTRE À JOUR LES TEMPS ======
function updatePostTimes() {
  document.querySelectorAll(".post-time").forEach((el) => {
    const originalTime = el.getAttribute("data-created-at");
    el.textContent = timeAgo(originalTime);
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
            ${post.image ? `<img src="${post.image}" class="w-100 mb-3" style="height: 300px; object-fit: cover" />` : ""}
            <h6 class="text-muted post-time" data-created-at="${post.created_at}">${timeAgo(post.created_at)}</h6>
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

      // mettre à jour les temps toutes les minutes
      setInterval(updatePostTimes, 60000);
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
    const response = await axios.post("https://tarmeezacademy.com/api/v1/login", {
      username: email,
      password: password,
    });

    alert("✅ Login successful !");
    showUserPage();
    localStorage.setItem("token", response.data.token);
    bootstrap.Modal.getInstance(document.getElementById("exampleModal")).hide();
  } catch (error) {
    alert("❌ Login failed");
    console.error("Erreur login :", error.response?.data || error.message);
  }
}

// ====== SHOW/HIDE BUTTONS LOGIN/REGISTER/LOGOUT ======
function showUserPage() {
  const token = localStorage.getItem("token");
  if (!token) return;

  document.getElementById("btnMainLogin").style.display = "none";
  document.getElementById("btnMainRegister").style.display = "none";
  document.getElementById("btnMainLogOut").style.display = "inline-block";
}

function logOut() {
  localStorage.removeItem("token");
  document.getElementById("btnMainLogin").style.display = "inline-block";
  document.getElementById("btnMainRegister").style.display = "inline-block";
  document.getElementById("btnMainLogOut").style.display = "none";
}

// ====== INITIALISATION ======
document.getElementById("btnLogin")?.addEventListener("click", login);
document.getElementById("btnMainLogOut")?.addEventListener("click", logOut);

// Charger les posts au démarrage
loadPosts();

// Vérifier si l’utilisateur est déjà connecté
showUserPage();


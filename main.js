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
  const now = new Date();
  const past = new Date(dateString);
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

// ==== AXIOS GET POSTS ======
axios
  .get("https://tarmeezacademy.com/api/v1/posts")
  .then((response) => {
    const posts = response.data.data; // ✅ tableau de posts
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
          <h6 class="text-muted post-time">${timeAgo(post.created_at)}</h6>
         
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

    initLikeButtons();
  })
  .catch((error) => {
    console.error("Erreur :", error);
  });
// =======end of get posts =======

// ====== GESTION LOGIN AVEC API ======
const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await axios.post(
      "https://tarmeezacademy.com/api/v1/login",
      {
        username: email, // ⚠️ l’API attend username, pas email
        password: password,
      }
    );

    // Si login OK
    alert("✅ Login successful !");
    console.log("User logged in :", response.data);

    // Tu peux stocker le token si tu veux
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    alert("❌ Login failed");
    console.error("Erreur login :", error.response?.data || error.message);
  }
});

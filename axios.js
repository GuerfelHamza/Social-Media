//  ==== AXIOS GET POSTS ======
// ==== AXIOS GET POSTS ======
axios
  .get("https://tarmeezacademy.com/api/v1/posts?limit=5")
  .then((response) => {
    console.log("Réponse brute :", response.data);

    const posts = response.data.data; // ✅ tableau de posts
    const container = document.getElementById("posts-container");

    // Vider avant d'ajouter
    container.innerHTML = "";

    posts.forEach((post) => {
      // Créer une div pour la card
      const card = document.createElement("div");
      card.className = "card shadow-sm mb-4";

      // Remplir avec du HTML Bootstrap
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
          <h6 class="text-muted">${post.created_at}</h6>
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

      // Ajouter au container
      container.appendChild(card);
    });

    // === GESTION DU LIKE (après ajout dynamique) ===
    document.querySelectorAll(".btn-like").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("liked");
        btn.classList.toggle("bi-heart");
        btn.classList.toggle("bi-heart-fill");
      });
    });
  })
  .catch((error) => {
    console.error("Erreur :", error);
  });

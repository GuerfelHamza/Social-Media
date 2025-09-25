// ====== GESTION DU LIKE ======
document.querySelectorAll(".btn-like").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("liked"); // toggle style rouge + animation
    btn.classList.toggle("bi-heart"); // alterne icône coeur vide
    btn.classList.toggle("bi-heart-fill"); // alterne icône coeur rempli
  });
});
//  ==== AXIOS GET POSTS ======

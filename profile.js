document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.id) {
    alert("⚠️ Connectez-vous pour voir votre profil !");
    window.location.href = "main.html";
    return;
  }

  document.getElementById("profileUsername").textContent = user.username;
  document.getElementById("profileEmail").textContent = user.email;

  try {
    // Récupérer posts du user
    const postsRes = await axios.get(`https://tarmeezacademy.com/api/v1/posts?user_id=${user.id}`);
    const posts = postsRes.data.data;
    document.getElementById("postCount").textContent = posts.length;

    let totalComments = 0;
    let totalLikes = 0;

    for (const post of posts) {
      totalComments += post.comments_count || 0;
      totalLikes += post.likes_count || 0;
    }

    document.getElementById("commentCount").textContent = totalComments;
    document.getElementById("likeCount").textContent = totalLikes;
  } catch (err) {
    console.error(err);
  }
});

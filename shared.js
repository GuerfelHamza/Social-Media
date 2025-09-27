export function showUserPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.username) {
    document.getElementById("usernameDisplay").textContent = user.username;
    const loginBtn =
      document.getElementById("btnMainLogin") ||
      document.getElementById("btnLogin");
    const registerBtn =
      document.getElementById("btnMainRegister") ||
      document.getElementById("btnRegister");
    if (loginBtn) loginBtn.style.display = "none";
    if (registerBtn) registerBtn.style.display = "none";
    const logoutBtn =
      document.getElementById("btnMainLogOut") ||
      document.getElementById("btnLogOut");
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  }
}

export async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const res = await axios.post("https://tarmeezacademy.com/api/v1/login", {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    showUserPage();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("loginModal")
    );
    modal.hide();
  } catch (err) {
    alert("Erreur login");
    console.error(err);
  }
}

export async function register() {
  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  try {
    await axios.post("https://tarmeezacademy.com/api/v1/register", {
      username,
      email,
      password,
    });
    alert("✅ Registered. Please login.");
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("registerModal")
    );
    modal.hide();
  } catch (err) {
    alert("Erreur register");
    console.error(err);
  }
}

export function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.href = "main.html";
}

export function initLikeButtons() {
  document.querySelectorAll(".btn-like").forEach((btn) => {
    btn.addEventListener("click", () => btn.classList.toggle("liked"));
  });
}

export function initEditButtons() {
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () =>
      alert("Edit Post ID " + btn.dataset.id)
    );
  });
}

export function initDeleteButtons() {
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () =>
      alert("Delete Post ID " + btn.dataset.id)
    );
  });
}

export function initCommentButtons() {
  document.querySelectorAll(".btn-comment").forEach((btn) => {
    btn.addEventListener("click", () =>
      alert("Comment Post ID " + btn.dataset.id)
    );
  });
}

export async function submitPost(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) return alert("Login required");
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  // image upload skipped for simplicity
  try {
    await axios.post(
      "https://tarmeezacademy.com/api/v1/posts",
      { title, body },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("✅ Post added");
    location.reload();
  } catch (err) {
    alert("Erreur adding post");
    console.error(err);
  }
}

// ====== AUTH.JS ======
export function showUserPage() {
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

export function showLoginPopup() {
  const popup = document.getElementById("loginSuccessPopup");
  popup.style.display = "flex";
  setTimeout(() => (popup.style.display = "none"), 3000);
}

export async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await axios.post("https://tarmeezacademy.com/api/v1/login", {
      username: email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    showLoginPopup();
    showUserPage();
    bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
  } catch (err) {
    alert("Erreur login !");
    console.error(err);
  }
}

export function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showUserPage();
}

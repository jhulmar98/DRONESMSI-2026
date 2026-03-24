/* =====================================================
   🔐 LOGIN - USANDO api.js
===================================================== */

import { loginUsuario } from "./Backend/api.js";

const btnLogin = document.getElementById("btnLogin");
const email = document.getElementById("email");
const password = document.getElementById("password");
const errorDiv = document.getElementById("error");

btnLogin.addEventListener("click", async () => {

  errorDiv.textContent = "";

  try {
    const user = await loginUsuario(email.value, password.value);

    // 🔥 guardar sesión
    localStorage.setItem("user", JSON.stringify(user));

    // 🚀 entrar al sistema
    window.location.href = "index.html";

  } catch (error) {
    console.error(error);

    if (error.code === "auth/user-not-found") {
      errorDiv.textContent = "Usuario no registrado";
    } else if (error.code === "auth/wrong-password") {
      errorDiv.textContent = "Contraseña incorrecta";
    } else {
      errorDiv.textContent = "Error al iniciar sesión";
    }
  }
});
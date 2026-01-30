const $ = (sel) => document.querySelector(sel);

// regex
const nameRegex = /^.{2,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRegex = /^(?=.*\d).{8,}$/;

// toast helper
function showToast(el, type, msg) {
  if (!el) return;
  el.classList.remove("success", "error", "show");
  el.classList.add(type, "show");
  el.textContent = msg;
}

// ---------------- REGISTER ----------------
const registerForm = $("#registerForm");
if (registerForm) {
  const regName = $("#regName");
  const regEmail = $("#regEmail");
  const regPassword = $("#regPassword");
  const regConfirm = $("#regConfirm");

  const regNameErr = $("#regNameErr");
  const regEmailErr = $("#regEmailErr");
  const regPassErr = $("#regPassErr");
  const regConfirmErr = $("#regConfirmErr");

  const regToast = $("#regToast");
  const regToggle = $("#regToggle");

  if (regToggle && regPassword) {
    regToggle.addEventListener("click", () => {
      const hidden = regPassword.type === "password";
      regPassword.type = hidden ? "text" : "password";
      regToggle.textContent = hidden ? "Hide" : "Show";
    });
  }

  function clearRegErrors() {
    regNameErr.textContent = "";
    regEmailErr.textContent = "";
    regPassErr.textContent = "";
    regConfirmErr.textContent = "";
    if (regToast) regToast.className = "toast";
    if (regToast) regToast.textContent = "";
  }

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearRegErrors();

    let ok = true;

    if (!nameRegex.test(regName.value.trim())) {
      regNameErr.textContent = "Name must be at least 2 characters.";
      ok = false;
    }

    if (!emailRegex.test(regEmail.value.trim())) {
      regEmailErr.textContent = "Enter a valid email.";
      ok = false;
    }

    if (!passRegex.test(regPassword.value)) {
      regPassErr.textContent = "Password must be 8+ chars and include 1 number.";
      ok = false;
    }

    if (regConfirm.value !== regPassword.value || regConfirm.value.length === 0) {
      regConfirmErr.textContent = "Passwords do not match.";
      ok = false;
    }

    if (!ok) {
      showToast(regToast, "error", "Please fix the errors above.");
      return;
    }

    const user = {
      name: regName.value.trim(),
      email: regEmail.value.trim(),
      password: regPassword.value
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.removeItem("isLoggedIn");

    showToast(regToast, "success", "Registered successfully! Now login.");

    registerForm.reset();
    regPassword.type = "password";
    if (regToggle) regToggle.textContent = "Show";
  });
}

// ---------------- LOGIN ----------------
const loginForm = $("#loginForm");
if (loginForm) {
  const logEmail = $("#logEmail");
  const logPassword = $("#logPassword");

  const logEmailErr = $("#logEmailErr");
  const logPassErr = $("#logPassErr");

  const logToast = $("#logToast");
  const logToggle = $("#logToggle");

  if (logToggle && logPassword) {
    logToggle.addEventListener("click", () => {
      const hidden = logPassword.type === "password";
      logPassword.type = hidden ? "text" : "password";
      logToggle.textContent = hidden ? "Hide" : "Show";
    });
  }

  function clearLogErrors() {
    logEmailErr.textContent = "";
    logPassErr.textContent = "";
    if (logToast) logToast.className = "toast";
    if (logToast) logToast.textContent = "";
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearLogErrors();

    let ok = true;

    if (!emailRegex.test(logEmail.value.trim())) {
      logEmailErr.textContent = "Enter a valid email.";
      ok = false;
    }

    if (logPassword.value.length === 0) {
      logPassErr.textContent = "Password is required.";
      ok = false;
    }

    if (!ok) {
      showToast(logToast, "error", "Please fix the errors above.");
      return;
    }

    const saved = localStorage.getItem("user");
    if (!saved) {
      showToast(logToast, "error", "No account found. Please register first.");
      return;
    }

    const user = JSON.parse(saved);

    const isMatch =
      logEmail.value.trim() === user.email &&
      logPassword.value === user.password;

    if (isMatch) {
      localStorage.setItem("isLoggedIn", "true");
      showToast(logToast, "success", "Logged in successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "./feed.html";
      }, 900);
    } else {
      showToast(logToast, "error", "Incorrect email or password.");
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
    const page = document.body.getAttribute("data-page");

    const signupText = document.getElementById("signupText");
    const loginLogoutText = document.getElementById("loginLogoutText");

    // -----------------------------
    // Navbar Login / Logout Text Switch
    // -----------------------------
    if (loginLogoutText) {  // protect in case navbar is missing
        if (localStorage.getItem("loggedIn") === "true") { // if the user is logged in localStorage is true
            loginLogoutText.textContent = "Logout";
        } else {
            loginLogoutText.textContent = "Log in";
        }

        // Handle login/logout click
        loginLogoutText.addEventListener("click", function () {
            if (localStorage.getItem("loggedIn") === "true") {
                // Logout
                localStorage.removeItem("loggedIn"); // Remove "loggedIn" from localStorage, logging the user out. 
                alert("You have been logged out."); // Show a pop-up syaing: "You have been logged out"
                loginLogoutText.textContent = "Log in"; // Change the button text to "Log in" since the user is now logged out.
                window.location.href = "index.html"; // Redirect the user back to the home page (index.html).
            } else {
                // Navigate to login page
                window.location.href = "login.html";
            }
        });
    }

    // Handle sign up click
    if (signupText) {
        signupText.addEventListener("click", function () {
            window.location.href = "signup.html";
        });
    }

    // -----------------------------
    // Sign Up Page Logic
    // -----------------------------
   if (page === "signup") {
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            // Simulate saving user info for prototype
            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("loggedIn", "true");

            alert("Sign up successful! Redirecting...");
            window.location.href = "questionnaire.html";
        });
    }
}
    // -----------------------------
    // Login Page Logic
    // -----------------------------
    if (page === "login") {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            const storedEmail = localStorage.getItem("userEmail");
            const storedPassword = localStorage.getItem("userPassword"); // if you store passwords (for prototype only)

            // For your RMCE prototype, skip password check or simulate:
            if (email === storedEmail) {
                localStorage.setItem("loggedIn", "true");
                alert("Login successful! Redirecting...");
                window.location.href = "questionnaire.html";
            } else {
                alert("Invalid email or password.");
            }
        });
    }
}

    // -----------------------------
    // Questionnaire Page Logic
    // -----------------------------
    if (page === "questionnaire") {
        const questionnaireForm = document.getElementById("questionnaireForm");
        if (questionnaireForm) {
            questionnaireForm.addEventListener("submit", function (e) {
                e.preventDefault();
                // Collect interests, budget, etc. and save to localStorage here.
                alert("Preferences saved!");
                window.location.href = "recommendations.html";
            });
        }
    }

    // -----------------------------
    // Recommendations Page Logic
    // -----------------------------
    if (page === "recommendations") {
        // Your recommendation filtering and display logic will go here
    }
});

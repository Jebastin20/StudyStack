const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://studystack-backend-js08.onrender.com/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast("Login successful!", "success");

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user._id);

            window.location.href = "dashboard.html";
        } else {
            showToast(data.message || "Login failed", "error");
        }

    } catch (error) {
        console.error(error);
        showToast("Server error. Please try again.", "error");
    }
});
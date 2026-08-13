const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const age = document.getElementById("age").value;
const gender = document.getElementById("gender").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://https://studystack-backend-js08.onrender.com/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
    name,
    email,
    age,
    gender,
    password
})
        });

        const data = await response.json();

        if (response.ok) {
            showToast("Registration successful!", "success");
            window.location.href = "login.html";
        } else {
            showToast(data.message || "Registration failed", "error");
        }

    } catch (error) {
        console.error(error);
        showToast("Server error. Please try again.", "error");
    }
});
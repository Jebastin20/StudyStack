// ==========================================
// StudyStack Global Theme Manager
// ==========================================

(function () {

    const savedTheme =
        localStorage.getItem("theme") || "light";

    document.documentElement.setAttribute(
        "data-theme",
        savedTheme
    );

})();


// ==========================================
// Theme Toggle
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const themeToggle =
        document.getElementById("themeToggle");

    const themeIcon =
        document.getElementById("themeIcon");

    function updateThemeIcon(theme) {

        if (!themeIcon) {
            return;
        }

        if (theme === "dark") {

            themeIcon.className =
                "fa-solid fa-sun";

        } else {

            themeIcon.className =
                "fa-solid fa-moon";

        }

    }

    const currentTheme =
        document.documentElement.getAttribute(
            "data-theme"
        ) || "light";

    updateThemeIcon(currentTheme);

    if (!themeToggle) {
        return;
    }

    themeToggle.addEventListener("click", () => {

        const current =
            document.documentElement.getAttribute(
                "data-theme"
            );

        const newTheme =
            current === "dark"
                ? "light"
                : "dark";

        document.documentElement.setAttribute(
            "data-theme",
            newTheme
        );

        localStorage.setItem(
            "theme",
            newTheme
        );

        updateThemeIcon(newTheme);

    });

});


// ==========================================
// Global Toast Notification
// ==========================================

function showToast(message, type = "success") {

    let container =
        document.getElementById("toastContainer");

    // Create container if it doesn't exist
    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "toastContainer";

        container.style.position =
            "fixed";

        container.style.top =
            "20px";

        container.style.right =
            "20px";

        container.style.zIndex =
            "9999";

        container.style.display =
            "flex";

        container.style.flexDirection =
            "column";

        container.style.gap =
            "10px";

        document.body.appendChild(
            container
        );
    }


    const toast =
        document.createElement("div");

    toast.className =
        `alert ${
            type === "error"
                ? "alert-danger"
                : type === "warning"
                ? "alert-warning"
                : "alert-success"
        } shadow`;

    toast.style.minWidth =
        "280px";

    toast.style.marginBottom =
        "0";

    toast.textContent =
        message;

    container.appendChild(
        toast
    );


    // Remove after 3 seconds
    setTimeout(() => {

        toast.remove();

    }, 3000);

}
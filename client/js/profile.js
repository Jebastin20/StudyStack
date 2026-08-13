const API = "https://studystack-backend-js08.onrender.com/api/users";
const SUBJECT_API = "https://studystack-backend-js08.onrender.com/api/subjects";
const SESSION_API = "https://studystack-backend-js08.onrender.com/api/study-sessions";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

// ==========================================
// Check Login
// ==========================================

if (!token || !userId) {
    window.location.href = "login.html";
}

// ==========================================
// Headers
// ==========================================

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}

function logoutAndRedirect() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "login.html";
}

// ==========================================
// Load Profile
// ==========================================

async function loadProfile() {

    try {

        const response = await fetch(
            `${API}/profile/${userId}`,
            {
                method: "GET",
                headers: getHeaders()
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                logoutAndRedirect();
                return;
            }
            throw new Error("Unable to load profile");
        }

        const user = await response.json();

        console.log("PROFILE DATA:", user);

        // ==========================================
        // Profile Picture
        // ==========================================

        const profileImage =
            document.getElementById("profileImage");

        if (profileImage && user.profilePicture) {

            profileImage.src =
                user.profilePicture;

        }

        const largeProfileImage =
    document.getElementById("largeProfileImage");

if (largeProfileImage && user.profilePicture) {

    largeProfileImage.src =
        user.profilePicture;

}

        // ==========================================
        // Profile Card
        // ==========================================

        document.getElementById("profileName").textContent =
            user.name || "-";

        document.getElementById("profileEmail").textContent =
            user.email || "-";

        // ==========================================
        // Personal Information
        // ==========================================

        document.getElementById("name").textContent =
            user.name || "-";

        document.getElementById("email").textContent =
            user.email || "-";

        document.getElementById("age").textContent =
            user.age || "-";

        document.getElementById("gender").textContent =
            user.gender || "-";

    } catch (error) {

        console.error(
            "Profile Error:",
            error
        );

    }

}

// ==========================================
// View Profile Picture
// ==========================================

const profileImage =
    document.getElementById("profileImage");

const largeProfileImage =
    document.getElementById("largeProfileImage");

if (profileImage && largeProfileImage) {

    profileImage.addEventListener(
        "click",
        () => {

            largeProfileImage.src =
                profileImage.src;

        }
    );

}

// ==========================================
// Load Statistics
// ==========================================

async function loadStatistics() {

    try {

        // ==========================================
        // Get Subjects
        // ==========================================

        const subjectResponse = await fetch(
            SUBJECT_API,
            {
                method: "GET",
                headers: getHeaders()
            }
        );

        if (subjectResponse.status === 401) {
            logoutAndRedirect();
            return;
        }

        const subjects = await subjectResponse.json();

        // ==========================================
        // Get Sessions
        // ==========================================

        const sessionResponse = await fetch(
            SESSION_API,
            {
                method: "GET",
                headers: getHeaders()
            }
        );

        if (sessionResponse.status === 401) {
            logoutAndRedirect();
            return;
        }

        const sessions = await sessionResponse.json();

        // ==========================================
        // Subjects
        // ==========================================

        document.getElementById(
            "subjectCount"
        ).textContent =
            subjects.length;

        // ==========================================
        // Completed Sessions
        // ==========================================

        const completedSessions =
            sessions.filter(
                session =>
                    session.completed === true
            );

        document.getElementById(
            "completedCount"
        ).textContent =
            completedSessions.length;

        // ==========================================
        // Study Hours
        // ==========================================

        let totalMinutes = 0;

        completedSessions.forEach(session => {

            const duration =
                Number(session.duration) || 0;

            if (session.unit === "Hours") {

                totalMinutes +=
                    duration * 60;

            } else {

                totalMinutes +=
                    duration;

            }

        });

        const hours =
            Math.floor(totalMinutes / 60);

        const minutes =
            totalMinutes % 60;

        if (minutes === 0) {

            document.getElementById(
                "studyHours"
            ).textContent =
                `${hours}h`;

        } else {

            document.getElementById(
                "studyHours"
            ).textContent =
                `${hours}h ${minutes}m`;

        }

    } catch (error) {

        console.error(
            "Statistics Error:",
            error
        );

    }

}

// ==========================================
// Profile Picture Upload
// ==========================================

const profilePictureInput =
    document.getElementById("profilePictureInput");

if (profilePictureInput) {

    profilePictureInput.addEventListener(
        "change",
        async function () {

            const file = this.files[0];

            if (!file) {
                return;
            }

            // Check image type
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(file.type)) {

                alert(
                    "Please select a JPG, PNG, or WEBP image."
                );

                this.value = "";
                return;
            }

            // Check file size - 5 MB
            if (file.size > 5 * 1024 * 1024) {

                alert(
                    "Image size must be less than 5 MB."
                );

                this.value = "";
                return;
            }

            const formData = new FormData();

            formData.append(
                "profilePicture",
                file
            );

            try {

                const response = await fetch(
                    `${API}/profile-picture`,
                    {
                        method: "PUT",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: formData
                    }
                );

                // Read response as text first
                const responseText =
                    await response.text();

                console.log(
                    "UPLOAD STATUS:",
                    response.status
                );

                console.log(
                    "UPLOAD RESPONSE:",
                    responseText
                );

                let data;

                try {

                    data = JSON.parse(responseText);

                } catch (jsonError) {

                    throw new Error(
                        "Server returned an invalid response. Check the backend terminal."
                    );

                }

                if (!response.ok) {
                    if (response.status === 401) {
                        logoutAndRedirect();
                        return;
                    }

                    throw new Error(
                        data.message ||
                        "Upload failed"
                    );
                }

                console.log(
                    "Upload successful:",
                    data
                );

                // ==========================================
                // Display New Picture
                // ==========================================

                if (
                    data.user &&
                    data.user.profilePicture
                ) {

                    const profileImage =
                        document.getElementById(
                            "profileImage"
                        );

                    const largeProfileImage =
                        document.getElementById(
                            "largeProfileImage"
                        );

                    if (profileImage) {

                        profileImage.src =
                            data.user.profilePicture;

                    }

                    if (largeProfileImage) {

                        largeProfileImage.src =
                            data.user.profilePicture;

                    }

                }

                // Reload profile information
                await loadProfile();

                // Clear selected file
                profilePictureInput.value = "";

                showToast(
                    "Profile picture updated successfully!",
                    "success"
                );

            } catch (error) {

                console.error(
                    "Upload Error:",
                    error
                );

                showToast(
                    "Unable to upload image: " +
                    error.message,
                    "error"
                );

                profilePictureInput.value = "";

            }

        }
    );

}

// ==========================================
// Logout
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Are you sure you want to logout?"
                )
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("userId");

                window.location.href =
                    "login.html";

            }

        }
    );

}

// ==========================================
// Load Everything
// ==========================================

loadProfile();
loadStatistics();
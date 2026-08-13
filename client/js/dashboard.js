const USER_API = "https://studystack-backend-js08.onrender.com/api/users";
const SUBJECT_API = "https://studystack-backend-js08.onrender.com/api/subjects";
const SESSION_API = "https://studystack-backend-js08.onrender.com/api/study-sessions";
const NOTIFICATION_API = "https://studystack-backend-js08.onrender.com/api/notifications";


// ==============================
// Authentication Headers
// ==============================

function getAuthHeaders() {

    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

}

// ==============================
// Load Dashboard Profile
// ==============================

async function loadDashboardProfile() {

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
        return;
    }

    try {

        const response = await fetch(
            `${USER_API}/profile/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load profile");
        }

        const user = await response.json();

        const profileIcon =
            document.getElementById("dashboardProfileIcon");

        if (!profileIcon) {
            return;
        }

        // ==============================
        // If user has profile picture
        // ==============================

        if (user.profilePicture) {

            profileIcon.innerHTML = `
                <img
                    src="${user.profilePicture}"
                    alt="Profile"
                    class="rounded-circle"
                    style="
                        width:40px;
                        height:40px;
                        object-fit:cover;
                    "
                >
            `;

            profileIcon.classList.remove(
                "bg-light",
                "text-primary"
            );

        }

        // ==============================
        // If no profile picture
        // ==============================

        else {

            profileIcon.innerHTML = `
                <i
                    class="fa-solid fa-user text-primary"
                    style="font-size:20px;">
                </i>
            `;

        }

    } catch (error) {

        console.error(
            "Dashboard Profile Error:",
            error
        );

    }

}

// ==============================
// Load Dashboard
// ==============================

async function loadDashboard() {

    const token = localStorage.getItem("token");

    // User not logged in
    if (!token) {

        window.location.href = "login.html";

        return;

    }


    try {

        // ==============================
        // Get Subjects
        // ==============================

        const subjectRes = await fetch(SUBJECT_API, {

            method: "GET",

            headers: getAuthHeaders()

        });


        if (subjectRes.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const subjects = await subjectRes.json();


        // ==============================
        // Get Study Sessions
        // ==============================

        const sessionRes = await fetch(SESSION_API, {

            method: "GET",

            headers: getAuthHeaders()

        });


        if (sessionRes.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const sessions = await sessionRes.json();


        // ==============================
        // Total Subjects
        // ==============================

        const subjectCount =
            document.getElementById("subjectCount");

        if (subjectCount) {

            subjectCount.textContent =
                subjects.length;

        }


        // ==============================
        // Today's Date
        // ==============================

        const today =
            new Date().toISOString().split("T")[0];


        let totalMinutes = 0;

        let todayHTML = "";


        // ==============================
        // Process Sessions
        // ==============================

        sessions.forEach(session => {

            if (!session.studyDate) {

                return;

            }


            const sessionDate =
                session.studyDate.split("T")[0];


            // Only today's completed sessions
            if (
                sessionDate === today &&
                session.completed
            ) {

                // Convert duration to minutes

                if (session.unit === "Hours") {

                    totalMinutes +=
                        Number(session.duration) * 60;

                } else {

                    totalMinutes +=
                        Number(session.duration);

                }


                todayHTML += `

                    <div class="d-flex justify-content-between align-items-center border-bottom py-3">

                        <div>

                            <h6 class="mb-1">

                                ${
                                    session.subject
                                        ? session.subject.name
                                        : "Unknown Subject"
                                }

                            </h6>

                            <small class="text-muted">

                                ${session.goal}

                            </small>

                        </div>


                        <div class="text-end">

                            <span class="badge bg-success">

                                Completed

                            </span>

                            <br>

                            <small class="text-muted">

                                ${session.duration}
                                ${session.unit}

                            </small>

                        </div>

                    </div>

                `;

            }

        });


        // ==============================
        // Convert Minutes
        // ==============================

        const hours =
            Math.floor(totalMinutes / 60);

        const minutes =
            totalMinutes % 60;


        const todayHours =
            document.getElementById("todayHours");


        if (todayHours) {

            todayHours.textContent =
                `${hours}h ${minutes}m`;

        }


        // ==============================
        // Calculate Streak
        // ==============================

        function calculateStreak(sessions) {

            const completedDates = new Set();


            sessions.forEach(session => {

                if (
                    session.completed &&
                    session.studyDate
                ) {

                    completedDates.add(
                        session.studyDate
                            .split("T")[0]
                    );

                }

            });


            let streak = 0;

            let current = new Date();


            while (true) {

                const dateString =
                    current
                        .toISOString()
                        .split("T")[0];


                if (
                    completedDates.has(dateString)
                ) {

                    streak++;

                    current.setDate(
                        current.getDate() - 1
                    );

                } else {

                    break;

                }

            }


            return streak;

        }


        // ==============================
        // Display Streak
        // ==============================

        const streak =
            calculateStreak(sessions);


        const streakElement =
            document.getElementById("streak");


        if (streakElement) {

            streakElement.textContent =
                `${streak} Days`;

        }


        // ==============================
        // Today's Sessions
        // ==============================

        const todaySessionList =
            document.getElementById(
                "todaySessionList"
            );


        if (todaySessionList) {

            todaySessionList.innerHTML =
                todayHTML ||

                `

                    <p class="text-muted">

                        No Study Sessions Today

                    </p>

                `;

        }


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


// ==============================
// Start Dashboard
// ==============================

// ==========================================
// Load Notifications
// ==========================================

async function loadNotifications() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            NOTIFICATION_API,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            throw new Error(
                "Unable to load notifications"
            );

        }

        const notifications =
            await response.json();

        console.log(
            "NOTIFICATIONS:",
            notifications
        );


        // ==========================================
        // Notification Elements
        // ==========================================

        const notificationList =
            document.getElementById(
                "notificationList"
            );

        const notificationBadge =
            document.getElementById(
                "notificationBadge"
            );


        // ==========================================
        // Unread Notifications
        // ==========================================

        const unreadNotifications =
            notifications.filter(
                notification =>
                    notification.isRead === false
            );

        // ==========================================
        // Badge
        // ==========================================

        if (notificationBadge) {

            if (unreadNotifications.length > 0) {

                notificationBadge.textContent =
                    unreadNotifications.length;

                notificationBadge.style.display =
                    "block";

            } else {

                notificationBadge.style.display =
                    "none";

            }

        }


        // ==========================================
        // Display Notifications
        // ==========================================

        if (!notificationList) {
            return;
        }


        if (notifications.length === 0) {

            notificationList.innerHTML = `

                <li>
                    <h6 class="dropdown-header">
                        🔔 Notifications
                    </h6>
                </li>

                <li>
                    <p class="text-muted text-center p-3 mb-0">
                        No notifications
                    </p>
                </li>

            `;

            return;
        }


        let notificationHTML = `

            <li>
                <h6 class="dropdown-header">
                    🔔 Notifications
                </h6>
            </li>

        `;


        notifications.forEach(notification => {

    notificationHTML += `

        <li>

            <div
                class="dropdown-item
                ${notification.isRead ? "" : "bg-light"}"
                style="white-space:normal;"
            >

                <div class="d-flex justify-content-between align-items-start">

                    <div
                        class="flex-grow-1"
                        style="cursor:pointer;"
                        onclick="markNotificationAsRead('${notification._id}')"
                    >

                        <div class="fw-bold">

                            ${notification.title}

                            ${
                                !notification.isRead
                                    ? '<span class="badge bg-primary ms-2">New</span>'
                                    : ''
                            }

                        </div>

                        <small class="text-muted">

                            ${notification.message}

                        </small>

                    </div>

                    <button
                        class="btn btn-sm btn-outline-danger ms-2"
                        onclick="deleteNotification('${notification._id}', event)"
                        title="Delete notification"
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </div>

        </li>

    `;

});


        notificationList.innerHTML =
            notificationHTML;


    } catch (error) {

        console.error(
            "Notification Error:",
            error
        );

    }

}

// ==========================================
// Mark Notification As Read
// ==========================================

async function markNotificationAsRead(notificationId) {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            `${NOTIFICATION_API}/${notificationId}/read`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log(
            "Mark as read response:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to mark notification as read"
            );

        }

        // Reload notifications
        await loadNotifications();

    } catch (error) {

        console.error(
            "Mark Notification Error:",
            error
        );

    }

}

// ==========================================
// Delete Notification
// ==========================================

async function deleteNotification(notificationId, event) {

    // Prevent notification click from triggering
    event.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            `${NOTIFICATION_API}/${notificationId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        console.log(
            "Delete notification response:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete notification"
            );

        }

        // Refresh notifications
        await loadNotifications();

    } catch (error) {
        console.error(
            "Delete Notification Error:",
            error
        );
        showToast("Unable to delete notification", "error");
    }

}

loadDashboard();
loadDashboardProfile();
loadNotifications();
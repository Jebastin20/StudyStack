const SESSION_API = "http://localhost:5000/api/study-sessions";
const SUBJECT_API = "http://localhost:5000/api/subjects";

const modal = new bootstrap.Modal(
    document.getElementById("sessionModal")
);

const subjectSelect = document.getElementById("subject");
const sessionTable = document.getElementById("sessionTable");
const saveBtn = document.getElementById("saveSession");

let editingId = null;


// =========================
// Authentication Headers
// =========================

function getAuthHeaders() {

    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

}


// =========================
// Check Login
// =========================

function checkLogin() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";

        return false;

    }

    return true;

}


// =========================
// Load Subjects
// =========================

async function loadSubjects() {

    if (!checkLogin()) return;

    try {

        const res = await fetch(SUBJECT_API, {

            method: "GET",

            headers: getAuthHeaders()

        });


        if (res.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const subjects = await res.json();

        subjectSelect.innerHTML = "";


        if (subjects.length === 0) {

            subjectSelect.innerHTML = `
                <option value="">
                    No subjects available
                </option>
            `;

            return;

        }


        subjects.forEach(subject => {

            subjectSelect.innerHTML += `
                <option value="${subject._id}">
                    ${subject.name}
                </option>
            `;

        });

    } catch (error) {

        console.error("Load subjects error:", error);

    }

}


// =========================
// Load Study Sessions
// =========================

async function loadSessions() {

    if (!checkLogin()) return;

    try {

        const res = await fetch(SESSION_API, {

            method: "GET",

            headers: getAuthHeaders()

        });


        if (res.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const sessions = await res.json();

        sessionTable.innerHTML = "";


        if (sessions.length === 0) {

            sessionTable.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        No Study Sessions Found
                    </td>
                </tr>
            `;

            return;

        }


        sessions.forEach(session => {

            sessionTable.innerHTML += `

                <tr>

                    <td>
                        ${session.subject
                            ? session.subject.name
                            : "Unknown Subject"}
                    </td>

                    <td>
                        ${session.goal}
                    </td>

                    <td>
                        ${session.duration}
                        ${session.unit}
                    </td>

                    <td>
                        ${new Date(
                            session.studyDate
                        ).toLocaleDateString()}
                    </td>

                    <td>
                        ${session.startTime}
                    </td>

                    <td>

                        ${
                            session.completed

                            ? `
                                <span class="badge bg-success">
                                    Completed
                                </span>
                            `

                            : `
                                <span class="badge bg-warning text-dark">
                                    Pending
                                </span>
                            `
                        }

                    </td>

                    <td>

                        ${
                            !session.completed

                            ? `
                                <button
                                    class="btn btn-success btn-sm me-2"
                                    onclick="completeSession('${session._id}')">

                                    <i class="fa-solid fa-check"></i>

                                </button>
                            `

                            : ""
                        }


                        <button
                            class="btn btn-warning btn-sm me-2"
                            onclick="editSession('${session._id}')">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteSession('${session._id}')">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error("Load sessions error:", error);

    }

}


// =========================
// Save / Update Session
// =========================

saveBtn.addEventListener("click", async () => {

    if (!checkLogin()) return;


    const data = {

        subject: subjectSelect.value,

        goal:
            document.getElementById("goal").value.trim(),

        duration:
            document.getElementById("duration").value,

        unit:
            document.getElementById("unit").value,

        studyDate:
            document.getElementById("studyDate").value,

        startTime:
            document.getElementById("startTime").value

    };


    if (!data.subject ||
        !data.goal ||
        !data.duration ||
        !data.studyDate ||
        !data.startTime) {

        showToast("Please fill all fields.", "warning");

        return;

    }


    const url = editingId
        ? `${SESSION_API}/${editingId}`
        : SESSION_API;


    const method = editingId
        ? "PUT"
        : "POST";


    try {

        const res = await fetch(url, {

            method: method,

            headers: getAuthHeaders(),

            body: JSON.stringify(data)

        });


        if (res.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const result = await res.json();


        if (!res.ok) {
            showToast(
                result.message ||
                "Unable to save study session.",
                "error"
            );
            return;
        }


        modal.hide();

        editingId = null;


        // Reset form

        document.getElementById("goal").value = "";

        document.getElementById("duration").value = "";

        document.getElementById("studyDate").value = "";

        document.getElementById("startTime").value = "";


        loadSessions();

    } catch (error) {

        console.error("Save session error:", error);

        alert("Server Error");

    }

});


// =========================
// Delete Study Session
// =========================

async function deleteSession(id) {

    if (!confirm("Delete this session?")) {

        return;

    }


    try {

        const res = await fetch(
            `${SESSION_API}/${id}`,
            {
                method: "DELETE",
                headers: getAuthHeaders()
            }
        );


        if (res.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const data = await res.json();


        if (!res.ok) {
            showToast(
                data.message ||
                "Unable to delete session.",
                "error"
            );
            return;
        }


        loadSessions();

    } catch (error) {
        console.error("Delete session error:", error);
        showToast("Server error. Please try again.", "error");
    }

}


// =========================
// Edit Study Session
// =========================

async function editSession(id) {

    try {

        const res = await fetch(SESSION_API, {

            method: "GET",

            headers: getAuthHeaders()

        });


        if (res.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const sessions = await res.json();

        const session =
            sessions.find(s => s._id === id);


        if (!session) {
            showToast("Study session not found.", "warning");
            return;
        }


        editingId = id;


        subjectSelect.value =
            session.subject._id;


        document.getElementById("goal").value =
            session.goal;


        document.getElementById("duration").value =
            session.duration;


        document.getElementById("unit").value =
            session.unit;


        document.getElementById("studyDate").value =
            session.studyDate.split("T")[0];


        document.getElementById("startTime").value =
            session.startTime;


        modal.show();

    } catch (error) {
        console.error("Edit session error:", error);
        showToast("Unable to load study session.", "error");
    }

}


// =========================
// Complete Study Session
// =========================

async function completeSession(id) {

    if (!confirm(
        "Mark this study session as completed?"
    )) {

        return;

    }


    try {

        const res = await fetch(
            `${SESSION_API}/${id}/complete`,
            {

                method: "PUT",

                headers: getAuthHeaders()

            }
        );


        if (res.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const data = await res.json();


        if (!res.ok) {

            alert(
                data.message ||
                "Unable to complete session."
            );

            return;

        }


        loadSessions();

    } catch (error) {
        console.error(
            "Complete session error:",
            error
        );
        showToast("Server error. Please try again.", "error");
    }

}


// =========================
// Initial Load
// =========================

if (checkLogin()) {

    loadSubjects();

    loadSessions();

}
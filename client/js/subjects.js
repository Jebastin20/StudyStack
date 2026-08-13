const API = "https://studystack-backend-js08.onrender.com/api/subjects";

const modal = new bootstrap.Modal(
    document.getElementById("subjectModal")
);

const addBtn = document.getElementById("addSubjectBtn");
const saveBtn = document.getElementById("saveSubject");

const subjectTable = document.getElementById("subjectTable");

let editingId = null;


// ==============================
// Get Authentication Headers
// ==============================

function getAuthHeaders() {

    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };

}


// ==============================
// Open Add Subject Modal
// ==============================

addBtn.addEventListener("click", () => {

    editingId = null;

    document.getElementById("subjectName").value = "";

    document.querySelector(".modal-title").textContent =
        "Add Subject";

    saveBtn.textContent = "Save";

    modal.show();

});


// ==============================
// Load Subjects
// ==============================

async function loadSubjects() {

    try {

        const token = localStorage.getItem("token");

        // Check login
        if (!token) {

            window.location.href = "login.html";

            return;

        }

        const res = await fetch(API, {

            method: "GET",

            headers: getAuthHeaders()

        });


        // Token invalid / expired
        if (res.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const subjects = await res.json();

        subjectTable.innerHTML = "";


        if (subjects.length === 0) {

            subjectTable.innerHTML = `
                <tr>
                    <td colspan="2" class="text-center">
                        No Subjects Found
                    </td>
                </tr>
            `;

            return;

        }


        subjects.forEach(subject => {

            subjectTable.innerHTML += `

                <tr>

                    <td>
                        ${subject.name}
                    </td>

                    <td>

                        <button
                            class="btn btn-warning btn-sm me-2"
                            onclick="editSubject(
                                '${subject._id}',
                                '${subject.name}'
                            )">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteSubject('${subject._id}')">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        console.error("Load subjects error:", error);

    }

}


// ==============================
// Save / Update Subject
// ==============================

saveBtn.addEventListener("click", async () => {

    const name =
        document.getElementById("subjectName").value.trim();


    if (!name) {
        showToast("Please enter a subject name.", "warning");
        return;
    }


    const url = editingId
        ? `${API}/${editingId}`
        : API;


    const method = editingId
        ? "PUT"
        : "POST";


    try {

        const res = await fetch(url, {

            method: method,

            headers: getAuthHeaders(),

            body: JSON.stringify({

                name: name

            })

        });


        if (res.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const data = await res.json();


        if (!res.ok) {
            showToast(data.message || "Something went wrong.", "error");
            return;
        }


        // Reset form
        document.getElementById("subjectName").value = "";

        editingId = null;

        document.querySelector(".modal-title").textContent =
            "Add Subject";

        saveBtn.textContent = "Save";

        modal.hide();


        // Reload subjects
        loadSubjects();


    } catch (error) {
        console.error("Save subject error:", error);
        showToast("Server error. Please try again.", "error");
    }

});


// ==============================
// Delete Subject
// ==============================

async function deleteSubject(id) {

    if (!confirm("Delete this subject?")) {

        return;

    }


    try {

        const res = await fetch(`${API}/${id}`, {

            method: "DELETE",

            headers: getAuthHeaders()

        });


        if (res.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("userId");

            window.location.href = "login.html";

            return;

        }


        const data = await res.json();


        if (!res.ok) {
            showToast(data.message || "Unable to delete subject.", "error");
            return;
        }


        loadSubjects();


    } catch (error) {
        console.error("Delete subject error:", error);
        showToast("Server error. Please try again.", "error");
    }

}


// ==============================
// Edit Subject
// ==============================

function editSubject(id, name) {

    editingId = id;

    document.getElementById("subjectName").value = name;

    document.querySelector(".modal-title").textContent =
        "Edit Subject";

    saveBtn.textContent = "Update";

    modal.show();

}


// ==============================
// Initial Load
// ==============================

loadSubjects();
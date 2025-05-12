document.addEventListener("DOMContentLoaded", function() {
const membersContainer = document.getElementById("membersContainer");
const searchBox = document.getElementById("searchBox");
const popupForm = document.getElementById("popupForm");
const submitBtn = document.getElementById("submitMember");
const closeBtn = document.getElementById("closeForm");
const addMemberBtn = document.getElementById("addMemberBtn");

// Get project_id from URL (example: ?project_id=1)
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get("project_id");

let members = [];

if (!projectId) {
    alert("Project ID is required in URL (e.g., ?project_id=1)");
    return;
}

// Fetch members from backend
function fetchMembers() {
    fetch(`Backend/api/controllers/project_memb_controller.php?project_id=${projectId}`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                members = data;
                displayMembers(members);
            } else {
                alert(data.message || "Failed to load members.");
            }
        })
        .catch(error => {
            console.error("Error fetching members:", error);
            alert("Error fetching members.");
        });
}

// Display member cards
function displayMembers(data) {
    membersContainer.innerHTML = "";
    data.forEach((member, index) => {
        const card = `
            <div class="member-card">
                <img src="media/User.png" alt="${member.username}">
                <div class="text-container">
                    <h2>${member.username}</h2>
                    <p><strong>Role:</strong> ${member.role}</p>
                </div>
                <button class="delete-btn" data-userid="${member.user_id}">Delete</button>
            </div>
        `;
        membersContainer.innerHTML += card;
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('data-userid');
            deleteMember(userId);
        });
    });
}

// Delete member via API
function deleteMember(userId) {
    fetch(`Backend/api/controllers/project_memb_controller.php?project_id=${projectId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
    })
    .then(res => res.json())
    .then(result => {
        alert(result.message);
        fetchMembers();
    })
    .catch(err => {
        console.error("Delete error:", err);
        alert("Error deleting member.");
    });
}

// Submit new member
submitBtn.addEventListener("click", () => {
    const username = document.getElementById("memberName").value;
    const role = document.getElementById("memberRole").value;

    if (username && role) {
        const payload = {
            username,
            role,
            project_id: parseInt(projectId)
        };

        fetch("Backend/api/controllers/project_memb_controller.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                popupForm.classList.remove("show");
                setTimeout(() => popupForm.style.display = "none", 300);
                fetchMembers();
            }
        })
        .catch(error => {
            console.error("Add member error:", error);
            alert("Failed to add member.");
        });
    } else {
        alert("Please fill in both username and role.");
    }
});

// Show/hide form
closeBtn.addEventListener("click", () => {
    popupForm.classList.remove("show");
    setTimeout(() => popupForm.style.display = "none", 300);
});

addMemberBtn.addEventListener("click", () => {
    popupForm.style.display = "flex";
    requestAnimationFrame(() => popupForm.classList.add("show"));
});

// Filter search
searchBox.addEventListener("keyup", () => {
    const filter = searchBox.value.toLowerCase();
    const filtered = members.filter(m =>
        m.username.toLowerCase().includes(filter)
    );
    displayMembers(filtered);
});

// Initial fetch
fetchMembers();
});
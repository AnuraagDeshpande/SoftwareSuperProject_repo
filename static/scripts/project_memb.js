document.addEventListener("DOMContentLoaded", function () {
    let members = []; 
    let selectedUser = null; 

    const membersContainer = document.getElementById("membersContainer");
    const searchBox = document.getElementById("searchBox");

    const modal = document.getElementById("memberModal");
    const addBtn = document.getElementById("addMemberBtn");
    const closeBtn = document.querySelector(".closeBtn");
    const memberForm = document.getElementById("memberForm");

    function displayMembers(data) {
        membersContainer.innerHTML = "";
        data.forEach((member, index) => {
            let card = `
                <div class="member-card" data-index="${index}">
                    <img src="${member.image}" alt="${member.name}">
                    <div class="text-container">
                        <h2>${member.name}</h2>
                        <p><strong>Role:</strong> ${member.role}</p>
                        <p><strong>Task:</strong> ${member.task}</p>
                        <a href="mailto:${member.contact}">${member.contact}</a>
                        <button class="delete-btn">Delete</button>
                    </div>
                </div>
            `;
            membersContainer.innerHTML += card;
        });

        document.querySelectorAll(".delete-btn").forEach((btn, i) => {
            btn.addEventListener("click", function () {
                members.splice(i, 1);
                displayMembers(members);
            });
        });
    }

    //member modal with user fetch
    addBtn.addEventListener("click", () => {
        modal.style.display = "block";
        selectedUser = null;
        document.getElementById("assignDetails").style.display = "none";

        fetch("/api/users")
            .then(res => res.json())
            .then(data => {
                const userList = document.getElementById("userList");
                userList.innerHTML = "";
                data.forEach(user => {
                    const btn = document.createElement("button");
                    btn.textContent = `${user.name} (${user.email})`;
                    btn.addEventListener("click", () => {
                        selectedUser = user;
                        document.getElementById("assignDetails").style.display = "block";
                    });
                    userList.appendChild(btn);
                });
            });
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    //selected user and inputted role/task
    memberForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!selectedUser) return;

        const newMember = {
            name: selectedUser.name,
            contact: selectedUser.email,
            image: document.getElementById("imageInput").value || "default.jpg",
            role: document.getElementById("roleInput").value,
            task: document.getElementById("taskInput").value,
        };

        members.push(newMember);
        displayMembers(members);
        modal.style.display = "none";
        memberForm.reset();
        selectedUser = null;
        document.getElementById("assignDetails").style.display = "none";
    });


    searchBox.addEventListener("keyup", function () {
        let filter = searchBox.value.toLowerCase();
        let filteredMembers = members.filter(member =>
            member.name.toLowerCase().includes(filter) ||
            member.role.toLowerCase().includes(filter) ||
            member.task.toLowerCase().includes(filter)
        );
        displayMembers(filteredMembers);
    });
});

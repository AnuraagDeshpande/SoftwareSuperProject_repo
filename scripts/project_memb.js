document.addEventListener("DOMContentLoaded", function() {
    const members = [
        { name: "Nafiba Biru", role: "Frontend Developer", task: "Designing UI", contact: "nbiru@constructor.university", image: "media/pfp1.jpeg" },
        { name: "Efrata Bayle", role: "Frontend Developer", task: "Testing and debugging", contact: "ebayle@constructor.university", image: "media/pfp2.jpeg" },
        { name: "Timofei Podkorytov", role: "Frontend Developer", task: "CSS styling", contact: "tpodkorytov@constructor.university", image: "media/pfp3.jpeg" },
        { name: "Anuraag Deshpande", role: "Frontend Developer", task: "Designing UI", contact: "adeshpande@constructor.university", image: "media/pfp4.jpeg" },
        { name: "Zaara Valladares", role: "Backend Developer", task: "API Integration", contact: "zvalladares@constructor.university", image: "media/pfp5.jpeg" },
        { name: "Dulguun Ulzibayar", role: "Backend Developer", task: "Database management", contact: "dulziibayar@constructor.university", image: "media/pfp6.jpeg" },
        { name: "Clara Rahimzade", role: "Backend Developer", task: "Testing and debugging", contact: "crahimzade@constructor.university", image: "media/pfp7.jpeg" },
        { name: "Nijusha Amgain", role: "Backend Developer", task: "System Architecture", contact: "namgain@constructor.university", image: "media/pfp8.jpeg" }
    ];

    const membersContainer = document.getElementById("membersContainer");
    const searchBox = document.getElementById("searchBox");
    const popupForm = document.getElementById("popupForm");
    const submitBtn = document.getElementById("submitMember");
    const closeBtn = document.getElementById("closeForm");

    //close popup form
    closeBtn.addEventListener("click", () => {
        popupForm.classList.remove("show");
        setTimeout(() => popupForm.style.display = "none", 300); // match transition time
    });

    //open popup form
    document.getElementById("addMemberBtn").addEventListener("click", () => {
        popupForm.style.display = "flex";
        requestAnimationFrame(() => popupForm.classList.add("show"));
    });

    //submit form and add new member
    submitBtn.addEventListener("click", () => {
        const name = document.getElementById("memberName").value;
        const role = document.getElementById("memberRole").value;
        const task = document.getElementById("memberTask").value;
        const contact = document.getElementById("memberContact").value;
        const image = document.getElementById("memberImage").value || "media/default.jpg";

        if (name && role && task && contact) {
            const newMember = { name, role, task, contact, image };
            members.push(newMember);
            displayMembers(members);

            //clear form inputs
            document.getElementById("memberName").value = "";
            document.getElementById("memberRole").value = "";
            document.getElementById("memberTask").value = "";
            document.getElementById("memberContact").value = "";
            document.getElementById("memberImage").value = "";

            //hide form with fade-out
            popupForm.classList.remove("show");
            setTimeout(() => popupForm.style.display = "none", 300);
        } else {
            alert("Please fill in all required fields.");
        }
    });

    //display members as cards
    function displayMembers(data) {
        membersContainer.innerHTML = ""; // Clear previous cards
        data.forEach((member, index) => {
            let card = `
                <div class="member-card">
                    <img src="${member.image}" alt="${member.name}">
                    <div class="text-container">
                        <h2>${member.name}</h2>
                        <p><strong>Role:</strong> ${member.role}</p>
                        <p><strong>Task:</strong> ${member.task}</p>
                        <a href="mailto:${member.contact}">${member.contact}</a>
                    </div>
                    <button class="delete-btn" data-index="${index}">Delete</button>
                </div>
            `;
            membersContainer.innerHTML += card;
        });

        //delete button functionality
        document.querySelectorAll('.delete-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                members.splice(index, 1);  //remove member from array
                displayMembers(members);   //re-render the members
            });
        });
    }

    //initial load
    displayMembers(members);

    //search filter functionality
    searchBox.addEventListener("keyup", function() {
        let filter = searchBox.value.toLowerCase();
        let filteredMembers = members.filter(member =>
            member.name.toLowerCase().includes(filter) ||
            member.role.toLowerCase().includes(filter) ||
            member.task.toLowerCase().includes(filter)
        );
        displayMembers(filteredMembers);
    });
});

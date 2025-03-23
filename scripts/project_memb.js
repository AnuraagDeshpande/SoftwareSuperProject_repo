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

    document.getElementById("addMemberBtn").addEventListener("click", function() {
        alert("Add member form here!");
    });

    function displayMembers(data) {
        membersContainer.innerHTML = "";
        data.forEach(member => {
            let card = `
                <div class="member-card">
                    <img src="${member.image}" alt="${member.name}">
                    <div class="text-container">
                        <h2>${member.name}</h2>
                        <p><strong>Role:</strong> ${member.role}</p>
                        <p><strong>Task:</strong> ${member.task}</p>
                        <a href="mailto:${member.contact}">${member.contact}</a>
                    </div>
                </div>
            `;
            membersContainer.innerHTML += card;
        });
    }

    //initial load
    displayMembers(members);

    //search filtr
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

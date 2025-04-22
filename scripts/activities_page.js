console.log("JS is working");

function addActivity() {
    const activityList = document.getElementById("activity-list");
    const newActivity = prompt("Enter a new activity:");
    if (newActivity && newActivity.trim() !== "") {
        const li = document.createElement("li");
        li.innerHTML = `${newActivity} <button class="delete-btn" onclick="removeActivity(this)">X</button>`;
        activityList.appendChild(li);
        saveActivities();
    }
}

// Delete activity
function removeActivity(button) {
    if (confirm("Remove this activity?")) {
        button.parentElement.remove();
        saveActivities();
    }
}

function saveActivities() {
    const items = [...document.querySelectorAll("#activity-list li")].map(li => li.firstChild.textContent.trim());
    localStorage.setItem("activities", JSON.stringify(items));
}

function loadActivities() {
    const data = JSON.parse(localStorage.getItem("activities") || "[]");
    const activityList = document.getElementById("activity-list");
    activityList.innerHTML = "";
    data.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `${item} <button class="delete-btn" onclick="removeActivity(this)">X</button>`;
        activityList.appendChild(li);
    });
}

function manageSchedule() {
    alert("Manage Scheduling button clicked!");
}

function projectSettings() {
    alert("Project Settings button clicked!");
}

// Add and remove team members
function addMember() {
    let memberName = document.getElementById("member-name").value;
    if (memberName.trim() === "") {
        alert("Please enter a name!");
        return;
    }

    let teamList = document.getElementById("team-list");
    let listItem = document.createElement("li");
    listItem.innerHTML = `${memberName} <button class="delete-btn" onclick="removeMember(this)">X</button>`;

    teamList.appendChild(listItem);
    document.getElementById("member-name").value = "";
    saveTeam();
}

function removeMember(button) {
    if (confirm("Remove this member?")) {
        button.parentElement.remove();
        saveTeam();
    }
}

function saveTeam() {
    const items = [...document.querySelectorAll("#team-list li")].map(li => li.firstChild.textContent.trim());
    localStorage.setItem("team", JSON.stringify(items));
}

function loadTeam() {
    const data = JSON.parse(localStorage.getItem("team") || "[]");
    const teamList = document.getElementById("team-list");
    teamList.innerHTML = "";
    data.forEach(name => {
        const li = document.createElement("li");
        li.innerHTML = `${name} <button class="delete-btn" onclick="removeMember(this)">X</button>`;
        teamList.appendChild(li);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 500,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: [
            {
                title: 'Kickoff Meeting',
                start: '2025-04-05'
            },
            {
                title: 'Prototype Demo',
                start: '2025-04-12',
                end: '2025-04-14'
            },
            {
                title: 'Final Review',
                start: '2025-04-28'
            }
        ]
    });
    calendar.render();

    loadActivities();
    loadTeam();
});

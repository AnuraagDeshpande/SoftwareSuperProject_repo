import { ProjectCharter } from "./project_charter.js";

console.log("JS is working");

const params = new URLSearchParams(window.location.search);
const projectId = params.get("projectId");

if (!projectId) {
  alert("No project selected.");
  // Optional: redirect to main page
  // window.location.href = "index.html";
}

// Temporary mock database — replace with real fetch logic later (backend work)
const mockProjects = [
    {
      id: "abc123", // replace with actual ID from project_list.js if hardcoded
      projectName: "Project on projects",
      desc: "This project aims at projecting project projects at project.",
      manager: "User321",
      owner: "User123",
      status: "active"
    },
    {
      id: "def456",
      projectName: "Another Project",
      desc: "Different project goals and scope.",
      manager: "User555",
      owner: "User666",
      status: "finished"
    }
  ];
  
  // Find the matching project
  const project = mockProjects.find(p => p.id === projectId);
  
  if (project) {
    // Populate the UI
    document.getElementById("project-name").innerText = project.projectName;
    document.getElementById("project-desc").innerText = project.desc;
    document.getElementById("project-manager").innerText = project.manager;
    document.getElementById("project-owner").innerText = project.owner;
    document.getElementById("project-status").innerText = project.status;
  } else {
    console.error("Project not found for ID:", projectId);
  }

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
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("projectId");
  
    if (!projectId) {
      alert("No project selected.");
      return;
    }
  
    window.location.href = `gantt_chart.html?projectId=${projectId}`;
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

async function loadProjectDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('projectId');

  if (!projectId) {
    console.error("No project ID found in URL.");
    return;
  }

  try {
    const data = await ProjectCharter.create(projectId); // Assuming create() returns a Promise with project data

    document.getElementById('project-name').textContent = data.project_name || 'N/A';
    document.getElementById('project-desc').textContent = data.description || 'N/A';
    document.getElementById('project-manager').textContent = data.managers || 'N/A';
    document.getElementById('project-owner').textContent = data.owners || 'N/A';
    document.getElementById('project-status').textContent = data.status || 'N/A';
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// You can now call this function manually wherever needed
loadProjectDetails();

// Call the function with the projectId from the URL
document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("projectId");

    if (projectId) {
        loadProjectData(projectId);  // Load the project data if projectId is available
    } else {
        alert("No project selected.");
    }
});

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

    // Call loadProjectData to fetch and display the project data once the page loads
    if (projectId) {
        loadProjectData(projectId);
    }
});

const ganttFrame = document.getElementById("gantt-frame");
if (ganttFrame && projectId) {
  ganttFrame.src = `gantt_chart.html?projectId=${projectId}`;
}

function goToProjectMembers() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("projectId");
  
    if (!projectId) {
      alert("No project selected.");
      return;
    }
  
    window.location.href = `project_memb.html?project_id=${projectId}`;
  }

  export function goToCharter() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("projectId");
  
    if (!projectId) {
      alert("No project selected.");
      return;
    }
  
    window.location.href = `project_charter.php?project_id=${projectId}`;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.activity-checkbox');
    const progressBar = document.getElementById('custom-progress-bar');
  
    function updateProgress() {
      const total = checkboxes.length;
      const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  
      if (progressBar) {
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${percent}%`;
      }
    }
  
    checkboxes.forEach(cb => cb.addEventListener('change', updateProgress));
  
    // Initialize on load
    updateProgress();
  });
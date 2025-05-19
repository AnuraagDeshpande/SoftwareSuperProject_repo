console.log("JS is working");

const params = new URLSearchParams(window.location.search);
const projectId = params.get("projectId");

if (!projectId) {
  alert("No project selected.");
  // Optional: redirect to main page
  // window.location.href = "index.html";
}

async function getTasks(id){
  const path = `${BASE_URL}/routes/tasks.php?project_id=${projectId}`;
  try{
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data.data;
  } catch(error){
      console.error("Fetch error:", error);
      return null;
  }
}

function displayTable(){
  getTasks(projectId).then((tasks)=>{
    const table = document.querySelector(".activity-table tbody");
    if(table){
      let newInerts ="";
      tasks.forEach(task =>{
        let statusClass="";
        switch(task.status){
          case "Completed":
            statusClass="completed";
            break;
          case "Pending":
            statusClass ="not-started";
            break;
          case "In Progress":
            statusClass = "in-progress";
            break;
        }

        const checked = task.status === "Completed" ? "checked" : "";

        newInerts+=`
        <tr>
          <td><input type="checkbox" class="activity-checkbox" ${checked} /></td>
          <td>${task.title}</td>
          <td class="status ${statusClass}">${task.status}</td>
          <td>${task.startdate}</td>
          <td>${task.deadline}</td>
        </tr>
        `;
      });

      table.innerHTML = newInerts;

      // Re-select and re-bind checkbox listeners
      const checkboxes = table.querySelectorAll('.activity-checkbox');
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

      // Initial progress update after loading tasks
      updateProgress();

    } else {
      console.error("NO FUCKING TABLE FOUND CRYING STARTS");
    }
  });
}

displayTable();


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
    if(activityList){
      activityList.innerHTML = "";
      data.forEach(item => {
          const li = document.createElement("li");
          li.innerHTML = `${item} <button class="delete-btn" onclick="removeActivity(this)">X</button>`;
          activityList.appendChild(li);
      });
    } else {
      console.log("no activity list was found =(");
    }
}

function manageSchedule() {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("projectId");
  
    if (!projectId) {
      alert("No project selected.");
      return;
    }
  
    window.location.href = `gantt_chart.php?projectId=${projectId}`;
}

//manageSchedule();

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
    if(teamList){
      teamList.innerHTML = "";
      data.forEach(name => {
          const li = document.createElement("li");
          li.innerHTML = `${name} <button class="delete-btn" onclick="removeMember(this)">X</button>`;
          teamList.appendChild(li);
      });
    } else {
      console.log("not team list found whateber");
    }
}

import { ProjectCharter } from './project_charter.js'; // adjust path if needed

async function loadProjectDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('projectId');
  const userId = window.user_id;

  console.log("Debug: projectId =", projectId);
  console.log("Debug: userId =", userId);

  if (!userId) {
    console.error("Missing user ID.");
    return;
  }

  if (!projectId) {
    console.error("Missing project ID.");
    return;
  }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch project');
    }

    // Fetch charter data (name, desc, status)
    const charter = await ProjectCharter.create(projectId);

    // Update DOM with charter info
    document.getElementById('project-name').textContent = charter.title || 'N/A';
    document.getElementById('project-desc').textContent = charter.desc || 'N/A';
    document.getElementById('project-status').textContent = charter.status || 'N/A';
    document.getElementById('project-objective').textContent = (charter.objective || []).join(', ') || 'N/A';
    document.getElementById('project-deadline').textContent = (charter.deadline || []).join(', ') || 'N/A';

  } catch (error) {
    console.error("Fetch error:", error);
  }


document.addEventListener('DOMContentLoaded', () => {
  const projectId = new URLSearchParams(window.location.search).get('projectId');
  if (projectId) {
    loadProjectDetails();
  } else {
    console.error('No project ID provided in URL');
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    /*const calendarEl = document.getElementById('calendar');
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
    calendar.render();*/

    loadActivities();
    loadTeam();

    // Call loadProjectData to fetch and display the project data once the page loads
    if (projectId) {
        //loadProjectData(projectId);
    }
});

const ganttFrame = document.getElementById("gantt-frame");
if (ganttFrame && projectId) {
  ganttFrame.src = `gantt_chart.php?projectId=${projectId}`;
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

  function goToCharter() {
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

window.goToCharter = goToCharter;
window.goToProjectMembers = goToProjectMembers;
window.manageSchedule = manageSchedule;
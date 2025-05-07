console.log("JS is working");

document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('.view-gantt-btn').addEventListener('click', viewGantt);
    document.querySelector('.view-members-btn').addEventListener('click', viewMembers);
    document.querySelector('.view-project-charter-btn').addEventListener('click', viewProjectCharter);
});

function viewGantt() {
    alert("View Gantt Chart button clicked!");
}

function viewMembers() {
    alert("View Members button clicked!");
}

function viewProjectCharter() {
    alert("View Project Charter button clicked!");
}

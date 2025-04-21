document.addEventListener('DOMContentLoaded', function () {
    // ================================
    // Navigation Section
    // ================================

    const body = document.body;
    const navbar = document.createElement("nav");
    navbar.classList.add("navbar");

    const navLeft = document.createElement("div");
    navLeft.classList.add("nav-left");
    const pages = ["Dashboard", "Tasks", "Gantt & Reports", "Documents", "Milestones", "Timesheet", "Issues", "Users"];
    pages.forEach(page_name => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = page_name;
        navLeft.appendChild(link);
    });


    const navRight = document.createElement("div");
    navRight.classList.add("nav-right");
    const icons = ["fa-gear", "fa-magnifying-glass", "fa-circle-user"];
    icons.forEach(icon_symbol => {
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", icon_symbol);
        navRight.appendChild(icon);
    });

    navbar.appendChild(navLeft);
    navbar.appendChild(navRight);
    body.appendChild(navbar);

    // ================================
    // Tasks Search Section
    // ================================

    const taskOverview = document.createElement("div");
    taskOverview.classList.add("task-overview");


    const taskSearchPanel = document.createElement("div");
    taskSearchPanel.classList.add("task-search-panel");
    taskOverview.appendChild(taskSearchPanel);


    const filters = [
        { label: "Project Name", id: "filter-project-name", type: "text", placeholder: "Search by project name" },
        { label: "Description", id: "filter-description", type: "text", placeholder: "Search by description" },
        { label: "Assigned By", id: "filter-assignee", type: "select", options: ["None", "PM 1", "PM 2", "PM 3"] }
    ];

    filters.forEach(filter => {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-container");

        const label = document.createElement("label");
        label.setAttribute("for", filter.id);
        label.textContent = filter.label;
        inputContainer.appendChild(label);

        if (filter.type === "text") {
            const input = document.createElement("input");
            input.type = filter.type;
            input.id = filter.id;
            input.placeholder = filter.placeholder;
            inputContainer.appendChild(input);
        } else if (filter.type === "select") {
            const select = document.createElement("select");
            select.id = filter.id;
            filter.options.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.value = option.toLowerCase().replace(" ", "");
                optionElement.textContent = option;
                select.appendChild(optionElement);
            });
            inputContainer.appendChild(select);
        }

        taskSearchPanel.appendChild(inputContainer);
    });


    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.id = "btn-search";
    searchButton.addEventListener('click', searchTasks);
    taskSearchPanel.appendChild(searchButton);

    body.appendChild(taskOverview);

    const taskManagementPanel = document.createElement("div");
    taskManagementPanel.classList.add("task-management-panel");

    const addButton = document.createElement("button");
    addButton.textContent = "Add Task";
    addButton.id = "btn-add-task";
    addButton.addEventListener('click', openModal);
    taskManagementPanel.appendChild(addButton);

    const sortButton = document.createElement("button");
    sortButton.textContent = "Sort";
    sortButton.id = "btn-sort";
    sortButton.addEventListener('click', sortTasks);
    taskManagementPanel.appendChild(sortButton);

    const printButton = document.createElement("button");
    printButton.textContent = "Print";
    printButton.id = "btn-print";
    printButton.addEventListener('click', printTasks);
    taskManagementPanel.appendChild(printButton);

    taskOverview.appendChild(taskManagementPanel);



    // ================================
    // Modal Section
    // ================================
    
    const taskDialog = document.createElement("dialog");
    taskDialog.classList.add("task-dialog");
    const taskModalContainer = document.createElement("div");
    taskModalContainer.classList.add("taskmodal-container");
    taskDialog.appendChild(taskModalContainer);

    const modalContent = [
        { label: "Title", id: "taskTitle", type: "text", placeholder: "Enter task title" },
        { label: "Priority", id: "taskpriority", type: "select", options: ["None", "Urgent", "High", "Medium", "Low"] },
        { label: "Description", id: "taskDescription", type: "textarea", placeholder: "Enter task description" },
        { label: "Project Name", id: "projectName", type: "text", placeholder: "Enter project name" },
        { label: "Assigned By", id: "assignedBy", type: "text", placeholder: "Enter assignee's name" },
        { label: "Due Date", id: "dueDate", type: "date" }
    ];

    modalContent.forEach(input_val => {
        const inputContainer = document.createElement("div");
        inputContainer.classList.add("input-modal");

        const label = document.createElement("label");
        label.setAttribute("for", input_val.id);
        label.textContent = input_val.label;
        inputContainer.appendChild(label);

        if (input_val.type === "select") {
            const select = document.createElement("select");
            select.id = input_val.id;
            input_val.options.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.value = option.toLowerCase();
                optionElement.textContent = option;
                select.appendChild(optionElement);
            });
            inputContainer.appendChild(select);
        } else {
            const input = document.createElement(input_val.type === "textarea" ? "textarea" : "input");
            input.type = input_val.type;
            input.id = input_val.id;
            input.placeholder = input_val.placeholder;
            inputContainer.appendChild(input);
        }

        taskModalContainer.appendChild(inputContainer);
    });


    const taskModalBtns = document.createElement("div");
    taskModalBtns.classList.add("taskmodal-btn");

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add Task";
    addBtn.id = "btn-add";
    addBtn.addEventListener('click', addTask);
    taskModalBtns.appendChild(addBtn);

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.id = "btn-close";
    closeBtn.addEventListener('click', closeModal);
    taskModalBtns.appendChild(closeBtn);

    taskModalContainer.appendChild(taskModalBtns);
    body.appendChild(taskDialog);




    // ================================
    // Kanban-Board Section
    // ================================
    const kanbanBoard = document.createElement("div");
    kanbanBoard.classList.add("kanban-board");


    const tasks = [
        {
            name: "Assign Tasks",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum, laudantium maxime iusto omnis animi.",
            project: "PM tasks",
            dueDate: "March 20, 2025",
            assignedBy: "John Doe",
            priority: "high",
            backlog: "Backlog"
        }
    ];

    const classes = [
        { id: "openTasks", title: "Open" },
        { id: "devTasks", title: "Development" },
        { id: "testTasks", title: "In Test" },
        { id: "closedTasks", title: "Closed" },
        { id: "abortedTasks", title: "Unresolved" }
    ];

    classes.forEach(column => {
        const kanbanClass = document.createElement("div");
        kanbanClass.classList.add("kanban-class");
        kanbanClass.id = column.id;

        const title_el = document.createElement("div");
        title_el.classList.add("kanban-class-title");
        const h3 = document.createElement("h3");
        h3.textContent = column.title;
        title_el.appendChild(h3);

        kanbanClass.appendChild(title_el);
        kanbanBoard.appendChild(kanbanClass);
    });


    document.body.appendChild(kanbanBoard);

    // ================================
    // Add Task / Rendering Tasks
    // ================================

    function renderTasks() {
        const class_choice = {
            "Backlog": document.getElementById("openTasks"),
            "Development": document.getElementById("devTaks"),
            "In Test": document.getElementById("testTasks"),
            "Closed": document.getElementById("closedTasks"),
            "Unresolved": document.getElementById("abortedTasks")

        };

        const kanban_classes = document.querySelectorAll(".kanban-class");

        kanban_classes.forEach(column => {
            column.querySelectorAll('.task').forEach(task => task.remove());
        });

        tasks.forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task");
            taskDiv.setAttribute("draggable", "true");

            const taskHeader = document.createElement("div");
            taskHeader.classList.add("task-header");

            const urgencyLabel = document.createElement("span");
            urgencyLabel.classList.add("urgency-label", task.priority);
            const urgencyIcon = document.createElement("i");
            urgencyIcon.classList.add("fa-solid", "fa-circle");
            urgencyLabel.appendChild(urgencyIcon);
            taskHeader.appendChild(urgencyLabel);

            const optionsLink = document.createElement("a");
            optionsLink.classList.add("task-options");
            const optionsIcon = document.createElement("i");
            optionsIcon.classList.add("fa-solid", "fa-ellipsis-vertical");
            optionsLink.appendChild(optionsIcon);
            taskHeader.appendChild(optionsLink);
            taskDiv.appendChild(taskHeader);

            const taskBody = document.createElement("div");
            taskBody.classList.add("task-body");
            const taskName = document.createElement("h4");
            taskName.classList.add("task-name");
            taskName.textContent = task.name;
            const taskDescription = document.createElement("p");
            taskDescription.classList.add("task-description");
            taskDescription.textContent = task.description;
            taskBody.appendChild(taskName);
            taskBody.appendChild(taskDescription);
            taskDiv.appendChild(taskBody);


            const taskMeta = document.createElement("div");
            taskMeta.classList.add("task-meta");
            const projectName = document.createElement("span");
            projectName.classList.add("project-name");
            projectName.innerHTML = `<i class="fa-solid fa-folder"></i> Project: ${task.project}`;
            const dueDate = document.createElement("span");
            dueDate.classList.add("due-date");
            dueDate.innerHTML = `<i class="fa-solid fa-calendar"></i> Due: ${task.dueDate}`;
            const assignedBy = document.createElement("span");
            assignedBy.classList.add("assigned-to");
            assignedBy.innerHTML = `<i class="fa-solid fa-user"></i> Assigned By: ${task.assignedBy}`;
            const backlogLabel = document.createElement("span");
            backlogLabel.classList.add("backlog-label");
            backlogLabel.innerHTML = `<i class="fa-solid fa-clipboard-list"></i> ${task.backlog}`;
            taskMeta.appendChild(projectName);
            taskMeta.appendChild(dueDate);
            taskMeta.appendChild(assignedBy);
            taskMeta.appendChild(backlogLabel);
            taskDiv.appendChild(taskMeta);

            const task_col = class_choice[task.backlog];
            if (task_col) {
                task_col.appendChild(taskDiv);
            }
        });

        drag_drop();

    }


    function openModal() {
        document.querySelector("dialog").showModal();
    }

    function closeModal() {
        document.querySelector("dialog").close();
    }

    function addTask() {
        const title = document.getElementById("taskTitle").value.trim();
        const priority = document.getElementById("taskpriority").value.trim();
        const description = document.getElementById("taskDescription").value.trim();
        const project = document.getElementById("projectName").value.trim();
        const assignedBy = document.getElementById("assignedBy").value.trim();
        const dueDate = document.getElementById("dueDate").value.trim();

        if (!title || !project) {
            alert("Please enter a valid value");
            return;
        }

        const taskCard = {
            name: title,
            description: description,
            project: project,
            dueDate: dueDate,
            assignedBy: assignedBy,
            priority: priority,
            backlog: "Backlog"
        };

        tasks.push(taskCard);
        renderTasks();

        document.getElementById("taskTitle").value = "";
        document.getElementById("taskpriority").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("projectName").value = "";
        document.getElementById("assignedBy").value = "";
        document.getElementById("dueDate").value = "";

        closeModal();
    };


    // ================================
    // Drag/Drop
    // ================================
    function drag_drop() {
        const draggables = document.querySelectorAll(".task");
        const droppables = document.querySelectorAll(".kanban-class");

        draggables.forEach((task) => {
            task.setAttribute("draggable", "true");
            task.addEventListener('dragstart', (e) => {
                e.target.classList.add("is-dragging");
            });

            task.addEventListener('dragend', (e) => {
                e.target.classList.remove("is-dragging");
            });
        });

        droppables.forEach((zone) => {
            zone.addEventListener("dragover", (e) => {
                e.preventDefault();
                const closestTask = insertAboveTask(zone, e.clientY);
                if (closestTask) {
                    zone.insertBefore(document.querySelector(".is-dragging"), closestTask);
                }
            });

            zone.addEventListener("drop", (e) => {
                e.preventDefault();
                const draggedTask = document.querySelector(".is-dragging");
                if (draggedTask) {
                    const closestTask = insertAboveTask(zone, e.clientY);
                    if (closestTask) {
                        zone.insertBefore(draggedTask, closestTask);
                    } else {
                        zone.appendChild(draggedTask);
                    }
                    draggedTask.classList.remove("is-dragging");
                }
            });
        });

        const insertAboveTask = (zone, mouseY) => {
            const draggableTasks = [...zone.querySelectorAll(".task:not(.is-dragging)")];
            if (draggableTasks.length === 0) {
                return null;
            }
            return draggableTasks.reduce((closest, currentTask) => {
                const box = currentTask.getBoundingClientRect();
                const offset = mouseY - box.top - box.height / 2;

                if (offset < 0 && offset > closest.offset) {
                    return { offset, element: currentTask };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        };

    }




    // ================================
    // Search Function
    // ================================
    function searchTasks() {

    }



    // ================================
    // Sort Function
    // ================================
    function sortTasks() {

    }



    // ================================
    // Print Function
    // ================================
    function printTasks() {
        const PDF_element = document.getElementsByClassName("kanban-board");
        const options = {
            margin: 10,
            filename: 'tasks.pdf',
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'landscape',
                autoPaging: true,
                PageBreak: 'auto'
            },
            scale: 0.9,
        };
        const array_elements = Array.from(PDF_element);
        array_elements.forEach(el => {
            html2pdf().from(el).set(options).save();
        });
    };


    renderTasks();

});

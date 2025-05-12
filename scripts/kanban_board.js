const API_BASE_URL = '/SoftwareSuperProject_repo/Backend/api/routes/tasks.php';

document.addEventListener('DOMContentLoaded', function () {
    // let tasks = [
    //     { id: 1, title: "Implement SEO Strategy", description: "Optimize the website for SEO by implementing keywords, meta descriptions, and alt text.", project: "Website Redesign", deadline: "May 18, 2025", status: "In Progress" },
    //     { id: 2, title: "Deploy Website to Production", description: "Deploy the website to the live production server and monitor for issues.", project: "Website Redesign", deadline: "May 25, 2025", status: "Pending" },
    //     { id: 3, title: "Review and Approve Final Design", description: "Review the final design with the team and get approval before proceeding with development.", project: "Website Redesign", deadline: "May 4, 2025", status: "Completed" }
    // ];

    let tasks = [];

    const body = document.body;

    //Fetch the tasks 
    function fetch_tasks() {
        fetch(API_BASE_URL)
            .then(response => response.json())
            .then(data => {
                tasks = data.data;
                render_tasks();
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // sending a POST request to add task
    // function AddTasks(task_card) {
    //     fetch(API_BASE_URL, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(task_card),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.success) {
    //                 // tasks.push(data.data);
    //                 // render_tasks();
    //                 fetch_tasks();
    //             }
    //         })
    //         .catch(error => console.error('Error adding task:', error));
    // }
    function AddTasks(task_card) {
        console.log("Sending task data:", task_card);  // Log the task data before sending the request
    
        fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task_card),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Response from API:", data);  // Log the API response
                if (data.success) {
                    console.log("Task added successfully.");
                    fetch_tasks();  // Fetch tasks again after adding
                } else {
                    console.log("Error: Task addition was not successful");
                }
            })
            .catch(error => {
                console.error('Error adding task:', error);  // Log the error if something goes wrong
            });
    }    

    //Removes task
    function remove_task(taskID) {
        fetch(`${API_BASE_URL}/${taskID}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    tasks = tasks.filter(task => task.id !== taskID);
                    render_tasks();
                } else {
                    console.error('Error deleting task');
                }
            })
            .catch(error => console.error('Error deleting task:', error));
    }


    // Creates a Navbar
    function create_navbar() {
        const navbar = document.createElement("nav");
        navbar.classList.add("navbar_kb");

        // Create the left side of the navbar
        const nav_left = document.createElement("div");
        nav_left.classList.add("nav-left");
        const page_title = document.createElement("h2");
        page_title.innerText = "Kanban-Board";
        nav_left.appendChild(page_title);

        // Create the right side of the navbar
        const nav_right = document.createElement("div");
        nav_right.classList.add("nav-right");
        const icons = ["fa-gear", "fa-magnifying-glass", "fa-circle-user"];
        icons.forEach(icon_symbol => {
            const icon = document.createElement("i");
            icon.classList.add("fa-solid", icon_symbol);
            nav_right.appendChild(icon);
        });

        navbar.appendChild(nav_left);
        navbar.appendChild(nav_right);
        body.appendChild(navbar);
    }

    // Creates the task overview panel with search and Management panel
    function create_task_overview() {
        const task_overview = document.createElement("div");
        task_overview.classList.add("task-overview");

        const task_search_panel = document.createElement("div");
        task_search_panel.classList.add("task-search-panel");
        task_overview.appendChild(task_search_panel);

        // function to create the elements
        create_search_filters(task_search_panel);
        create_task_management_panel(task_overview);

        body.appendChild(task_overview);
    }

    // Creates the search filter
    function create_search_filters(panel) {
        const filters = [
            { label: "Project Name", id: "filter-project-name", type: "text", placeholder: "Search by project name" },
            { label: "Description", id: "filter-description", type: "text", placeholder: "Search by description" },
        ];

        filters.forEach(filter => {
            const input_container = document.createElement("div");
            input_container.classList.add("input-container");

            const label = document.createElement("label");
            label.setAttribute("for", filter.id);
            label.innerText = filter.label;
            input_container.appendChild(label);

            const input = document.createElement("input");
            input.type = filter.type;
            input.id = filter.id;
            input.placeholder = filter.placeholder;
            input_container.appendChild(input);


            panel.appendChild(input_container);

        });

        const search_button = document.createElement("button");
        search_button.innerText = "Search";
        search_button.id = "btn-search";
        search_button.addEventListener('click', search_tasks);
        panel.appendChild(search_button);

    }

    //creates the panel for the buttons sorting , adding and
    function create_task_management_panel(task_overview) {
        const panel = document.createElement("div");
        panel.classList.add("task-management-panel");

        const select_container = document.createElement("div");
        select_container.classList.add("input-container");

        const select_label = document.createElement("label");
        select_label.setAttribute("for", "filter-sort-by");
        select_label.innerText = "Sort By";
        select_container.appendChild(select_label);

        const select = document.createElement("select");
        select.id = "filter-sort-by";
        select.innerHTML = `
        <option value="none">None</option>
        <option value="task-name">Task Name</option>
        <option value="deadline">Deadline</option>
    `;
        select_container.appendChild(select);
        panel.appendChild(select_container);

        const sortButton = document.createElement("button");
        sortButton.innerText = "Sort";
        sortButton.id = "btn-sort";
        sortButton.addEventListener('click', sort_tasks);
        panel.appendChild(sortButton);

        const addButton = document.createElement("button");
        addButton.innerText = "Add Task";
        addButton.id = "btn-add-task";
        addButton.addEventListener('click', () => create_task_modal());

        panel.appendChild(addButton);

        const printButton = document.createElement("button");
        printButton.innerText = "Print";
        printButton.id = "btn-print";
        printButton.addEventListener('click', print_tasks);
        panel.appendChild(printButton);

        task_overview.appendChild(panel);
    }

    // Creates a dialog for adding tasks
    function create_task_modal(data = null) {
        let task_dialog = document.getElementById("task_dialog");

        if (!task_dialog) {
            task_dialog = document.createElement("dialog");
            task_dialog.id = "task_dialog";
            task_dialog.classList.add("task-dialog");

            document.body.appendChild(task_dialog);
        }

        task_dialog.innerHTML = "";

        const task_modal_container = document.createElement("div");
        task_modal_container.classList.add("taskmodal-container");
        task_dialog.appendChild(task_modal_container);

        const taskmodal_title = document.createElement("h2");
        taskmodal_title.innerText = data ? `Edit Task: ${data.title}` : "Enter Task Details";
        task_modal_container.appendChild(taskmodal_title);

        const modal_content = [
            { label: "Title:", id: "taskTitle", type: "text", placeholder: "Enter task title" },
            { label: "Description:", id: "taskDescription", type: "textarea", placeholder: "Enter task description" },
            { label: "Project Name:", id: "projectName", type: "text", placeholder: "Enter project name" },
            { label: "Deadline:", id: "deadline", type: "date" }
        ];

        modal_content.forEach(input_val => {

            const input_container = document.createElement("div");
            input_container.classList.add("input-modal");

            const label = document.createElement("label");
            label.setAttribute("for", input_val.id);
            label.innerText = input_val.label;
            input_container.appendChild(label);

            const input = document.createElement(input_val.type === "textarea" ? "textarea" : "input");
            input.type = input_val.type;
            input.id = input_val.id;
            input.placeholder = input_val.placeholder;
            input_container.appendChild(input);

            task_modal_container.appendChild(input_container);
        });

        const task_modal_buttons = document.createElement("div");
        task_modal_buttons.classList.add("taskmodal-btn");

        const add_button = document.createElement("button");
        add_button.innerText = data ? "Edit Task" : "Add Task";
        add_button.id = "btn-add";
        task_modal_buttons.appendChild(add_button);

        const close_button = document.createElement("button");
        close_button.innerText = "Close";
        close_button.id = "btn-close";
        close_button.addEventListener('click', () => {
            close_modal();
        });
        task_modal_buttons.appendChild(close_button);

        task_modal_container.appendChild(task_modal_buttons);
        document.body.appendChild(task_dialog);

        if (data) {
            document.getElementById("taskTitle").value = data.title;
            document.getElementById("taskDescription").value = data.description;
            document.getElementById("projectName").value = data.project;
            document.getElementById("deadline").value = data.deadline;
            add_button.addEventListener('click', () => update_task(data.id)); //*
        } else {
            add_button.addEventListener('click', add_task);
        }

        task_dialog.showModal();

    }

    function close_modal() {
        document.getElementById("task_dialog").close();
        if (task_dialog) {
            if (task_dialog.open) {
            task_dialog.close();
            }
            task_dialog.remove();  // Cleanly remove from DOM so fresh dialog gets created next time
        }
    }


    // Creates the board with columns
    function create_kanban_board() {
        const kanban_board = document.createElement("div");
        kanban_board.classList.add("kanban-board");

        const columns = [
            { id: "Pending", title: "Pending", status: "Pending" },
            { id: "In_progress", title: "In Progress", status: "In Progress" },
            { id: "Completed", title: "Completed", status: "Completed" },
        ];

        //Creating each column
        columns.forEach(column => {
            const kanban_class = document.createElement("div");
            kanban_class.classList.add("kanban-class");
            kanban_class.id = column.id;
            kanban_class.dataset.status = column.status;

            const title_element = document.createElement("div");
            title_element.classList.add("kanban-class-title");
            const h3 = document.createElement("h3");
            h3.innerText = column.title;
            title_element.appendChild(h3);

            kanban_class.appendChild(title_element);
            kanban_board.appendChild(kanban_class);
        });

        body.appendChild(kanban_board);
    }

    // Render task on Kanban board
    function render_tasks() {
        console.log("Rendering tasks:", tasks);
        const kanban_classes = document.querySelectorAll(".kanban-class");

        //removing all existing tasks
        kanban_classes.forEach(column => {
            column.querySelectorAll('.task').forEach(task => task.remove());
        });

        const kanban_status = {
            "Pending": "Pending",
            "In Progress": "In_progress",
            "Completed": "Completed",
        };

        // creates task and places them in the column 
        tasks.forEach(task => {

            task.id = Number(task.id); //making sure the id is number not string

            const task_div = create_task_element(task);
            const column_belong = kanban_status[task.status];
            const column = document.getElementById(column_belong);
            if (column) {
                column.appendChild(task_div);
            }
        });

        drag_drop();
    }

    // Creates Task Element
    function create_task_element(task) {

        const task_div = document.createElement("div");
        task_div.classList.add("task");
        task_div.setAttribute("draggable", "true");
        task_div.dataset.taskId = task.id;

        const task_header = document.createElement("div");
        task_header.classList.add("task-header");

        const options_link = document.createElement("a");
        options_link.classList.add("task-options");
        const options_icon = document.createElement("i");
        options_icon.classList.add("fa-solid", "fa-xmark");
        options_link.appendChild(options_icon);
        task_header.appendChild(options_link);

        options_link.addEventListener("click", () => remove_task(task.id));
        task_div.appendChild(task_header);

        const task_body = document.createElement("div");
        task_body.classList.add("task-body");

        const task_name = document.createElement("h4");
        task_name.classList.add("task-name");
        task_name.innerText = task.title;

        const task_description = document.createElement("p");
        task_description.classList.add("task-description");
        task_description.innerText = task.description;

        task_body.appendChild(task_name);
        task_body.appendChild(task_description);
        task_div.appendChild(task_body);

        const task_meta = document.createElement("div");
        task_meta.classList.add("task-meta");

        const project_name = document.createElement("span");
        project_name.innerHTML = `<i class="fa-solid fa-folder"></i> Project: ${task.project}`;

        const deadline = document.createElement("span");
        deadline.innerHTML = `<i class="fa-solid fa-calendar"></i> Due: ${task.deadline}`;

        const status_label = document.createElement("span");
        status_label.innerHTML = `<i class="fa-solid fa-clipboard-list"></i> ${task.status}`;

        task_meta.appendChild(project_name);
        task_meta.appendChild(deadline);
        task_meta.appendChild(status_label);
        task_div.appendChild(task_meta);


        task_div.addEventListener('dblclick', () => {
            create_task_modal(task);
        });

        return task_div;
    }


    // To add new tasks 
    function add_task() {

        //Gets the form value from within the task dialog
        const title = document.getElementById("taskTitle").value.trim();
        const description = document.getElementById("taskDescription").value.trim();
        const project = document.getElementById("projectName").value.trim();
        const deadline = document.getElementById("deadline").value.trim();

        if (!title || !project || !description || !deadline) {
            alert("Please fill in all the fields.");
            return;
        }

        const format_date = new Date(deadline);
        const formatted_date = format_date.toLocaleDateString("en-US", {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        const today = new Date();

        // creating a task object
        const task_card = {
            title: title,
            description: description,
            project: project,
            deadline: deadline,
            status: "Pending",
            startDate: today,
        };

        tasks.push(task_card);
        render_tasks();


        AddTasks(task_card);

        // Clear form fields
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("projectName").value = "";
        document.getElementById("deadline").value = "";

        close_modal();
    }

    // Drag drop functionality
    function drag_drop() {
        const draggables = document.querySelectorAll(".task");
        const droppables = document.querySelectorAll(".kanban-class");

        draggables.forEach((task) => {
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

                const closest_task = insert_above_task(zone, e.clientY);
                const dragged_task = document.querySelector(".is-dragging");

                if (dragged_task) {
                    if (closest_task) {
                        zone.insertBefore(dragged_task, closest_task);
                    } else {
                        zone.appendChild(dragged_task);
                    }
                }
            });

            zone.addEventListener("drop", (e) => {
                e.preventDefault();
                const dragged_task = document.querySelector(".is-dragging");
                if (dragged_task) {
                    const closest_task = insert_above_task(zone, e.clientY);
                    if (closest_task) {
                        zone.insertBefore(dragged_task, closest_task);
                    } else {
                        zone.appendChild(dragged_task);
                    }

                    dragged_task.classList.remove("is-dragging");
                    const new_status = zone.dataset.status;
                    update_task_status(dragged_task.dataset.taskId, new_status);
                }
            });
        });
    }

    // Helper function finding the position of the mouse to drop the tasks
    function insert_above_task(zone, mouseY) {
        const draggable_elements = [...zone.querySelectorAll(".task:not(.is-dragging)")];
        let closest_task = null;
        let closest_offset = Number.NEGATIVE_INFINITY;

        draggable_elements.forEach(task => {
            const box = task.getBoundingClientRect();
            const offset = mouseY - (box.top + box.height / 2);

            if (offset < 0 && offset > closest_offset) {
                closest_offset = offset;
                closest_task = task;
            }
        });
        return closest_task;

    }

    // Update task status when dropped
    function update_task_status(taskId, new_status) {
        taskId = Number(taskId);

        console.log("update_task_status called with:", taskId, new_status);

        console.log("Current tasks array:", tasks.map(t => ({ id: t.id, title: t.title })));

        const task = tasks.find(t => t.id === taskId);
        console.log("Matched task:", task);

        if (!task) //console.log("Not found");
        {
            console.warn(`Task with id ${taskId} not found`);
            return;
        }

        task.status = new_status;
        render_tasks();

        fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: new_status,
            }),
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    task.status = result.data.status;

            // .then(updatedTask => {
            //     task.status = updatedTask.status;
                render_tasks();
            }
            else {
                console.error('Failed to update task status:', result.error);
            }
            })
            .catch(error => console.error('Error updating task status:', error));
    }

    function update_task(taskId) {
        const title = document.getElementById("taskTitle").value.trim();
        const description = document.getElementById("taskDescription").value.trim();
        const project = document.getElementById("projectName").value.trim();
        const deadline = document.getElementById("deadline").value.trim();

        const task_card = {
            title: title,
            description: description,
            project: project,
            deadline: deadline,
            status: "Pending"
        };

        console.log("Updating task:", taskId, task_card);

        fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify(updated_task),
            body: JSON.stringify(task_card),
        })
            .then(response => response.json())
            // .then(updatedtask =>{
                .then(result => {
                    if (result.success) {
                        const updatedtask = result.data;  // extract from .data
            
                const index = tasks.findIndex(t => t.id === updatedtask.id);
                if (index !== -1) {
                    tasks[index] = updatedtask;
                    render_tasks();
                    console.log('Task updated successfully');
                }
            }
            fetch_tasks();
                close_modal();

            })
            .catch(error => console.error('Error updating task:', error));
    }

    function search_tasks() {
        const searchValue = document.getElementById("filter-project-name").value.toLowerCase();
        const filter_task = [];
        const filter_tasks = tasks.filter(task => {
            const project_name_compare = task.project.toLowerCase().includes(searchValue);

        });


        render_tasks();
    }

    function sort_tasks() {
        const sort_by = document.getElementById("filter-sort-by").value;

        if (sort_by === "task-name") {
            sort_by_task_name();
        } else if (sort_by === "priority") {
            sort_by_priority();
        } else if (sort_by === "deadline") {
            sort_by_deadline();
        }
    }

    function sort_by_task_name() {
        tasks.sort(function (a, b) {
            if (a.title < b.title) {
                return -1;
            }
            if (a.title > b.title) {
                return 1;
            }
            return 0;
        });
        render_tasks();
    }

    function sort_by_deadline() {
        tasks.sort((a, b) => {
            const date_a = new Date(a.deadline);
            const date_b = new Date(b.deadline);
            return date_a - date_b;
        });
        render_tasks();
    }

    function print_tasks() {
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

    create_navbar();
    create_task_overview();
    create_kanban_board();
    render_tasks();
    fetch_tasks();

});

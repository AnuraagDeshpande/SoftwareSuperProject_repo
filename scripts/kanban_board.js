document.addEventListener('DOMContentLoaded', function () {

    const tasks = [
        { name: "Design Website Layout", description: "Create initial design layout for the homepage and contact page.", project: "Website Redesign", dueDate: "May 5, 2025", assignedBy: "Jane Smith", priority: "urgent", backlog: "Open" },
        { name: "Develop Login Functionality", description: "Implement login and registration functionality with validation.", project: "Website Redesign", dueDate: "May 10, 2025", assignedBy: "John Doe", priority: "high", backlog: "Development" },
        { name: "Test User Authentication", description: "Test the login and registration flow to ensure proper functionality.", project: "Website Redesign", dueDate: "May 15, 2025", assignedBy: "Sarah Lee", priority: "medium", backlog: "In Test" },
        { name: "Finalize Branding Guide", description: "Complete branding guide including logo, color palette, and typography.", project: "Branding", dueDate: "May 20, 2025", assignedBy: "Chris Green", priority: "low", backlog: "Open" },
        { name: "Fix Mobile Navigation Bug", description: "Resolve issue with mobile navigation not displaying correctly on small screens.", project: "Website Redesign", dueDate: "May 8, 2025", assignedBy: "Alice Brown", priority: "urgent", backlog: "Development" },
        { name: "Prepare Client Presentation", description: "Prepare PowerPoint slides and talking points for the client presentation on Monday.", project: "Client Meeting", dueDate: "May 1, 2025", assignedBy: "Robert Black", priority: "high", backlog: "Open" },
        { name: "Update Website Terms and Conditions", description: "Update the terms and conditions page with new legal requirements.", project: "Website Redesign", dueDate: "May 12, 2025", assignedBy: "Eve White", priority: "medium", backlog: "Closed" },
        { name: "Implement SEO Strategy", description: "Optimize the website for SEO by implementing keywords, meta descriptions, and alt text.", project: "Website Redesign", dueDate: "May 18, 2025", assignedBy: "David Black", priority: "low", backlog: "Open" },
        { name: "Deploy Website to Production", description: "Deploy the website to the live production server and monitor for issues.", project: "Website Redesign", dueDate: "May 25, 2025", assignedBy: "John Doe", priority: "urgent", backlog: "Closed" },
        { name: "Review and Approve Final Design", description: "Review the final design with the team and get approval before proceeding with development.", project: "Website Redesign", dueDate: "May 4, 2025", assignedBy: "Jane Smith", priority: "high", backlog: "Open" }
    ];


    const body = document.body;

    function create_navbar() {
        const navbar = document.createElement("nav");
        navbar.classList.add("navbar");

        const nav_left = document.createElement("div");
        nav_left.classList.add("nav-left");
        const page_title = document.createElement("h2");
        page_title.innerText = "Kanban-Board";
        nav_left.appendChild(page_title);

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


    function create_task_overview() {
        const task_overview = document.createElement("div");
        task_overview.classList.add("task-overview");

        const task_search_panel = document.createElement("div");
        task_search_panel.classList.add("task-search-panel");
        task_overview.appendChild(task_search_panel);

        create_search_filters(task_search_panel);

        const search_button = document.createElement("button");
        search_button.textContent = "Search";
        search_button.id = "btn-search";
        search_button.addEventListener('click', search_tasks);
        task_search_panel.appendChild(search_button);

        body.appendChild(task_overview);
        create_task_management_panel(task_overview);
    }


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
            label.textContent = filter.label;
            input_container.appendChild(label);

            if (filter.type === "text") {
                const input = document.createElement("input");
                input.type = filter.type;
                input.id = filter.id;
                input.placeholder = filter.placeholder;
                input_container.appendChild(input);
            } else if (filter.type === "select") {
                const select = document.createElement("select");
                select.id = filter.id;
                filter.options.forEach(option => {
                    const option_element = document.createElement("option");
                    option_element.value = option.toLowerCase().replace(" ", "");
                    option_element.textContent = option;
                    select.appendChild(option_element);
                });
                input_container.appendChild(select);
            }

            panel.appendChild(input_container);
        });
    }

    function create_task_management_panel(task_overview) {
        const panel = document.createElement("div");
        panel.classList.add("task-management-panel");

        const select_container = document.createElement("div");
        select_container.classList.add("input-container");

        const select_label = document.createElement("label");
        select_label.setAttribute("for", "filter-sort-by");
        select_label.textContent = "Sort By";
        select_container.appendChild(select_label);

        const select = document.createElement("select");
        select.id = "filter-sort-by";
        select.innerHTML = `
        <option value="none">None</option>
        <option value="task-name">Task Name</option>
        <option value="priority">Priority</option>
        <option value="deadline">Deadline</option>
    `;
        select_container.appendChild(select);
        panel.appendChild(select_container);

        const sortButton = document.createElement("button");
        sortButton.textContent = "Sort";
        sortButton.id = "btn-sort";
        sortButton.addEventListener('click', sort_tasks);
        panel.appendChild(sortButton);

        const addButton = document.createElement("button");
        addButton.textContent = "Add Task";
        addButton.id = "btn-add-task";
        addButton.addEventListener('click', open_modal);
        panel.appendChild(addButton);

        const printButton = document.createElement("button");
        printButton.textContent = "Print";
        printButton.id = "btn-print";
        printButton.addEventListener('click', print_tasks);
        panel.appendChild(printButton);

        task_overview.appendChild(panel);
    }


    function create_task_modal() {
        const task_dialog = document.createElement("dialog");
        task_dialog.classList.add("task-dialog");

        const task_modal_container = document.createElement("div");
        task_modal_container.classList.add("taskmodal-container");
        task_dialog.appendChild(task_modal_container);

        create_task_modal_content(task_modal_container);

        body.appendChild(task_dialog);
    }


    function create_task_modal_content(modal_container) {
        const taskmodal_title = document.createElement("h2");
        taskmodal_title.innerText = "Enter Task Details";
        const modal_content = [
            { label: "Title:", id: "taskTitle", type: "text", placeholder: "Enter task title" },
            { label: "Priority:", id: "taskpriority", type: "select", options: ["None", "Urgent", "High", "Medium", "Low"] },
            { label: "Description:", id: "taskDescription", type: "textarea", placeholder: "Enter task description" },
            { label: "Project Name:", id: "projectName", type: "text", placeholder: "Enter project name" },
            { label: "Assigned By:", id: "assignedBy", type: "text", placeholder: "Enter assignee's name" },
            { label: "Due Date:", id: "dueDate", type: "date" }
        ];

        modal_content.forEach(input_val => {

            const input_container = document.createElement("div");
            input_container.classList.add("input-modal");

            const label = document.createElement("label");
            label.setAttribute("for", input_val.id);
            label.textContent = input_val.label;
            input_container.appendChild(label);

            if (input_val.type === "select") {
                const select = document.createElement("select");
                select.id = input_val.id;
                input_val.options.forEach(option => {
                    const option_element = document.createElement("option");
                    option_element.value = option.toLowerCase();
                    option_element.textContent = option;
                    select.appendChild(option_element);
                });
                input_container.appendChild(select);
            } else {
                const input = document.createElement(input_val.type === "textarea" ? "textarea" : "input");
                input.type = input_val.type;
                input.id = input_val.id;
                input.placeholder = input_val.placeholder;
                input_container.appendChild(input);
            }

            modal_container.appendChild(input_container);
        });

        create_task_modal_buttons(modal_container);
    }


    function create_task_modal_buttons(modal_container) {
        const task_modal_buttons = document.createElement("div");
        task_modal_buttons.classList.add("taskmodal-btn");

        const add_button = document.createElement("button");
        add_button.textContent = "Add Task";
        add_button.id = "btn-add";
        add_button.addEventListener('click', add_task);
        task_modal_buttons.appendChild(add_button);

        const close_button = document.createElement("button");
        close_button.textContent = "Close";
        close_button.id = "btn-close";
        close_button.addEventListener('click', close_modal);
        task_modal_buttons.appendChild(close_button);

        modal_container.appendChild(task_modal_buttons);
    }


    function create_kanban_board() {
        const kanban_board = document.createElement("div");
        kanban_board.classList.add("kanban-board");

        const columns = [
            { id: "openTasks", title: "Open" },
            { id: "devTasks", title: "Development" },
            { id: "testTasks", title: "In Test" },
            { id: "closedTasks", title: "Closed" },
            { id: "abortedTasks", title: "Unresolved" }
        ];

        columns.forEach(column => {
            const kanban_class = document.createElement("div");
            kanban_class.classList.add("kanban-class");
            kanban_class.id = column.id;

            const title_element = document.createElement("div");
            title_element.classList.add("kanban-class-title");
            const h3 = document.createElement("h3");
            h3.textContent = column.title;
            title_element.appendChild(h3);

            kanban_class.appendChild(title_element);
            kanban_board.appendChild(kanban_class);
        });

        body.appendChild(kanban_board);
    }


    function render_tasks() {
        const class_choice = {
            "Open": document.getElementById("openTasks"),
            "Development": document.getElementById("devTasks"),
            "In Test": document.getElementById("testTasks"),
            "Closed": document.getElementById("closedTasks"),
            "Unresolved": document.getElementById("abortedTasks")
        };
        const kanban_classes = document.querySelectorAll(".kanban-class");
        kanban_classes.forEach(column => {
            column.querySelectorAll('.task').forEach(task => task.remove());
        });
        tasks.forEach(task => {
            const task_div = create_task_element(task);
            const task_column = class_choice[task.backlog];
            if (task_column) {
                task_column.appendChild(task_div);
            }
        });

        drag_drop();
    }
    function create_task_element(task) {
        const task_div = document.createElement("div");
        task_div.classList.add("task");
        task_div.setAttribute("draggable", "true");

        const task_header = create_task_header(task);
        task_div.appendChild(task_header);

        const task_body = create_task_body(task);
        task_div.appendChild(task_body);

        const task_meta = create_task_meta(task);
        task_div.appendChild(task_meta);


        task_div.addEventListener('dblclick', () =>
            show_task_details(task)
        );

        return task_div;
    }

    function create_task_header(task) {
        const task_header = document.createElement("div");
        task_header.classList.add("task-header");

        const urgency_label = document.createElement("span");
        urgency_label.classList.add("urgency-label", task.priority);
        const urgency_icon = document.createElement("i");
        urgency_icon.classList.add("fa-solid", "fa-circle");
        urgency_label.appendChild(urgency_icon);
        task_header.appendChild(urgency_label);

        const options_link = document.createElement("a");
        options_link.classList.add("task-options");
        const options_icon = document.createElement("i");
        options_icon.classList.add("fa-solid", "fa-xmark");
        options_link.appendChild(options_icon);
        task_header.appendChild(options_link);

        options_link.addEventListener("click", () => remove_task(tasks.indexOf(task)));

        return task_header;
    }

    function create_task_body(task) {
        const task_body = document.createElement("div");
        task_body.classList.add("task-body");

        const task_name = document.createElement("h4");
        task_name.classList.add("task-name");
        task_name.textContent = task.name;

        const task_description = document.createElement("p");
        task_description.classList.add("task-description");
        task_description.textContent = task.description;

        task_body.appendChild(task_name);
        task_body.appendChild(task_description);

        return task_body;
    }

    function create_task_meta(task) {
        const task_meta = document.createElement("div");
        task_meta.classList.add("task-meta");

        const project_name = document.createElement("span");
        project_name.innerHTML = `<i class="fa-solid fa-folder"></i> Project: ${task.project}`;

        const due_date = document.createElement("span");
        due_date.innerHTML = `<i class="fa-solid fa-calendar"></i> Due: ${task.dueDate}`;

        const assigned_by = document.createElement("span");
        assigned_by.innerHTML = `<i class="fa-solid fa-user"></i> Assigned By: ${task.assignedBy}`;

        const backlog_label = document.createElement("span");
        backlog_label.innerHTML = `<i class="fa-solid fa-clipboard-list"></i> ${task.backlog}`;

        task_meta.appendChild(project_name);
        task_meta.appendChild(due_date);
        task_meta.appendChild(assigned_by);
        task_meta.appendChild(backlog_label);

        return task_meta;
    }


    function add_task() {
        const title = document.getElementById("taskTitle").value.trim();
        const priority = document.getElementById("taskpriority").value.trim();
        const description = document.getElementById("taskDescription").value.trim();
        const project = document.getElementById("projectName").value.trim();
        const assigned_by = document.getElementById("assignedBy").value.trim();
        const due_date = document.getElementById("dueDate").value.trim();

        if (!title || !project || !priority || !description || !assigned_by || !due_date) {
            alert("Please fill in all the fields.");
            return;
        }

        const format_date = new Date(due_date);
        const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const day = format_date.getDate();
        const month = month_names[format_date.getMonth()];
        const year = format_date.getFullYear();

        const formatted_date = `${month} ${day}, ${year}`;

        const task_card = {
            name: title,
            description: description,
            project: project,
            dueDate: formatted_date,
            assignedBy: assigned_by,
            priority: priority,
            backlog: "Open"
        };

        tasks.push(task_card);
        render_tasks();

        document.getElementById("taskTitle").value = "";
        document.getElementById("taskpriority").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("projectName").value = "";
        document.getElementById("assignedBy").value = "";
        document.getElementById("dueDate").value = "";

        close_modal();
    }

    function remove_task(index) {
        tasks.splice(index, 1);
        render_tasks();
    }

    function open_modal() {
        document.querySelector("dialog").showModal();
    }

    function close_modal() {
        document.querySelector("dialog").close();
    }

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
                    update_task_backlog(dragged_task, closest_task);
                }
            });
        });
    }

    function insert_above_task(zone, mouseY) {
        const draggable_elements = [...zone.querySelectorAll(".task:not(.is-dragging)")];
        return draggable_elements.reduce((closest, task) => {
            const box = task.getBoundingClientRect();
            const offset = mouseY - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: task };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }


    // function update_task_backlog(dragged_task, closest_task) {
    //     const task_name = dragged_task.querySelector(".task-name").textContent;
    //     const new_backlog = closest_task.backlog_label;

    //     const task = tasks.find(t => t.name === task_name);
    //     if (task) {
    //         task.backlog = new_backlog;
    //     }
    // }


    function show_task_details(task) {
            const show_task_modal = document.createElement("dialog");
            show_task_modal.classList.add("task-details-modal");
        
            const task_details = document.createElement("div");
            task_details.classList.add("task-details");
        
            const task_name_label = document.createElement("label");
            task_name_label.setAttribute("for", "taskName");
            task_name_label.textContent = "Task Name:";
            const task_name = document.createElement("input");
            task_name.type = "text";
            task_name.id = "taskName";
            task_name.value = task.name;
            task_details.appendChild(task_name_label);
            task_details.appendChild(task_name);
        
            const task_priority_label = document.createElement("label");
            task_priority_label.setAttribute("for", "taskPriority");
            task_priority_label.textContent = "Priority:";
            const task_priority = document.createElement("select");
            task_priority.id = "taskPriority";
            const priorities = ["urgent", "high", "medium", "low"];
            priorities.forEach(priority => {
                const option = document.createElement("option");
                option.value = priority;
                option.textContent = priority; 
                if (task.priority === priority) option.selected = true;
                task_priority.appendChild(option);
            });
            task_details.appendChild(task_priority_label);
            task_details.appendChild(task_priority);
        
            const task_description_label = document.createElement("label");
            task_description_label.setAttribute("for", "taskDescription");
            task_description_label.textContent = "Description:";
            const task_description = document.createElement("textarea");
            task_description.id = "taskDescription";
            task_description.value = task.description;
            task_details.appendChild(task_description_label);
            task_details.appendChild(task_description);
        
            const task_project_label = document.createElement("label");
            task_project_label.setAttribute("for", "taskProject");
            task_project_label.textContent = "Project Name:";
            const task_project = document.createElement("input");
            task_project.type = "text";
            task_project.id = "taskProject";
            task_project.value = task.project;
            task_details.appendChild(task_project_label);
            task_details.appendChild(task_project);
        
            const task_assigned_by_label = document.createElement("label");
            task_assigned_by_label.setAttribute("for", "taskAssignedBy");
            task_assigned_by_label.textContent = "Assigned By:";
            const task_assigned_by = document.createElement("input");
            task_assigned_by.type = "text";
            task_assigned_by.id = "taskAssignedBy";
            task_assigned_by.value = task.assignedBy;
            task_details.appendChild(task_assigned_by_label);
            task_details.appendChild(task_assigned_by);
        
            const task_due_date_label = document.createElement("label");
            task_due_date_label.setAttribute("for", "taskDueDate");
            task_due_date_label.textContent = "Due Date:";
            const task_due_date = document.createElement("input");
            task_due_date.type = "date";
            task_due_date.id = "taskDueDate";
            task_due_date.value = task.dueDate;
            task_details.appendChild(task_due_date_label);
            task_details.appendChild(task_due_date);
        
            const save_button = document.createElement("button");
            save_button.textContent = "Save Changes";
            save_button.addEventListener('click', () => {
                task.name = task_name.value;
                task.priority = task_priority.value;
                task.description = task_description.value;
                task.project = task_project.value;
                task.assignedBy = task_assigned_by.value;
                task.dueDate = task_due_date.value;
        
                show_task_modal.close();
            });
        
            const close_button = document.createElement("button");
            close_button.textContent = "Close";
            close_button.addEventListener('click', () => {
                show_task_modal.close();
            });
        
            task_details.appendChild(save_button);
            task_details.appendChild(close_button);
        
            show_task_modal.appendChild(task_details);
            document.body.appendChild(show_task_modal);
        
            show_task_modal.showModal();
    }
        
    function search_tasks() {
        const searchValue = document.getElementById("search-box").value.toLowerCase();
        const filteredTasks = tasks.filter(task => {
            return task.name.toLowerCase().includes(searchValue) || task.description.toLowerCase().includes(searchValue);
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
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
        render_tasks();
    }
    
    function sort_by_priority() {
        tasks.sort((a, b) => {
            const priority_order = { urgent: 1, high: 2, medium: 3, low: 4  };
            return priority_order[a.priority] - priority_order[b.priority];
        });
        render_tasks();
    }
    
    function sort_by_deadline() {
        tasks.sort((a, b) => {
            const date_a = new Date(a.dueDate);
            const date_b = new Date(b.dueDate);
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
    create_task_modal();
    create_kanban_board();
    render_tasks();

});

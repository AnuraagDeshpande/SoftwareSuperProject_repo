document.addEventListener('DOMContentLoaded', function () {

    const body = document.body;

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("projectId");

    // Use projectId as needed

    function create_navbar() {
        const navbar = document.createElement("nav");
        navbar.classList.add("navbar_gc");

        const nav_left = document.createElement("div");
        nav_left.classList.add("nav-left");
        const page_title = document.createElement("h2");
        page_title.innerText = "Gantt Chart";
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

    create_navbar();

    const project_data = {
        name: "Website Redesign",
        pm: "Jane Doe",
        start_date: "2025-04-01",
        due_date: "2025-06-01",
        progress: "45%",
    };

    // fetch("/api/project")
    //     .then(res => res.json())
    //     .then(projectData => {
    //         const project_overview = document.createElement("div");
    //         project_overview.classList.add("project_overview");
    //         project_overview.id = "project_overview";
    //         project_overview.appendChild(create_project_overview(projectData));
    //         body.appendChild(project_overview);

    //         fetch("/api/tasks")
    //             .then(res => res.json())
    //             .then(taskData => {
    //                 const gantt_chart = generate_gantt_chart(taskData, projectData); 
    //                 body.appendChild(gantt_chart);
    //             })
    //             .catch(error => console.error('Error fetching tasks:', error));
    //     })
    //     .catch(error => console.error('Error fetching project data:', error));
        

    const project_overview = document.createElement("div");
    project_overview.classList.add("project_overview");
    project_overview.id = "project_overview";

    function create_project_overview(project) {
        const container = document.createElement("div");
        container.classList.add("project_info_section");

        const info_left_box = document.createElement("div");
        info_left_box.classList.add("info_box");

        function add_project_info(label, value, icon_class) {
            const info_section = document.createElement("div");
            info_section.classList.add("info_section");

            const label_titles = document.createElement("h4");

            const icon = document.createElement("i");
            icon.classList.add("fa-solid", icon_class);
            icon.style.marginRight = "8px";

            label_titles.appendChild(icon);
            label_titles.append(label);

            const value_names = document.createElement("p");
            value_names.innerText = `${value}`;

            info_section.append(label_titles, value_names);
            info_left_box.appendChild(info_section);
        }


        add_project_info("Project Name", project.name, "fa-folder-open");
        add_project_info("Project Manager", project.pm, "fa-user-tie");
        add_project_info("Start Date", project.start_date, "fa-calendar-day");
        add_project_info("Due Date", project.due_date, "fa-calendar-check");
        container.appendChild(info_left_box);

        const project_progress = document.createElement("div");
        project_progress.classList.add("info_box");
        project_progress.id = "project_progress";

        const project_progress_title = document.createElement("h4");

        const progress_icon = document.createElement("i");
        progress_icon.classList.add("fa-solid", "fa-chart-line");
        progress_icon.style.marginRight = "8px";

        project_progress_title.appendChild(progress_icon);
        project_progress_title.append("Project Progress");

        const progress_value = document.createElement("p");
        progress_value.innerText = project.progress;

        project_progress.append(project_progress_title, progress_value);
        container.appendChild(project_progress);

        return container;
    }

    project_overview.appendChild(create_project_overview(project_data));
    body.appendChild(project_overview);

    const tasks = [
        { name: "Research", startDate: "2025-04-01", dueDate: "2025-05-10", status: "In Progress" },
        { name: "Wireframes", startDate: "2025-04-11", dueDate: "2025-04-25", status: "Pending" },
        { name: "Prototype", startDate: "2025-04-26", dueDate: "2025-05-10", status: "Completed" },
        { name: "Design", startDate: "2025-04-11", dueDate: "2025-05-19", status: "In Progress" },
        { name: "Deployment", startDate: "2025-04-02", dueDate: "2025-06-01", status: "Completed" },
        { name: "Planning", startDate: "2025-04-01", dueDate: "2025-04-15", status: "Pending" },
        { name: "Initial Review", startDate: "2025-04-16", dueDate: "2025-04-20", status: "Completed" },
        { name: "Final Design", startDate: "2025-04-21", dueDate: "2025-05-10", status: "In Progress" },
        { name: "User Testing", startDate: "2025-05-11", dueDate: "2025-05-20", status: "In Progress" },
        { name: "Release", startDate: "2025-05-21", dueDate: "2025-06-01", status: "Pending" }
    ];


    function generate_gantt_chart(tasks, project_data)  {
        const pixel_width_perday = 60;
        const microsecond_perday = 86400000;

        const gantt_container = document.createElement("div");
        gantt_container.classList.add("gantt_chart_wrapper");

        const gantt_chart_container = document.createElement("div");
        gantt_chart_container.classList.add("gantt_chart_container");

        const start_date_chart = new Date(project_data.start_date);
        const last_date_chart = new Date(project_data.due_date);
        const total_days = Math.floor((last_date_chart - start_date_chart) / microsecond_perday) + 1;

        const date_header = document.createElement("div");
        date_header.classList.add("gantt_row");

        for (let i = 0; i < total_days; i++) {
            const date = new Date(start_date_chart);
            date.setDate(start_date_chart.getDate() + i);

            const cell = document.createElement("div");
            cell.classList.add("gantt_date_cell");
            cell.innerText = date.toLocaleDateString("en-US", {
                month: 'short',
                day: 'numeric',
            });

            date_header.appendChild(cell);
        }

        gantt_chart_container.appendChild(date_header);

        
        const task_list = document.createElement("div");
        task_list.classList.add("gantt_task_list");

        tasks.forEach(task => {
            const task_name = document.createElement("div");
            task_name.classList.add("gantt_task_name_cell");
            task_name.innerText = task.name;
            task_list.appendChild(task_name);

            const task_row = document.createElement("div");
            task_row.classList.add("gantt_row");

            for (let i = 0; i < total_days; i++) {
                const cell = document.createElement("div");
                cell.classList.add("gantt_cell");
                task_row.appendChild(cell);
            }

            const start = new Date(task.startDate);
            const end = new Date(task.dueDate);
            const offset = Math.floor((start - start_date_chart) / microsecond_perday);
            const duration = Math.floor((end - start) / microsecond_perday) + 1;

            const gantt_span = document.createElement("div");
            gantt_span.classList.add("gantt_span");
            gantt_span.style.left = `${offset * pixel_width_perday}px`;
            gantt_span.style.width = `${duration * pixel_width_perday}px`;
            gantt_span.style.height = "12px";
    
            const today = new Date();
            if (new Date(task.dueDate) < today && task.status !== "In Progress") {
                gantt_span.style.backgroundColor = "rgba(255, 0, 0, 0.6)";
                gantt_span.id = "overdue";
            }


            const status_icon = document.createElement("i");
            status_icon.classList.add("fa-solid");
            status_icon.style.marginRight = "6px";

            switch (task.status) {
                case "Pending":
                    status_icon.classList.add("fa-folder-open");
                    gantt_span.id = "pending";
                    break;
                case "In Progress":
                    status_icon.classList.add("fa-vial");
                    gantt_span.id = "in_progress";
                    break;
                case "Completed":
                    status_icon.classList.add("fa-check-circle");
                    gantt_span.id = "completed";
                    break;
                case "overdue":
                    status_icon.classList.add("fa-exclamation-triangle");
                    break;
                default:
                    status_icon.classList.add("fa-question-circle");
            }

            const span_text = document.createElement("span");
            span_text.innerText = task.name;
            gantt_span.append(status_icon, span_text);


            task_row.appendChild(gantt_span);
            gantt_chart_container.appendChild(task_row);
        });

        gantt_container.appendChild(task_list);
        gantt_container.appendChild(gantt_chart_container);
        return gantt_container;
    }

    const gantt_chart = generate_gantt_chart(tasks, project_data); 
    body.appendChild(gantt_chart);

    const gantt_legend = document.createElement("div");
    gantt_legend.classList.add("gantt_legend");
    gantt_legend.innerHTML = `
    <div class="legend_item" style="background-color: rgb(65, 116, 212, 40%);"><i class="fa-solid fa-folder-open"></i><span>Pending</span></div>
    <div class="legend_item" style="background-color: rgb(244, 197, 66, 40%);"><i class="fa-solid fa-vial"></i><span>In Progress</span></div>
    <div class="legend_item" style="background-color: rgb(119, 221, 119, 40%);"><i class="fa-solid fa-check-circle"></i><span>Completed</span></div>
    <div class="legend_item" style="background-color: rgba(255, 0, 0, 0.6);"><i class="fa-solid fa-exclamation-triangle"></i><span>Overdue</span></div>
`;
    body.appendChild(gantt_legend);
    
});

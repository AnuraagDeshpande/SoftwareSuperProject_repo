document.addEventListener('DOMContentLoaded', function () {

    const body = document.body;

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get("projectId");

    // Use projectId as needed


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
        

    const project_data = {
        name: "Website Redesign",
        pm: "Jane Doe",
        start_date: "2025-04-01",
        due_date: "2025-06-01",
        progress: "45%",
    };


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

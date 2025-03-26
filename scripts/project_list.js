export class ProjectList{
    projects;

    constructor(){
        this.fetchData();
        this.displayProjects();
    }

    fetchData(){
        this.projects=JSON.parse(localStorage.getItem("project_list"))||[
        {
            projectName:"Project on projects",
            projectIcon:"profile-picture-placeholder.png",
            manager:"User321",
            owner:"User123",
            desc:"This project aims at projecting project projects at project. It is of high imprtance and is believed to be very cool. This text doens't fit",
            participants:[
                "profile-picture-placeholder.png",
                "profile-picture-placeholder2.jpg",
                "profile-picture-placeholder.png",
            ],
            status:"error"
        },
        {
            projectName:"Project on projects",
            projectIcon:"profile-picture-placeholder.png",
            manager:"User321",
            owner:"User123",
            desc:"This project aims at projecting project projects at project. This text fully fits",
            participants:[
                "profile-picture-placeholder.png",
                "profile-picture-placeholder2.jpg",
                "profile-picture-placeholder.png",
                "profile-picture-placeholder.png",
                "profile-picture-placeholder.png",
            ],
            status: "active"
        }
        ];
    }

    displayProjects(){
        const div = document.querySelector(".js-project-list");
        if(div){
            let generatedHTML="";
            this.projects.forEach(element => {
                //we cut description if needed
                let desc = element.desc;
                if(desc.length>120){
                    desc=desc.slice(0,121)+"..."
                }
                //we create the card
                const card = `
                <div class="project-card">
                    <div class="project-card-header">
                        <img class="project-icon" src="media/${element.projectIcon}">
                        <div class="project-title">
                            <h2>${element.projectName}</h2>
                            <h3>Manager: ${element.manager}</h3>
                            <h4>Owner: ${element.owner}</h4>
                        </div>                   
                    </div>
                    <p>
                        ${desc}
                    </p>
                    <div class="status ${element.status}"></div>
                    <div class="participants">
                        ${element.participants.slice(0,4).map(part=>{return `<img src="media/${part}">`}).join()}
                    </div>
                </div>
                `;
                generatedHTML+=card;
            });
            div.innerHTML=generatedHTML;
        } else {
            console.log("no js-project-list class found")
        }
    }

    refresh(){
        this.fetchData();
        this.displayProjects();
    }

    save(){
        localStorage.setItem("project_list", JSON.stringify(this.projects));
    }

    addProject(newProject){
        this.projects.push(newProject);
        this.save();
        this.displayProjects();
    }
}

const projects = new ProjectList();

/* ADD PROJECT POP UP*/
const popUp = document.querySelector(".pop-up-screen");
if(popUp){
    const addProjectBut = document.querySelector("#btn-add-project");
    const hideAddProject = document.querySelector(".js-hide-add-project");
    if(addProjectBut && hideAddProject){
        addProjectBut.addEventListener("click",()=>{
            popUp.classList.toggle("shown");
        });
        hideAddProject.addEventListener("click",()=>{
            popUp.classList.toggle("shown");
        });
    }
}

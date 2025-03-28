export class ProjectList{
    projects;

    constructor(){
        this.fetchData();
        this.displayProjects();
    }

    /** get projects data*/
    fetchData(){
        this.projects=JSON.parse(localStorage.getItem("project_list"))||[
        {
            projectName:"Project on projects",
            projectIcon:"profile-picture-placeholder.png",
            manager:[],
            owner:["user123"],
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
            manager:["manager 1"],
            owner:["some usr","some other user","another person"],
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

    /** turn a list of strings into a single string or - if empty */
    #displayList(a){
        if(a.length > 0 && Array.isArray(a)){
            return a.slice(0,3).join(", ");
        } 
        return "-";
    }

    /** display the projects on a page */
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
                            <h3>Managers: ${this.#displayList(element.manager)}</h3>
                            <h4>Owners: ${this.#displayList(element.owner)}</h4>
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

    /** refresh the data on a page */
    refresh(){
        this.fetchData();
        this.displayProjects();
    }

    /** save the changes */
    save(){
        localStorage.setItem("project_list", JSON.stringify(this.projects));
    }

    /** add project to list of projects*/
    addProject(newProject){
        this.projects.push(newProject);
        this.save();
        this.displayProjects();
    }
}

const projects = new ProjectList();
const user ="user123";

/*
=================================================
ADD PROJECT POP UP
=================================================
*/

/** makes clear button active*/
export function makeClearButActive(){
    const clearBut = document.querySelector("#add-project-clear");
    if(clearBut){
        clearBut.addEventListener("click",()=>{
            clearPopUpFields();
        });
    } else {
        console.error("no clear button found")
    }
}

/** clears all input fields in pop ups*/
export function clearPopUpFields(){
    //we get all fields in pop up cards
    const fields = document.querySelectorAll(".js-pop-up-field");
    fields.forEach((field)=>{
        //we set each field to empty
        field.value="";
        field.innerHTML="";
    });
}

/**reset the pop up state and toggle between visible and not */
export function popUpToggle(){
    const popUp = document.querySelector(".pop-up-screen");
    if (popUp){
        document.querySelector(".error-message").innerHTML="";
        popUp.classList.toggle("shown");
        clearPopUpFields();
    } else {
        console.error("no pop up div found");
    }
}

/** add an event in the listener to add a project entered when clicked */
export function addProject(){
    const submitChanges = document.querySelector("#add-project-submit");
    if(submitChanges){
        submitChanges.addEventListener("click",()=>{
            //expected values:
            let regex = /^[A-Za-z0-9 ,.]+$/;
            //the input values from the user
            const name = document.querySelector("#project-name").value || "";
            const desc = document.querySelector("#project-desc").value || "";
            //we test the input values for being correct
            if(!regex.test(name) || !regex.test(desc) || name.length > 50 || name.length===0 || desc.length===0){
                document.querySelector(".error-message").innerHTML="invalid input try again";
                return;
            }
            //create a new project
            const newProject = {
                projectName: name,
                projectIcon:"profile-picture-placeholder.png",
                manager:[],
                owner:[user],
                desc:desc,
                participants:[],
                status: "active"
            }
            //add the project to projects
            projects.addProject(newProject);
            
            //console.log("addProject() is being called with:", newProject);
            //close pop up and clear
            popUpToggle();
        });
    } else {
        console.error("no submit add project button found");
    }
}

/** add an event listener to buttons that are supposed to summon the add project pop up */
export function addPopUpToggle(){
    //the popUp div
    const popUp = document.querySelector(".pop-up-screen");
    //if it is peresent we add event listeners
    if(popUp){
        const addProjectBut = document.querySelector("#btn-add-project");
        const hideAddProject = document.querySelector(".js-hide-add-project");
        if(addProjectBut && hideAddProject){
            addProjectBut.addEventListener("click",()=>{
                popUpToggle();
            });
            hideAddProject.addEventListener("click",()=>{ 
                popUpToggle();
            });
        } else {
            console.error("no div for open/close add project pop up found");
        }
    } else {
        console.error("no pop up div found");
    }
}

//we call functions to make the page active
addProject();
makeClearButActive();
addPopUpToggle();

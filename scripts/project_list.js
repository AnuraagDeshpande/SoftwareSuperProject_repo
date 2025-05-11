export class ProjectList{
    projects=[];
    nameFilter="";
    statusFilter="";
    descFilter="";
    viewedId=0;
    id=-1;

    constructor(){
        this.projects=0;
        this.nameFilter="";
        this.statusFilter="";
        this.descFilter="";
        this.viewedId=0;
    }

    static async create(id){
        const instance = new ProjectList();
        const temp = await instance.fetchData(id);

        if (!temp) throw new Error("Failed to fetch project list data");

        instance.projects=temp.data ?? [];
        instance.id=id;
        return instance;
    }

    /** get projects data*/
    async fetchData(id){
        const path = `${BASE_URL}/projects/user=${id}`;

        try{
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch(error){
            console.error("Fetch error:", error);
            return null;
        }
    }

    /** delete a project by id asynchronous function */
    async deleteData(id){
        console.log("deleting request sending");
        const path = `${BASE_URL}/projects/${id}`;

        try{
            //delete request sent to the server
            const response = await fetch(path,{
                method: "DELETE",
                headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch(error){
            //error handling
            console.error("Fetch error:", error);
            return null;
        }
    }

    /** asynchronous function to add a project, sends the request */
    async addData(obj){
        console.log("adding project requst");
        //path  to the api
        const path = `${BASE_URL}/projects/`;

        try{
            //we send the request
            const response = await fetch(path,{
                method: "POST",
                body:JSON.stringify(obj),
            });
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch(error){
            //error handlin
            console.error("Fetch error:", error);
            return null;
        }
    }

    /** turn a list of strings into a single string or - if empty */
    #displayList(a){
        if(a.length > 0 && Array.isArray(a)){
            return a.slice(0,3).join(", ");
        } 
        return "-";
    }

    /** get the list containing the list of relations of a user to the project */
    #getRelation(project){
        let relations =[];//TODO replace user with actual user
        if (project.owner.includes(window.user)||project.manager.includes(window.user)){
            if(project.manager.includes(window.user)){
                relations.push("m");
            }
            if(project.owner.includes(window.user)){
                relations.push("o");
            }           
        } else {
            relations.push("p");
        }
        return relations;
    }

    /** return an object containing projects sorted into types */
    #sortByRelation(){
        const visibleProjects = this.#getVisibleProjects();
        const owner = visibleProjects.filter((pr)=>{return this.#getRelation(pr).includes("o")});
        const mangr = visibleProjects.filter((pr)=>{return this.#getRelation(pr).includes("m")});
        const part = visibleProjects.filter((pr)=>{return this.#getRelation(pr).includes("p")});
        return {
            owner: owner,
            mangr: mangr,
            part: part
        };
    }

    #getVisibleProjects(){
        return this.projects.filter((pr)=>{
            return pr.projectName.includes(this.nameFilter);
        }).filter((pr)=>{
            return pr.desc.includes(this.descFilter);
        }).filter((pr)=>{
            return pr.status.includes(this.statusFilter) || this.statusFilter==="none";
        });
    }

    #displayProjectListIn(list, div){
        if(div){
            let generatedHTML="";
            list.forEach(element => {
                //we cut description if needed
                let desc = element.desc;
                if(desc.length>120){
                    desc=desc.slice(0,121)+"..."
                }
                //we create the card
                const card = `
                <a href="individual_project.html?projectId=${element.id}" class="project-link">
                    <div class="project-card">
                        <div class="project-card-header">
                            <img class="project-icon" src="media/${element.projectIcon}">
                            <div class="project-title">
                                <div class="project-title-name">
                                    <h2>${element.projectName}</h2>
                                    <div class="status ${element.status}"></div>
                                </div>
                                <h3>Managers: ${this.#displayList(element.manager)}</h3>
                                <h4>Owners: ${this.#displayList(element.owner)}</h4>
                            </div>                   
                        </div>
                        <p>
                            ${desc}
                        </p>
                        <div class="card-bottom-row">
                            <button class="cool-button" id="delete-button" data-id="${element.id}">delete</button>
                            <div class="participants">
                                ${element.participants.slice(0,4).map(part=>{return `<img src="media/${part}">`}).join()}
                            </div>
                        </div>
                    </div>
                </a>
                `;
                generatedHTML+=card;
            });
            if(generatedHTML==""){
                div.innerHTML="no projects here yet";
            } else {
                div.innerHTML=generatedHTML;
            }
        } else {
            console.log("no js-project-list class found")
        }
    }

    /** display the projects on a page */
    displayProjects(){
        const sorted = this.#sortByRelation();
        const own = document.querySelector(".js-owner-prjct");
        this.#displayProjectListIn(sorted.owner, own);
        const mangr = document.querySelector(".js-mangr-prjct");
        this.#displayProjectListIn(sorted.mangr, mangr);
        const part = document.querySelector(".js-part-prjct");
        this.#displayProjectListIn(sorted.part, part);
        addDeleteListener();
    }

    /** refresh the data on a page*/
    refresh(){
        this.fetchData(this.id).then((obj)=>{
            //we store the result
            this.projects=obj.data ?? [];
            //the display is updated
            this.displayProjects();
        }).catch(err => {
            console.error('Error:', err);
        });
        
    }

    /** save the changes */
    save(){
        localStorage.setItem("project_list", JSON.stringify(this.projects));
    }

    /** add project to list of projects*/
    addProject(newProject){
        this.addData(newProject).then(()=>{
            this.refresh()
        }).catch(err => {
            console.error('Error adding a new project:', err);
        });
    }

    /** remove project by ID */
    removeByID(id){
        console.log(`project id: ${id}`);
        this.deleteData(id).then(()=>{
            this.refresh()
        }).catch(err => {
            console.error('Error deleting project:', err);
        });
    }

    setViewId(id){
        this.viewedId=id;
    }

    removeViewed(){
        this.removeByID(this.viewedId);
    }

    /**set filter parameters */
    setFilter(name="", desc="", status="none"){
        this.nameFilter=name;
        this.descFilter=desc;
        this.statusFilter=status;
    }
}

export async function setUpFun(id, username){
    window.user =username;
    console.log(`username: ${username}, id: ${id}`);
    const projects =  await ProjectList.create(id);
    window.projects = projects;
    window.projects.displayProjects();
    
    //we call functions to make the page active
    addProject();
    makeClearButActive();
    addPopUpToggle();
    //search functionality
    search();
    addClearFilterListener();
    //delete menu functionality
    addDeleteMenuConfirmListener();
    addDeleteMenuRevokeListener();
}

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
        //document.querySelector(".error-message").innerHTML="";
        popUp.classList.toggle("shown");
        //clearPopUpFields();
    } else {
        console.error("no pop up div found");
    }
}

/** show the add project pop up menu */
export function popUpToggleAdd(){
    popUpToggle();
    const popUp = document.querySelector(".add-project-card");
    if (popUp){
        document.querySelector(".error-message").innerHTML="";
        popUp.classList.toggle("shown");
        clearPopUpFields();
    } else {
        console.error("no add pop up div found");
    }
}

export function popUpToggleDelete(){
    popUpToggle();
    const popUp = document.querySelector(".delete-project-card");
    if (popUp){
        popUp.classList.toggle("shown");
    } else {
        console.error("no delete pop up div found");
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
                projectIcon:"/media/profile-picture-placeholder2.png",
                manager:[],
                owner:[window.user],
                desc:desc,
                participants:[],
                status: "active"
            }
            //add the project to projects
            window.projects.addProject(newProject);
            
            //close pop up and clear
            //popUpToggle();
            popUpToggleAdd();
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
                popUpToggleAdd();
            });
            hideAddProject.addEventListener("click",()=>{ 
                popUpToggleAdd();
            });
        } else {
            console.error("no div for open/close add project pop up found");
        }
    } else {
        console.error("no pop up div found");
    }
}

/**
=================================================
FILTERING
=================================================
*/

/** apply the data in input to filter the projects*/
export function applyFilter(){
    const name = document.querySelector("#filter-project-name").value || "";
    const desc = document.querySelector("#filter-description").value || "";
    const status = document.querySelector("#filter-status").value || "";
    window.projects.setFilter(name,desc,status);
    window.projects.displayProjects();
}

/** clear the filter and set it to default */
export function clearFilter(){
    document.querySelector("#filter-project-name").value = "";
    document.querySelector("#filter-description").value = "";
    document.querySelector("#filter-status").value = "none";
    window.projects.setFilter();
    window.projects.displayProjects();
}

/** add event listener for clear filter button*/
export function addClearFilterListener(){
    const clear = document.querySelector(".js-clear-filter");
    if(clear){
        clear.addEventListener("click",()=>{
            clearFilter();
        });
    } else {
        console.error("no clear filter button found");
    }
}

/** add even listener for search button */
export function search(){
    const searchBtn = document.querySelector("#btn-search");
    if(searchBtn){
        searchBtn.addEventListener("click",()=>{
            applyFilter();
        });
    } else {
        console.error("no search button found");
    }
}

/**
=================================================
DELETING
=================================================
*/

/**add listener for delete button to all our projects and remove button for others */
export function addDeleteListener(){
    //we fetch all projects owned by the user
    const myOwn = document.querySelectorAll(".projects-grid.js-project-list.js-owner-prjct div.project-card");
    //we add event listener to the projects
    myOwn.forEach((card)=>{
        const button = card.querySelector("button");
        button.addEventListener("click",(e)=>{
            e.preventDefault();
            e.stopPropagation();
            const id = button.dataset.id;
            window.projects.setViewId(id);
            popUpToggleDelete();
        });
    });
    //we hide the button for managed projects
    const managed = document.querySelectorAll(".projects-grid.js-project-list.js-mangr-prjct div.project-card");
    managed.forEach((card)=>{
        const button = card.querySelector("button");
        button.style.visibility="hidden";
    });

    //we hide the button for projects where we are just the participant
    const part = document.querySelectorAll(".projects-grid.js-project-list.js-part-prjct div.project-card");
    part.forEach((card)=>{
        const button = card.querySelector("button");
        button.style.visibility="hidden";
    });
}

/** add event listener to the revoke delete button in pop up*/
export function addDeleteMenuRevokeListener(){
    const revoke = document.querySelector("#revoke-delete");
    if(revoke){
        revoke.addEventListener("click",()=>{
            popUpToggleDelete();
        });
    } else {
        console.error("no revoke delte button found");
    }
}

/** add event listener to the confirm delete button in pop up*/
export function addDeleteMenuConfirmListener(){
    const confirm = document.querySelector("#confirm-delete");
    if(confirm){
        confirm.addEventListener("click",()=>{
            popUpToggleDelete();
            window.projects.removeViewed();
        });
    } else {
        console.error("no confirm delte button found");
    }
}

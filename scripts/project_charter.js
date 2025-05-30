export class ProjectCharter{
    //properties described by the charter
    id=1;
    title="";
    desc="";
    status="Active";
    purpose="";
    objective="";
    acceptance="";
    deadline= "2025-12-24";
    deliverables={};
    assumptions=[];
    constraints=[];
    risks=[];

    /** construct an instance based on id */
    static async create(id){
        console.log(`create is being called with id = ${id}`);
        const instance = new ProjectCharter();
        const temp = await instance.fetchData(id);

        if (!temp) throw new Error("Failed to fetch project charter data");

        instance.id=id;
        instance.title = temp.project_title||"";
        instance.desc = temp.project_desc||"";
        instance.status = temp.project_status ||"Active";
        instance.purpose = temp.project_purpose||"";
        instance.objective = temp.project_objective||"";
        instance.acceptance = temp.project_acceptance||"";
        instance.deadline = temp.project_deadline||"2025-12-24";
        instance.deliverables = temp.project_deliverables ?? {};
        instance.assumptions = temp.project_assumptions ?? [];
        instance.constraints = temp.project_constraints ?? [];
        instance.risks = temp.project_risks ?? [];

        return instance;
    }

    /** fetch data from a server based on id */
    async fetchData(id){
        //starter code for integrating with the backend
        const path = `${BASE_URL}/controllers/Project_charter_controller.php?project_id=${id}`;
        console.log(path);
        try{
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch(error){
            console.error("Fetch error:", error);
            return null;
        }
    }

    /** add a deliverable to the list */
    addDeliverable(del){
        if(!(del in this.deliverables)){
            this.deliverables[del]="";//we add the new deliverable
            window.updateDelList();
            window.addDelListeners();
        }
    }

    /** remove a deliverable from the list */
    deleteDeliverable(del){
        if(del in this.deliverables){
            delete this.deliverables[del];
        }
        window.updateDelList();
        window.addDelListeners();
    }

    /** add to a list in the instance */
    addToList(value, key){
        if(Object.keys(this).includes(key)){
            if(!this[key].includes(value)){
                this[key].push(value);
                window.updateLists();
                window.addListListeners();
            }
        }
    }

    /** remove a value from a list indicated by the key */
    removeFromList(value,key){
        if(Object.keys(this).includes(key)){
            this[key]=this[key].filter(el=>{return el!=value});
            window.updateLists();
            window.addListListeners();
        }
    }

    async submitChanges(){
        //we have a path for sending update charter and one for updating status
        const path = `${BASE_URL}/controllers/Project_charter_controller.php?project_id=${this.id}`;
        const path2 =`${BASE_URL}/projects/${this.id}/status=${this.status}`
        console.log(path);
        try{
            const request1 = fetch(path,{
                method: "PUT",
                body:JSON.stringify(this),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            const request2 = fetch(path2,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            //we await the changes to be submitted
            const [response, response2] = await Promise.all([request1, request2]);
            //the result is checked for correct execution
            if (!response.ok || !response2.ok) {
                throw new Error(`HTTP error: ${response.status} or ${response2.status}`);
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch(error){
            console.error("Fetch error:", error);
            return null;
        }
    }

    /** submit the data to the database */
    submit(){
        this.submitChanges().then(()=>{
            console.log("going back");
            history.back();
        }).catch(err => {
            console.error('Error:', err);
        });
    }
}

/** load the project from the database*/
/*export function loadProjectCharter(){
    return new ProjectCharter();
}*/

export async function setUpFun(id){
    //we load the charter
    const charter= await ProjectCharter.create(id);
    //this makes testing work easier kinda
    window.updateDelList = updateDelList;
    window.addDelListeners = addDelListeners;
    window.updateLists = updateLists;
    window.addListListeners = addListListeners;
    window.charter= charter;
    //display loaded data
    displayCharter();
    //add listeners to the data
    addListeners();
    //submit button listener
    submitCharter();
}

/** display the initial project charter information */
export function displayCharter(){
    Object.keys(window.charter).forEach(key=>{
        //text field values are set
        const lists = ["deliverables","assumptions","constraints","risks"];
        if(!lists.includes(key) && key!="id"){
            //node is retrieved
            let field=document.querySelector(`#project-${key}`);
            if(!field) {
                console.error(`no field ${key} found`);
                return;
            }
            field.value=window.charter[key];

            //user input should be stored in the variable as they type
            field.addEventListener("input",(event)=>{
                const value = event.target.value;
                window.charter[key]=value;
            });
        }
        //deliverables are set differently via inner HTML
        if(key==="deliverables"){
            let field=document.querySelector(`#project-${key}`);
            let innerHTML="";
            if(!field) {
                console.error(`no field ${key} found`);
                return;
            }
            //each property is added to the string
            Object.keys(window.charter[key]).forEach(del =>{
                innerHTML+=`
                <div class="blob cool-button list-del" data-del="${del}">
                    ${del}
                    <input type="text" id="list-del-${del}" placeholder="Acceptance criteria" pattern="[A-Za-z0-9 ,.]+" required>
                    <i class="fa fa-times delete" aria-hidden="true"></i>
                </div>
                `;
            });
            field.innerHTML=innerHTML;
            //we set the values of the fields
            Object.keys(window.charter[key]).forEach(del =>{
                const elem = document.getElementById(`list-del-${del}`);
                if(elem){
                    elem.value = window.charter[key][del];
                } else {
                    console.error("deliverable without a dom element");
                }
                
            });
        } else if(lists.includes(key)){
            //we need to add the list elements
            let field=document.querySelector(`#project-${key}`);
            let innerHTML="";
            if(!field) {
                console.error(`no field ${key} found`);
                return;
            }
            //each property is added to the string
            (window.charter[key]).forEach(elem =>{
                innerHTML+=`
                <div class="blob cool-button list-${key}" data-${key}="${elem}">
                    ${elem}
                    <i class="fa fa-times delete" aria-hidden="true"></i>
                </div>
                `;
            });
            field.innerHTML=innerHTML;
        }
    });
}

/** add listeners to each add button and fields*/
export function addListeners(){
    const validPattern = /^[A-Za-z0-9 ,\.]+$/;
    const msg = document.querySelector(".error-message");

    //get the add deliverable field
    let addButton=document.querySelector(`#add-deliverable`);
    if(!addButton) {
        console.error(`no add deliverable button found`);
        return;
    }
    addButton.addEventListener("click",(event)=>{
        event.preventDefault();
        const newDel = document.querySelector("#deliverables");
        if(newDel && newDel.value!="" && validPattern.test(newDel.value)){
            window.charter.addDeliverable(newDel.value);
            msg.innerHTML="";
        } else{
            console.error("deliverables field not found or empty");
            msg.innerHTML="INVALID INPUT! MAKE BETTER CHOICES";
        }
    });

    //get the add list fields and add the listeners for them
    const lists = ["assumptions","constraints","risks"];
    lists.forEach(key=>{
        let addButton=document.querySelector(`#add-${key}`);
        if(!addButton) {
            console.error(`no add ${key} button found found`);
            return;
        }
        addButton.addEventListener("click",(event)=>{
            event.preventDefault();
            const newList = document.querySelector(`#${key}`);
            if(newList && newList.value!="" && validPattern.test(newList.value)){
                window.charter.addToList(newList.value, key);
                msg.innerHTML="";
            } else{
                console.error(`${key} field not found or empty`);
                msg.innerHTML="INVALID INPUT! MAKE BETTER CHOICES";
            }
        });
    });
    window.addDelListeners();
    window.addListListeners();
}

/** add event listeners for the blobs for each deliverable */
export function addDelListeners(){
    const validPattern = /^[A-Za-z0-9 ,\.]+$/;
    const msg = document.querySelector(".error-message");

    //set event listeners to deliverables
    const deliverables = document.querySelectorAll(".list-del");
    deliverables.forEach((del)=>{
        //the deliverable name
        const name = del.dataset.del;
        //we want delete button to work
        del.querySelector(".delete").addEventListener("click",(event)=>{
            event.preventDefault();
            window.charter.deleteDeliverable(name);
        });
        //we want the value to be updated in the variable upon input
        del.querySelector("input").addEventListener("input",(event)=>{
            const value = event.target.value;
            window.charter.deliverables[name]=value;
            if(!validPattern.test(value)){
                msg.innerHTML="INVALID INPUT! MAKE BETTER CHOICES";
            } else {
                msg.innerHTML="";
            }
        });
    });
}

/** update the list of deliverables visuals */
export function updateDelList(){
    let field=document.querySelector(`#project-deliverables`);
    let innerHTML="";
    if(!field) {
        console.error(`no field deliverables found`);
        return;
    }
    //each property is added to the string
    Object.keys(window.charter["deliverables"]).forEach(del =>{
        innerHTML+=`
        <div class="blob cool-button list-del" data-del="${del}">
            ${del}
            <input type="text" id="list-del-${del}" placeholder="Acceptance criteria" pattern="[A-Za-z0-9 ,.]+" required>
            <i class="fa fa-times delete" aria-hidden="true"></i>
        </div>
        `;
    });
    field.innerHTML=innerHTML;
    //we set the values of the fields
    Object.keys(window.charter.deliverables).forEach(del =>{
        document.querySelector(`#list-del-${del}`).value = window.charter.deliverables[del];
    });
}

/** add listeners to blob fields */
export function addListListeners(){
    const lists = ["assumptions","constraints","risks"];
    lists.forEach(key=>{
        const elements = document.querySelectorAll(`.list-${key}`);
        elements.forEach((el)=>{
            //the the name of the element
            const name = el.dataset[key];
            //we want delete button to work
            el.querySelector(".delete").addEventListener("click",(event)=>{
                event.preventDefault();
                console.log(`want to delete ${name} from ${key}`)
                window.charter.removeFromList(name, key);
            });
        });
    });
}

/** create html for blob lists */
export function updateLists(){
    //get the add deliverable field
    const lists = ["assumptions","constraints","risks"];
    lists.forEach(key=>{
        //we need to add the list elements
        let field=document.querySelector(`#project-${key}`);
        let innerHTML="";
        if(!field) {
            console.error(`no field ${key} found`);
            return;
        }
        //each property is added to the string
        (window.charter[key]).forEach(elem =>{
            innerHTML+=`
            <div class="blob cool-button list-${key}" data-${key}="${elem}">
                ${elem}
                <i class="fa fa-times delete" aria-hidden="true"></i>
            </div>
            `;
        });
        field.innerHTML=innerHTML;
    });
}


/** submit the data displayed on the page */
export function submitCharter(){
    const objective = document.querySelector("#project-objective");
    const desc = document.querySelector("#project-desc");
    const msg = document.querySelector(".error-message");
    const form = document.querySelector("form");
    const submitBut = document.querySelector('form input[type="submit"]');
    const validPattern = /^[A-Za-z0-9 ,\.]+$/;

    if(submitBut && form && msg){
        submitBut.addEventListener("click", (event)=>{
            event.preventDefault();//we do our own little thing instead

            //this checks text area fields for validity
            const littleSpecialFields = validPattern.test(objective.value) && validPattern.test(desc.value);
            //is the user sane?
            if(form.checkValidity() && littleSpecialFields){
                console.log("submitting");
                console.log(charter);
                //API call
                window.charter.submit();
            } else {
                console.log(`form: ${form.checkValidity()}, fields: ${littleSpecialFields}`);
                msg.innerHTML="INVALID INPUT! MAKE BETTER CHOICES";
            }
        });
    } else {
        console.error("no submit button found");
    }
}
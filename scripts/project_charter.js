class ProjectCharter{
    //properties described by the charter
    id=1;
    title="";
    desc="";
    purpose="";
    objective="";
    acceptance="";
    deadline= "2025-12-24";
    deliverables={};
    assumptions=[];
    constraints=[];
    risks=[];

    /** construct an instance based on id */
    constructor(id){
        const temp = this.fetchData(id);
        this.id=temp.id;
        this.title = temp.title;
        this.desc = temp.desc;
        this.purpose = temp.purpose;
        this.objective = temp.objective;
        this.acceptance = temp.acceptance;
        this.deadline = temp.deadline;
        this.deliverables = temp.deliverables;
        this.assumptions = temp.assumptions;
        this.constraints = temp.constraints;
        this.risks = temp.risks;
    }

    /** fetch data from a server based on id */
    fetchData(id){
        return {
            id: 1,
            deadline:"2025-12-12",
            status: "",
            title:"",
            desc:"",
            purpose:"",
            objective:"",
            acceptance:"",
            deliverables:{},
            assumptions:[],
            constraints:[],
            risks:[]
        };
    }

    /** add a deliverable to the list */
    addDeliverable(del){
        if(!(del in this.deliverables)){
            this.deliverables[del]="";//we add the new deliverable
            updateDelList();
            addDelListeners();
        }
    }

    /** remove a deliverable from the list */
    deleteDeliverable(del){
        if(del in this.deliverables){
            delete this.deliverables[del];
        }
        updateDelList();
        addDelListeners();
    }

    /** add to a list in the instance */
    addToList(value, key){
        if(Object.keys(this).includes(key)){
            if(!this[key].includes(value)){
                this[key].push(value);
                updateLists();
                addListListeners();
            }
        }
    }

    /** remove a value from a list indicated by the key */
    removeFromList(value,key){
        if(Object.keys(this).includes(key)){
            this[key]=this[key].filter(el=>{return el!=value});
            updateLists();
            addListListeners();
        }
    }
}

/** load the project from the database*/
function loadProjectCharter(){
    return new ProjectCharter(1);
}

const charter=loadProjectCharter();
//display loaded data
displayCharter();
//add listeners to the data
addListeners();
//submit button listener
submitCharter();

/** display the initial project charter information */
function displayCharter(){
    Object.keys(charter).forEach(key=>{
        //text field values are set
        const lists = ["deliverables","assumptions","constraints","risks"];
        if(!lists.includes(key) && key!="id"){
            //node is retrieved
            let field=document.querySelector(`#project-${key}`);
            if(!field) {
                console.error(`no field ${key} found`);
                return;
            }
            field.value=charter[key];

            //user input should be stored in the variable as they type
            field.addEventListener("input",(event)=>{
                const value = event.target.value;
                charter[key]=value;
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
            Object.keys(charter[key]).forEach(del =>{
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
            Object.keys(charter[key]).forEach(del =>{
                document.querySelector(`#list-del-${del}`).value = charter[key][del];
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
            Object.keys(charter[key]).forEach(elem =>{
                innerHTML+=`
                <div class="blob cool-button list-${key}" data-${key}="${elem}">
                    ${elem}
                    <i class="fa fa-times delete" aria-hidden="true"></i>
                </div>
                `;
            });
        }
    });
}



/** add listeners to each add button and fields*/
function addListeners(){
    const validPattern = /^[A-Za-z0-9 ,\.]+$/;
    const msg = document.querySelector(".error-message");

    //get the add deliverable field
    let addButton=document.querySelector(`#add-deliverable`);
    if(!addButton) {
        console.error(`no add deliverable button found found`);
        return;
    }
    addButton.addEventListener("click",(event)=>{
        event.preventDefault();
        const newDel = document.querySelector("#deliverables");
        if(newDel && newDel.value!="" && validPattern.test(newDel.value)){
            charter.addDeliverable(newDel.value);
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
                charter.addToList(newList.value, key);
                msg.innerHTML="";
            } else{
                console.error(`${key} field not found or empty`);
                msg.innerHTML="INVALID INPUT! MAKE BETTER CHOICES";
            }
        });
    });
    addDelListeners();
    addListListeners();
}

/** add event listeners for the blobs for each deliverable */
function addDelListeners(){
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
            charter.deleteDeliverable(name);
        });
        //we want the value to be updated in the variable upon input
        del.querySelector("input").addEventListener("input",(event)=>{
            const value = event.target.value;
            charter.deliverables[name]=value;
            if(!validPattern.test(value)){
                msg.innerHTML="INVALID INPUT! MAKE BETTER CHOICES";
            } else {
                msg.innerHTML="";
            }
        });
    });
}

/** update the list of deliverables visuals */
function updateDelList(){
    let field=document.querySelector(`#project-deliverables`);
    let innerHTML="";
    if(!field) {
        console.error(`no field deliverables found`);
        return;
    }
    //each property is added to the string
    Object.keys(charter["deliverables"]).forEach(del =>{
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
    Object.keys(charter.deliverables).forEach(del =>{
        document.querySelector(`#list-del-${del}`).value = charter.deliverables[del];
    });
}

/** add listeners to blob fields */
function addListListeners(){
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
                charter.removeFromList(name, key);
            });
        });
    });
}

/** create html for blob lists */
function updateLists(){
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
        (charter[key]).forEach(elem =>{
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
function submitCharter(){
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
            } else {
                msg.innerHTML="INVALID INPUT! MAKE BETTER CHOICES";
            }
        });
    } else {
        console.error("no submit button found");
    }
}
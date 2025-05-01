class ProjectCharter{
    //properties described by the charter
    title="";
    desc="";
    purpose="";
    objective="";
    deliverables=[];
    //basic constructor
    constructor(title, desc){
        this.title=title;
        this.desc=desc;
    }

    /** save the edited version*/
    save(){
        console.log("saving");
    }

    /** add a deliverable to the list */
    addDeliverable(del){
        if(!this.deliverables.includes(del)){
            this.deliverables.push(del);
            updateDelList();
            addDelListeners();
        }
    }

    /** remove a deliverable from the list */
    deleteDeliverable(del){
        this.deliverables = this.deliverables.filter(item => item!==del);
        updateDelList();
        addDelListeners();
    }

}

function loadProjectCharter(){
    return new ProjectCharter("name of something", "description of something");
}

const charter=loadProjectCharter();
//display loaded data
displayCharter();

function displayCharter(){
    Object.keys(charter).forEach(key=>{
        //text field values are set
        if(key!="deliverables"){
            //node is retrieved
            let field=document.querySelector(`#project-${key}`);
            if(!field) {
                console.error(`no field ${key} found`);
                return;
            }
            field.value=charter[key];
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
            charter[key].forEach(del =>{
                innerHTML+=`
                <div class="blob cool-button list-del" data-del="${del}">
                    ${del}
                    <input type="text" id="list-del-${del}" placeholder="Acceptance criteria" pattern="[A-Za-z0-9 ,.]+" required>
                    <i class="fa fa-times delete" aria-hidden="true"></i>
                </div>
                `;
            });
            field.innerHTML=innerHTML;
        }
    });
}

addListeners();

function addListeners(){
    //get the add deliverable field
    let addButton=document.querySelector(`#add-deliverable`);
    if(!addButton) {
        console.error(`no add deliverable button found found`);
        return;
    }
    addButton.addEventListener("click",(event)=>{
        event.preventDefault();
        const newDel = document.querySelector("#deliverables");
        if(newDel && newDel.value!=""){
            charter.addDeliverable(newDel.value);
        } else{
            console.error("deliverables field not found or empty");
        }
    });
    addDelListeners();
    
}

function addDelListeners(){
    //set event listeners to deliverables
    const deliverables = document.querySelectorAll(".list-del");
    deliverables.forEach((del)=>{
        const name = del.dataset.del;
        del.querySelector(".delete").addEventListener("click",(event)=>{
            event.preventDefault();
            charter.deleteDeliverable(name);
        });
    });
}

function updateDelList(){
    let field=document.querySelector(`#project-deliverables`);
    let innerHTML="";
    if(!field) {
        console.error(`no field deliverables found`);
        return;
    }
    //each property is added to the string
    charter["deliverables"].forEach(del =>{
        innerHTML+=`
        <div class="blob cool-button list-del" data-del="${del}">
            ${del}
            <input type="text" id="list-del-${del}" placeholder="Acceptance criteria" pattern="[A-Za-z0-9 ,.]+" required>
            <i class="fa fa-times delete" aria-hidden="true"></i>
        </div>
        `;
    });
    field.innerHTML=innerHTML;
}


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
        this.deliverables.push(del);
        displayCharter();
    }

    /** remove a deliverable from the list */
    deleteDeliverable(del){
        this.deliverables = this.deliverables.filter(item => item!=del);
    }

}

function loadProjectCharter(){
    return new ProjectCharter("name of something", "description of something");
}

const charter=loadProjectCharter();
displayCharter();

function displayCharter(){
    Object.keys(charter).forEach(key=>{
        //text field values are set
        if(key!="deliverables"){
            console.log(key, charter[key]);
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
                <button class="blob cool-button list-elem">
                    ${del}
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
                `
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
}


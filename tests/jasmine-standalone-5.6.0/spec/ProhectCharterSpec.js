import  {
    ProjectCharter,
    loadProjectCharter,
    updateDelList,
    updateLists,
    addDelListeners,
    addListListeners,
    displayCharter,
    addListeners,
    submitCharter
} from "../../../scripts/project_charter.js";

describe("PROJECT CHARTER PAGE:",()=>{
    let testDiv= document.querySelector(".js-test-div");
    let charter;
    let fakeData;

    beforeEach(function (){
        //we give fake data instead of real one
        fakeData = {
            id: 99,
            deadline: "2025-11-11",
            title: "Fake Project",
            desc: "Fake Description",
            purpose: "Fake Purpose",
            objective: "Fake Objective",
            acceptance: "Fake Acceptance",
            deliverables: { "Deliverable1": "Criteria1" },
            assumptions: ["Assumption1"],
            constraints: ["Constraint1"],
            risks: ["Risk1"]
        };

        //we set the inner html to what is expected
        testDiv.innerHTML=`
        <form>
        <h1>Project charter editing page:</h1>
        <div class="input-container">
            <div class="error-message"></div>
            <!--BASIC INFO-->
            <h2>Essential information:</h2>
            <label for="project-title">Project title/name:</label>
            <input type="text" id="project-title" placeholder="Project name" pattern="[A-Za-z0-9 ,.]+" required>
            <label for="project-desc">Description:</label>
            <textarea type="text" id="project-desc" placeholder="Project description" cols="50" rows="5" class="js-pop-up-field" pattern="[A-Za-z0-9 ,.]+" ></textarea required>
            <!--IMPORTANT INFO-->
            <h2>Goals of the project:</h2>
            <!--deadline-->
            <input type="date" id="project-deadline" value="2069-12-12" />
            <!--purpose-->
            <label for="project-purpose">Purpose:</label>
            <input type="text" id="project-purpose" placeholder="Project purpose" pattern="[A-Za-z0-9 ,.]+" >
            <!--objective-->
            <label for="project-objective">Objective:</label>
            <textarea type="text" id="project-objective" placeholder="Project objective" cols="50" rows="5" class="js-pop-up-field" pattern="[A-Za-z0-9 ,.]+" ></textarea>
            <label for="project-accept-crt">Acceptance criteria:</label>
            <!--acceptance-->
            <input type="text" id="project-acceptance" placeholder="Acceptance criteria" pattern="[A-Za-z0-9 ,.]+" >
            <!--adding a deliverable-->
            <h2>Other info</h2>
            <!--DELIVERABLES-->
            <label for="deliverables">Deliverables:</label>
            <div class="input-container add-deliverable">
                <input type="text" id="deliverables" placeholder="New deliverable" pattern="[A-Za-z0-9 ,.]+" >
                <button id="add-deliverable"class="blob cool-button">
                    Add
                </button>
            </div>
            <div id="project-deliverables" class="project-list">
                <!--javascript-->
            </div>
            <!--ASSUMPTIONS-->
            <label for="assumptions">Assumptions:</label>
            <div class="input-container add-deliverable">
                <input type="text" id="assumptions" placeholder="New assumption" pattern="[A-Za-z0-9 ,.]+" >
                <button id="add-assumptions"class="blob cool-button">
                    Add
                </button>
            </div>
            <div id="project-assumptions" class="project-list">
                <!--javascript-->
            </div>
            <!--CONSTRAINTS-->
            <label for="constraints">Constraints:</label>
            <div class="input-container add-deliverable">
                <input type="text" id="constraints" placeholder="New constraint" pattern="[A-Za-z0-9 ,.]+" >
                <button id="add-constraints"class="blob cool-button">
                    Add
                </button>
            </div>
            <div id="project-constraints" class="project-list">
                <!--javascript-->
            </div>
            <!--RISKS-->
            <label for="risks">Risks:</label>
            <div class="input-container add-deliverable">
                <input type="text" id="risks" placeholder="New risk" pattern="[A-Za-z0-9 ,.]+" >
                <button id="add-risks"class="blob cool-button">
                    Add
                </button>
            </div>
            <div id="project-risks" class="project-list">
                <!--javascript-->
            </div>
            <input type="submit" class="cool-button" value="Submit">
        </div>
        </form>
        `;

        //the test doesn't call to the server
        spyOn(ProjectCharter.prototype,"fetchData").and.returnValue(fakeData);
        //reset the fake data to the initial state
        charter=new ProjectCharter(99);

        //we assign function to a window
        window.updateDelList = updateDelList;
        window.addDelListeners = addDelListeners;
        window.updateLists = updateLists;
        window.addListListeners = addListListeners;
        window.displayCharter = displayCharter;
        window.charter = charter;

        // Spy on update functions
        spyOn(window, "updateDelList").and.callThrough();
        spyOn(window, "addDelListeners").and.callThrough();
        spyOn(window, "updateLists").and.callThrough();
        spyOn(window, "addListListeners").and.callThrough();
        spyOn(console, "error");

    });

    //need to empty the div so as not to crowd the page
    afterAll(()=>{
        testDiv.innerHTML="";
    });

    describe("#the project charter class tests:",()=>{
        it("should initialize from fetchData", function() {
            expect(ProjectCharter.prototype.fetchData).toHaveBeenCalledWith(99);
            expect(charter.id).toBe(99);
            expect(charter.title).toBe("Fake Project");
            expect(charter.deliverables).toEqual({ "Deliverable1": "Criteria1" });
        });
        
        it("should add a new deliverable and trigger UI updates", () => {
            charter.addDeliverable("NewDel");
            expect(charter.deliverables["NewDel"]).toBe("");
            expect(window.updateDelList).toHaveBeenCalled();
            expect(window.addDelListeners).toHaveBeenCalled();
        });

        it("should keep deliverable if already exists",()=>{
            charter.addDeliverable("Deliverable1");
            expect(charter.deliverables["Deliverable1"]).toBe("Criteria1");
        });

        it("should delete a deliverable and trigger UI updates", () => {
            charter.deleteDeliverable("Deliverable1");
            expect(charter.deliverables["Deliverable1"]).toBeUndefined();
            expect(window.updateDelList).toHaveBeenCalled();
            expect(window.addDelListeners).toHaveBeenCalled();

        });

        it("should add to list (assumptions)", () => {
            charter.addToList("NewAssumption", "assumptions");
            expect(charter.assumptions).toContain("NewAssumption");
            expect(window.updateLists).toHaveBeenCalled();
            expect(window.addListListeners).toHaveBeenCalled();
        });

        it("should not add duplicate to list", () => {
            charter.addToList("Assumption1", "assumptions");
            expect(charter.assumptions.length).toBe(1);
        });

        it("should remove from list", () => {
            charter.removeFromList("Assumption1", "assumptions");
            expect(charter.assumptions).not.toContain("Assumption1");
            expect(window.updateLists).toHaveBeenCalled();
            expect(window.addListListeners).toHaveBeenCalled();
        });

        it("should update deliverable input and validate pattern", () => {
            displayCharter(); // Triggers initial render
            addDelListeners();

            const input = document.querySelector("#list-del-Deliverable1");
            input.value = "Updated Criteria";

            input.dispatchEvent(new Event("input"));
            //updateDelList();
            console.log(charter.deliverables["Deliverable1"]);
            expect(charter.deliverables["Deliverable1"]).toBe("Updated Criteria");
        });

        it("should not break if invalid pattern is input", () => {
            displayCharter();
            addListeners();
            const input = document.querySelector("#list-del-Deliverable1");
            expect(input).not.toBeNull();
            input.value = "###INVALID###";
            input.dispatchEvent(new Event("input"));
            const msg = document.querySelector(".error-message");
            expect(msg.innerHTML).toContain("INVALID INPUT");
        });

        it("should not crash or modify state with invalid list key", () => {
            const original = [...charter.assumptions];
            charter.addToList("Oops", "nonexistentKey");
            expect(charter.assumptions).toEqual(original);
        });
    });

    describe("#other functions in the file:",()=>{
        describe("#display charter tests:",()=>{
            it("should display the charter properly(general test)",()=>{
                window.displayCharter();
                Object.keys(window.charter).forEach(key=>{
                    //text field values are set
                    const lists = ["deliverables","assumptions","constraints","risks"];
                    if(!lists.includes(key) && key!="id"){
                        //node is retrieved
                        let field=document.querySelector(`#project-${key}`);
                        expect(field).not.toBeNull();

                        expect(field.value).toEqual(window.charter[key]);
                    }
                    //deliverables are set differently via inner HTML
                    if(key==="deliverables"){
                        let field=document.querySelector(`#project-${key}`);
                        expect(field).not.toBeNull();
                        expect(field.innerHTML).not.toBeNull();
                        //we set the values of the fields
                        Object.keys(window.charter[key]).forEach(del =>{
                            expect(document.querySelector(`#list-del-${del}`).value).toEqual(window.charter[key][del]);
                        });
                    } else if(lists.includes(key)){
                        //we need to add the list elements
                        let field=document.querySelector(`#project-${key}`);
                        expect(field).not.toBeNull();

                        expect(field.innerHTML).not.toBeNull();
                    }
                });
            });

            it("display charter should populate input fields with charter values", () => {
                displayCharter();
                expect(document.querySelector("#project-title").value).toBe("Fake Project");
                expect(document.querySelector("#project-desc").value).toBe("Fake Description");
                expect(document.querySelector("#project-objective").value).toBe("Fake Objective");
            });

            it("display charter should create a deliverable blob with correct input value", () => {
                displayCharter();
                const input = document.querySelector("#list-del-Deliverable1");
                expect(input).not.toBeNull();
                expect(input.value).toBe("Criteria1");
            });
        });

        it("should log and not show error on valid form submit", () => {
            displayCharter();
            addListeners();
            submitCharter();
        
            const msg = document.querySelector(".error-message");
            const submitBtn = document.querySelector('form input[type="submit"]');
            spyOn(console, 'log');
        
            // valid inputs
            document.querySelector("#project-objective").value = "Valid Objective";
            document.querySelector("#project-desc").value = "Valid Description";
        
            submitBtn.click();
            expect(console.log).toHaveBeenCalledWith("submitting");
            expect(msg.innerHTML).toBe("");
        });

        describe("#update del list function:",()=>{
            it("update del list should update the deliverables DOM with current data", () => {
                charter.deliverables = { "TestDel": "TestCriteria" };
                updateDelList();
                const input = document.querySelector("#list-del-TestDel");
                expect(input).not.toBeNull();
                expect(input.value).toBe("TestCriteria");
            });

            it("update del list should throw an error if no field is present",()=>{
                let field=document.querySelector(`#project-deliverables`);
                field.remove();

                updateDelList();
                expect(console.error).toHaveBeenCalled();
            });
        });

        describe("#addDelListeners", () => {
            it("should attach input and delete listeners to each deliverable blob", () => {
                charter.deliverables = { "TestDel": "Initial" };
                updateDelList();
                addDelListeners();
                const input = document.querySelector("#list-del-TestDel");
                input.value = "Updated";
                input.dispatchEvent(new Event("input"));
    
                expect(charter.deliverables["TestDel"]).toBe("Updated");
            });
    
            it("should remove deliverable when delete is clicked", () => {
                charter.deliverables = { "TempDel": "Whatever" };
                updateDelList();
                addDelListeners();
                const deleteBtn = document.querySelector(".list-del .delete");
                deleteBtn.click();
                expect(charter.deliverables["TempDel"]).toBeUndefined();
            });
        });


    });
});
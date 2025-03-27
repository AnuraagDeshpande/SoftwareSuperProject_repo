import { ProjectList, popUpToggle, clearPopUpFields, makeClearButActive, addProject, addPopUpToggle } from "../../../scripts/project_list.js";

describe("Project list page", ()=>{
    let projectList;
    let testDiv= document.querySelector(".js-test-div");

    beforeEach(function() {
        //necessary fields are created for testing
        testDiv.innerHTML=`
        <div class=\"js-project-list\"></div>
        <div class="pop-up-screen"></div>
        <button id="add-project-clear"></button>
        <button id="add-project-submit"></button>
        <input id="project-name" class="js-pop-up-field" value="">
        <textarea id="project-desc" class="js-pop-up-field"></textarea>
        <p class="error-message"></p>
        <button id="btn-add-project"></button>
        <button class="js-hide-add-project"></button>
        `;

        //we get fake values for the fetch Data
        spyOn(ProjectList.prototype, "fetchData").and.callFake(function() {
            this.projects = [
                {
                    projectName: "Mock Project 1",
                    projectIcon: "profile-picture-placeholder.png",
                    manager: "manager123",
                    owner: "owner123",
                    desc: "This is a very long description sdjklfhasdkjfhlsdkfhsdjakfhlaskdjfaskdlfhadsfklhdsfkladslfasdlfhdsfklhl",
                    participants: ["profile-picture-placeholder.png", "profile-picture-placeholder.png"],
                    status: "active"
                },
                {
                    projectName: "Mock Project 2",
                    projectIcon: "profile-picture-placeholder.png",
                    manager: "manger 234",
                    owner: "owner 234",
                    desc: "dslakfjeiowhfjsdncna;ksdfhsfjdsljfklasjdfhjkasdfhaskdjfhu",
                    participants: ["mock3.png", "mock4.png"],
                    status: "error"
                }
            ];
        });

        spyOn(console, 'error');

        projectList = new ProjectList();
        //we set up the elements to be active
        makeClearButActive();
        addProject();
        addPopUpToggle();
    });

    //we clean up after ourselves
    afterAll(()=>{
        testDiv.innerHTML="";
    });

    //test cases:
    it("calls mock version of the fetch data", function(){
            expect(ProjectList.prototype.fetchData).toHaveBeenCalled();
            expect(projectList.projects.length).toBe(2);
            expect(projectList.projects[0].projectName).toBe("Mock Project 1");
        }
    );

    it("calls addProject and adds a project to list", ()=> {
        const newProject = {
            projectName: "Test Project",
            projectIcon: "test-icon.png",
            manager: "Test Manager",
            owner: "Test Owner",
            desc: "This is a test project description",
            participants: ["test1.png", "test2.png"],
            status: "pending"
        };

        projectList.addProject(newProject);
        expect(projectList.projects.length).toBe(3);
        expect(projectList.projects[2]).toEqual(newProject);
    });

    it("fills the div with the projects list",()=>{
        expect(testDiv.innerHTML).not.toEqual("");
        const cards=document.querySelectorAll('.project-card');
        expect(cards.length).toEqual(2);
    });

    describe("#add project pop up menu",()=>{
        it("should toggle pop-up visibility", function() {
            const popUp = document.querySelector(".pop-up-screen");
            //it is not visible
            expect(popUp.classList.contains("shown")).toBe(false);
            
            popUpToggle();//we show it
            expect(popUp.classList.contains("shown")).toBe(true);

            popUpToggle();//we hide it again
            expect(popUp.classList.contains("shown")).toBe(false);

            //for branch coverage
            popUp.remove();
            popUpToggle();
            expect(console.error).toHaveBeenCalledWith("no pop up div found");
        });

        it("should clear all input fields in the pop up", function() {
            document.querySelector("#project-name").value = "Test Project";
            document.querySelector("#project-desc").value = "Test Description";
            
            clearPopUpFields();//clear fields

            expect(document.querySelector("#project-name").value).toBe("");
            expect(document.querySelector("#project-desc").value).toBe("");
        });

        it("should show an error message for invalid input", function() {
            const errorDiv = document.querySelector(".error-message")
            //name invalid, desc valid - test regex
            document.querySelector("#project-name").value = "!@#$";//invalid
            document.querySelector("#project-desc").value = "Valid Description";

            document.querySelector("#add-project-submit").click();//we try submitting
            expect(errorDiv.innerHTML).toBe("invalid input try again");

            //reset
            errorDiv.innerHTML="";
            //name valid, desc invalid - test regex
            document.querySelector("#project-name").value = "name";
            document.querySelector("#project-desc").value = "!@#$";

            document.querySelector("#add-project-submit").click();
            expect(errorDiv.innerHTML).toBe("invalid input try again");

            //reset
            errorDiv.innerHTML="";
            //name invalid, desc invalid - test for empty values
            document.querySelector("#project-name").value = "";
            document.querySelector("#project-desc").value = "";

            document.querySelector("#add-project-submit").click();
            expect(errorDiv.innerHTML).toBe("invalid input try again");

            //reset
            errorDiv.innerHTML="";
            //name invalid, desc invalid - test max length
            document.querySelector("#project-name").value = "00000".repeat(11);
            document.querySelector("#project-desc").value = "valid";

            document.querySelector("#add-project-submit").click();
            expect(errorDiv.innerHTML).toBe("invalid input try again");
        });

        it("should add an event listener to the add project button(submit)",()=>{
            //basic test
            const submitChanges = document.querySelector("#add-project-submit");
            spyOn(submitChanges, "addEventListener");

            addProject();
            expect(submitChanges.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

            //test for branch coverage
            submitChanges.remove();
            addProject();
            expect(console.error).toHaveBeenCalledWith("no submit add project button found");
        });

        it("should add an event listener to the clear button",()=>{
            //basic test
            const clear = document.querySelector("#add-project-clear");
            spyOn(clear, "addEventListener");

            makeClearButActive();
            expect(clear.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

            //test for branch coverage
            clear.remove();
            makeClearButActive();
            expect(console.error).toHaveBeenCalledWith("no clear button found");
        });
    });
});
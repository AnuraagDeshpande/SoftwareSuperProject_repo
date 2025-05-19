import { ProjectList, popUpToggle, clearPopUpFields, makeClearButActive, addProject, addPopUpToggle,clearFilter, addClearFilterListener, search, applyFilter, addDeleteMenuRevokeListener, addDeleteMenuConfirmListener, addDeleteListener, popUpToggleAdd, popUpToggleDelete } from "../../../scripts/project_list.js";

describe("PROJECT LIST PAGE:", ()=>{
    let projectList;
    let testDiv= document.querySelector(".js-test-div");

    beforeEach(function() {
        //necessary fields are created for testing
        testDiv.innerHTML=`
        <div class=\"js-project-list\"></div>

        <!--popup stuff-->
        <div class="pop-up-screen">
            <div class=" add-project-card"></div>
            <button id="add-project-clear"></button>
            <button id="add-project-submit"></button>
            <input id="project-name" class="js-pop-up-field" value="">
            <textarea id="project-desc" class="js-pop-up-field"></textarea>
            <p class="error-message"></p>
        </div>
        <button id="btn-add-project"></button>
        <button class="js-hide-add-project"></button>

        <!--the delete menu-->
        <div class="pop-up-card delete-project-card">
            <div>
                <button id="confirm-delete" class="cool-button">delete</button>
                <button id="revoke-delete" class="cool-button">return</button>
            </div>
        </div>

        <!--displaying projects-->
        <div class="projects-grid js-project-list js-owner-prjct"></div>
        <div class=" projects-grid js-project-list js-mangr-prjct"></div>
        <div class="projects-grid js-project-list js-part-prjct"></div>

        <!--filtering project-->
        <button id="btn-sort" class="js-clear-filter">Clear filter</button>
        <button id="btn-search">Search</button>

        <input type="text" id="filter-project-name" placeholder="Search by project name">
        <input type="text" id="filter-description" placeholder="Search by description">
        <select id="filter-status"><option value="none">None</option>
            <option value="active">active</option>
            <option value="error">failed</option>
            <option value="finished">finished</option>
        </select>
        `;
        const fakeData = [
            {
                projectName: "Mock Project 1",
                projectIcon: "profile-picture-placeholder.png",
                manager: ["manager123"],
                owner: ["owner123"],
                desc: "This is a very long description sdjklfhasdkjfhlsdkfhsdjakfhlaskdjfaskdlfhadsfklhdsfkladslfasdlfhdsfklhl",
                participants: ["profile-picture-placeholder.png", "profile-picture-placeholder.png"],
                status: "active"
            },
            {
                projectName: "Mock Project 2",
                projectIcon: "profile-picture-placeholder.png",
                manager: ["manger 234"],
                owner: ["owner 234", "user123"],
                desc: "dslakfjeiowhfjsdncna;ksdfhsfjdsljfklasjdfhjkasdfhaskdjfhu",
                participants: ["mock3.png", "mock4.png"],
                status: "error"
            }
        ];    

        spyOn(console, 'error');
        spyOn(console,'log');

        projectList = new ProjectList();
        projectList.projects=fakeData;
        //const projects = new ProjectList();


        window.projects = projectList;
        window.user = "owner 234";

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
    });

    //we clean up after ourselves
    afterAll(()=>{
        testDiv.innerHTML="";
    });

    it("fills the div with the projects list",()=>{
        expect(testDiv.innerHTML).not.toEqual("");
        const cards=document.querySelectorAll('.project-card');
        console.log(cards);
        expect(cards.length).toEqual(2);
    });

    describe("#add project pop up menu",()=>{
        it("should toggle pop-up screen visibility", function() {
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

        it("should add an event listener to the pop up close/open button",()=>{
            //basic test
            const addProjectBut = document.querySelector("#btn-add-project");
            const hideAddProject = document.querySelector(".js-hide-add-project");
            spyOn(addProjectBut, "addEventListener");
            spyOn(hideAddProject, "addEventListener")

            addPopUpToggle();
            expect(addProjectBut.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));
            expect(hideAddProject.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

            //test for branch coverage
            addProjectBut.remove();
            addPopUpToggle();
            expect(console.error).toHaveBeenCalledWith("no div for open/close add project pop up found");

            //more branch coverage
            document.querySelector(".pop-up-screen").remove();
            addPopUpToggle();
            expect(console.error).toHaveBeenCalledWith("no pop up div found");
        });
    
        it("should toggle pop-up when add/hide buttons are clicked", function() {
            const popUp = document.querySelector(".pop-up-screen");
            const addProjectButton = document.querySelector("#btn-add-project");
            const hideProjectButton = document.querySelector(".js-hide-add-project");
    
            expect(popUp.classList.contains("shown")).toBe(false);
    
            addProjectButton.click();//open
            expect(popUp.classList.contains("shown")).toBe(true);
    
            hideProjectButton.click();//close
            expect(popUp.classList.contains("shown")).toBe(false);
        });

        it("should toggle add project pop up",()=>{
            //we test that the pop up for add project is changing
            const popUp = document.querySelector(".add-project-card");
            expect(popUp.classList.contains("shown")).toBe(false);
            popUpToggleAdd();
            expect(popUp.classList.contains("shown")).toBe(true);

            //branch coverage
            popUp.remove();
            popUpToggleAdd();
            expect(console.error).toHaveBeenCalledWith("no add pop up div found");
        });
    });

    describe("#the filtering functionality:",()=>{
        //we initialize the 2 elements
        beforeEach(()=>{
            search();
            addClearFilterListener();
        });

        //event listeners should be there
        it("should add event listener for clear button",()=>{
            const clear = document.querySelector(".js-clear-filter");
            spyOn(clear, "addEventListener");
            addClearFilterListener();
            expect(clear.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

            clear.remove();
            addClearFilterListener();
            expect(console.error).toHaveBeenCalledWith("no clear filter button found");
        });

        it("should add event listener to search button",()=>{
            const searchBtn = document.querySelector("#btn-search");
            spyOn(searchBtn,"addEventListener");
            search();
            expect(searchBtn.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

            searchBtn.remove();
            search();
            expect(console.error).toHaveBeenCalledWith("no search button found");
        });

        //apply filter to the elemets displayed
        it("should filter properly when searched and clear it correctly",()=>{
            const name=document.querySelector("#filter-project-name");
            const desc=document.querySelector("#filter-description");
            const status = document.querySelector("#filter-status");
            //first we apply simple filter
            name.value="1";
            desc.value="This is a very long description";
            status.value="active";
            applyFilter();
            let projects=document.querySelectorAll(".project-card");
            expect(projects.length).toEqual(1);
            //we change filter
            status.value="finished";
            applyFilter();
            projects=document.querySelectorAll(".project-card");
            expect(projects.length).toEqual(0);
            //we clear the filter
            clearFilter();
            projects=document.querySelectorAll(".project-card");
            expect(projects.length).toEqual(2);
        });
    });

    describe("#the deletion functions",()=>{
        it("should add listener to revoke delete",()=>{
            const revoke = document.querySelector("#revoke-delete");

            spyOn(revoke, "addEventListener");
            addDeleteMenuRevokeListener();
            expect(revoke.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

            revoke.remove();
            addDeleteMenuRevokeListener();
            expect(console.error).toHaveBeenCalledWith("no revoke delte button found");
        });

        it("should add listener to confirm delete",()=>{
            const confirm = document.querySelector("#confirm-delete");

            spyOn(confirm, "addEventListener");
            addDeleteMenuConfirmListener();
            expect(confirm.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

            confirm.remove();
            addDeleteMenuConfirmListener();
            expect(console.error).toHaveBeenCalledWith("no confirm delte button found");
        });

        it("should add listener for the delete button on project card",()=>{
            //we get our own projects
            console.log("fetching my own project");
            const myOwn = document.querySelector(".projects-grid.js-project-list.js-owner-prjct div.project-card");
            console.log(`the my own list:${myOwn.innerHTML}`);
            let button = myOwn.querySelector("button");
            spyOn(button, "addEventListener");
            //function is called
            addDeleteListener();
            expect(button.addEventListener).toHaveBeenCalledWith("click", jasmine.any(Function));

            //we get projects that are not ours
            const part = document.querySelector(".projects-grid.js-project-list.js-part-prjct div.project-card");
            button = part.querySelector("button");
            addDeleteListener();
            expect(button.style.visibility).toEqual("hidden");
        });

        it("should toggle delete pop up",()=>{
            //we test that the pop up for delete is changing
            const popUp = document.querySelector(".delete-project-card");
            expect(popUp.classList.contains("shown")).toBe(false);
            popUpToggleDelete();
            expect(popUp.classList.contains("shown")).toBe(true);

            //branch coverage
            popUp.remove();
            popUpToggleDelete();
            expect(console.error).toHaveBeenCalledWith("no delete pop up div found");
        });
    });
});
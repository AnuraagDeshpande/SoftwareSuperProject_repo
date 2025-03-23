import { ProjectList } from "../../../scripts/project_list.js";

describe("Project list page", ()=>{
    let projectList;
    let testDiv= document.querySelector(".js-test-div");

    beforeEach(function() {
        testDiv.innerHTML="<div class=\"js-project-list\"></div>";
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

        projectList = new ProjectList();
    });

    afterAll(()=>{
        testDiv.innerHTML="<div class=\"js-project-list\"></div>";
    });

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
});
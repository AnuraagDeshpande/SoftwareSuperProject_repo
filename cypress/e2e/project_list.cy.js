describe("project-list page",()=>{
    it('open the project list page, add project menu', () => {
        //we go to the project list page
        cy.visit('http://localhost:8000/');
        cy.get("#hamburger").click();
        cy.get("#btn-project-list").click();
        //we create a project
        cy.get("#btn-add-project").click();
        cy.get(".add-project-card").should("be.visible");
        cy.get("#project-name").type("new project here");
        cy.get("#project-desc").type("new project description");
        //we check the value after typing
        cy.get('#project-name').should('have.value', 'new project here');
        cy.get("#project-desc").should("have.value","new project description");
        //we clear the fields
        cy.get("#add-project-clear").click();
        cy.get('#project-name').should('have.value', '');
        cy.get("#project-desc").should("have.value","");
        //we decide to close for some reson
        cy.get(".js-hide-add-project").click();
        cy.get(".add-project-card").should("not.be.visible");
    });

    it("delete the project menu should work after we add",()=>{
        //we go to the project list page
        cy.visit('http://localhost:8000/');
        cy.get("#hamburger").click();
        cy.get("#btn-project-list").click();

        //expect there to be 1 more card than before
        cy.get('.project-card').then(($cardsBefore) => {
            const cardsLen = $cardsBefore.length;            
            cy.get("#btn-add-project").click();
            cy.get(".add-project-card").should("be.visible");
            cy.get("#project-name").type("new project here");
            cy.get("#project-desc").type("new project description");
            //we check the value after typing
            cy.get('#project-name').should('have.value', 'new project here');
            cy.get("#project-desc").should("have.value","new project description");
            cy.get("#add-project-submit").click();
            cy.get(".project-card").should("have.length",cardsLen+1);
        });

        //we try using the delete menu
        cy.get('.project-card').eq(1).within(() => {
            cy.get('#delete-button').click();
        });
        //we test revoke button
        cy.get(".delete-project-card").should("be.visible");
        cy.get("#revoke-delete").click();
        cy.get(".delete-project-card").should("not.be.visible");

        //we test the confirm button
        cy.get('.project-card').then(($cardsBefore) => {
            const cardsLen = $cardsBefore.length;            
            cy.get('.project-card').eq(1).within(() => {
                cy.get('#delete-button').click();
            });
            cy.get(".delete-project-card").should("be.visible");
            cy.get("#confirm-delete").click();
            cy.get(".project-card").should("have.length",cardsLen-1);
        });
    });

    it("should filter the projects as expected",()=>{
        //we go to the project list page
        cy.visit('http://localhost:8000/');
        cy.get("#hamburger").click();
        cy.get("#btn-project-list").click();

        //we filter the projects based on status
        cy.get("#filter-status").select("failed");
        cy.get("#btn-search").click();
        cy.get('.project-card').should("have.length",1);
        //we clear the filter
        cy.get(".js-clear-filter").click();
        cy.get('.project-card').should("have.length",3);

        //we filter based on name
        cy.get("#filter-project-name").type("Project on projects 2")
        cy.get("#btn-search").click();
        cy.get('.project-card').should("have.length",1);
        //we clear the filter
        cy.get(".js-clear-filter").click();
        cy.get('.project-card').should("have.length",3);

        //we filter based on desc
        cy.get("#filter-description ").type("This project aims at projecting project projects at project. This text fully fits");
        cy.get("#btn-search").click();
        cy.get('.project-card').should("have.length",2);
        //we clear the filter
        cy.get(".js-clear-filter").click();
        cy.get('.project-card').should("have.length",3);

    });
});

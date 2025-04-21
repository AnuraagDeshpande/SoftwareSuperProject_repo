describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:8000/');
  })

  it("should have side and nav bars ",()=>{
    cy.visit('http://localhost:8000/');
    cy.get(".navbar").should("exist").and("not.be.empty");
    cy.get(".sidebar").should("exist").and("not.be.empty");
  });
});
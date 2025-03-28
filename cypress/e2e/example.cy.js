describe('My First Test', () => {
  it('Visits the React App', () => {
    cy.visit('http://localhost:5173/');
    cy.contains('Tractice');
  });
});

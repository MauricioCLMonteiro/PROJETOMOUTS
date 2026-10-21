// Esta classe suporta cenarios positivos e negativos do login page
class LoginPage {
  visitar() {
    cy.visit('/login');
  }

  preencherEmail(email) {
    if (email) cy.get('[data-testid="email"]').type(email);
  }

  preencherSenha(senha) {
    if (senha) cy.get('[data-testid="senha"]').type(senha);
  }

  limparEmail() {
    cy.get('[data-testid="email"]').clear();
  }

  limparSenha() {
    cy.get('[data-testid="senha"]').clear();
  }

  clicarEntrar() {
    cy.get('[data-testid="entrar"]').click();
  }

  verificarMensagemErro(mensagem) {
    cy.get('.alert').should('be.visible').and('contain.text', mensagem);
  }

  verificarValidacaoCampoObrigatorio(mensagem) {
    cy.contains(mensagem).should('be.visible');
  }
}

export default new LoginPage();
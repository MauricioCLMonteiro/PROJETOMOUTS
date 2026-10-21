import loginPage from '../../support/pages/login.page';
// Nesta classe login.cy.js contemplam os cenarios de testes mapeados positivos e negativos de front
describe('Testes E2E - Frontend (Login)', () => {
  beforeEach(() => {
    loginPage.visitar();
  });

  // --- CENARIOS DE TESTES POSITIVOS ---
  it('CT01 (Positivo): Realizar login com sucesso com credenciais validas', () => {
    loginPage.preencherEmail('produto@qa.com');
    loginPage.preencherSenha('mouts123');
    loginPage.clicarEntrar();

    cy.url().should('include', '/admin/home');
    cy.contains('Bem Vindo').should('be.visible');
  });

  it('CT02 (Positivo): Validar redirecionamento para a tela de cadastro', () => {
    cy.get('[data-testid="cadastrar"]').click();
    cy.url().should('include', '/cadastrarusuarios');
    cy.contains('Cadastre-se').should('be.visible');
  });

  // --- --- CENARIOS DE TESTES NEGATIVOS ---
  it('CT03 (Negativo): Exibir erro ao tentar autenticar com senha incorreta', () => {
    loginPage.preencherEmail('produto@qa.com');
    loginPage.preencherSenha('mouts1234');
    loginPage.clicarEntrar();

    loginPage.verificarMensagemErro('Email e/ou senha invalidos');
  });

  it('CT04 (Negativo): Exibir mensagens de validacao ao submeter formulario em branco', () => {
    loginPage.clicarEntrar();

    loginPage.verificarValidacaoCampoObrigatorio('Email obrigatorio');
    loginPage.verificarValidacaoCampoObrigatorio('Password obrigatrio');
  });

  it('CT05 (Negativo): Exibir validacao para formato de e-mail invalido', () => {
    loginPage.preencherEmail('produto@qa.commmm');
    loginPage.preencherSenha('teste');
    loginPage.clicarEntrar();

    loginPage.verificarValidacaoCampoObrigatorio('Email deve ser um email valido');
  });
});
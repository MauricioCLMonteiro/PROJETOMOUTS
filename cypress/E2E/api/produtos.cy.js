//Nesta classe produtos.cy.js contemplam os cenarios de testes mapeados positivos e negativos de API
describe('Testes de API - (Produtos)', () => {
  let token;

  before(() => {
    // chamada de autenticacao para obter o Bearer Token
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/login',
      body: {
        email: 'produto@qa.com',
        password: 'teste'
      }
    }).then((response) => {
      token = response.body.authorization;
    });
  });

  // --- CENARIOS DE TESTES POSITIVOS ---
  it('CT01 (Positivo): Listar produtos cadastrados com sucesso (GET 200)', () => {
    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/produtos'
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('produtos');
      expect(response.body.produtos).to.be.an('array');
    });
  });

  it('CT02 (Positivo): Cadastrar produto com dados validos (POST 201)', () => {
    const produto = {
      nome: `Logitech MX Master ${Date.now()}`,
      preco: 450,
      descricao: 'Mouse ergonomico',
      quantidade: 15
    };

    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/produtos',
      headers: { authorization: token },
      body: produto
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro com sucesso');
      expect(response.body).to.have.property('_id');
    });
  });

  // --- CENARIOS DE TESTES NEGATIVOS ---
  it('CT03 (Negativo): Tentar cadastrar produto sem enviar token de autorizacao (POST 401)', () => {
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/produtos',
      failOnStatusCode: false,
      body: {
        nome: 'Teclado Mecanico',
        preco: 250,
        descricao: 'Teclado RGB',
        quantidade: 5
      }
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais');
    });
  });

  it('CT04 (Negativo): Tentar cadastrar produto com nome ja existente (POST 400)', () => {
    const nomeDuplicado = `Produto Duplicado ${Date.now()}`;

    // Cadastra o primeiro produto
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/produtos',
      headers: { authorization: token },
      body: {
        nome: produtoDuplicado,
        preco: 100,
        descricao: 'Teste de produto ja existente',
        quantidade: 1
      }
    }).then(() => {
      // Tenta cadastrar um segundo produto com o mesmo nome
      cy.request({
        method: 'POST',
        url: 'https://serverest.dev/produtos',
        headers: { authorization: token },
        failOnStatusCode: false,
        body: {
          nome: produtoDuplicado,
          preco: 200,
          descricao: 'Tentando duplicar o produto ja existente',
          quantidade: 2
        }
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Ja existe produto com esse nome');
      });
    });
  });

  it('CT05 (Negativo): Tentar cadastrar produto com payload em branco ou com campos obrigatorios vazios (POST 400)', () => {
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/produtos',
      headers: { authorization: token },
      failOnStatusCode: false,
      body: {}
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('nome', 'nome nao pode ficar em branco');
      expect(response.body).to.have.property('preco', 'preco deve ser um numero');
      expect(response.body).to.have.property('descricao', 'descricao noo pode ficar em branco');
      expect(response.body).to.have.property('quantidade', 'quantidade deve ser um numero');
    });
  });
});
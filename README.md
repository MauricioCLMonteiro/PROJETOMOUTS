# Projeto MOUTS — Testes automatizados com Cypress

Projeto de automação de testes E2E para o fluxo de login da interface ServeRest e de testes de API para o recurso de produtos.

## Tecnologias e bibliotecas

- **JavaScript** com módulos CommonJS na configuração do Cypress e módulos ES nos testes e arquivos de suporte.
- **Node.js e npm** para instalar as dependências e executar os testes.
- **Cypress `^16.2.0`** para automação da interface e chamadas HTTP de teste (`cy.request`).
- **ServeRest** como aplicação sob teste:
  - Frontend: `https://front.serverest.dev`
  - API: `https://serverest.dev`

## Estrutura do projeto

```text
.
├── cypress.config.js
├── package.json
├── README.md
└── cypress/
    ├── E2E/
    │   ├── api/
    │   │   └── produtos.cy.js
    │   └── frontend/
    │       └── login.cy.js
    ├── fixtures/
    │   └── example.json
    └── support/
        ├── commands.js
        ├── e2e.js
        ├── pages/
        │   └── login.page.js
        └── requests/
```

### Arquivos e responsabilidades

- **`cypress.config.js`**: configura os testes E2E e define `https://front.serverest.dev` como `baseUrl`.
- **`cypress/E2E/frontend/login.cy.js`**: contém os cenários de interface para login e navegação até o cadastro.
- **`cypress/E2E/api/produtos.cy.js`**: contém os cenários HTTP para listagem e cadastro de produtos. Obtém um token antes dos testes que exigem autenticação.
- **`cypress/support/pages/login.page.js`**: implementa a classe `LoginPage`, que encapsula navegação, preenchimento e limpeza dos campos, ação de login e verificações de mensagens.
- **`cypress/support/e2e.js`**: arquivo de suporte carregado pelo Cypress; importa `commands.js`.
- **`cypress/support/commands.js`**: ponto de extensão para comandos customizados do Cypress; atualmente não registra comandos.
- **`cypress/fixtures/example.json`**: fixture de exemplo, ainda não utilizada pelos cenários atuais.
- **`cypress/support/requests/`**: diretório reservado para organização de requisições; não há arquivos nele atualmente.
- **`package.json`**: declara o Cypress como dependência de desenvolvimento. O script npm `test` ainda é apenas um placeholder e não executa os testes.

## Cenários automatizados

### Frontend — Login (`login.cy.js`)

Os testes visitam `/login` antes de cada cenário e usam os métodos da classe `LoginPage`.

| ID | Tipo | Cenário | Resultado esperado |
|---|---|---|---|
| CT01 | Positivo | Entrar com `produto@qa.com` e senha `mouts123` | Redirecionar para `/admin/home` e exibir “Bem Vindo”. |
| CT02 | Positivo | Acessar o cadastro pelo botão de cadastro | Redirecionar para `/cadastrarusuarios` e exibir “Cadastre-se”. |
| CT03 | Negativo | Entrar com senha incorreta | Exibir a mensagem “Email e/ou senha invalidos”. |
| CT04 | Negativo | Enviar o formulário vazio | Exibir as validações de e-mail e senha obrigatórios. |
| CT05 | Negativo | Enviar e-mail em formato inválido | Exibir “Email deve ser um email valido”. |

### API — Produtos (`produtos.cy.js`)

Os cenários usam `https://serverest.dev` diretamente. O `before` da suíte faz login com `produto@qa.com` e senha `teste` para obter o token usado nos cadastros autenticados.

| ID | Tipo | Cenário | Resultado esperado |
|---|---|---|---|
| CT01 | Positivo | Listar produtos (`GET /produtos`) | HTTP 200 e propriedade `produtos` contendo um array. |
| CT02 | Positivo | Cadastrar produto com dados válidos (`POST /produtos`) | HTTP 201, mensagem “Cadastro com sucesso” e identificador `_id`. |
| CT03 | Negativo | Cadastrar produto sem token (`POST /produtos`) | HTTP 401 e mensagem de token ausente ou inválido. |
| CT04 | Negativo | Tentar cadastrar novamente um produto com o mesmo nome | HTTP 400 e mensagem “Ja existe produto com esse nome”. |
| CT05 | Negativo | Cadastrar com payload vazio (`POST /produtos`) | HTTP 400 e mensagens de validação para nome, preço, descrição e quantidade. |

> **Atenção — CT04 da API:** no código atual, a variável declarada é `nomeDuplicado`, mas o primeiro payload usa `produtoDuplicado`. Essa referência indefinida interrompe o teste antes de validar a duplicidade. Corrija a variável no teste antes de esperar que esse cenário passe.

## Pré-requisitos

- Node.js e npm instalados.
- Acesso à internet e disponibilidade dos ambientes ServeRest de frontend e API.
- Credenciais de teste válidas para os ambientes. As credenciais estão definidas diretamente nos arquivos de teste e podem precisar ser atualizadas caso a conta ou os dados do ambiente mudem.

## Instalação e execução

Na raiz do projeto:

```bash
npm install
```

Abrir o Cypress em modo interativo:

```bash
npx cypress open
```

Executar todos os testes E2E em modo headless:

```bash
npx cypress run
```

Executar somente os testes de login:

```bash
npx cypress run --spec "cypress/E2E/frontend/login.cy.js"
```

Executar somente os testes de produtos:

```bash
npx cypress run --spec "cypress/E2E/api/produtos.cy.js"
```

O comando `npm test` não executa os testes Cypress no estado atual do projeto; use os comandos `npx cypress` acima.

👨‍💻 Autor

Mauricio Monteiro

Senior QA Engineer | Quality Engineering | Test Automation | API Testing | Cypress | Playwright | Selenium | CI/CD

Projeto desenvolvido para fins de avaliação técnica da MOUTS e demonstração de competências em automação de testes de software.
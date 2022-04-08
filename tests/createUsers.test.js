const chai = require('chai');
const chaiHttp = require('chai-http');
const { stub } = require('sinon');

const server = require('../api/app');
const { User } = require('../models');
const { User: userMock } = require('./mocks/models');

const { expect } = chai;
chai.use(chaiHttp);

describe('Rota /api/users', () => {
  before(() => {
    stub(User, 'findAll').callsFake(userMock.findAll);
    stub(User, 'create').callsFake(userMock.create);
  });
  after(() => {
    User.findAll.restore();
    User.create.restore();
  });

  describe('consulta a lista de pessoas usuárias:', () => {
    let response;
    before(async () => {
      response = await chai.request(server).get('/api/users');
    });

    it('a requisição deve reornar o código de status 200', () => {
      expect(response).to.have.status(200);
    });
    it('a requisição GET para a rota traz uma lista inicial contendo dois registros de pessoas usuárias', () => {
      expect(response.body).to.have.length(2);
    });
  });

  describe('insere um novo registro:', () => {
    let createRequest = {};
    let firstUserList = [];
    let secondUserList = [];
    const newUser = { username: 'jane', password: 'senha123' };

    before(async () => {
      firstUserList = await chai.request(server).get('/api/users').then(({ body }) => body);
      createRequest = await chai.request(server).post('/api/users').send(newUser);
      secondUserList = await chai.request(server).get('/api/users').then(({ body }) => body);
    });

    it('a primeira requisição GET para a rota deve retornar 2 registros', () => {
      expect(firstUserList).to.have.length(2);
    });
    it('a requisição POST para a rota deve retornar o status 201 e um objeto com a propriedade message e o texto: `Novo usuário criado com sucesso`', () => {
      expect(createRequest).to.have.status(201);
      expect(createRequest.body).to.be.a('object');
      expect(createRequest.body).to.have.property('message');
      expect(createRequest.body.message).to.be.equal('Novo usuário criado com sucesso');
    });
    it('a segunda requisição GET para a rota deve retornar 3 registros', () => {
      expect(secondUserList).to.have.length(3);
    });
    it('o terceiro registro deve corresponder ao registro enviado na requisição POST', () => {
      expect(secondUserList[2]).to.contain(newUser);
    });
  });
});

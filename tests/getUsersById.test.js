const chai = require('chai');
const chaiHttp = require('chai-http');
const { stub } = require('sinon');
const jwt = require('jsonwebtoken');

const server = require('../src/api/app');
const { User } = require('../src/models');
const { User: userMock } = require('./mocks/models');
const users = require('./mocks/models/Users.json');

const { expect } = chai;
chai.use(chaiHttp);

describe.only('Rota /api/users/:userId', () => {
  before(() => {
    stub(User, 'findByPk').callsFake(userMock.findByPk);
    stub(User, 'findOne').callsFake(userMock.findOne);
  });
  after(() => {
    User.findByPk.restore();
    User.findOne.restore();
  })

  describe('quando um token não é enviado:', () => {
    let response = {};
    before(async () => {
      response = await chai.request(server).get('/api/users/1');
    });

    it('a requisição deve retornar o código de status 400', () => {
      expect(response).to.have.status(400);
    });
    it('a requisição deve retornar no body uma mensagem de erro com o texto `Token não encontrado ou informado`', () => {
      expect(response.body.message).to.be.equal('Token não encontrado ou informado');
    });
  });

  describe('quando o token é válido, mas é incompatível com o userId:', () => {
    let response = {};
    before(async () => {
      stub(jwt, 'verify').returns({ data: users[1] });
      response = await chai
        .request(server)
        .get('/api/users/1')
        .set('Authorization', 'avalidtokenbutnottheone');
    });
    after(() => jwt.verify.restore());

    it('a requisição deve retornar o código de status 401', () => {
      expect(response).to.have.status(401);
    });
    it('a requisição deve retornar no body uma mensagem de erro com o texto `Acesso negado`', () => {
      expect(response.body.message).to.be.equal('Acesso negado');
    });
  });

  describe('quando o token é válido e compatível com o userId', () => {
    let response = {};
    before(async () => {
      stub(jwt, 'verify').returns({ data: users[0] });
      response = await chai
        .request(server)
        .get('/api/users/1')
        .set('Authorization', 'avalidtoken');
    });
    after(() => jwt.verify.restore());

    it('a requisição deve retornar o código de status 200', () => {
      expect(response).to.have.status(200);
    });
    it('a requisição deve retornar os dados da pessoa usuária no corpo da resposta', () => {
      expect(response.body).to.be.eql(users[0]);
    });
  });
});

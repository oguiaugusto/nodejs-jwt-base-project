const chai = require('chai');
const chaiHttp = require('chai-http');
const { stub } = require('sinon');

const server = require('../api/app');
const { User } = require('../models');
const { User: userMock } = require('./mocks/models');

const { expect } = chai;
chai.use(chaiHttp);

describe('Rota /api/users', () => {
  before(() => stub(User, 'findAll').callsFake(userMock.findAll));
  after(() => User.findAll.restore());

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
});

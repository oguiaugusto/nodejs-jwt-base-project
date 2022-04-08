const Users = require('./Users.json');

const mockCreate = (Instance, data) => {
  if (!data) return;

  const newData = data;
  if (!!Instance[0].id) newData.id = Date.now();
  Instance.push(newData);

  return newData;
};

const mockFindByPk = (Instance, pk) => {
  if (!pk) return;
  
  const result = Instance.find((item) => {
    const pkValue = Object.values(item)[0];
    return pkValue === parseInt(pk);
  });

  if (!result) return null;
  return result;
};

const mockFindOne = (Instance, data) => {
  if (!data || !data.where) return;

  const result = Instance.find((item) => {
    const keys = Object.keys(item).filter((key) => data.where.hasOwnProperty(key));
    return keys.every((key) => item[key] === data.where[key]);
  });

  if (!result) return null;
  return result;
};

const User = {
  create: async (data) => mockCreate(Users, data),
  findAll: async () => Users,
  findByPk: async (pk) => mockFindByPk(Users, pk),
  findOne: async (data) => mockFindOne(Users, data),
};

module.exports = { User };

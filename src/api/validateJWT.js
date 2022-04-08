require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const secret = process.env.SECRET_TOKEN;

module.exports = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(400).json({ message: 'Token não encontrado ou informado' });

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ where: { username: decoded.data.username, id: decoded.data.id } });

    if (!user) return res.status(401).json({ message: 'Erro ao procurar usuário do token.' });
    req.user = user;

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Erro interno', error: err.message });
  }
};

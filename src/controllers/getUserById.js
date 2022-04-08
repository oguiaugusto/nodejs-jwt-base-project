const { User } = require('../models');

module.exports = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);

    if (!user) throw Error;
    if (req.user.id !== user.id) return res.status(401).json({ message: 'Acesso negado' });
    
    return res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Erro ao buscar usuário no banco', error: err.message });
  }
};

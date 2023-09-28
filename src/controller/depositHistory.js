// list
const list = async (req, res, next) => {
  res.render('./admin/depositHistory/index', { title: 'Add-edit package' });
};

module.exports = { list };

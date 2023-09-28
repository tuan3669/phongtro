// list

const listAll = async (req, res, next) => {
  res.render('./admin/posts/admin', { title: 'Post all' });
};

module.exports = { listAll };

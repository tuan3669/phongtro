


// add-edit form
const addEdit = (req, res, next) => {
  res.render('./admin/categories/add-edit', { title: 'Add edit categories' });
};

// list
const list = async (req, res, next) => {
  res.render('./admin/categories/index', { title: 'categories' });
};



module.exports = { list, addEdit };

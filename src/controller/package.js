// const Package = require('../models/package');

// create a new createPackage
// package;
// const createPackage = async (req, res, next) => {
//   try {
//     const package = await Package.create(req.body);
//     console.log('create package', package);
//     res.redirect('/package');
//   } catch (error) {
//     console.log(error);
//     res.render('/create-package', { package });
//   }
// };

// form
const addEdit = (req, res, next) => {
  res.render('./admin/packages/add-edit', { title: 'Add-edit package' });
};

// list
const list = async (req, res, next) => {
  res.render('./admin/packages/index', { title: 'Add-edit package' });
};

module.exports = { list, addEdit };

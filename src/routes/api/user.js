const { Router } = require('express');
const router = Router();
const User = require('../../models/user');
const { verifyToken } = require('../../middlewares/middlewaresController');
// get all users
router.get('/', verifyToken, async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      categories,
    });
  } catch (error) {
    res.status(500);
  }
});

// get  user by id
// router.get('/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     console.log('router user by id nè ', id);
//     const user = await User.findById(id);
//     res.status(200).json({
//       code: 200,
//       data: user,
//     });
//   } catch (error) {
//     console.log('router user by id ', error);
//   }
// });

router.get('/curent', verifyToken, async (req, res) => {
  try {
    const id = req?.user?.id;
    const user = await User.findById(id).select('username phone role');
    res.status(200).json({
      code: 200,
      user,
    });
  } catch (error) {
    console.log('router user by id ', error);
  }
});

module.exports = router;

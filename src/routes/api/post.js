const { Router } = require('express');
const router = Router();
const Post = require('../../models/posts');
const User = require('../../models/user');
const { verifyToken, isAdmin } = require('../../middlewares/middlewaresController');
const fileUploader = require('../../middlewares/cloudinary');

// get all
router.get('/currentUser/', verifyToken, async (req, res) => {
  // const ddd = await Post.find({ expired_at: { $ne: null }, expired_at: { $lt: new Date() } });
  let searchOptions = {};

  const { page = 1, limit = 4 } = req?.query;
  const skip = (page - 1) * limit;

  if (req.query.title != null && req.query.title !== '') {
    searchOptions.title = new RegExp(req.query.title, 'i');
  }
  if (req.query.category != null && req.query.category !== '') {
    searchOptions.category_id = req.query.category;
  }

  try {
    const userId = req?.user?.id;

    if (!userId) return res.status(401);
    searchOptions.user_id = userId;
    console.log('searcg  ', searchOptions);
    const posts = await Post.find(searchOptions, { rawResult: false })
      .populate([
        {
          path: 'user_id',
          select: '_id',
        },
        {
          path: 'category_id',
          select: '_id title',
        },
      ])
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const postNew = posts.map((post) => {
      return {
        ...post,
        categoryName: post.category_id.title,
        category_id: post.category_id._id,
      };
    });
    console.log('postnew ', postNew);
    const totalRows = await Post.find(searchOptions)
      .populate([
        {
          path: 'user_id',
          select: '_id',
        },
        {
          path: 'category_id',
          select: '_id title',
        },
      ])
      .countDocuments();
    console.log('totalrow ', totalRows);

    const totalPages = Math.ceil(totalRows / limit);

    res.status(200).json({
      data: postNew,
      pagination: {
        totalRows,
        totalPages,
        page: +page,
        limit: +limit,
      },
    });
  } catch (error) {
    res.status(500);
  }
});

// admin
// get all
router.get('/getAll/', verifyToken, isAdmin, async (req, res) => {
  let searchOptions = {};

  const { page = 1, limit = 4 } = req?.query;
  const skip = (page - 1) * limit;
  console.log('page ', page);
  console.log('skip ', skip);
  console.log('limit ', limit);

  let address = '';

  if (req.query?.province) address += req.query?.province?.replaceAll('-', ' ');
  if (req.query?.district) address += req.query?.district?.replaceAll('-', ' ') + ', ';
  if (req.query?.ward) address += req.query?.ward?.replaceAll('-', ' ') + ', ';

  if (address !== '') {
    searchOptions.address = new RegExp(address, 'i');
  }

  if (req.query.category != null && req.query.category !== '') {
    searchOptions.category_id = req.query.category;
  }
  if (req.query.minPrice) searchOptions.price = { $gte: req.query.minPrice.replace('.', '') };
  if (req.query.maxPrice)
    searchOptions.price = { ...searchOptions.price, $lte: req.query.maxPrice.replace('.', '') };

  if (req.query.minAcreage) searchOptions.acreage = { $gte: req.query.minAcreage };
  if (req.query.maxAcreage)
    searchOptions.acreage = { ...searchOptions.acreage, $lte: req.query.maxAcreage };

  try {
    const userId = req?.user?.id;

    if (!userId) return res.status(401);

    // ko return về đối tượng thô  rawResult: false
    const posts = await Post.find(searchOptions, { rawResult: false })
      .populate([
        {
          path: 'user_id',
          select: '_id username',
        },
        {
          path: 'category_id',
          select: '_id title',
        },
      ])
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log('search opitons ', searchOptions);
    console.log('post ::', posts);
    const postNew = posts.map((post) => {
      return {
        ...post,
        categoryName: post.category_id.title,
        category_id: post.category_id._id,
        user_id: post.user_id._id,
        username: post.user_id.username,
      };
    });

    const totalRows = await Post.find(searchOptions)
      .populate([
        {
          path: 'user_id',
          select: '_id username',
        },
        {
          path: 'category_id',
          select: '_id title',
        },
      ])
      .countDocuments();

    console.log('totalRows :::', totalRows);
    const totalPages = Math.ceil(totalRows / limit);

    res.status(200).json({
      data: postNew,
      pagination: {
        totalRows,
        totalPages,
        page: +page,
        limit: +limit,
      },
    });
  } catch (error) {
    console.log('err ', error);
    res.status(500);
  }
});
// admin

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).select('-filenameList -isvip  -user_id');
    res.status(200).json(post);
  } catch (error) {
    res.status(500);
  }
});

// create
router.post('/', verifyToken, fileUploader.array('file'), async (req, res) => {
  try {
    const path = req.files.map((link) => link.path);
    const filenameArr = req.files.map((link) => link.filename);

    const formatPrice = req?.body?.price.replace(/\D/g, '');
    const price = +formatPrice || 0;
    const data = {
      title: req.body.title,
      address: req.body.address,
      description: req.body.description,
      price,
      images: path,
      filenameList: filenameArr,
      phone: req.body.phone,
      category_id: req.body.category,
      acreage: req.body.acreage,
      user_id: req?.user?.id,
    };
    const post = await Post.create(data);
    const user = await User.findById(req?.user?.id);
    user.posts.push(post._id);
    await user.save();
    res.status(201).json({
      code: 201,
      data: post,
    });
  } catch (error) {
    console.log('create error post', error);
    if (req?.file) {
      req?.file.forEach(async (f) => {
        await cloudinary.uploader.destroy(f?.filename, (err, result) => {
          if (err) return res.status(500);
          console.log('đã xóa file cũ khi up ảnh mới', res);
          console.log('delete image cloudinary');
        });
      });
    }
    res.status(500);
  }
});

router.put('/:id', verifyToken, fileUploader.array('file'), async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId)
      return res.status(400).json({
        message: 'missing param id ^^',
      });
    const formatPrice = req?.body?.price.replace(/\D/g, '');
    const price = +formatPrice || 0;
    const newPost = {
      title: req.body.title,
      address: req.body.address,
      description: req.body.description,
      price,
      phone: req.body.phone,
      category_id: req.body.category,
      acreage: req.body.acreage,
      user_id: req?.user?.id,
    };

    if (req?.file) {
      newPost.images = req.files.map((link) => link.path);
      newPost.filenameList = req.files.map((link) => link.filename);
    }

    const post = await Post.findByIdAndUpdate(postId, newPost, { new: true });
    console.log('updated post');
    res.status(200).json({
      code: 200,
      data: post,
    });
  } catch (error) {
    if (req?.file) {
      req?.file.forEach(async (f) => {
        await cloudinary.uploader.destroy(f?.filename, (err, result) => {
          if (err) return res.status(500);
          console.log('đã xóa file cũ khi up ảnh mới', result);
          console.log('delete image cloudinary');
        });
      });
    }
  }
  res.status(500);
});

// remove post
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = req?.params?.id;
    if (!id) return res.status(400);
    const post = await Post.findByIdAndDelete(req.params.id, { new: true });
    await cloudinary.uploader.destroy(post.filenameList, (err, result) => {
      if (err) return res.status(500);
      console.log('đã xóa file cũ khi up ảnh mới', result);
    });
    console.log('xóa');

    res.status(200).json({
      code: 200,
      data: post,
    });
  } catch (error) {
    res.status(500);
  }
});
module.exports = router;

// province=Tỉnh+Tuyên+Quang&district=Huyện+Hàm+Yên&minPrice=200000&maxPrice=300000&minAcreage=70&maxAcreage=90

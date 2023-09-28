const Post = require('../models/posts');
const querystring = require('querystring');

const ITEMS_PER_PAGE = 4;

const getPaginatedPosts = async (query, currentPage = 1) => {
  const page = parseInt(currentPage) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const totalPost = await Post.countDocuments(query);
  const totalPage = Math.ceil(totalPost / ITEMS_PER_PAGE);

  const posts = await Post.find(query)
    .sort({ isvip: -1, createdAt: -1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .populate('category_id');

  return {
    posts,
    totalPage,
    currentPage,
    totalPost,
    itemsPerPage: ITEMS_PER_PAGE,
    category_id: query.category_id,
    page,
    search: query.search,
  };
};

const showHomePage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const query = {
    $or: [{ isvip: { $gte: 3 } }, { isvip: { $exists: false } }],
  };

  const { posts, ...pagination } = await getPaginatedPosts(query, page);

  res.render('index', {
    title: 'Trang Chủ',
    posts,
    ...pagination,
  });
};

const getPostsByCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const categoryId = req.params.category_id;
  const query = { category_id: categoryId };

  const { posts, ...pagination } = await getPaginatedPosts(query, page);

  res.render('index', {
    title: 'Trang Chủ',
    posts,
    ...pagination,
  });
};

// search post by category and address and price and acreage
const searchPost = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const category = req.query.category;
  const province = req.query.province;
  const price = req.query.price;
  const acreage = req.query.acreage;
  const query = {};
  if (category) {
    query.category_id = category;
  }
  if (province) {
    query.address = { $regex: province, $options: 'i' };
  }
  if (price == 1) {
    query.price = { $gte: 0, $lte: 1000000 };
  }
  if (price == 2) {
    query.price = { $gte: 1000000, $lte: 5000000 };
  }
  if (price == 3) {
    query.price = { $gte: 5000000, $lte: 10000000 };
  }
  if (price == 4) {
    query.price = { $gte: 10000000 };
  }
  if (acreage == 1) {
    query.acreage = { $gte: 0, $lte: 20 };
  }
  if (acreage == 2) {
    query.acreage = { $gte: 20, $lte: 50 };
  }
  if (acreage == 3) {
    query.acreage = { $gte: 50, $lte: 100 };
  }
  if (acreage == 4) {
    query.acreage = { $gte: 100 };
  }

  if (category == '') {
    delete query.category_id;
  }
  if (province == '') {
    delete query.address;
  }
  if (price == '') {
    delete query.price;
  }
  if (acreage == '') {
    delete query.acreage;
  }

  const queryString = querystring.stringify(req.query);
  const decodedQueryString = decodeURIComponent(queryString);
  const search = decodedQueryString;
  searchParams = search.replace(/&page=\d+/, '');
  if (searchParams) {
    query.search = searchParams;
  }
  const { posts, ...pagination } = await getPaginatedPosts(query, page);

  res.render('index', {
    title: 'Trang Chủ',
    posts,
    ...pagination,
  });
};

module.exports = {
  showHomePage,
  getPostsByCategory,
  searchPost,
};

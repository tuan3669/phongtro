const joi = require('joi');

const postValidate = (data) => {
  const post = joi.object({
    title: joi.string().email().lowercase().required(),
    description: joi.string().min(4).max(160).required(),
    area: joi.number().required(),
  });
};

module.exports = {
  postValidate,
};

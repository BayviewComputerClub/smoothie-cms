const Joi = require('@hapi/joi');

const pageSchema = Joi.object({
    slug: Joi.string().min(4).max(16).required(),

    date: Joi.date().required(),

    display_on_nav: Joi.boolean().required(),

    parent: Joi.number().integer().required(),

    nav_title: Joi.string().min(4).max(16).required(),

    title: Joi.string().min(4).max(16).required(),

    meta: Joi.string().min(4).max(120).required(),

    content: Joi.string().min(4).required(),
});

module.exports = pageSchema;

const Hapi = require('@hapi/hapi');
const server = Hapi.server({
    port: process.env.PORT || 3000,
});

module.exports = server;

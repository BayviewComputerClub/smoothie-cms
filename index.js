const db = require("./pool");
const server = require("./server");
const Page = require("./classes/page");
const Nav = require("./classes/nav");
const PageResponse = require("./classes/page_response");

function pageRoutes() {
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return new PageResponse(true, "", []);
        }
    });

    // Pages
    server.route({
        method: 'GET',
        path: '/pages',
        handler: async (request, h) => {
            return await new Page().get.all();
        }
    });
    server.route({
        method: 'POST',
        path: '/pages',
        handler: async (request, h) => {
            return await new Page().create(request.payload);
        }
    });
    server.route({
        method: 'PUT',
        path: '/pages',
        handler: async (request, h) => {
            console.log(request.payload);
            return await new Page().update(request.payload.slug, request.payload.page);
        }
    });

    // Single Page
    server.route({
        method: 'GET',
        path: '/pages/{page}',
        handler: async (request, h) => {
            return await new Page().get.bySlug.raw(request.params.page);
        }
    });
    server.route({
        method: 'GET',
        path: '/pages/rendered/{page}',
        handler: async (request, h) => {
            return await new Page().get.bySlug.rendered(request.params.page, request.payload);
        }
    });

    // Navs
    server.route({
        method: 'GET',
        path: '/navs/{parent}',
        handler: async (request, h) => {
            return new Nav().get.byParent(request.params.parent);
        }
    });
}


async function main() {
    // Initialize Routes:

    pageRoutes();

    // Wait for the server to start.
    await server.start();
    console.log('Server running on %s', server.info.uri);
}
main().then(() => {});

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

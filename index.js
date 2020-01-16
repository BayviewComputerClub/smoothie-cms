const db = require("./pool");
const server = require("./server");
const Page = require("./classes/page");
const PageResponse = require("./classes/page_response");

async function main() {
    // Initialize Routes:
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
            let page = new Page();
            return await page.create(request.payload);
        }
    });

    // Single Page
    server.route({
        method: 'GET',
        path: '/pages/{page}',
        handler: async (request, h) => {
            return await new Page().get.bySlug(request.params.page)
        }
    });

    // Navs
    server.route({
        method: 'GET',
        path: '/navs/{parent}',
        handler: async (request, h) => {
            const [rows, fields] = await db.execute("SELECT * FROM pages WHERE display_on_nav=? AND parent=?", [true, request.params.parent]);
            if(rows.length === 0) {
                return {status: false, pages: rows, error: "404 - nav items not found"};
            }
            return {status: true, pages: rows};
        }
    });

    // Wait for the server to start.
    await server.start();
    console.log('Server running on %s', server.info.uri);
}
main().then(() => {});

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

const db = require("./pool");
const server = require("./server");
const pageSchema = require("./schemas/page_schema");

async function main() {
    // Initialize Routes:
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return {status: true};
        }
    });

    // Pages
    server.route({
        method: 'GET',
        path: '/pages',
        handler: async (request, h) => {
            const [rows, fields] = await db.query("SELECT * FROM pages");
            return {status: true, pages: rows};
        }
    });
    server.route({
        method: 'POST',
        path: '/pages',
        handler: async (request, h) => {
            // Payload is the JSON Body object.c
            let validatedResult = pageSchema.validate(request.payload);
            if(typeof(validatedResult.error) !== "undefined") {
                return {status: false, error: validatedResult.error.details[0].message};
            } else {
                let page = validatedResult.value;
                let result;
                try {
                    result = await db.execute(
                        `INSERT INTO pages (slug, date, display_on_nav, parent, nav_title, title, meta, content)
                         VALUES (?,?,?,?,?,?,?,?)`,
                        [page.slug, page.date, page.display_on_nav, page.parent, page.nav_title, page.title, page.meta, page.content]
                    );
                } catch (e) {
                    return {status: false, pages: [], error: JSON.stringify(e)};
                }

                if(result[0].affectedRows >= 1) {
                    return {status: true, pages: [], error: ""};
                } else {
                    return {status: false, pages: [], error: "MySQL - no rows affected"};
                }

            }

        }
    });

    // Single Page
    server.route({
        method: 'GET',
        path: '/pages/{page}',
        handler: async (request, h) => {
            const [rows, fields] = await db.execute("SELECT * FROM pages WHERE slug=?", [request.params.page]);
            if(rows.length === 0) {
                return {status: false, pages: rows, error: "404 - slug not found"};
            }
            return {status: true, pages: rows};
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

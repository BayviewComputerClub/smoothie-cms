const db = require("../pool");
const pageSchema = require("../schemas/page_schema");
const PageResponse = require("./page_response");
const marked = require("marked");
const ejs = require('ejs');
const LRU = require('lru-cache');

ejs.cache = new LRU(100);

class Page {
    get = {
        all: async () => {
            const [rows, fields] = await db.query("SELECT * FROM pages");
            return new PageResponse(true, "", rows);
        },
        bySlug: {
            raw: async (slug) => {
                const [rows, fields] = await db.execute("SELECT * FROM pages WHERE slug=?", [slug]);
                if(rows.length <= 0) {
                    return new PageResponse(false, "404 - slug not found", []);
                }
                return new PageResponse(true, "", rows);
            },
            rendered: async (slug, ejsObj) => {
                const [rows, fields] = await db.execute("SELECT * FROM pages WHERE slug=?", [slug]);
                if(rows.length <= 0) {
                    return new PageResponse(false, "404 - slug not found", []);
                }

                let ejsOptions = {
                    async: true
                };

                // Render the EJS followed by Markdown.
                rows[0].content = await ejs.render(rows[0].content, ejsObj, ejsOptions);
                rows[0].content = await marked(rows[0].content);

                return new PageResponse(true, "", rows);
            }
        }
    };

    async create(newPage) {
        // Pass the Page object to joi for validation.
        let validatedResult = pageSchema.validate(newPage);

        if (typeof(validatedResult.error) !== "undefined") {
            // If the error property exists, fail.
            return new PageResponse(false, validatedResult.error.details[0].message, []);
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
                return new PageResponse(false, e.message, []);
            }
            if(result[0].affectedRows >= 1) {
                return new PageResponse(true, "", []);
            } else {
                return new PageResponse(false, "MySQL - no rows affected", []);
            }

        }
    }

    async update(pageSlug, newPage) {
        let validatedResult = pageSchema.validate(newPage);
        if (typeof(validatedResult.error) !== "undefined") {
            // If the error property exists, fail.
            return new PageResponse(false, validatedResult.error.details[0].message, []);
        } else {
            let page = validatedResult.value;

            let result;
            try {
                result = await db.execute(
                    `UPDATE pages SET 
                    
                    slug = ?, 
                    date = ?, 
                    display_on_nav = ?, 
                    parent = ?, 
                    nav_title = ?, 
                    title = ?, 
                    meta = ?, 
                    content = ?
                    
                    WHERE slug = ?`,
                    [page.slug, page.date, page.display_on_nav, page.parent, page.nav_title, page.title, page.meta, page.content, pageSlug]
                );
            } catch (e) {
                return new PageResponse(false, e.message, []);
            }
            if (result[0].affectedRows >= 1) {
                return new PageResponse(true, "", []);
            } else {
                return new PageResponse(false, "MySQL - no rows affected", []);
            }
        }
    }
}

module.exports = Page;

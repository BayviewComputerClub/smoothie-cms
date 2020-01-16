const db = require("../pool");
const pageSchema = require("../schemas/page_schema");
const PageResponse = require("./page_response");

class Nav {
    get = {
        byParent: async (parent) => {
            const [rows, fields] = await db.execute("SELECT * FROM pages WHERE display_on_nav=? AND parent=?", [true, parent]);
            if(rows.length <= 0) {
                return new PageResponse(false, "404 - nav items not found", []);
            }
            return new PageResponse(true, "", rows);
        }
    }

}
module.exports = Nav;

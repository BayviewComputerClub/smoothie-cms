# smoothie-cms

Content (Pages, Posts, Comments, etc) Server for smoothie-web

Requires NodeJS v12.


## API

GET "/pages" - Returns a PageResponse with all pages.

POST "/pages" - Accepts a JSON Page object in the body, and creates that page. Returns an empty PageResponse.

GET "/pages/{slug}" - Returns a PageResponse with a single page (by slug).

GET "/pages/rendered/{slug}" - Returns a PageResponse with a single page, that is rendered with EJS and Markdown support. A JSON object in the request body will be passed to EJS.

GET "/navs/{parent}" - Returns a PageResponse with all pages with the specified parent, and has "display_on_nav" set to to true.

### PageResponse
```json
{"status": true, "error": "", "pages": []}
```
### Page
```json
{
    "id": 1,
    "slug": "hello-world",
    "date": "2020-01-07T05:00:00.000Z",
    "display_on_nav": 1,
    "parent": 0,
    "nav_title": "Hello World",
    "title": "Hello World Page",
    "meta": "This is a test page.",
    "content": "<em>This is some coool content.</em>"
}
```

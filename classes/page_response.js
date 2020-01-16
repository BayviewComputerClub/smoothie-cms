class PageResponse {
    constructor(status, error, pages) {
        this.status = status;
        this.error = error;
        this.pages = pages;
    }
    status = true;
    error = "";
    pages = []
}
module.exports = PageResponse;

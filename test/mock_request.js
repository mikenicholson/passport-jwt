/**
 A mock Request for testing jwt extractor functions
 */
function Request() {
    this.method = 'GET';
    this.url = '/';
    this.headers = {};
    this.cookies = {};
}

module.exports = Request;

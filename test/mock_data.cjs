/**
 A mock Request for testing jwt extractor functions
 */
function Request() {
    this.method = 'GET';
    this.url = '/';
    this.headers = {};
    this.signedCookies = {};
    this.cookies = {};
    this.session = {};
}

const self = {
    jwtExtractor: function (request) {
        return self.valid_jwt.token;
    },
    jwtDriver: {
        validate: function (token, secret) {
            if (secret === self.valid_jwt.secret) {
                return Promise.resolve({
                    success: true,
                    payload: self.valid_jwt.payload
                });
            } else {
                return Promise.resolve({
                    success: false,
                    message: "Not Valid"
                });
            }
        }
    },
    Request: Request,
    // Note, this JWT will expire sometime in 2286. If unit tests are failing around this time try
    // generating a new, valid token :)
    // Made it to 2022 so far ;)
    valid_jwt: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyMzQ1Njc4OTAsIm5hbWUiOiJKb2huIERvZSIsImlzcyI6ImV4YW1wbGVzb2Z0LmNvbSIsImV4cCI6OTk5OTk5OTk5OX0.EPKFnCisWgrgeWEC6EfsgPDUqJLvwA0ozMmSfSDqwPE",
        payload: {
            "sub": 1234567890,
            "name": "John Doe",
            "iss": "examplesoft.com",
            "exp": 9999999999
        },
        secret: 'secret'
    },
    invalid_jwt_none: {
        token: "eyJhbGciOiAiTm9uZSIsICJ0eXAiOiAiSldUIn0.eyJ1c2VyIjoiYWRtaW4ifQ.",
        payload: {
            user: "admin"
        },
        secret: null
    }
};
module.exports = self;

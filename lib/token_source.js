
/**
 * Extracts a token from the specifid request body field
 */
function QueryTokenSource(tokenQueryParameterName) {
    var url = require('url');

    return function(req) {
	var parsed_url = url.parse(req.url, true);
        if (parsed_url.query && parsed_url.query.hasOwnProperty(tokenQueryParameterName)) {
            return parsed_url.query[tokenQueryParameterName];
        }
	return null;
    };
}


/**
 * Extracts a token from the specifid request body field
 */
function BodyTokenSource(tokenBodyField) {
    return function(req) {
	// If not in the header try the body
	if (req.body && tokenBodyField) {
            return req.body[tokenBodyField];
	}
	return null;
    };
}

/**
 * Extracts a token from the specifid Cookie
 */
function CookieTokenSource(tokenCookieName) {
    var cookie = require('cookie')
    , COOKIE_HEADER = "cookie";

    return function(req) {
	if(tokenCookieName && req.headers[COOKIE_HEADER]) {
	    var parsed_cookies = cookie.parse(req.headers[COOKIE_HEADER]);
	    if(parsed_cookies && parsed_cookies[tokenCookieName]) {
		return parsed_cookies[tokenCookieName];
	    }
	}
	return null;
    };
}

/**
 * Extracts a token from the Authorization header and makes sure scheme matches provided authScheme
 */
function AuthorizationHeaderTokenSource(authScheme) {
    var auth_hdr = require('./auth_header'),
	AUTH_HEADER = "authorization";

    return function(req) {
	if( req.headers[AUTH_HEADER]) {
            var auth_params = auth_hdr.parse(req.headers[AUTH_HEADER]);
            if (auth_params && authScheme === auth_params.scheme) {
		return auth_params.value;
            }
	}
	return null;
    };
}

/**
 * Usage: 
 * new JWTStrategy({secretOrKey: 'secret', tokenSource: new TokenSource.Cookie('cookieName')});
 */
module.exports = {
    AuthorizationHeader: AuthorizationHeaderTokenSource,
    Body: BodyTokenSource,
    Cookie: CookieTokenSource,
    Query: QueryTokenSource
};

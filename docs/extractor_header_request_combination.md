# Extractor Request Combinations

The following instructions should help in decide what should be request header when there is particular Extractor.

Extractor | Code | Request Header
--- | --- | ---
fromHeader | `ExtractJwt.fromHeader('authorization')` | `{Authorization :eyJhbGciOiJIUzI...VERYLONGTOKEN}`
fromHeader | `ExtractJwt.fromHeader('HelloTom')` | `{HelloTom :eyJhbGciOiJIUzI...VERYLONGTOKEN}`
fromAuthHeaderAsBearerToken | `ExtractJwt.fromAuthHeaderAsBearerToken()` | `{Authorization :bearer eyJhbGciOiJIUzI...VERYLONGTOKEN}`
fromAuthHeaderWithScheme | `ExtractJwt.fromAuthHeaderWithScheme('JWT')` | `{Authorization :JWT eyJhbGciOiJIUzI...VERYLONGTOKEN}`
fromAuthHeaderWithScheme | `ExtractJwt.fromAuthHeaderWithScheme('HelloJerry')` | `{Authorization :HelloJerry eyJhbGciOiJIUzI...VERYLONGTOKEN}`

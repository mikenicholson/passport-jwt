process.emitWarning("Your node version does not support submodules (which are supported in Node >=12), therefore the fallback is used to load the library as if it had been imported from 'passport-jwt/auto'. You should update your node version, this may work but is **not supported**.");
module.exports = {
    Strategy: require("./dist/cjs/auto_load.cjs").Strategy,
    ExtractJwt: require("./dist/cjs/extract_jwt.cjs").ExtractJwt
}

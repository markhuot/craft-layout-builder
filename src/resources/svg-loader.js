const getOptions = require('loader-utils').getOptions

module.exports = function loader(source) {
    return `export default "foo bar"`
}
const docsGenerator = require('./docs.js')
const helpers = require('./helpers')

module.exports = (plop) => {
  plop.setHelper('capitalize', helpers.capitalize)
  plop.setHelper('lowercase', helpers.lowercase)

  plop.setGenerator('docs', docsGenerator)
}

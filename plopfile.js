module.exports = function (plop) {
  plop.setWelcomeMessage('What needs to be generated: ')
  plop.setGenerator('plop-template', require('./plop-templates/plop/prompt'))
  // #auto-import
  plop.setGenerator('mock-template', require('./plop-templates/mock/prompt'))
}

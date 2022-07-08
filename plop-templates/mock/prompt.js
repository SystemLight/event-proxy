/**
* 基础模板配置文件
* @type {import("plop").PlopGeneratorConfig}
*/
const config = {
    description: 'Generate mock template',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Mock file name'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'mock/{{kebabCase name}}.js',
        templateFile: 'plop-templates/mock/index.hbs'
      },
      {
        type: 'append',
        pattern: /\/\/ #auto-mock/,
        path: 'mock/index.js',
        template: `  ...require('./{{kebabCase name}}'),`
      }
    ]
};

module.exports = config;

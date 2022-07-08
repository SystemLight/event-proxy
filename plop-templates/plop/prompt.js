/**
 * 基础模板配置文件
 * @type {import("plop").PlopGeneratorConfig}
 */
const config = {
    description: 'Generate plop template',
    prompts: [
        {
            type: 'input',
            name: 'name',
            message: 'Template file name'
        }
    ],
    actions: [
        {
            type: 'add',
            path: 'plop-templates/{{kebabCase name}}/index.hbs',
            template: ''
        },
        {
            type: 'add',
            path: 'plop-templates/{{kebabCase name}}/prompt.js',
            templateFile: 'plop-templates/plop/index.hbs'
        },
        {
            type: 'append',
            pattern: /\/\/ #auto-import/,
            path: 'plopfile.js',
            template: `  plop.setGenerator('{{kebabCase name}}-template', require('./plop-templates/{{kebabCase name}}/prompt'))`
        }
    ]
};

module.exports = config;

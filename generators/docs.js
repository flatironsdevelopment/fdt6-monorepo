module.exports = {
  description: 'Create Documentation file',
  prompts: [
    {
      type: 'input',
      name: 'sectionName',
      message: 'Enter name for the new Section:'
    }
  ],
  actions: [
    {
      type: 'add',
      templateFile: './templates/docs/section.hbs',
      path: '../apps/docs/pages/sections/{{kebabCase sectionName}}.md',
      skipIfExists: true,
      abortOnFail: true
    },
    {
      type: 'modify',
      path: '../apps/docs/pages/_sidebar.md',
      pattern: new RegExp(`(<!-- Insert new section here -->)`),
      templateFile: './templates/docs/sidebar-item.hbs',
      abortOnFail: true
    }
  ]
}

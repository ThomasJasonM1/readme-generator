var inquirer = require('inquirer');
var fs = require('fs');
var makeFile = require('./readme-template.js')

inquirer
    .prompt([
        {
            name: 'firstname',
            message: 'What is your first name?',
            type: 'input',
        },
        {
            name: 'lastName',
            message: 'What is your last name?',
            type: 'input',
        }
    ])
    .then(answers => {
        console.log(answers);
        let file = makeFile(answers);
        console.log(file);


        fs.writeFile('README.md', file, () => {})
    })

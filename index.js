let inquirer = require('inquirer');
let fs = require('fs');
let makeFile = require('./readme-template.js');
let installationStep = 0;
let installationSteps = [];
let answerNumber = 0;
const responseObject = {};


const prompts = [
    {
        name: 'title',
        message: 'Please enter a title for your project.',
        type: 'input',
    },
    {
        name: 'description',
        message: 'Please wrie a brief description of your project. Press return when finished.',
        type: 'input',
    },
    {
        name: 'wantsInstallationStep' + installationStep,
        message: 'Would you like to add installation steps?',
        type: 'confirm'
    },
    {
        name: 'thisStep',
        message: 'Would you like to add inst?',
        type: 'confirm'
    }
];

function onEachAnswer(res) {
    responseObject[res.name] = res.answer;
    console.log(res);
    if (res['wantsInstallationStep' + installationStep] === true) {
        return getInstallationSteps();
    }
}

function getInstallationSteps() {
    console.log('here');
    installationStep++;
    return prompts.splice(answerNumber, 0, {
        name: 'installationStep',
        message: `Please add step ${installationStep}:`,
        type: 'input',
    },
    {
        name: 'wantsInstallationStep' + installationStep,
        message: 'Would you like to add another installation step?',
        type: 'confirm'
    });

}

async function askQuestions(number) {
    console.log(prompts.length);
    await inquirer.prompt(prompts[number])
        .then (async answer => {
            console.log(answer);
            answerNumber++;
            await onEachAnswer(answer);
            askQuestions(answerNumber);
        })
}

askQuestions(answerNumber);

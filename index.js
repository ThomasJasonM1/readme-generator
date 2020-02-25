let inquirer = require('inquirer');
let fs = require('fs');
let makeFile = require('./readme-template.js');
let installationStep = 0;
let answerNumber = 0;
const responseObject = { Installation_Steps: [], };


const prompts = [
    {
        name: 'wantsToAddTitle',
        message: 'Do you want to add a title to your project?',
        type: 'confirm',
    },
    {
        name: 'wantsToAddDescription',
        message: 'Would you like to add a description?',
        type: 'confirm',
    },
    {
        name: 'wantsInstallationStep' + installationStep,
        message: 'Would you like to add installation steps?',
        type: 'confirm'
    }
];

function onEachAnswer(res) {
    if (res.wantsToAddTitle) {
        return prompts.splice(answerNumber, 0, {
            name: 'Title',
            message: 'Please enter a title for your project:',
            type: 'input',
        });
    }

    if (res.wantsToAddDescription) {
        return prompts.splice(answerNumber, 0, {
            name: 'Description',
            message: 'Please wrie a brief description of your project:',
            type: 'input',
        });
    }

    if (res['wantsInstallationStep' + installationStep] === true) {
        return getInstallationSteps();
    }

}

function getInstallationSteps() {
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
    await inquirer.prompt(prompts[number])
        .then (answer => {
            let promptName = prompts[answerNumber].name;
            let promptType = prompts[answerNumber].type;
            console.log(answer);
            if (promptType === 'input' && answer[promptName]=== '') {
                switch (promptType) {
                    case 'input':
                        console.log(`You must enter something for "${promptName}", please try again!`);
                        break;
                
                    default:
                        break;
                }
                return askQuestions(answerNumber);
            }
            if (!promptName.startsWith('wants')) {
                if (promptName.startsWith('installationStep')) {
                    responseObject['Installation_Steps'].push(answer[promptName]);
                } else {
                    responseObject[promptName] = answer[promptName];
                }
            }
            
            answerNumber++;
            onEachAnswer(answer);
            if (answerNumber < prompts.length)
            {
                askQuestions(answerNumber);
            }
            console.log(responseObject);
        })
}

askQuestions(answerNumber);

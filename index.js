const inquirer = require('inquirer');
const fs = require('fs');
const makeFile = require('./readme-template.js');
const responseObject = { Installation: [], };

let installationStep = 0;
let contributorNumber = 0;
let answerNumber = 0;

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
    },
    {
        name: 'wantsUsageStep',
        message: 'Would you like to add a How to Use section?',
        type: 'confirm'
    },
    {
        name: 'wantsLicenseStep',
        message: 'Would you like to add a license?',
        type: 'confirm'
    }
    ,
    {
        name: 'wantsContributorStep' + contributorNumber,
        message: 'Would you like to add a contributor?',
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

    if (res.wantsUsageStep) {
        return prompts.splice(answerNumber, 0, {
            name: 'Usage',
            message: 'Please explain how to use this:',
            type: 'input',
        });
    }

    if (res['wantsInstallationStep' + installationStep] === true) {
        return getInstallationSteps();
    }

    if (res['wantsContributorStep' + contributorNumber] === true) {
        responseObject.Contributors = [];
        return getContributorSteps();
    }

    if (res.wantsLicenseStep) {
        return prompts.splice(answerNumber, 0, {
            name: 'License',
            message: 'Please type or paste your license:',
            type: 'input',
        });
    }

}

function getContributorSteps() {
    contributorNumber++;
    return prompts.splice(answerNumber, 0, {
        name: 'contributor' + contributorNumber,
        message: `Please add the name of contributor #${contributorNumber}:`,
        type: 'input',
    },
    {
        name: 'contributorGit' + contributorNumber,
        message: 'Please add the github username for this contributor:',
        type: 'input'
    },
    {
        name: 'wantsContributorStep' + contributorNumber,
        message: 'Would you like to add another contributor?',
        type: 'confirm'
    });

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
                    responseObject['Installation'].push(answer[promptName]);
                } else if (promptName.startsWith('contributor')) {
                    console.log(contributorNumber);
                    console.log(responseObject.Contributors[promptName.substring(0, promptName.length - 1) + contributorNumber]);
                    let contributorExists = responseObject.Contributors[promptName];
                    if (!contributorExists) {
                        let name = { 
                            promptName: 
                            {
                                contributor: answer[promptName], 
                            }
                        };
                        responseObject.Contributors.push(name);
                    } else {
                        contributorExists.github = answer[promptName];
                    }
                }
                else {
                    responseObject[promptName] = answer[promptName];
                }
            }
            
            answerNumber++;
            onEachAnswer(answer);
            if (answerNumber < prompts.length)
            {
                askQuestions(answerNumber);
            } else {
                fs.writeFile('./README.md', makeFile(responseObject), () => {});
            }
            console.log(responseObject);
        })
}

askQuestions(answerNumber);

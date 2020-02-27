const inquirer = require('inquirer');
const fs = require('fs');
const makeFile = require('./readme-template.js');
const responseObject = {  };

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
    },
    {
        name: 'wantsTestsStep',
        message: 'Would you like to add a test command?',
        type: 'confirm'
    }
    ,
    {
        name: 'wantsQuestionsStep',
        message: 'Would you like to add an email address where you can take questions questions?',
        type: 'confirm'
    },
    {
        name: 'wantsBadgesStep',
        message: 'Would you like to add badges?',
        type: 'confirm'
    }
    ,
    {
        name: 'readmePath',
        message: 'Please specify README file path:',
        type: 'input'
    }
];

const onEachAnswer = (res) => {
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
        if (!responseObject['Installation']) { responseObject.Installation = []; }
        return getInstallationSteps();
    }

    if (res['wantsContributorStep' + contributorNumber] === true) {
        if (!responseObject['Contributors']) { responseObject.Contributors = []; }
        return getContributorSteps();
    }

    if (res.wantsLicenseStep) {
        return prompts.splice(answerNumber, 0, {
            name: 'License',
            message: 'Please add a license:',
            type: 'input',
        });
    }

    if (res.wantsTestsStep) {
        return prompts.splice(answerNumber, 0, {
            name: 'Tests',
            message: 'Please type your test command:',
            type: 'input',
        });
    }
    
    if (res.wantsQuestionsStep) {
        return prompts.splice(answerNumber, 0, {
            name: 'Questions',
            message: 'Please type the email address where you can be reached for questions:',
            type: 'input',
        });
    }

    if (res.wantsBadgesStep) {
        return prompts.splice(answerNumber, 0, {
            name: 'Badges',
            message: 'Please select the badges you want to add:',
            type: 'checkbox',
            choices: ['node', 'javascript', 'html', 'css', 'react', 'java', 'npm']
        });
    }
}

const getContributorSteps = () => {
    contributorNumber++;
    return prompts.splice(answerNumber, 0, {
        name: 'contributor',
        message: `Please add the gitHub username of contributor #${contributorNumber}:`,
        type: 'input',
    });
    // ,
    // {
    //     name: 'wantsContributorStep' + contributorNumber,
    //     message: 'Would you like to add another contributor (this doesn\'t work yet)?',
    //     type: 'confirm'
    // });

}

const getInstallationSteps = () => {
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

const askQuestions = (number) => {
    inquirer.prompt(prompts[number])
        .then (answer => {
            let promptName = prompts[answerNumber].name;
            let promptType = prompts[answerNumber].type;
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
                    responseObject['Contributors'].push(answer[promptName].replace('@', ''));
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
                new Promise(resolve => {
                    makeFile(responseObject, resolve);
                }).then(res => fs.writeFile(answer.readmePath, res, () => {
                    console.log('README has been generated!');
                }))
            }
        })
}

askQuestions(answerNumber);

const axios = require('axios');
require('dotenv').config();

const badges = {
    node: 'https://img.shields.io/badge/node.js%20-brightgreen.svg',
    javascript: 'https://img.shields.io/badge/javascript%20-blue.svg',
    java: 'https://img.shields.io/badge/java%20-yellow.svg',
    html: 'https://img.shields.io/badge/html%20-orange.svg',
    css: 'https://img.shields.io/badge/css%20-orange.svg',
    react: 'https://img.shields.io/badge/react%20-pink.svg',
    npm: 'https://img.shields.io/badge/npm%20-red.svg'
}

module.exports = (answers, resolve) => { 
    let 
        text = '',
        toc = Object.keys(answers),
        titleString = '',
        descString = '',
        tocString = '\n## Table of Contents\n___\n',
        contributorString = '',
        questionsString = '',
        testString = '',
        badgeString = '',
        usageString = '',
        licenseString = '';
        installationString = '';

    if (toc) {
        toc.map(key => { 
            tocString += key === 'Title' && key === 'readmePath' ? '' : `* [${key}](#${key.toLocaleLowerCase()})\n`;
        })
    }

    if (answers.Title && answers.Title !== '') {
        titleString = `# ${answers.Title}\n___`;
    }

    if (answers.Description && answers.Description !== '') {
        descString = `\n## Description\n___\n${answers.Description}`;
    }

    if (answers.Questions && answers.Questions !== '') {
        questionsString = `\n## Questions\n___\nPlease direct all questions to ${answers.Questions}`;
    } 

    if (answers.Tests && answers.Tests !== '') {
        testString = `\n## Tests\n___\nRun \`${answers.Tests}\` to run tests!`;
    } 

    if (answers.License && answers.License !== '') {
        licenseString = `\n## License\n___\n${answers.License}`;
    } 

    if (answers.Usage && answers.Usage !== '') {
        usageString = `\n## Usage\n___\n${answers.Usage}`;
    } 

    if (answers.Installation) {
        installationString = '\n## Installation\n___\n';
        answers.Installation.map(i => {
            installationString += `1. ${i}\n`;
        }) 
    }

    if (answers.Badges) {
        answers.Badges.map(badge => { badgeString += `![](${badges[badge]})\n` })
    }

    if (answers.Contributors) {
        //contributorString = '\n## Contributors\n';
        answers.Contributors.map(contributor => {
            axios.get(`https://api.github.com/users/${contributor}?access_token=${process.env.ACCESS_TOKEN}`)
            .then(res => {
                let data = res.data;
                contributorString += 
`
\n## Contributors\n___\n![](${data.avatar_url}&size=100)\n
Name: ${data.name}\n
GitHub Username: ${data.login}\n
Email: ${data.email}\n
[GitHub Profile](${data.html_url})`;
text = 
`
${badgeString}
${titleString}
${descString}
${tocString}
${installationString}
${contributorString}
${usageString}
${testString}
${licenseString}
${questionsString}
`
return resolve(text);
            })

        })
    } else {
text = 
`
${badgeString}
${titleString}
${descString}
${tocString}
${installationString}
${usageString}
${testString}
${licenseString}
${questionsString}
`
return resolve(text);
    }
}


const axios = require('axios');
require('dotenv').config();

module.exports = (answers, resolve) => { 
    let 
        text = '',
        toc = Object.keys(answers),
        titleString = '',
        descString = '',
        tocString = '\n## Table of Contents\n',
        contributorString = '',
        installationString = '';

    if (toc) {
        toc.map(key => { 
            tocString += key === 'Title' ? '' : `* [${key}](#${key.toLocaleLowerCase()})\n`;
        })
    }

    if (answers.Title && answers.Title !== '') {
        titleString = `# ${answers.Title}`
    }

    if (answers.Description && answers.Description !== '') {
        descString = `\n## Description\n${answers.Description}`
    }

    if (answers.Installation) {
        installationString = '\n## Installation\n';
        answers.Installation.map(i => {
            installationString += `1. ${i}\n`;
        }) 
    }

    if (answers.Contributors) {
        contributorString = '\n## Contributors\n';
        answers.Contributors.map(contributor => {
            axios.get(`https://api.github.com/users/${contributor}?access_token=${process.env.ACCESS_TOKEN}`)
            .then(res => {
                console.log(res.data);
                let data = res.data;
                contributorString += 
`
\n## Contributors\n![](${data.avatar_url})\n
Name: ${data.name}\n
GitHub Username: ${data.login}\n
Email: ${data.email}\n
[GitHub Profile](${data.html_url})`;
text = 
`
${titleString}
${descString}
${tocString}
${installationString}
${contributorString}
`
return resolve(text);
            })

        })
    } else {
text = 
`
${titleString}
${descString}
${tocString}
${installationString}
${contributorString}
`
return resolve(text);
    }
console.log('here1');
}


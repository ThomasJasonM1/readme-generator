module.exports = (answers) => { 
    let 
        toc = Object.keys(answers),
        titleString = '',
        descString = '',
        tocString = '\n## Table of Contents\n',
        installationString = '';

    if (toc) {
        toc.map(key => { 
            console.log(key == 'Installation' && answers.Installation.length === 0);
            console.log(answers.Installation.length);
            if (key == 'Installation' && answers.Installation.length === 0) {
                tocString += '';
            } else {
                tocString += key === 'Title' ? '' : `* [${key}](#${key.toLocaleLowerCase()})\n`;
            }
        })
    }

    if (answers.Title && answers.Title !== '') {
        titleString = `# ${answers.Title}`
    }

    if (answers.Description && answers.Description !== '') {
        descString = `\n## Description\n${answers.Description}`
    }

    if (answers.Installation && answers.Installation.length > 0) {
        installationString = '\n## Installation\n';
        answers.Installation.map(i => {
            installationString += `1. ${i}\n`;
        }) 
    }

    let text = 
`
${titleString}
${descString}
${tocString}
${installationString}
`
    return text;
}


const fs = require('fs');
const formatter = require('html-formatter');
// const cssbeautify = require('cssbeautify');
const beautify = require('beautify');

const rootPath = './build';
const scriptsFile = `${rootPath}/js/main.js`;
const stylesFile = `${rootPath}/css/main.css`;

const workFiles = [{
    name: 'styles',
    path: stylesFile,
    prefix: '<style>\n',
    postfix: '\n</style>',
}, {
    name: 'scripts',
    path: scriptsFile,
    prefix: '\n\n<script>\n//<![CDATA[\n',
    postfix: '\n//]]>\n</script>\n\n',
}, {
    name: 'html',
    path: `${rootPath}/index.html`,
}];

const resultFile = './build/result.html';
const indent = '    ';

const replaceSymbols = string => string
    .replace(/&(?!nbsp|amp|shy|#|lt|gt|quot)/g, '&amp;')
    .replace(/\u00A0/g, '&#160;')
    .replace(/(allowfullscreen>)n/g, 'allowfullscreen="allowfullscreen">')
    .replace(/(allowfullscreen\s)n/g, 'allowfullscreen="allowfullscreen" ')
    .replace(/\bwebkitallowfullscreen=""/g, 'webkitallowfullscreen="webkitallowfullscreen"')
    .replace(/\bmozallowfullscreen=""/g, 'mozallowfullscreen="mozallowfullscreen"')
    .replace(/n><\/iframe>/g, 'n><!-- --></iframe>')
    .replace(/"><\/iframe>/g, '"><!-- --></iframe>')
    .replace(/\s><\/iframe>/g, ' ><!-- --></iframe>')
    .replace(/>\s*<\/hht:vacancies>/g, ' />')
    .replace(/>\s*<\/hht:employer-confirmed>/g, ' />')
    .replace(/>\s*<\/hht:employer-insider>/g, ' />')
    .replace(/><\/hht>/g, ' />')
    .replace(/«\s*<hht:employer-title>»/g, '«<hht:employer-title />»')
    .replace(/«\s*<hht:employer-title xmlns:hht="http:\/\/hh.ru\/development\/hht">/g, '«<hht:employer-title xmlns:hht="http://hh.ru/development/hht" />')
    .replace(/«\s*<hht:employer-title xmlns:hht="http:\/\/hh\.ru\/development\/hht" \/>/g, '«<hht:employer-title xmlns:hht="http://hh.ru/development/hht" />')
    .replace(/<\/hht:employer-title>/g, '');

const replaceVacancyContent = string => string.replace(/<div class="tmpl_hh_content">(\s|.)*?<\/div>/g, `<div class="tmpl_hh_content">\n${indent}${indent}<hht:vacancy-description />\n${indent}</div>`);

let paramsType;
let paramsTags;
fs.readFile('config.json', 'utf8', (err, data) => {
    if (err) {
        console.log('\x1b[41m%s\x1b[0m', 'Failed to read config');
        return false;
    }
    let config = JSON.parse(data);
    paramsType = config.type;
    paramsTags = config.tags;
});

const readFiles = (items) => {
    if (items.length === 0) {
        console.log('\x1b[36m%s\x1b[0m', 'Congratulations! Complete save result file!');
        return;
    }

    const currentFile = items[0];

    fs.readFile(currentFile.path, (err, data) => {
        if (err) {
            console.log('\x1b[41m%s\x1b[0m', err.message);
            return false;
        }

        const prefix = (currentFile.prefix) ? currentFile.prefix : '';
        const postfix = (currentFile.postfix) ? currentFile.postfix : '';
        let dataFile = prefix + data + postfix;

        if (currentFile.name === 'styles') {
            dataFile = beautify(dataFile, {
                format: 'css',
            });

            dataFile = dataFile.replace(/\n\n.*(sourceMappingURL).*/g, '');

            if (paramsType === 'vacancy') dataFile = '<hht:adaptive>\n' + dataFile;
        }

        if (currentFile.name === 'html') {
            dataFile = formatter.closing(dataFile.split(/\<body?(.+?)\>/g)[2].split('</body>')[0]);
            
            const beforeHtml = `<div style="width:100%;max-width:1250px;margin:0 auto 15px auto;"><hht:employer-wantworkhere/><div style="margin: 15px 0 0;"><hht:employer-hrbrand /><hht:employer-hhrating/></div></div>\n`;
            let afterHtml = `\n<div class="tmpl_hh_vacancy_block" style="width:100%;max-width:1250px;margin:0 auto 25px auto;position: relative; padding: 30px 0 0;">\n${indent}<div style="position: absolute; right: 0; top: 15px; z-index: 10;">\n${indent}${indent}<hht:employer-insider xmlns:hht="http://hh.ru/development/hht" />\n${indent}</div>\n${indent}<h3 style="font-weight: normal; font-size: 18px; margin: 20px 0;">\n${indent}${indent}Вакансии компании «<hht:employer-title />»<hht:employer-confirmed />\n${indent}</h3>\n${indent}<hht:vacancies filtered="true" />\n</div>`;

            if (dataFile.indexOf('tmpl_hh_vacancy_block') !== -1) afterHtml = '';

            dataFile = replaceSymbols(dataFile);
            dataFile = (paramsTags && paramsType.indexOf('vacancy') === -1) ? beforeHtml + dataFile + afterHtml : dataFile;

            if (paramsType.indexOf('vacancy') !== -1) dataFile = replaceVacancyContent(dataFile);
            if (paramsType === 'vacancy') dataFile = dataFile = dataFile + '\n</hht:adaptive>';
        }

        return fs.appendFile(resultFile, dataFile, (error) => {
            if (err) {
                console.log('\x1b[41m%s\x1b[0m', error.message);
                return false;
            }
            items.shift();
            return readFiles(items);
        });
    });
};

// очищение результирующего файла и старт записи в него
fs.writeFile(resultFile, '', 'utf8', (err) => {
    if (err) {
        console.log('\x1b[41m%s\x1b[0m', `${err.message} Need run task - "npm run build"`);
        return false;
    }
    console.log('\x1b[36m%s\x1b[0m', 'Result file is clean!');
    return readFiles(workFiles);
});
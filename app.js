'use strict';

const configuration = require("./config.json");
const cv = require("./cv.json");

const fs = require('fs');
const handlebars = require('handlebars');
const moment = require('moment');
const templateDirectory = 'templates/';

if (configuration.template) {
    loadTemplate(configuration.template);
}

function loadTemplate(templateName) {
    if (!templateExists(templateName)) {
        console.log(`Template (${templateName}) does not exist.`);
    }
    let conversion = require("phantom-html-to-pdf")();
    let html = getTemplate(templateName);
    let header = "";
    let footer = "";
    if (templateExists(templateName + '/header.html')) {
        header = getTemplateHeader(templateName);
        let headerTemplate = handlebars.compile(header);
        header = headerTemplate(cv);
    }
    if (templateExists(templateName + '/footer.html')) {
        footer = getTemplateFooter(templateName);
        let footerTemplate = handlebars.compile(header);
        footer = footerTemplate(cv);
    }
    let template = handlebars.compile(html);
    html = template(cv);

    conversion({
        html: html,
        paperSize: {
            format: 'A4'
        },
        format: {
            quality: 100
        },
        header: header,
        footer: footer
    }, function (err, pdf) {
        var dir = './cv';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let count = 0;
        let name = "";
        fs.readdir(dir, (err, files) => {
            count = files.length;
            if (count > 0) name = `(${count})`;
            var output = fs.createWriteStream(`${dir}/cv-${moment().format('YYYYMMDD')}${name}.pdf`)
            pdf
                .stream
                .pipe(output);
            conversion.kill();
        });
    });
}

function templateExists(templateName) {
    return fs.existsSync(`${templateDirectory}/${templateName}`);
}

function getTemplate(templateName) {
    return fs.readFileSync(`${templateDirectory}/${templateName}/index.html`, 'utf8');
}

function getTemplateHeader(templateName) {
    return fs.readFileSync(`${templateDirectory}/${templateName}/header.html`, 'utf8');
}

function getTemplateFooter(templateName) {
    return fs.readFileSync(`${templateDirectory}/${templateName}/footer.html`, 'utf8');
}
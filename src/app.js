'use strict';

const configuration = require("../config.json");
const cv = require("../" + configuration.cvfile);

const fs = require('fs');
const handlebars = require('handlebars');
const moment = require('moment');
const templateDirectory = 'templates/';

handlebars.registerHelper('ifObject', function (item, options) {
    if (typeof item === "object") {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

handlebars.registerHelper('ifArray', function (item, options) {
    if (typeof item === Array) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

if (configuration.template) {
    loadTemplate(configuration.template);
}

function loadTemplate(templateName) {
    if (!templateExists(templateName)) {
        console.log(`Template (${templateName}) does not exist.`);
    }

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

    let dir = `./cv/${moment().format('X')}`;
    let path = `${dir}/cv`;
    if (!fs.existsSync('./cv/')) {
        fs.mkdirSync('./cv/');
    }
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    if (configuration.saveHTML) {
        fs
            .writeFile(`${path}.html`, html, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
    }

    let http = require('http');
    let puppeteer = require('puppeteer');

    const server = http.createServer((req, res) => res.end(html)).listen(1337, async() => {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('http://localhost:1337', {waitUntil: 'networkidle0'});
        await page.waitFor(500);

        if (configuration.saveImage) {
            await page.screenshot({path: `${path}.png`, fullPage: true});
        }
        if (configuration.savePDF) {
            await page.pdf({
                path: `${path}.pdf`,
                footerTemplate: footer,
                headerTemplate: header,
                margin: {
                    top: '60px',
                    bottom: '60px'
                },
                format: 'A4'
            });
        }

        await browser.close();
        server.close();
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
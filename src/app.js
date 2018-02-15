'use strict';

const configuration = require("../config.json");
const cv = require("../" + configuration.cvfile);

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

    if (configuration.saveHTML) {
        fs
            .writeFile("cv.html", html, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
    }
    if (configuration.saveImage) {}
    if (configuration.savePDF) {
        var path = '';
        var dir = './cv';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let count = 0;
        let name = "";
        fs.readdir(dir, (err, files) => {
            count = files.length;
            if (count > 0)
                name = `(${count})`;
            path = `${dir}/cv-${moment().format('YYYYMMDD')}${name}.pdf`;
        });

        let http = require('http');
        let puppeteer = require('puppeteer');

        const server = http.createServer((req, res) => res.end(html)).listen(1337, async () => {

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('http://localhost:1337', );
            await page.waitFor(5000);
            await page.pdf({
                path: path,
                format: 'A4'
            });

            await browser.close();
            server.close();
        });

    }
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
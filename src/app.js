'use strict';

const configuration = require("../config.json");
const cv = require("../" + configuration.cv.data);
const cover = require("../" + configuration.cover.data);

const HtmlDocx = require('html-docx-js');
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
    loadTemplate(configuration.template, 'cv', cv).then(() => {
        loadTemplate(configuration.template, 'cover', cover);
    });
}

function loadTemplate(templateName, type, data) {
    return new Promise((res) => {
        if (!templateExists(templateName)) {
            console.log(`Template (${templateName}) does not exist.`);
        }

        let html = getTemplate(templateName, `${type}.html`);
        let header = "";
        let footer = "";
        if (templateExists(templateName + '/header.html')) {
            header = getTemplate(templateName, 'header.html');
            let headerTemplate = handlebars.compile(header);
            header = headerTemplate(data);
        }
        if (templateExists(templateName + '/footer.html')) {
            footer = getTemplate(templateName, 'footer.html');
            let footerTemplate = handlebars.compile(header);
            footer = footerTemplate(data);
        }
        let template = handlebars.compile(html);
        html = template(data);

        let typedir = configuration[type].dir
        let dir = `./${typedir}/${moment().format('X')}`;
        let path = `${dir}/${typedir}`;

        if (!fs.existsSync(`./${typedir}/`)) {
            fs.mkdirSync(`./${typedir}/`);
        }
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        if (configuration[type].saveDOCX) {
            var docx = HtmlDocx.asBlob(html);
            fs.writeFile(`${path}.docx`, docx, function (err) {
                if (err) throw err;
            });
        }
        if (configuration[type].saveHTML) {
            fs
                .writeFile(`${path}.html`, html, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
        }

        let http = require('http');
        let puppeteer = require('puppeteer');

        const server = http.createServer((req, res) => res.end(html)).listen(configuration.port, async () => {

            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`http://localhost:${configuration.port}`, {
                waitUntil: 'networkidle0'
            });
            await page.waitFor(500);

            if (configuration[type].saveImage) {
                await page.screenshot({
                    path: `${path}.png`,
                    fullPage: true
                });
            }
            if (configuration[type].savePDF) {
                await page.pdf({
                    path: `${path}.pdf`,
                    footerTemplate: footer,
                    headerTemplate: header,
                    margin: {
                        top: '55px',
                        bottom: '55px'
                    },
                    format: 'A4'
                });
            }

            await browser.close();
            server.close();
        });
        server.addListener("close", () => {
            return res();
        });
    })
}

function templateExists(templateName) {
    return fs.existsSync(`${templateDirectory}/${templateName}`);
}

function getTemplate(templateName, filename) {
    return fs.readFileSync(`${templateDirectory}/${templateName}/${filename}`, 'utf8');
}

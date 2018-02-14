'use strict';

let configuration = require("./config.json");
let cv = require("./cv.json");

let fs = require('fs');
const templateDirectory = 'templates/';

const TemplateEngine = function (html, options) {
    var re = /<%([^%>]+)?%>/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0,
        match;
    var add = function (line, js) {
        js
            ? (code += line.match(reExp)
                ? line + '\n'
                : 'r.push(' + line + ');\n')
            : (code += line != ''
                ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n'
                : '');
        return add;
    }
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}

if (configuration.template) {
    loadTemplate(configuration.template);
}

function loadTemplate(templateName) {
    if (!templateExists(templateName)) {
        console.log(`Template (${templateName}) does not exist.`);
    }
    let conversion = require("phantom-html-to-pdf")();
    let html = getTemplate(templateName);
    let header = {};
    let footer = {};
    if (!templateExists(templateName + '/header.html')) {
        header = getTemplateHeader(templateName);
        header = TemplateEngine(header, cv);
    }
    if (!templateExists(templateName + '/footer.html')) {
        footer = getTemplateFooter(templateName);
        footer = TemplateEngine(footer, cv);
    }
    html = TemplateEngine(html, cv);

    conversion({
        html: html,
        paperSize: {
            format: 'A4'
        },
        header: header,
        footer: footer
    }, function (err, pdf) {
        var output = fs.createWriteStream('cv.pdf')
        pdf
            .stream
            .pipe(output);
        conversion.kill();
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
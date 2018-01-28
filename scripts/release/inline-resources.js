'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const readFile = promiseify(fs.readFile);
const writeFile = promiseify(fs.writeFile);

function promiseify(fn) {
  return function () {
    const args = [].slice.call(arguments, 0);
    return new Promise((resolve, reject) => {
      fn.apply(this, args.concat([function (err, value) {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      }]));
    });
  };
}

function inlineResources(globs) {
  if (typeof globs == 'string') {
    globs = [globs];
  }

  return Promise.all(globs.map(pattern => {
    if (pattern.indexOf('*') < 0) {
      pattern = path.join(pattern, '**', '*');
    }

    const files = glob.sync(pattern, {})
      .filter(name => /\.js$/.test(name));

    return Promise.all(files.map(filePath => {
      return readFile(filePath, 'utf-8')
        .then(content => inlineResourcesFromString(content, url => {
          return path.join(path.dirname(filePath), url);
        }))
        .then(content => writeFile(filePath, content))
        .catch(err => {
          console.error('An error occurred: ', err);
        });
    }));
  }));
}

function inlineResourcesFromString(content, urlResolver) {
  return [
    inlineTemplate,
    inlineStyle,
    removeModuleId
  ].reduce((content, fn) => fn(content, urlResolver), content);
}

if (require.main === module) {
  inlineResources(process.argv.slice(2));
}

function inlineTemplate(content, urlResolver) {
  return content.replace(/templateUrl:\s*'([^']+?\.html)'/g, function (m, templateUrl) {
    const templateFile = urlResolver(templateUrl);
    const templateContent = fs.readFileSync(templateFile, 'utf-8');
    const shortenedTemplate = templateContent
      .replace(/([\n\r]\s*)+/gm, ' ')
      .replace(/"/g, '\\"');
    return `template: "${shortenedTemplate}"`;
  });
}

function inlineStyle(content, urlResolver) {
  return content.replace(/styleUrls:\s*(\[[\s\S]*?\])/gm, function (m, styleUrls) {
    const urls = eval(styleUrls);
    return 'styles: ['
      + urls.map(styleUrl => {
        const styleFile = urlResolver(styleUrl);
        const styleContent = fs.readFileSync(styleFile, 'utf-8');
        const shortenedStyle = styleContent
          .replace(/([\n\r]\s*)+/gm, ' ')
          .replace(/"/g, '\\"');
        return `"${shortenedStyle}"`;
      })
        .join(',\n')
      + ']';
  });
}

function removeModuleId(content) {
  return content.replace(/\s*moduleId:\s*module\.id\s*,?\s*/gm, '');
}

module.exports = inlineResources;
module.exports.inlineResourcesFromString = inlineResourcesFromString;

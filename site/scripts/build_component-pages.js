/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// const fsp = require('fs').promises;
// const path = require('path');

// // const gulp = require('gulp');
// // const data = require('gulp-data');
// // const rename = require('gulp-rename');

// const yaml = require('js-yaml');
// const merge = require('merge-stream');
// const through = require('through2');
// const ext = require('replace-ext');
// const nunjucks = require('nunjucks');

// const sitePath = path.join(process.cwd(), '../../site');

// async function readJSONFile(filepath) {
//   return JSON.parse(await fsp.readFile(filepath));
// }

// async function getDependencies(packagePath = '') {
//   let package = await readJSONFile(path.join(packagePath, 'package.json'));

//   let dependencies = [];

//   if (package.devDependencies) {
//     dependencies = Object.keys(package.devDependencies);

//     dependencies = dependencies
//       .filter((dep) => {
//         return (
//           dep.indexOf('@spectrum-css') === 0 &&
//           dep !== '@spectrum-css/bundle-builder' &&
//           dep !== '@spectrum-css/component-builder' &&
//           dep !== '@spectrum-css/component-builder-simple'
//         );
//       })
//       .map((dep) => dep.split('/').pop());
//   }

//   return dependencies;
// }

// // @todo move this to 11ty
// function buildDocs_resources() {
//   return gulp.src(`${sitePath}/dist/**`)
//     .pipe(gulp.dest('dist/docs/'));
// }

// function buildDocs_copyDeps() {
//   return new Promise(async (resolve, reject) => {
//     let dependencies;
//     try {
//       dependencies = await getDependencies();
//     }
//     catch(err) {
//       return reject(err);
//     }

//     function copyDep(dep) {
//       const depPath = path.dirname(require.resolve(`@spectrum-css/${dep}`));
//       return gulp.src(`${depPath}/dist/*`).pipe(gulp.dest(`dist/docs/dependencies/@spectrum-css/${dep}/`));
//     }

//     return merge.apply(merge, dependencies.map(copyDep))
//       .resume()
//       .on('end', resolve)
//       .on('error', reject);
//   });
// }

// function buildDocs_html() {
//   return new Promise(async (resolve, reject) => {
//     let dependencies;
//     let package;
//     try {
//       package = await readJSONFile('package.json');
//       dependencies = await getDependencies();
//     }
//     catch(err) {
//       return reject(err);
//     }

//     let packageName = package.name.split('/').pop();

//     let dnaVars = readJSONFile(path.join(path.dirname(require.resolve('@spectrum-css/vars')), '..', 'dist', 'spectrum-metadata.json'));

//     gulp.src(
//       [
//         'metadata.yml',
//         'metadata/*.yml'
//       ], {
//         allowEmpty: true
//       }
//     )
//       .pipe(rename(function(file) {
//         if (file.basename === 'docs' || file.basename === packageName) {
//           file.basename = 'index';
//         }
//       }))
//       .pipe(data(function() {
//         return {
//           dependencies: dependencies,
//           dnaVars: dnaVars,
//           pkg: package
//         };
//       }))
//       .pipe(through.obj((file, enc, cb) => {
//           let data = Object.assign({}, { component: yaml.safeLoad(String(file.contents)) }, file.data || {});

//           file.path = ext(file.path, '.html');

//           // @todo move this to 11ty
//           try {
//             const templatePath = path.join(sitePath, '/_includes/individualComponent.njk');
//             if (!nunjucks.getTemplate(templatePath)) {
//               nunjucks.configure(sitePath, {
//                 autoescape: false
//               });
//             }
//             let compiled = nunjucks.render(templatePath, data)
//             file.contents = Buffer.from(compiled);
//           } catch (e) {
//             return cb(e);
//           }
//           cb(null, file);
//         })
//       )
//       .pipe(gulp.dest('dist/docs/'))
//       .on('end', resolve)
//       .on('error', reject);
//   });
// }

// let buildDocs = gulp.parallel(
//   buildDocs_resources,
//   buildDocs_copyDeps,
//   buildDocs_html
// );

// exports.buildDocs = buildDocs;
// exports.buildDocs_html = gulp.series(buildDocs_html);

const fs = require("fs").promises;
const path = require("path");

const yaml = require("js-yaml");
const fg = require("fast-glob");

const componentDir = path.join(__dirname, '../../components');
(async () => {
  const promises = [];
  for (const filePath of await fg(["*/metadata/*.yml"], {
    cwd: componentDir,
  })) {
    const componentName = filePath.split("/").shift();
    if (!componentName) {
      console.warn(`Unable to determine component name from ${filePath}`);
      continue;
    }

    const componentData = await fs.readFile(path.join(componentDir, filePath), "utf8").then(yaml.load).catch((err) => {
      console.warn(`Error reading component metadata for ${componentName} from ${filePath}.`);
      console.warn(err);
    });

    const componentPkg = await fs.readFile(path.join(componentDir, componentName, 'package.json'), "utf8").then(JSON.parse).catch((err) => {
      console.warn(`Error reading component package data for ${componentName}.`);
      console.warn(err);
    });

    if (!componentData) continue;

    promises.push(fs.writeFile(path.join(__dirname, `../components/${componentName}.md`), `---
tags: components
layout: individualComponent.njk
eleventyNavigation:
    key: ${componentName}
    title: ${componentData.name}
    parent: Components
${yaml.dump(componentData).trim()}
${yaml.dump({ pkg: {
  name: componentPkg.name,
  version: componentPkg.version,
  description: componentPkg.description,
  peerDependencies: componentPkg.peerDependencies,
  dependencies: componentPkg.dependencies,
  devDependencies: componentPkg.devDependencies,
} }).trim()}
---`));
  }

  return Promise.all(promises);
})();

/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const { readFile } = require("fs").promises;
const { join, dirname, basename } = require("path");

const yaml = require("js-yaml");
const fg = require("fast-glob");
const { json } = require('npm-registry-fetch');
const depSolver = require('dependency-solver');

const fetchDNA = require('../scripts/fetchDNA.js');

// was: buildDocs_forDep/buildDocs_individualPackages
module.exports = async () => {
  const pages = [];
  const isMigrated = (dependencies) => {
    if (dependencies["@spectrum-css/component-builder-simple"] || dependencies["@spectrum-css/tokens"]) return true;
    return false;
  };

  async function getDependencies(packageName) {
    const pageData = pages.find((page) => page.packageName === packageName) || {};
    if (pageData.dependencies) return { name: packageName, dependencies: pageData.dependencies };

    const pathToComponent = join(__dirname, "../../components", packageName.split('/').pop());
    const { name, devDependencies } = await readFile(join(pathToComponent, 'package.json'), "utf8").then(JSON.parse).catch(console.warn);
    const dep = Object.keys(devDependencies).filter((dep) => dep.indexOf('@spectrum-css') === 0 && !dep.includes('-builder')) || [];
    if (!dep) return { name, dependencies: [] };

    return { name, dependencies: dep };
  }

  async function getPackageDependencyOrder(deps) {
    if (deps.length === 0) return [];
    const depList = {};
    for (const p of deps.map((dep) => join(dirname(require.resolve(dep)), '..'))) {
      let { name, dependencies } = await getDependencies(p);
      if (dependencies.length === 0) continue;
      depList[name] = dependencies;
    }

    return depSolver.solve(depList);
  }

  for await (const componentName of fg.stream('*', {
    cwd: join(__dirname, "../../components"),
    onlyDirectories: true,
  })) {
    const pathToComponent = join(__dirname, "../../components", componentName);
    const pkgData = await readFile(join(pathToComponent, 'package.json'), "utf8").then(JSON.parse).catch(console.warn);
    if (!pkgData) continue;

    /* Get the release date of the package using npmFetch */
    const date = await json(pkgData.name)
      .then((data) => {
        const datetime = data.time[pkgData.version];
        return new Date(datetime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      })
      .catch(() => {
        logger.error(`Could not determine date of release for ${pkgData.name}@${pkgData.version}`);
        return 'Unreleased';
      });

    const dependencies = pkgData.devDependencies ? Object.keys(pkgData.devDependencies).filter((dep) => {
      return dep.indexOf('@spectrum-css') === 0 && !dep.includes('-builder');
    }) : [];

    const dependencyOrder = await getPackageDependencyOrder(dependencies);
    const componentDeps = dependencyOrder.map((dep) => dep.split('/').pop()).filter((dep, i) => dependencies.indexOf(dep) === i) || [];

    for await (const file of fg.stream('metadata/*.yml', { cwd: pathToComponent, onlyFiles: true, absolute: true })) {
      const componentData = await readFile(file, "utf8").then(yaml.safeLoad).catch(console.warn);
      if (!componentData) continue;

      componentData.id = (componentData.id ?? basename(file, '.yml') ?? componentName)?.toLowerCase()?.trim();

      let examples = !componentData.examples ? [componentData] : componentData.examples;
      if (!Array.isArray(examples)) {
        examples = Object.values(examples);
      }

      examples = examples.map((example) => {
        let status = 'Contribution';
        const { dnaStatus, cssStatus } = example;
        if (dnaStatus === 'Deprecated' || cssStatus === 'Deprecated') {
          status = 'Deprecated';
        } else if (cssStatus === 'Verified' || dnaStatus === 'Canon') {
          status = 'Verified';
        }

        return { ...example, status };
      });

      pages.push({
        ...fetchDNA(componentData) || {},
        title: componentData.name,
        description: componentData.description,
        pageURL: basename(file, '.yml') + '.html',
        name: componentName,
        migrated: isMigrated(pkgData.devDependencies),
        dependencies,
        dependencyOrder: componentDeps,
        packageName: pkgData.name,
        version: pkgData.version,
        path: pathToComponent,
        examples,
        releaseDate: date,
      });
    }
  }

  return pages;
};

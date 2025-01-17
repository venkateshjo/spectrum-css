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

module.exports = function (page, scenario) {
  page.evaluate(`window._spectrumScale = '${scenario.scale}'`);
  page.evaluate(`window._spectrumTheme = '${scenario.theme}'`);
  page.evaluate(`window._spectrumVarsVersion = '${scenario.varsversion}'`);
  page.evaluate(() => {
    const SCALES = ['medium', 'large'];
    const THEMES = ['light', 'dark', 'darkest'];
    const VARS_VERSION = ['default', 'express'];
    const bodyElm = document.documentElement;
    if (window._spectrumScale && !bodyElm.classList.contains(window._spectrumScale)) {
      // Remove all the theme class
      SCALES.forEach(t => {
        bodyElm.classList.remove(`spectrum--${t}`);
      });
      bodyElm.classList.toggle(`spectrum--${window._spectrumScale}`);
    }
    if (window._spectrumTheme && !bodyElm.classList.contains(window._spectrumTheme)) {
      // Remove all the theme class
      THEMES.forEach(t => {
        bodyElm.classList.remove(`spectrum--${t}`);
      });
      bodyElm.classList.toggle(`spectrum--${window._spectrumTheme}`);
    }
    if (window._spectrumVarsVersion && !bodyElm.classList.contains(window._spectrumVarsVersion)) {
      // Remove all the vars version class
      VARS_VERSION.forEach(v => {
        bodyElm.classList.remove(`spectrum--${v}`);
      });
      bodyElm.classList.toggle(`spectrum--${window._spectrumVarsVersion}`);
    }
  });
};

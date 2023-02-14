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

module.exports = (component) => {
  // const quiet = typeof process.env.VERBOSE === undefined || process.env.VERBOSE?.toLowerCase() !== 'true' ? true : false;
  const dnaVars = require('@spectrum-css/vars/dist/spectrum-metadata.json');
  const dnaStrictRegex = (id) => new RegExp(`spectrum-${id.replace('-', '')}(?:-[s|m|l|xl])?-(name|status|version)`);
  const dnaTShirtRegex = (id) => {
    const ids = id.split('-');
    return new RegExp(`spectrum-${ids[0]}(?:-[s|m|l|xl])?${ids[1] ? `-${ids[1]}`: ``}(?:-\\w+)*-(name|status|version)`);
  };
  const dnaLooseRegex = (id) => new RegExp(`spectrum-${id.replace('-', '')}(?:-\\w+)*-(name|status|version)`);

  if (!dnaVars || !component) return;

  // Get DNA information
  const dnaComponent = Object.keys(dnaVars).filter(varKey => 
      varKey.match(dnaStrictRegex(component.id)) ||
      varKey.match(dnaLooseRegex(component.id)) ||
      varKey.match(dnaTShirtRegex(component.id))
    ).reduce((acc, varKey) => {
      let key = varKey.match(dnaStrictRegex(component.id))?.[1];
      if (!key) key = varKey.match(dnaLooseRegex(component.id))?.[1];
      if (!key) key = varKey.match(dnaTShirtRegex(component.id))?.[1];
      if (!key) return acc;

      acc[key] = dnaVars[varKey];
      return acc;
    }, {});
    
  const sourceStatus = dnaComponent.status ?? component.dnaStatus;
  /* Get DNA status for documentation */
  let dnaStatus = sourceStatus;
  if (component.status === 'Deprecated') dnaStatus = 'Deprecated';

  // @todo do we need to output this info still?
  // if (typeof dnaStatus !== 'undefined' && component.status !== dnaStatus && component.status === 'Verified' && (!sourceStatus || sourceStatus !== 'Released')) {
  //   console.log(`${component.id} is ${component.status ?? 'Unverified'} in CSS, but ${dnaStatus} in DNA`);
  // }

  // Store the info
  // Get info based on component variation first, then component name second
  if (!component.name) component.name = dnaComponent.name;
  component.cssStatus = component.status ?? 'Unverified';
  component.dnaStatus = dnaStatus ?? 'Contribution';

  // Add other data
  component.status = component.status ?? 'Contribution';

  for (id in component.examples) {
    let example = component.examples[id];
    if (typeof example === 'string') {
      // Handle markup only examples
      example = {
        id: id,
        markup: example
      };
      component.examples[id] = example;
    } else if (!example.id) example.id = id;

    // All examples are verified if the outer component is verified
    if (component.status === 'Verified' && !example.status) example.status = 'Verified';

    // The example is canon if the component is Canon and Verified
    if (component.dnaStatus === 'Canon' && component.status === 'Verified') example.dnaStatus = 'Canon';

    // this.populateDNAInfo(example);
  }

  return component;
};

/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const fs = require("fs")
const del = require("del")
const path = require("path")
const async = require("async")
const glob = require("glob")
const fg = require("fast-glob")

function clean() {
  return del("dist/*")
}

function prepareBuild(cb) {
  const dir = "dist"
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  cb()
}

/**
 * @description This code will read all the files in the css/globals directory,
 * except for the spectrum-dimensionAliases.css
 * and spectrum-colorAliases.css files, and write modified versions of them
 * to the dist/globals directory.
 * @author Rajdeep
 */
function copyGlobals() {
  glob(
    "css/globals/*.css",
    {
      ignore: [
        "css/globals/spectrum-dimensionAliases.css",
        "css/globals/spectrum-colorAliases.css",
      ],
    },
    (err, files) => {
      if (err) {
        console.error(err)
      }
      files.forEach((file) => {
        fs.readFile(file, "utf8", (err, data) => {
          if (err) {
            console.error(err)
          }
          const modifiedData = data.replace(/:root {/, ".spectrum {")
          fs.writeFile(
            file.replace("css/globals/", "dist/globals/"),
            modifiedData,
            "utf8",
            (err) => {
              if (err) {
                console.error(err)
              }
            }
          )
        })
      })
    }
  )
}

/**
 * @description This code will read all the files in the css/themes and
 * css/scales directories and write modified versions of them to the dist directory.
 * @author Rajdeep
 */
async function copySources() {
  const classMap = {
    "spectrum-darkest.css": ".spectrum--darkest",
    "spectrum-dark.css": ".spectrum--dark",
    "spectrum-light.css": ".spectrum--light",
    "spectrum-lightest.css": ".spectrum--lightest",
    "spectrum-large.css": ".spectrum--large",
    "spectrum-medium.css": ".spectrum--medium",
  }
  try {
    const files = await fg(["css/themes/*.css", "css/scales/*.css"])
    files.forEach((file) => {
      fs.readFile(file, "utf8", (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        const modifiedData = data.replace(
          ":root",
          classMap[path.basename(file)]
        )
        fs.writeFile(
          file.replace("css/", "dist/"),
          modifiedData,
          "utf8",
          (err) => {
            if (err) {
              console.error(err)
            }
          }
        )
      })
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * @description This code will read the .tmp/spectrum-global.css,
 * dist/globals/spectrum-dimensionAliases.css,
 * dist/globals/spectrum-colorAliases.css, and custom.css files and write a
 * modified version of them to the dist directory as a single file called spectrum-global.css
 * @author Rajdeep
 */
async function concatGlobalsFinal() {
  try {
    const files = await fg([
      ".tmp/spectrum-global.css",
      "dist/globals/spectrum-dimensionAliases.css",
      "dist/globals/spectrum-colorAliases.css",
      "custom.css",
    ])

    let modifiedData = ""
    files.forEach((file) => {
      fs.readFile(file, "utf8", (err, data) => {
        if (err) {
          console.error(err)
        }
        if (file.match("Aliases.css")) {
          modifiedData += `{\n  /* ${path.basename(file)} */`
        } else {
          modifiedData += "{"
        }
        modifiedData += data.replace(/{/, "")
      })
    })
    fs.writeFile("dist/spectrum-global.css", modifiedData, "utf8", (err) => {
      if (err) {
        console.error(err)
      }
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * @description This code will read all the files in the css/globals directory,
 * except for the index.css, spectrum-dimensionAliases.css, and spectrum-colorAliases.css files,
 * and write a modified version of them to the .tmp directory
 * as a single file called spectrum-global.css
 * @author Rajdeep
 */
function concatGlobalsTemp() {
  glob(
    "css/globals/*.css",
    {
      ignore: [
        "css/globals/index.css",
        "css/globals/spectrum-dimensionAliases.css",
        "css/globals/spectrum-colorAliases.css",
      ],
    },
    (err, files) => {
      if (err) {
        console.error(err)
      }
      let modifiedData = ""
      files.forEach((file) => {
        fs.readFile(file, "utf8", (err, data) => {
          if (err) {
            console.error(err)
          }
          modifiedData += `  /* ${path.basename(file)} */\n`
          modifiedData += data.replace(/:root {/, "").replace(/}/, "")
        })
      })
      modifiedData = `.spectrum {\n${modifiedData}\n}\n`
      fs.writeFile(
        ".tmp/spectrum-global.css",
        modifiedData,
        "utf8",
        (err) => {
          if (err) {
            console.error(err)
          }
        }
      )
    }
  )
}

/**
 * @description This code will read the css/globals/spectrum-colorAliases.css
 * file and write a modified version of it to the dist/globals directory.
 */
function processColorAliases() {
  const colorStops = ["darkest", "dark", "light", "lightest"]

  glob("css/globals/spectrum-colorAliases.css", (err, files) => {
    if (err) {
      console.error(err)
      return
    }
    files.forEach((file) => {
      fs.readFile(file, "utf8", (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        const modifiedData = data.replace(
          /:root/,
          colorStops.map((stop) => `.spectrum--${stop}`).join(",\n")
        )
        fs.writeFile(
          file.replace("css/globals/", "dist/globals/"),
          modifiedData,
          "utf8",
          (err) => {
            if (err) {
              console.error(err)
            }
          }
        )
      })
    })
  })
}

/**
 * @description This code will read the css/globals/spectrum-dimensionAliases.css file
 * and write a modified version of it to the dist/globals directory
 * @author Rajdeep
 */
function processDimensionAliases() {
  const scales = ["medium", "large"]

  glob("css/globals/spectrum-dimensionAliases.css", (err, files) => {
    if (err) {
      console.error(err)
      return
    }
    files.forEach((file) => {
      fs.readFile(file, "utf8", (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        const modifiedData = data.replace(
          /:root/,
          scales.map((scale) => `.spectrum--${scale}`).join(",\n")
        )
        fs.writeFile(
          file.replace("css/globals/", "dist/globals/"),
          modifiedData,
          "utf8",
          (err) => {
            if (err) {
              console.error(err)
            }
          }
        )
      })
    })
  })
}

/**
 * @description  This code will read all the files in the css/components directory,
 * except for the index.css file, and write modified versions
 * of them to the dist/components directory.
 * @author Rajdeep
 */
async function copyComponents() {
  try {
    const files = await fg(["!css/components/index.css", "css/components/*.css"]);
    files.forEach((file) => {
      glob.readFile(file, "utf8", (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        const modifiedData = data.replace(/:root/, ".spectrum")
        glob.writeFile(
          file.replace("css/", "dist/"),
          modifiedData,
          "utf8",
          (err) => {
            if (err) {
              console.error(err)
            }
          }
        )
      })
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 * @description This code will copy the json/spectrum-metadata.json file to the dist directory.
 * The copyFile function is used to copy the file from its original location to the destination.
 * @author Rajdeep
 */
function copyMetadata() {
  glob("json/spectrum-metadata.json", (err, files) => {
    if (err) {
      console.error(err)
      return
    }
    files.forEach((file) => {
      fs.copyFile(file, file.replace("json/", "dist/"), (err) => {
        if (err) {
          console.error(err)
        }
      })
    })
  })
}

/**
 * @descriptio This code will define a build function that performs a series of tasks in a
 * specified order, using the async.series function.
 * @param {*} callback
 */
const build = (callback) => {
  async.series(
    [
      clean,
      prepareBuild,
      () => {
        async.parallel(
          [
            copyMetadata,
            copyGlobals,
            copySources,
            copyComponents,
            concatGlobalsTemp,
            processColorAliases,
            processDimensionAliases,
          ],
          callback
        )
      },
      concatGlobalsFinal,
    ],
    callback
  )
}

/**
 * @description This code defines an update function that performs a series of tasks
 * in a specified order, using the async.series function
 */
exports.update = (callback) => {
  async.series(
    [
      // eslint-disable-next-line global-require
      require("./tasks/updateDNA").updateDNA,
      build,
    ],
    callback
  )
}

exports.clean = clean
exports.default = build
exports.build =
  exports.buildLite =
  exports.buildHeavy =
  exports.buildMedium =
    build
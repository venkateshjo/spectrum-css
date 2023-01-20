/**
 * @description This module exports an object that is used to define a 
 * custom attribute in a JavaScript application. The attribute is used 
 * to extract the red, green, and blue values from a string that starts with 
 * "rgb" and not starts with "rgba" and returns an object with a single property "rgb" 
 * whose value is a string containing the extracted red, green, 
 * and blue values separated by commas.
 */

module.exports = {
  name: "attribute/customrgba",
  type: "attribute",
  matcher: function (token) {
    return (
      token.original.value.startsWith("rgb") &&
      !token.original.value.startsWith("rgba")
    )
  },
  transformer: (prop) => {
    const color = prop.original.value
    const [, r, g, b] =
      color.match(/rgb\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)\)/) || []

    if (r && g && b) {
      return {
        rgb: `${r}, ${g}, ${b}`,
      }
    }
  },
}

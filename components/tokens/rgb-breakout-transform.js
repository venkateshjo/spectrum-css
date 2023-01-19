module.exports = {
    name: 'attribute/rgbBreakout',
    type: 'attribute',
    matcher: function(token) {
      return !token.name.split('-').includes('transparent') && token.original.value.startsWith('rgb') && !token.original.value.startsWith('rgba');
    },
    transformer: (prop) => {
      const [ , r, g, b ] = (prop.original.value).match(/rgb\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)\)/);
      return {
        category: 'color',
        rgb: `${r}, ${g}, ${b}`
      };
    }
};

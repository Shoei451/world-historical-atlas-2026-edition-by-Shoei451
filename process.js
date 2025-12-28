const fs = require('fs');

const content = fs.readFileSync('regions.js', 'utf8');

const region_list = eval(content.replace('use strict;\n\n', '').replace('const region_list = ', '').replace(/;$/, ''));

function removeChinese(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      removeChinese(arr[i]);
    } else if (typeof arr[i] === 'string') {
      if (i === 5 || i === 8) {
        arr[i] = '';
      }
    }
  }
}

removeChinese(region_list);

const newContent = 'use strict;\n\nconst region_list = ' + JSON.stringify(region_list, null, 0) + ';';

fs.writeFileSync('regions_new.js', newContent);
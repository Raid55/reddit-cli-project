var Table = require('cli-table');

// instantiate
var table = new Table({
    head: ['The title of the fucking articl']
  , colWidths: [55]
});

// table is an Array, so you can `push`, `unshift`, `splice` and friends
table.push(
    [``]
);

console.log(table.toString());

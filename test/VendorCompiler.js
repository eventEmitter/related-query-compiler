(function() {
    'use strict';


    let log = require('ee-log');
    let Class = require('ee-class');
    let QueryCompiler = require('../');





    module.exports = new Class({
        inherits: QueryCompiler





        , escape: function(input) {
            return `'${input}'`;
        }




        , escapeId: function(input) {
            return `"${input}"`;
        }
    });
})();
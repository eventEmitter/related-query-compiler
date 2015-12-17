(function() {
    'use strict';


    let Class = require('ee-class');
    let Check = require('./Check');
    



    module.exports = new Class({


        // the name of the node
        name: 'unknown'



                


        /**
         * returns a initialized check instance
         */
        , check: function(input) {
            return new Check(this.name, input);
        }
    });
})();

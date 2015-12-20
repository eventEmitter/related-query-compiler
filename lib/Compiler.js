(function() {
    'use strict';


    let Class = require('ee-class');
    let type = require('ee-types');
    let Check = require('./Check');
    



    module.exports = new Class({


        // the name of the node
        name: 'unknown'





        /**
         * since values are often not passed as ast object
         * we have to create one and send it to the orrect 
         * compiler. takes also ast object, passes them
         * to the appropriate compiler
         *
         * @param {object} the query context
         * @param {*} value the value to convert
         * 
         * @returns {promise}
         */
        , processValue: function(queryContext, value) {
            if (type.object(value)) return this.compileNode(queryContext, value);
            else {
                let node = {
                      kind: 'value'
                    , value: value
                };
                
                return this.compileNode(queryContext, node);
            }
        }



                


        /**
         * returns a initialized check instance
         */
        , check: function(input) {
            return new Check(this.name, input);
        }
    });
})();

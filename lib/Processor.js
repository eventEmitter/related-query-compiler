(function() {
    'use strict';


    let Class = require('ee-class');
    



    module.exports = new Class({


        // the name of the node
        name: 'unknown'




        /**
         * processes the results of an pseudo ast based
         * query
         *
         * @param {object} context the query context
         * @param {object} data the data returned from the database
         *
         * @param {promise}
         */
        , process: function(queryContext, data) {
            return Promise.resolve(data);
        }
    });
})();

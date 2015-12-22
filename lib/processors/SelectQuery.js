(function() {
    'use strict';


    let Class = require('ee-class');
    let type = require('ee-types');

    let Processor = require('../Processor');
    



    module.exports = new Class({
        inherits: Processor


        // the name of the node
        , name: 'selectQuery'




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
            return Promise.resolve(data && data.rows ? data.rows : []);
        }
    });
})();

(function() {
    'use strict';


    let Class = require('ee-class');
    let type = require('ee-types');
    let Compiler = require('../Compiler');




    module.exports = new Class({
        inherits: Compiler



        // compiler name
        , name: 'selectQuery'







        /**
         * compiles the node
         *
         * @param {object} connection database connection
         * @param {object} node the nodes the node
         *
         * @returns {promise} a promise to be resolved
         */
        , compile: function(queryContext, node) {
            let query = {};

            return this.compileNode(queryContext, node.select).then((selectSql) => {
                query.select = selectSql;

                return this.compileNode(queryContext, node.from);
            }).then((fromSql) => {
                query.from = fromSql;

                return `${query.select} ${query.from}`;
            })
        }

        




        


        /**
         * validates the input given by the node
         *         
         * @param {object} node the nodes the node
         *
         * @returns {promise} a promise to be resolved
         */
        , validate: function(node) {
            return this.check(node)
                .property('select').object()
                .property('from').object()
                .execute();
        }
    });
})();

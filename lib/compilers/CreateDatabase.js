(function() {
    'use strict';


    let Class = require('ee-class');
    let Compiler = require('../Compiler');
    let type = require('ee-types');




    module.exports = new Class({
        inherits: Compiler



        // compiler name
        , name: 'createDatabase'





        /**
         * compiles the node
         *
         * @param {object} connection database connection
         * @param {object} node the nodes the node
         *
         * @returns {promise} a promise to be resolved
         */
        , compile: function(queryContext, node) {
            if (type.object(node.database)) {
                return this.compileNode(queryContext, node.database).then((output) => {
                    return Promise.resolve(`CREATE DATABASE ${output};`);
                });
            }
            else return Promise.resolve(`CREATE DATABASE ${this.escapeId(node.database)};`);
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
                .property('database').string().or().object()
                .execute();
        }
    });
})();

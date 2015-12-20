(function() {
    'use strict';


    let Class = require('ee-class');
    let type = require('ee-types');
    let Compiler = require('../Compiler');




    module.exports = new Class({
        inherits: Compiler



        // compiler name
        , name: 'functionQuery'







        /**
         * compiles the node
         *
         * @param {object} connection database connection
         * @param {object} node the nodes the node
         *
         * @returns {promise} a promise to be resolved
         */
        , compile: function(queryContext, node) {
            return Promise.all(node.parameters.map(parameter => this.processValue(queryContext, parameter))).then((params) => {
                return Promise.resolve(`SELECT * FROM ${node.database ? this.escapeId(node.database)+'.' : ''}${this.escapeId(node.name)}(${params.join(', ')})`);
            });
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
                .property('name').string()
                .property('parameters').array()
                .property('database').string().or().undefined().or().null()
                .execute();
        }
    });
})();

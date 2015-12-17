(function() {
    'use strict';


    let Class = require('ee-class');
    let type = require('ee-types');
    let Compiler = require('../Compiler');




    module.exports = new Class({
        inherits: Compiler



        // compiler name
        , name: 'from'







        /**
         * compiles the node
         *
         * @param {object} connection database connection
         * @param {object} node the nodes the node
         *
         * @returns {promise} a promise to be resolved
         */
        , compile: function(queryContext, node) {
            let processedEntitiy;

            // make sure we dont use subqueries with the database statement
            if (type.string(node.alias) && (type.string(node.database) || type.object(node.database))) return Promise.reject(new Error(`Cannot use an alias and a database at the same time in a from statement!`));
            else {

                return Promise.resolve().then(() => {

                    // prepare the entitiy value
                    if (type.string(node.entity)) return Promise.resolve(this.escapeId(node.entity));
                    else if (type.object(node.entity)) {
                        return this.compileNode(queryContext, node.entity).then((sql) => {

                            // subquery?
                            if (type.string(node.alias)) return Promise.resolve(`(${sql}) AS ${this.escapeId(node.alias)}`);
                            else return Promise.resolve(sql);
                        });
                    }
                    else return Promise.resolve();
                }).then((entity) => {
                    processedEntitiy = entity;

                    // prepare the database value
                    if (type.string(node.database)) return Promise.resolve(this.escapeId(node.database));
                    else if (type.object(node.database)) return this.compileNode(queryContext, node.database);
                    else return Promise.resolve();
                }).then((database) => {

                    // got everything!
                    if (!type.string(processedEntitiy)) return Promise.rejeect(new Error(`The entitiy must be typeof string, got ${type(processedEntitiy)} instead!`));
                    else if (!processedEntitiy.length) return Promise.rejeect(new Error(`The entitiy must have a length of at least 1 characters, got 0!`));
                    else {

                        // nice!
                        return Promise.resolve(`FROM ${type.string(database) ? `${database}.` : ''}${processedEntitiy}`);
                    }
                });
            }
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
                .property('entity').string().or().object().or().undefined()
                .property('database').string().or().object().or().undefined()
                .property('alias').string().or().undefined()
                .execute();
        }
    });
})();

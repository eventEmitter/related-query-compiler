(function() {
    'use strict';


    let Class = require('ee-class');
    let type = require('ee-types');
    let Compiler = require('../Compiler');




    module.exports = new Class({
        inherits: Compiler



        // compiler name
        , name: 'select'







        /**
         * compiles the node
         *
         * @param {object} connection database connection
         * @param {object} node the nodes the node
         *
         * @returns {promise} a promise to be resolved
         */
        , compile: function(queryContext, node) {
            if (!node.selection.length) return Promise.reject(new Error('Cannot render empty select statement!'));
            else {
                let set = new Set();

                // make sure there are no duplicates
                let filteredSelection = node.selection.filter((selection) => {
                    if (type.string(selection)) {
                        if (set.has(selection)) return false;
                        else {
                            set.add(selection);
                            return true;
                        }
                    }
                    else return true;
                });


                // compile
                return Promise.all(filteredSelection.map((selection) => {
                    if (type.object(selection)) return this.compileNode(queryContext, selection);
                    else return Promise.resolve(this.escapeId(selection));
                })).then((selections) => {
                    return Promise.resolve(`SELECT ${selections.join(', ')}`);
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
                .property('selection').array()
                .execute();
        }
    });
})();

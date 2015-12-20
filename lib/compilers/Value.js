(function() {
    'use strict';


    let Class = require('ee-class');
    let log = require('ee-log');
    let type = require('ee-types');
    let Compiler = require('../Compiler');




    module.exports = new Class({
        inherits: Compiler



        // compiler name
        , name: 'value'








        /**
         * compiles the node
         *
         * @param {object} connection database connection
         * @param {object} node the nodes the node
         *
         * @returns {promise} a promise to be resolved
         */
        , compile: function(queryContext, node) {
            switch (type(node.value)) {
                case 'string':
                    return Promise.resolve(this.escape(node.value));

                case 'symbol':
                    return Promise.resolve(this.escape(''+node.value.toString()));

                case 'number':
                case 'boolean':
                    return Promise.resolve(this.escape(''+node.value));

                case 'null':
                case 'undefined':
                    return Promise.resolve('NULL');

                case 'symbol':
                case 'regexp':
                case 'error':
                    return Promise.resolve(this.escape(node.value.toString()));

                case 'date':
                    return Promise.resolve(this.escape(node.value.toISOString()));

                case 'buffer':
                    return Promise.resolve(this.escape('\\x'+node.value.toString('HEX')));

                case 'array':
                    return Promise.all(node.value.map(v => this.compile(queryContext, {value: v}))).then((values) => {
                        return Promise.resolve(`{${values.join(', ')}}`);
                    });

                case 'float32Array':
                case 'float64Array':
                case 'int8Array':
                case 'int16Array':
                case 'int32Array':
                case 'uInt8Array':
                case 'uInt16Array':
                case 'uInt32Array':
                case 'uInt8ClampedArray':
                    // convert the array to a normal array beforehand, 
                    // else the strings will be coerced back to numbers
                    // automatically
                    return Promise.all(Array.prototype.slice.call(node.value).map(v => this.compile(queryContext, {value: v}))).then((values) => {
                        return Promise.resolve(`{${values.join(', ')}}`);
                    });

                case 'set':
                case 'weakSet':
                    let promises = [];

                    // since this stuff has no map method we need 
                    // to create them ahead of time
                    node.value.forEach(v => promises.push(this.compile(queryContext, {value: v})));

                    return Promise.all(promises).then(values => {
                        return Promise.resolve(`{${values.join(', ')}}`);
                    });

                case 'map':
                case 'weakMap':
                    // lets treat this as json
                    let obj = {};

                    node.value.forEach((value, key) => {
                        obj[key] = value;
                    });

                    return Promise.resolve(this.escape(JSON.stringify(obj)));

                case 'object':
                    // try to serialize or stringify
                    if (type.function(node.value.toJSON)) return Promise.resolve(this.escape(node.value.toJSON()));
                    else return Promise.resolve(this.escape(JSON.stringify(node.value)));


                default:
                    return Promise.reject(new Error(`Cannot convert type ${type(node.value)} to SQL!`));
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
            return Promise.resolve();
        }
    });
})();

(function() {
	'use strict';



    let path = require('path');
	let Class = require('ee-class');
    let type = require('ee-types');
	let log = require('ee-log');







	module.exports = new Class({

		init: function(options) {


            // storage for the node compilers
            this.compilers = new Map();

            // set of failed to load compilers
            this.failedCompilers = new Set();
		}









        /**
         * register a new or override an exiting compiler
         */
        , registerCompiler: function(compiler) {
            if (!type.object(compiler)) throw new Error(`Expected type object as compiler, got ${type(compiler)}!`);
            if (!type.string(compiler.name) || !compiler.name) throw new Error('The compiler needs a name its identified by!');
            if (!type.function(compiler.compile)) throw new Error(`Each compiler needs a compile method!`);


            // tell the nodes how to escape stuff
            compiler.escapeId = this.escapeId.bind(this);
            compiler.escape = this.escape.bind(this);


            // let the nodes call other nodes to compile
            compiler.compileNode = this.compileNode.bind(this);


            // register
            this.compilers.set(compiler.name, compiler);
        }








        /**
         * dummy escapeId method
         */
        , escapeId: function() {
            throw new Error('The escapeId method is not implemented!');
        }








        /**
         * dummy escape method
         */
        , escape: function() {
            throw new Error('The escape method is not implemented!');
        }









        /**
         * compiles a single node
         */
        , compileNode: function(context, inputNode) {
            if (!type.object(inputNode)) return Promise.reject(new Error(`Cannot compile node that is not of type object!`));
            else {
                return this.loadCompiler(inputNode.kind).then((compiler) => {
                    return compiler.validate(inputNode).then(() => {
                        return compiler.compile(context, inputNode);
                    });
                });
            }
        }








        /**
         * load a compiler from the filesystem, on demand loader
         * should be pretty secure since allowed filenames can only
         * contain [a-zA-Z].
         * 
         * @param {string} compilerName 
         *
         * @returns {promise}
         */
        , loadCompiler: function(compilerName) {
            if (!type.string(compilerName)) return Promise.reject(new Error(`Cannot compile node without knowing its kind!`));
            else if (this.compilers.has(compilerName)) return Promise.resolve(this.compilers.get(compilerName));
            else if (this.failedCompilers.has(compilerName)) return Promise.reject(new Error(`Cannot load the compiler ${compilerName}, it does not exist!`));
            else if (/[^a-z]/gi.test(compilerName)) return Promise.reject(new Error(`Illegal compiler name ${compilerName}, allowed characters are [a-zA-Z]!`));
            else if (compilerName.length < 3) return Promise.reject(new Error(`Illegal compiler name ${compilerName}, he name must consist of at least 3 characters!`));
            else {

                // so, actually going to load the compiler. 
                // first checking for the vendor version of
                // the compiler
                return Promise.resolve().then(() => {
                    if (type.function(this.loadVendorCompiler)) return this.loadVendorCompiler(compilerName);
                    else return Promise.resolve();
                }).then((Compiler) => {
                    if (Compiler) return Promise.resolve(Compiler);
                    else {

                        // try to get the local version
                        Compiler = this.loadFile(path.join(__dirname, 'compilers', compilerName[0].toUpperCase()+compilerName.substr(1)));

                        // return the compiler if it exists
                        return Promise.resolve(Compiler);
                    }
                }).then((Compiler) => {
                    if (Compiler) {
                        let compiler = new Compiler();

                        // register
                        this.registerCompiler(compiler);

                        // return
                        return Promise.resolve(compiler);
                    }
                    else {
                        // mark as failed
                        this.failedCompilers.add(compilerName);

                        // return the error
                        return Promise.reject(new Error(`Cannot compile node of the kind «${compilerName}», there is compiler registered for this kind of node!`)); 
                    }
                });
            }
        }









        /**
         * moved the try catch block to a spearate function since  
         * v8 wont optimize it
         *
         * @param {string} path to file to load
         *
         * @returns {contructor|undefined} the class constructor or undefined
         */
        , loadFile: function(filePath) {
            let Compiler;

            try {
                Compiler = require(filePath);
            } catch (e) {}

            return Compiler;
        }









        /**
         * compile the actual query
         */
        , compile: function(context) { 

            // lets compile the shit!
            return this.compileNode(context, context.ast).then((sql) => {
                context.sql = sql;

                return Promise.resolve();
            });
        }
	});
})();

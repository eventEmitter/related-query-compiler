(function() {
	'use strict';



	let Class = require('ee-class');
    let type = require('ee-types');
    let EventEmitter = require('ee-event-emitter');
	let log = require('ee-log');




    let CreateDatabase = require('./compilers/CreateDatabase');
    let From = require('./compilers/From');
    let Fn = require('./compilers/Function')
    let Select = require('./compilers/Select');
    let SelectQuery = require('./compilers/SelectQuery');








	module.exports = new Class({

		init: function(options) {


            // storage for the node compilers
            this.compilers = new Map();



            // register native compilers
            this.registerCompiler(new CreateDatabase());
            this.registerCompiler(new Select());
            this.registerCompiler(new SelectQuery());
            this.registerCompiler(new From());
            this.registerCompiler(new Fn());
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
        , compileNode: function(context, inputNode, isRootNode) {
            if (!type.object(inputNode)) return Promise.reject(new Error(`Cannot compile node that is not of type object!`));
            else if (!type.string(inputNode.kind)) return Promise.reject(new Error(`Cannot compile node without knowing its kind!`));
            else {
                if (this.compilers.has(inputNode.kind)) {
                    let compiler = this.compilers.get(inputNode.kind);

                    return compiler.validate(inputNode).then(() => {
                        return compiler.compile(context, inputNode, isRootNode);
                    });
                }
                else return Promise.reject(new Error(`Cannot compile node of the kind «${inputNode.kind}», there is compiler registered for this kind of node!`));
            }
        }









        /**
         * compile the actual query
         */
        , compile: function(context) { 

            // lets compile the shit!
            return this.compileNode(context, context.ast, true).then((sql) => {
                context.sql = sql;

                return Promise.resolve();
            });
        }
	});
})();

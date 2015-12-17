(function() {
    'use strict';

	let Class = require('ee-class');
	let log = require('ee-log');
	let assert = require('assert');
    let QueryContext = require('related-query-context');



	let VendorCompiler = require('./VendorCompiler');



	describe('The Compiler', function(){
		it('should not crash when instantiated', function() {
            new VendorCompiler();
        });



        it('should compile a native module', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'createDatabase'
                , database: 'test'
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal('CREATE DATABASE "test";', context.sql);
                done();
            }).catch(done);
        });
	});







    describe('Native Compilers', function(){
        it('createDatabase', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'createDatabase'
                , database: 'testDatabase'
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal('CREATE DATABASE "testDatabase";', context.sql);
                done();
            }).catch(done);
        });


        it('select', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'select'
                , selection: ['id', 'c', 'id', 'b']
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal('SELECT "id", "c", "b"', context.sql);
                done();
            }).catch(done);
        });


        it('from', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'from'
                , entity: 'testEntitiy'
                , database: 'testDatabase'
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal('FROM "testDatabase"."testEntitiy"', context.sql);
                done();
            }).catch(done);
        });


        it('function', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'function'
                , name: 'doSomethingUseful'
                , parameters: ['a', 1]
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(`"doSomethingUseful"('a', '1')`, context.sql);
                done();
            }).catch(done);
        });


        it('selectQuery', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'selectQuery'
                , select: {
                      kind: 'select'
                    , selection: ['*']
                }
                , from: {
                      kind: 'from'
                    , entity: {
                          kind: 'function'
                        , name: 'doSomethingUseful'
                        , parameters: ['a', 1]
                    }
                }
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(`SELECT "*" FROM "doSomethingUseful"('a', '1');`, context.sql);
                done();
            }).catch(done);
        });
    });
})();

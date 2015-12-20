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
                , selection: ['id', 'c', 'id', 'b', '*']
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal('SELECT "id", "c", "b", *', context.sql);
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
                assert.equal(`SELECT * FROM "doSomethingUseful"('a', '1')`, context.sql);
                done();
            }).catch(done);
        });
    });







    describe('Type Serialization', function(){
        it('string', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: 'test'
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `'test'`);
                done();
            }).catch(done);
        });


        it('number', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: 1
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `'1'`);
                done();
            }).catch(done);
        });


        it('boolean', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: true
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `'true'`);
                done();
            }).catch(done);
        });


        it('array', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: [1, false, 'hi']
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `{'1', 'false', 'hi'}`);
                done();
            }).catch(done);
        });


        it('Int8Array', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: new Int8Array(3)
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `{'0', '0', '0'}`);
                done();
            }).catch(done);
        });


        it('Float32Array', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: new Float32Array(3)
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `{'0', '0', '0'}`);
                done();
            }).catch(done);
        });


        it('object', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: {a:1}
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `'{"a":1}'`);
                done();
            }).catch(done);
        });


        it('Symbol', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: Symbol('fb')
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `'Symbol(fb)'`);
                done();
            }).catch(done);
        });


        it('Date', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: new Date(Date.UTC(1983, 9, 2, 7, 30, 28))
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `'1983-10-02T07:30:28.000Z'`);
                done();
            }).catch(done);
        });


        it('RegExp', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: /so-what/gi
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `'/so-what/gi'`);
                done();
            }).catch(done);
        });


        it('Error', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: new Error('not good!')
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `'Error: not good!'`);
                done();
            }).catch(done);
        });


        it('Null', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: null
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `NULL`);
                done();
            }).catch(done);
        });


        it('Undefined', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: undefined
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `NULL`);
                done();
            }).catch(done);
        });


        it('Buffer', function(done) {
            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: new Buffer('abc')
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `'\\x616263'`);
                done();
            }).catch(done);
        });


        it('Map', function(done) {
            let map = new Map();
            map.set(1, 'a');
            map.set('b', 2)

            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: map
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `'{"1":"a","b":2}'`);
                done();
            }).catch(done);
        });


        it('Set', function(done) {
            let set = new Set();
            set.add(1);
            set.add('b')

            let context = new QueryContext({ast: {
                  kind: 'value'
                , value: set
            }});

            new VendorCompiler().compile(context).then(() => {
                assert.equal(context.sql, `{'1', 'b'}`);
                done();
            }).catch(done);
        });
    });









})();

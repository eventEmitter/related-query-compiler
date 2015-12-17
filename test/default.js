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
            let context = new QueryContext({
                ast: {
                      kind: 'createDatabase'
                    , databaseName: 'test'
                }
            });

            new VendorCompiler().compile(context).then(() => {
                assert('CREATE DATABASE "test";' === context.sql);
                done();
            }).catch(done);
        });
	});  
})();

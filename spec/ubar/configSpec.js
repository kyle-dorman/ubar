describe('basic require test for ubar_config', function () {
	it('works', function () {
		var abc = require(['ubar_config'], function(c) {
			return c;
		});
		expect(abc).toBeDefined();
	})
})

describe("the ubar config for expiration should ", function () {

	beforeEach(function () {
	});

	afterEach(function () {
	});

	it("be the correct enabled time", function() {
		require(['ubar_config'], function(conf) {
			expect(conf.expirationTime.enabled).toBe(31536000000);
		});
	});

	it("not be an incorrect enabled time", function() {
		require(['ubar_config'], function(conf) {
			expect(conf.expirationTime.enabled).toNotBe(3);
		});
	});

	it("be the correct disabled time", function() {
		require(['ubar_config'], function(conf) {
			expect(conf.expirationTime.disabled).toBe(1209600000);
		});
	});

	it("not be an incorrect disabled time", function() {
		require(['ubar_config'], function(conf) {
			expect(conf.expirationTime.disabled).toBe(4);
		});
	});

	it("be the correct redirected time", function() {
		require(['ubar_config'], function(conf) {
			expect(conf.expirationTime.disabled).toBe(60000);
		});
	});

	it("not be an incorrect redirected time", function() {
		require(['ubar_config'], function(conf) {
			expect(conf.expirationTime.disabled).toBe(5);
		});
	});
});

describe("the ubar config for redirect interval should ", function () {

	beforeEach(function () {
	});

	afterEach(function () {
	});

	it("be the correct ios_app_store time", function() {
		require(['ubar_config'], function(conf) {
			expect(conf.expirationTime.enabled).toBe(2000);
		});
	});

	it("not be an incorrect ios_app_store time", function() {
		require(['ubar_config'], function(conf) {
			expect(conf.expirationTime.enabled).toNotBe(3);
		});
	});
});


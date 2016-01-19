'use strict';

/*global require*/
var corsProxy = require('../../lib/Core/corsProxy');

describe('corsProxy', function() {
    var originalPageIsHttps;

    beforeEach(function() {
        originalPageIsHttps = corsProxy.pageIsHttps;
        corsProxy.pageIsHttps = false;
    });

    afterEach(function() {
        corsProxy.pageIsHttps = originalPageIsHttps;
        corsProxy.proxyDomains.length = 0;
        corsProxy.corsDomains.length = 0;
    });

    it('does not proxy CORS requests', function() {
        corsProxy.proxyDomains.push('example.com');
        corsProxy.corsDomains.push('example.com');
        expect(corsProxy.shouldUseProxy('http://www.example.com/foo')).toBe(false);
    });

    it('proxies non-CORS http requests on https sites', function() {
        corsProxy.pageIsHttps = true;
        corsProxy.proxyDomains.push('example.com');
        expect(corsProxy.shouldUseProxy('http://www.example.com/foo')).toBe(true);
    });

    it('proxies CORS http requests on https sites', function() {
        corsProxy.pageIsHttps = true;
        corsProxy.proxyDomains.push('example.com');
        corsProxy.corsDomains.push('example.com');
        expect(corsProxy.shouldUseProxy('http://www.example.com/foo')).toBe(true);
    });
});

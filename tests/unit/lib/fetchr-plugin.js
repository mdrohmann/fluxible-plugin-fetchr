/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*globals describe,it,beforeEach */
"use strict";

var path = require('path');
var expect = require('chai').expect;
var fetchrPlugin = require('../../../lib/fetchr-plugin');
var FluxibleApp = require('fluxible');
var mockService = require('../../fixtures/services/test');

describe('fetchrPlugin', function () {
    var app,
        pluginInstance,
        context,
        mockReq;

    beforeEach(function () {
        mockReq = {};
        app = new FluxibleApp();
        pluginInstance = fetchrPlugin({
            xhrPath: 'custom/api'
        });
        pluginInstance.registerService(mockService);
        app.plug(pluginInstance);
        context = app.createContext({
            req: mockReq,
            xhrContext: {
                device: 'tablet'
            }
        });
    });

    describe('factory', function () {
        it('should use default xhr path', function () {
            var p = fetchrPlugin();
            expect(p.getXhrPath()).to.equal('/api');
        });
    });

    describe('actionContext', function () {
        var actionContext;
        beforeEach(function () {
            actionContext = context.getActionContext();
        });
        describe('service', function () {
            it('should have a service interface', function () {
                expect(actionContext.service).to.be.an('object');
                expect(actionContext.service.create).to.be.an('function');
                expect(actionContext.service.read).to.be.an('function');
                expect(actionContext.service.update).to.be.an('function');
                expect(actionContext.service['delete']).to.be.an('function');
            });
            describe('create', function () {
                it('should call the service\'s create method', function (done) {
                    actionContext.service.read('test', {}, {}, function (err, result) {
                        expect(result).to.equal('read');
                        expect(actionContext.getServiceMeta()).to.deep.equal([
                            {
                                headers: {
                                    'Cache-Control': 'private'
                                }
                            }
                        ]);
                        done();
                    });
                });
            });
            describe('read', function () {
                it('should call the service\'s read method', function (done) {
                    actionContext.service.create('test', {}, {}, function (err, result) {
                        expect(result).to.equal('create');
                        expect(actionContext.getServiceMeta()).to.be.empty;
                        done();
                    });
                });
            });
            describe('update', function () {
                it('should call the service\'s update method', function (done) {
                    actionContext.service.update('test', {}, {}, function (err, result) {
                        expect(result).to.equal('update');
                        expect(actionContext.getServiceMeta()).to.be.empty;
                        done();
                    });
                });
            });
            describe('delete', function () {
                it('should call the service\'s delete method', function (done) {
                    actionContext.service['delete']('test', {}, function (err, result) {
                        expect(result).to.equal('delete');
                        expect(actionContext.getServiceMeta()).to.be.empty;
                        done();
                    });
                });
            });
        });
    });

    describe('getMiddleware', function () {
        it('should return the fetchr middleware', function () {
            expect(pluginInstance.getMiddleware()).to.be.an('function');
        });
    });

    describe('dehydrate', function () {
        it('should dehydrate its state correctly', function () {
            expect(pluginInstance.dehydrate()).to.deep.equal({
                xhrPath: 'custom/api'
            });
        });
    });

    describe('rehydrate', function () {
        it('should rehydrate the state correctly', function () {
            pluginInstance.rehydrate({
                xhrPath: 'custom2/api'
            });
            expect(pluginInstance.dehydrate()).to.deep.equal({
                xhrPath: 'custom2/api'
            });
        });
    });

    describe('context level', function () {
        var actionContext;
        beforeEach(function () {
            actionContext = context.getActionContext();
        });
        it('should dehydrate / rehydrate context correctly', function () {
            var contextPlug = pluginInstance.plugContext({ xhrContext: { device: 'tablet' }});
            contextPlug.plugActionContext(actionContext);

            contextPlug.rehydrate({
                xhrContext: {
                    device: 'tablet'
                }
            });

            expect(contextPlug.dehydrate()).to.eql({
                xhrContext: {
                    device: 'tablet'
                }
            });
        });
    });

});

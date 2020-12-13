"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialiseWorkerService = exports.initialiseLauncherService = void 0;
const logger_1 = __importDefault(require("@wdio/logger"));
const initialisePlugin_1 = __importDefault(require("./initialisePlugin"));
const log = logger_1.default('@wdio/utils:initialiseServices');
function initialiseServices(services) {
    const initialisedServices = [];
    for (let [serviceName, serviceConfig = {}] of services) {
        if (typeof serviceName === 'object') {
            log.debug('initialise custom initiated service');
            initialisedServices.push([serviceName, {}]);
            continue;
        }
        if (typeof serviceName === 'function') {
            log.debug(`initialise custom service "${serviceName.name}"`);
            initialisedServices.push([serviceName, serviceConfig]);
            continue;
        }
        log.debug(`initialise service "${serviceName}" as NPM package`);
        const service = initialisePlugin_1.default(serviceName, 'service');
        initialisedServices.push([service, serviceConfig, serviceName]);
    }
    return initialisedServices;
}
function sanitizeServiceArray(service) {
    return Array.isArray(service) ? service : [service, {}];
}
function initialiseLauncherService(config, caps) {
    const ignoredWorkerServices = [];
    const launcherServices = [];
    try {
        const services = initialiseServices(config.services.map(sanitizeServiceArray));
        for (const [service, serviceConfig, serviceName] of services) {
            if (typeof service === 'object' && !serviceName) {
                launcherServices.push(service);
                continue;
            }
            const Launcher = service.launcher;
            if (typeof Launcher === 'function' && serviceName) {
                launcherServices.push(new Launcher(serviceConfig, caps, config));
            }
            if (typeof service === 'function' && !serviceName) {
                launcherServices.push(new service(serviceConfig, caps, config));
            }
            if (serviceName &&
                typeof service.default !== 'function' &&
                typeof service !== 'function') {
                ignoredWorkerServices.push(serviceName);
            }
        }
    }
    catch (err) {
        log.error(err);
    }
    return { ignoredWorkerServices, launcherServices };
}
exports.initialiseLauncherService = initialiseLauncherService;
function initialiseWorkerService(config, caps, ignoredWorkerServices = []) {
    const workerServices = config.services
        .map(sanitizeServiceArray)
        .filter(([serviceName]) => !ignoredWorkerServices.includes(serviceName));
    try {
        const services = initialiseServices(workerServices);
        return services.map(([service, serviceConfig, serviceName]) => {
            if (typeof service === 'object' && !serviceName) {
                return service;
            }
            const Service = service.default || service;
            if (typeof Service === 'function') {
                return new Service(serviceConfig, caps, config);
            }
        }).filter((service) => Boolean(service));
    }
    catch (err) {
        log.error(err);
        return [];
    }
}
exports.initialiseWorkerService = initialiseWorkerService;

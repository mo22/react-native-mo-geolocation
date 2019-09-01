import { Event } from 'mo-core';
import * as ios from './ios';
import * as android from './android';
/**
 * a geolocation result
 */
export interface GeolocationResult {
    /** timestamp in milliseconds since unix epoch */
    time: number;
    /** latitude in degrees */
    latitude: number;
    /** longitude in degrees */
    longitude: number;
    /** latitude/longitude accuracy in meters */
    locationAccuracy: number;
    /** altitude in meters */
    altitude: number;
    /** altitude accuracy in meters */
    altitudeAccuracy: number;
    /** course in degrees true north */
    course?: number;
    /** speed in meters per second */
    speed?: number;
}
/**
 * requested accuracy
 */
export declare enum GeolocationAccuracy {
    /** only update on cell tower change */
    SIGNIFICANT = 1000,
    /** low */
    LOW = 100,
    MEDIUM = 10,
    HIGH = -1,
    /** very high */
    BEST = -2
}
export declare enum GeolocationPermissionStatus {
    GRANTED = "granted",
    DENIED = "denied",
    UNKNOWN = "unknown"
}
/**
 * geolocation options
 */
export interface GeolocationOptions {
    /**
     * maximum age a cached location may have
     */
    maxAge?: number;
    timeout?: number;
    /**
     * desired accuracy
     */
    accuracy?: GeolocationAccuracy;
    background?: boolean;
    indicateBackground?: boolean;
}
/**
 * any error that occurs during geolocation
 */
export declare class GeolocationError extends Error {
}
/**
 * Geolocation class
 */
export declare class Geolocation {
    static readonly ios: typeof ios;
    static readonly android: typeof android;
    private static lastResult?;
    private static observers;
    private static subscription?;
    private static currentConfig?;
    private static verbose;
    static setVerbose(verbose: boolean): void;
    private static update;
    /**
     * get permissions
     * @TODO: unavailable?/disabled?
     */
    static getPermissionStatus(args?: {
        background?: boolean;
    }): Promise<GeolocationPermissionStatus>;
    /**
     * request permissions
     * @TODO: unavailable?/disabled?
     */
    static requestPermissions(args?: {
        background?: boolean;
    }): Promise<GeolocationPermissionStatus>;
    /**
     * request permissions
     */
    static showSettings(): void;
    /**
     * get the current location once
     * @param options GeolocationOptions
     * @returns GeolocationResult
     */
    static get(options?: GeolocationOptions): Promise<GeolocationResult>;
    /**
     * start observing the location permanently
     * @param options GeolocationOptions
     * @returns Event<GeolocationResult>
     */
    static observe(options?: GeolocationOptions): Event<GeolocationResult | Error>;
    /**
     * calculate distance between two coordinates
     * @returns distance in km
     */
    static getDistance(p1: {
        latitude: number;
        longitude: number;
    }, p2: {
        latitude: number;
        longitude: number;
    }): number;
    /**
     * calculate bearing/heading between two coordinates
     * @returns bearing in degrees
     */
    static getBearing(p1: {
        latitude: number;
        longitude: number;
    }, p2: {
        latitude: number;
        longitude: number;
    }): number;
}

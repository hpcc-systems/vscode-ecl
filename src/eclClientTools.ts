'use strict';

import fs = require('fs');
import path = require('path');

let binPathCache: { [bin: string]: string; } = {};
let runtimePathCache: { [runtime: string]: string; } = {};

export interface IExecFile {
	stderr: string[];
	stdout: string[];
}

export interface ICheckResult {
	file: string;
	line: number;
	col: number;
	msg: string;
	severity: string;
}

export function getBinPathFromEnvVar(toolName: string, envVar: string, appendBinToPath: boolean): string {
	toolName = correctBinname(toolName);
	if (process.env[envVar]) {
		let paths = process.env[envVar].split(path.delimiter);
		for (let i = 0; i < paths.length; i++) {
			let binpath = path.join(paths[i], appendBinToPath ? 'bin' : '', toolName);
			if (fs.existsSync(binpath)) {
				binPathCache[toolName] = binpath;
				return binpath;
			}
		}
	}
	return null;
}

export function getBinPath(binname: string) {
	if (binPathCache[correctBinname(binname)]) return binPathCache[correctBinname(binname)];

	// First search each ECLPATH workspace's bin folder
	let pathFromEclPath = getBinPathFromEnvVar(binname, 'ECLPATH', true);
	if (pathFromEclPath) {
		return pathFromEclPath;
	}

	// Then search PATH parts
	let pathFromPath = getBinPathFromEnvVar(binname, 'PATH', false);
	if (pathFromPath) {
		return pathFromPath;
	}

	// Finally check ECLROOT just in case
	let pathFromEclRoot = getBinPathFromEnvVar(binname, 'ECLROOT', true);
	if (pathFromEclRoot) {
		return pathFromEclRoot;
	}

	// Else return the binary name directly (this will likely always fail downstream) 
	return binname;
}

function correctBinname(binname: string) {
	if (process.platform === 'win32')
		return binname + '.exe';
	else
		return binname;
}

class Version {
	constructor() {
	}
}

function getRuntimePath(runtime: string): string {
	if (runtimePathCache[runtime]) return runtimePathCache[runtime];
	if (process.env['ECLROOT']) {
		runtimePathCache[runtime] = path.join(process.env['ECLROOT'], 'bin', correctBinname(runtime));
	} else if (process.env['PATH']) {
		let pathparts = (<string>process.env.PATH).split(path.delimiter);
		runtimePathCache[runtime] = pathparts.map(dir => path.join(dir, correctBinname(runtime))).filter(candidate => fs.existsSync(candidate))[0];
	}
	return runtimePathCache[runtime];
}

/**
 * Returns ecl binary path.
 * 
 * @return the path to the ecl binary. 
 */
export function getEclRuntimePath(): string {
	return getRuntimePath('ecl');
}

/**
 * Returns eclcc binary path.
 * 
 * @return the path to the eclcc binary. 
 */
export function getEclCCRuntimePath(): string {
	return getRuntimePath('eclcc');
}

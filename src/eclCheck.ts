'use strict';

import vscode = require('vscode');
import { locateClientTools, ICheckResult } from './serverAdapter/clientTools';
import { getCoverage } from './eclCover';
import { outputChannel } from './eclStatus';

export function check(filename: string, eclConfig: vscode.WorkspaceConfiguration): Promise<ICheckResult[]> {
	outputChannel.clear();
	return locateClientTools('', vscode.workspace.rootPath, eclConfig['includeFolders']).then((clientTools) => {
		let runningToolsPromises = [];
		if (!clientTools) {
			vscode.window.showInformationMessage('Cannot find "ecl" binary. Update PATH or ECLROOT appropriately');
			return Promise.resolve([]);
		}

		if (!!eclConfig['syntaxCheckOnSave']) {
			runningToolsPromises.push(clientTools.syntaxCheck(filename));
		}

		if (!!eclConfig['coverOnSave']) {
			runningToolsPromises.push(getCoverage(filename));
		}

		return Promise.all(runningToolsPromises).then(resultSets => [].concat.apply([], resultSets));
	});
}

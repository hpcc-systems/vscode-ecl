'use strict';

import vscode = require('vscode');
import { locateClientTools, IECLError } from './files/clientTools';
import { outputChannel } from './eclStatus';

export function check(filename: string, eclConfig: vscode.WorkspaceConfiguration): Promise<IECLError[]> {
	outputChannel.clear();
	return locateClientTools('', vscode.workspace.rootPath, eclConfig['includeFolders'], eclConfig['legacyMode']).then((clientTools) => {
		let runningToolsPromises = [];
		if (!clientTools) {
			vscode.window.showInformationMessage('Cannot find "ecl" binary. Update PATH or ECLROOT appropriately');
			return Promise.resolve([]);
		}

		if (!!eclConfig['syntaxCheckOnSave']) {
			runningToolsPromises.push(clientTools.syntaxCheck(filename));
		}

		return Promise.all(runningToolsPromises).then(resultSets => [].concat.apply([], resultSets));
	});
}

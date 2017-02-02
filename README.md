# ECL for Visual Studio Code

[![Join the chat at https://gitter.im/GordonSmith/vscode-ecl](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/GordonSmith/vscode-ecl?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.org/GordonSmith/vscode-ecl.svg?branch=master)](https://travis-ci.org/GordonSmith/vscode-ecl)

Read the [Release Notes](https://github.com/GordonSmith/vscode-ecl/wiki/Release-Notes) to know what has changed over the last few versions of this extension

This extension adds rich language support for the ECL language to VS Code, including:

- Syntax highlighting
- Auto completion
- F12 "Goto definition"
- Debugging

## Installation

- Install Visual Studio Code. 
- In VS-Code open the command palette (`cmd-shift-p`) and select `Install Extension`.  Enter 'ecl' to filter the available extensions and choose `ecl`.
- Locate and install the appropriate ECL Client Tools from [hpccsystems.com](https://hpccsystems.com/download/developer-tools/client-tools)

### VS-Code Settings

The following Visual Studio Code settings are available for the ECL extension.  These can be set in user preferences (`cmd+,`) or workspace settings (`.vscode/settings.json`):

```javascript
"ecl.syntaxCheckOnSave"	//  "Run 'eclcc -fsytnax' on save."
"ecl.includeFolders"	//  "External folders use by IMPORT"
```

#### Launch Settings

Submitting or debugging ECL using VS-Code requires specificying the target environment within the VS Code `launch.json` (pressing `F5` will prompt the user to auto create a skelleton file if none exists):

```javascript
{	//  Sample configuration  ---
	"name": "Debug-hthor",
	"type": "ecl",
	"request": "launch",
	"mode": "submit",
	"workspace": "${workspaceRoot}",
	"program": "${file}",
    "protocol": "http",
	"serverAddress": "192.168.3.22",
	"port": 8010,
	"rejectUnauthorized": false,
	"targetCluster": "hthor",
	"eclccArgs": [],
	"includeFolders": "${config.ecl.includeFolders}"
}
```

## Building and Debugging the Extension

You can set up a development environment for debugging the extension during extension development.

First make sure you do not have the extension installed in `~/.vscode/extensions`.  Then clone the repo somewhere else on your machine, run `npm install` and open a development instance of Code.

```bash
rm -rf ~/.vscode/extensions/GordonSmith.ecl
cd ~
git clone https://github.com/GordonSmith/vscode-ecl
cd vscode-ecl
npm install
code .
```

You can now go to the Debug viewlet and select `Launch Extension` then hit run (`F5`).

In the `[Extension Development Host]` instance, open your ECL folder.

You can now hit breakpoints and step through the extension.

If you make edits in the extension `.ts` files, just reload (`cmd-r`) the `[Extension Development Host]` instance of Code to load in the new extension code.  The debugging instance will automatically reattach.

To debug the debugger, see [the debugAdapter readme](src/debugAdapter/Readme.md).

## License
[Apache-2.0](LICENSE)

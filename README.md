# ECL for Visual Studio Code

Read the [Release Notes](https://github.com/hpcc-systems/vscode-ecl/releases) to know what has changed over the last few versions of this extension.

This extension adds rich language support for the ECL language to VS Code, including:

- Syntax highlighting
- Auto completion
- F7 Syntax check
- shift+F7 Syntax check all
- cmd/ctrl+F7 Syntax check clear all reported problems
- F12 "Goto definition"
- Basic workunit support
- Multi root workspaces ([vscode docs](https://code.visualstudio.com/docs/editor/multi-root-workspaces)):  No need to manually include folders.
- Debugging

## Installation

- Install Visual Studio Code. 
- In VS-Code open the command palette (`ctrl/cmd+shift+p`) and select `Install Extension`.  Enter 'ecl' to filter the available extensions and choose `ecl`.
- Locate and install the appropriate ECL Client Tools from [hpccsystems.com](https://hpccsystems.com/download/developer-tools/client-tools)

### VS-Code Settings

The following Visual Studio Code settings are available for the ECL extension.  These can be set in user preferences (`ctrl/cmd+,`) or workspace settings (`.vscode/settings.json`):

```javascript
  // Syntax check args.
  "ecl.syntaxArgs": ["-syntax"],

  // Run 'eclcc -syntax' on save.
  "ecl.syntaxCheckOnSave": true

  // Run 'eclcc -syntax' on load.
  "ecl.syntaxCheckOnLoad": true

// External folders used by IMPORT
  "ecl.includeFolders": []

  // Override eclcc auto detection
  "ecl.eclccPath": ""

  // Add '-legacy' arguement to eclcc.
  "ecl.legacyMode": false

  // Open workunits in external browser.
  "ecl.WUOpenExternal": true

  // Automatically open WU in browser on creation.
  "ecl.WUAutoOpen": false

  // Debug logging.
  "ecl.debugLogging": false
  
```

#### Launch Settings

Submitting or debugging ECL using VS-Code requires specifiying the target environment within the VS Code `launch.json` (pressing `F5` will prompt you to auto create a skeleton file if none exists):

```javascript
{
    "name": "localhost-hthor",
    "type": "ecl",
    "request": "launch",
    "mode": "submit",
    "workspace": "${workspaceRoot}",
    "program": "${file}",
    "protocol": "http",
    "serverAddress": "localhost",
    "port": 8010,
    "rejectUnauthorized": false,
    "targetCluster": "hthor",
    "eclccPath": "${config:ecl.eclccPath}",
    "eclccArgs": [],
    "includeFolders": "${config:ecl.includeFolders}",
    "legacyMode": "${config:ecl.legacyMode}",
    "resultLimit": 100,
    "user": "",
    "password": ""
}
```

## Building and Debugging the Extension

You can set up a development environment for debugging the extension during extension development.

First make sure you do not have the extension installed in `~/.vscode/extensions`.  Then clone the repo somewhere else on your machine, run `npm install` and open a development instance of Code.

```bash
rm -rf ~/.vscode/extensions/GordonSmith.ecl
cd ~
git clone https://github.com/hpcc-systems/vscode-ecl
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

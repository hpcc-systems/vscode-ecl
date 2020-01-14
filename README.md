# ECL for Visual Studio Code
_For list of latest changes, please see the  [Change Log](https://github.com/hpcc-systems/vscode-ecl/blob/master/CHANGELOG.md) at the main [GitHub](https://github.com/hpcc-systems/vscode-ecl) repository._

This extension adds rich language support for [HPCC Systems](https://hpccsystems.com/) [ECL language](https://hpccsystems.com/training/documentation/ecl-language-reference/html) (for the [HPCC-Platform](https://github.com/hpcc-systems/HPCC-Platform)) to VS Code, including:

* Syntax highlighting
* Auto completion
* Client tools discovery and integration
* HPCC-Platform server support

## Installation

* Install Visual Studio Code. 
* In VS-Code, open the command palette (`ctrl/cmd + shift + p`) and select `Install Extension`.  Enter `ecl` to filter the available extensions and choose `ECL Language by HPCC Systems`.
* Locate and install the appropriate ECL Client Tools from [hpccsystems.com](https://hpccsystems.com/download/archive)

## VS-Code Settings

The following Visual Studio Code settings are available for the ECL extension.  These can be set in user preferences (`ctrl/cmd + ,`) or directly in your current workspace (`.vscode/settings.json`):

```javascript

  // eclcc syntax check arguments.
  "ecl.syntaxArgs": ["-syntax"],

  // Run 'eclcc -syntax' on save.
  "ecl.syntaxCheckOnSave": true

  // Run 'eclcc -syntax' on load.
  "ecl.syntaxCheckOnLoad": true

  // Additional folders to use when resolving IMPORT statements.
  "ecl.includeFolders": []

  // Override eclcc auto detection.
  "ecl.eclccPath": ""

  // Add '-legacy' argument to eclcc.
  "ecl.legacyMode": false

  // Open Workunits in external browser.
  "ecl.WUOpenExternal": true

  // Automatically open Workunits on creation.
  "ecl.WUAutoOpen": false

  // Debug level logging (requires restart).
  "ecl.debugLogging": false
  
```

## Launch Settings

Submitting ECL using VS-Code requires specifying the target environment within the VS Code `launch.json` (pressing `F5` will prompt you to auto create a skeleton file if none exists):

```javascript
// Default ECL Launch Configuration
{
  "name": "play-hthor-submit",
  "type": "ecl",
  "request": "launch",
  "mode": "submit",
  "workspace": "${workspaceRoot}",
  "program": "${file}",
  "protocol": "https",
  "serverAddress": "play.hpccsystems.com",
  "port": 18010,
  "rejectUnauthorized": false,
  "targetCluster": "hthor",
  "eclccPath": "${config:ecl.eclccPath}",
  "eclccArgs": [],
  "includeFolders": "${config:ecl.includeFolders}",
  "legacyMode": "${config:ecl.legacyMode}",
  "resultLimit": 100,
  "user": "vscode_user",
  "password": ""
}
```

## ECL Commands

The following ECL specific commands are available.  Note:  These commands will **not** be active until an ECL file has been opened (as this triggers the extension to load).  To activate a command either use its associated hotkey or press `ctrl/cmd + shift + p` and type `ECL` this will present a filtered list of the ECL specific commands:

### Global:

* Syntax Check all files **[shift + F7]** - _Save All + check syntax of all files._
* Syntax Clear **[ctrl + F7]** - _Clear all previously reported ECL Syntax Check results._
* Language Reference Website - _Opens the ECL language reference website in external browser._
* Command Prompt - _Opens ECL Client Tools Terminal Session._

### Within the ECL Code Editor:

* Syntax Check **[F7]** - _Save + check syntax of current file._
* Language Reference Lookup **[shift + F1]** - _For the currently selected text, search the online ECL language reference._

### Within the ECL Activity Pane:
_Right click on item_

* Workunit Details - _Opens ECL Watch Workunit Details for the selected Workunit._

### Within the Status Bar
_Click on ECL Client Tools Version_

* Select Client Tools Version: Select Client Tools Version from available options.

## Building and Debugging the Extension

To set up a development environment for debugging the ECL for VS Code extension:

```bash
cd /Some/Dev/Folder/
git clone https://github.com/hpcc-systems/vscode-ecl
cd vscode-ecl
npm install
```

At which point you can open the `vscode-ecl` folder within VS Code.  

Next start the background build process by running the following command within a terminal session:

```bash
npm run watch
```

At which point you can edit the sources and launch debug sessions via **F5** and included launch configurations.

## License
[Apache-2.0](LICENSE)

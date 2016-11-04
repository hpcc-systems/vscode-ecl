# ECL for Visual Studio Code

[![Join the chat at https://gitter.im/hpcc-systems/vscode-ecl](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/hpcc-systems/vscode-ecl?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Build Status](https://travis-ci.org/hpcc-systems/vscode-ecl.svg?branch=master)](https://travis-ci.org/hpcc-systems/vscode-ecl)

Read the [Release Notes](https://github.com/hpcc-systems/vscode-ecl/wiki/Release-Notes) to know what has changed over the last few versions of this extension

This extension adds rich language support for the ECL language to VS Code, including:

- ...todo...

## Using

First, you will need to install Visual Studio Code. Then, in the command palette (`cmd-shift-p`) select `Install Extension` and choose `ECL`.

Next you will need to have installed the client tools from hpccsystems.com

### Options

The following Visual Studio Code settings are available for the ECL extension.  These can be set in user preferences (`cmd+,`) or workspace settings (`.vscode/settings.json`).

```javascript
{
	...todo...
}
```

#### Remote Debugging

To remote debug using VS Code create a remote debug configuration in VS Code `launch.json`.

```json
{
	...todo...
}
```

## Building and Debugging the Extension

You can set up a development environment for debugging the extension during extension development.

First make sure you do not have the extension installed in `~/.vscode/extensions`.  Then clone the repo somewhere else on your machine, run `npm install` and open a development instance of Code.

```bash
rm -rf ~/.vscode/extensions/hpccsystems.ecl
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

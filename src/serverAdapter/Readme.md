# ECL Debug Adapter

This code runs in a seperate Node process spawned by Code when launch the 'ecl' type in the Code debugger.

## Debugging the debugger

The ideal setup involves three instances of Code:

1. Open the `vscode-ecl` folder in one instance.  Choose the `Launch Extension` debug target and hit F5 to launch a second instance.
2. In the second instance, open the ECL application you'd like to test against.  In that instance, create a new ECL debug target pointing at the program you want to debug, and add `"debugServer": 4711` in the root of the configuration.
3. Open another instance of Code on the `vscode-ecl/src/serverAdapter` folder.  In that instance hit F5 to launch the debug adapter in server mode under the debugger.
4. ECL back to the second instance and hit F5 to debug your ECL code.  Debuggers from the other two Code windows are attached to the ECL debug adapter and the ECL language integation respectively, so you can set breakpoints, step through code and inspect state as needed. 
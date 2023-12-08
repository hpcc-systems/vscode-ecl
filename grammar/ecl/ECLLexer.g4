lexer grammar ECLLexer;

channels {
	WS_CHANNEL
}

WS: [ t]+ -> channel(WS_CHANNEL);
NL: ('rn' | 'r' | 'n') -> channel(WS_CHANNEL);

//  Calc  ---------------------------------------------

INPUT_KW: 'input';
OUTPUT_KW: 'output';

NUMBER_LIT: ('0' | [1-9][0-9]*) ('.' [0-9]+)?;

ID: [a-zA-Z][a-zA-Z0-9_]*;

LPAREN: '(';
RPAREN: ')';
EQUAL: '=';
MINUS: '-';
PLUS: '+';
MUL: '*';
DIV: '/';

UNRECOGNIZED: .;

//  ECL  ---------------------------------------------

LETTER: [a-zA-Z];
DIGIT: [0-9];
BINDIGIT: [0-1];
HEXDIGIT: [a-fA-F0-9];
ALPHANUM: [a-zA-Z$0-9];
ALPHANUMCOLON: [a-zA-Z$0-9:@];
BLANK: [ \t\r];
SLASH: [/];
STAR: [*];
PERCENT: [%];
LCURLY: [{];
RCURLY: [}];
DOT: [.];
HEXPAIRS: (HEXDIGIT HEXDIGIT)+;
ERR_HEXPAIRS: HEXDIGIT (HEXDIGIT HEXDIGIT)*;
XPATHSEQ: ([^}\r\n])+;
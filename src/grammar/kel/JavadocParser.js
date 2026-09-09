// Generated from ./JavadocParser.g4 by ANTLR 4.13.2
// jshint ignore: start
import antlr4 from 'antlr4';
import JavadocParserListener from './JavadocParserListener.js';
import JavadocParserVisitor from './JavadocParserVisitor.js';

const serializedATN = [4,1,40,148,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,
4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,1,0,3,0,22,8,0,1,0,5,0,25,8,0,
10,0,12,0,28,9,0,1,0,1,0,1,1,4,1,33,8,1,11,1,12,1,34,1,1,1,1,5,1,39,8,1,
10,1,12,1,42,9,1,3,1,44,8,1,1,2,5,2,47,8,2,10,2,12,2,50,9,2,1,2,1,2,4,2,
54,8,2,11,2,12,2,55,1,2,5,2,59,8,2,10,2,12,2,62,9,2,1,2,5,2,65,8,2,10,2,
12,2,68,9,2,1,3,5,3,71,8,3,10,3,12,3,74,9,3,1,3,5,3,77,8,3,10,3,12,3,80,
9,3,1,3,1,3,4,3,84,8,3,11,3,12,3,85,1,3,4,3,89,8,3,11,3,12,3,90,1,3,3,3,
94,8,3,4,3,96,8,3,11,3,12,3,97,1,4,1,4,4,4,102,8,4,11,4,12,4,103,3,4,106,
8,4,1,5,1,5,1,6,1,6,1,6,5,6,113,8,6,10,6,12,6,116,9,6,1,6,3,6,119,8,6,1,
7,1,7,1,7,1,7,1,7,1,7,3,7,127,8,7,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,3,
8,138,8,8,1,9,1,9,1,9,1,9,1,9,1,9,3,9,146,8,9,1,9,9,26,48,60,66,72,78,90,
93,97,0,10,0,2,4,6,8,10,12,14,16,18,0,5,2,0,3,3,14,14,1,0,3,4,3,0,3,3,14,
14,27,27,3,0,8,8,14,15,26,26,2,0,1,1,15,15,172,0,21,1,0,0,0,2,43,1,0,0,0,
4,48,1,0,0,0,6,72,1,0,0,0,8,105,1,0,0,0,10,107,1,0,0,0,12,118,1,0,0,0,14,
126,1,0,0,0,16,137,1,0,0,0,18,145,1,0,0,0,20,22,3,2,1,0,21,20,1,0,0,0,21,
22,1,0,0,0,22,26,1,0,0,0,23,25,7,0,0,0,24,23,1,0,0,0,25,28,1,0,0,0,26,27,
1,0,0,0,26,24,1,0,0,0,27,29,1,0,0,0,28,26,1,0,0,0,29,30,5,0,0,1,30,1,1,0,
0,0,31,33,3,6,3,0,32,31,1,0,0,0,33,34,1,0,0,0,34,32,1,0,0,0,34,35,1,0,0,
0,35,44,1,0,0,0,36,40,3,4,2,0,37,39,3,6,3,0,38,37,1,0,0,0,39,42,1,0,0,0,
40,38,1,0,0,0,40,41,1,0,0,0,41,44,1,0,0,0,42,40,1,0,0,0,43,32,1,0,0,0,43,
36,1,0,0,0,44,3,1,0,0,0,45,47,7,1,0,0,46,45,1,0,0,0,47,50,1,0,0,0,48,49,
1,0,0,0,48,46,1,0,0,0,49,51,1,0,0,0,50,48,1,0,0,0,51,60,5,7,0,0,52,54,7,
1,0,0,53,52,1,0,0,0,54,55,1,0,0,0,55,53,1,0,0,0,55,56,1,0,0,0,56,57,1,0,
0,0,57,59,5,7,0,0,58,53,1,0,0,0,59,62,1,0,0,0,60,61,1,0,0,0,60,58,1,0,0,
0,61,66,1,0,0,0,62,60,1,0,0,0,63,65,7,1,0,0,64,63,1,0,0,0,65,68,1,0,0,0,
66,67,1,0,0,0,66,64,1,0,0,0,67,5,1,0,0,0,68,66,1,0,0,0,69,71,5,3,0,0,70,
69,1,0,0,0,71,74,1,0,0,0,72,73,1,0,0,0,72,70,1,0,0,0,73,78,1,0,0,0,74,72,
1,0,0,0,75,77,5,14,0,0,76,75,1,0,0,0,77,80,1,0,0,0,78,79,1,0,0,0,78,76,1,
0,0,0,79,81,1,0,0,0,80,78,1,0,0,0,81,95,3,10,5,0,82,84,7,2,0,0,83,82,1,0,
0,0,84,85,1,0,0,0,85,83,1,0,0,0,85,86,1,0,0,0,86,87,1,0,0,0,87,89,3,8,4,
0,88,83,1,0,0,0,89,90,1,0,0,0,90,91,1,0,0,0,90,88,1,0,0,0,91,93,1,0,0,0,
92,94,5,26,0,0,93,94,1,0,0,0,93,92,1,0,0,0,94,96,1,0,0,0,95,88,1,0,0,0,96,
97,1,0,0,0,97,98,1,0,0,0,97,95,1,0,0,0,98,7,1,0,0,0,99,106,3,12,6,0,100,
102,8,3,0,0,101,100,1,0,0,0,102,103,1,0,0,0,103,101,1,0,0,0,103,104,1,0,
0,0,104,106,1,0,0,0,105,99,1,0,0,0,105,101,1,0,0,0,106,9,1,0,0,0,107,108,
7,4,0,0,108,11,1,0,0,0,109,119,3,14,7,0,110,114,5,9,0,0,111,113,5,14,0,0,
112,111,1,0,0,0,113,116,1,0,0,0,114,112,1,0,0,0,114,115,1,0,0,0,115,117,
1,0,0,0,116,114,1,0,0,0,117,119,5,10,0,0,118,109,1,0,0,0,118,110,1,0,0,0,
119,13,1,0,0,0,120,127,5,23,0,0,121,127,3,18,9,0,122,127,5,11,0,0,123,127,
5,12,0,0,124,127,5,24,0,0,125,127,3,16,8,0,126,120,1,0,0,0,126,121,1,0,0,
0,126,122,1,0,0,0,126,123,1,0,0,0,126,124,1,0,0,0,126,125,1,0,0,0,127,15,
1,0,0,0,128,138,5,19,0,0,129,130,5,29,0,0,130,138,5,19,0,0,131,138,5,20,
0,0,132,138,5,21,0,0,133,138,5,36,0,0,134,138,5,34,0,0,135,138,5,35,0,0,
136,138,5,37,0,0,137,128,1,0,0,0,137,129,1,0,0,0,137,131,1,0,0,0,137,132,
1,0,0,0,137,133,1,0,0,0,137,134,1,0,0,0,137,135,1,0,0,0,137,136,1,0,0,0,
138,17,1,0,0,0,139,146,5,22,0,0,140,141,5,29,0,0,141,146,5,22,0,0,142,146,
5,38,0,0,143,146,5,39,0,0,144,146,5,40,0,0,145,139,1,0,0,0,145,140,1,0,0,
0,145,142,1,0,0,0,145,143,1,0,0,0,145,144,1,0,0,0,146,19,1,0,0,0,22,21,26,
34,40,43,48,55,60,66,72,78,85,90,93,97,103,105,114,118,126,137,145];


const atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

const decisionsToDFA = atn.decisionToState.map( (ds, index) => new antlr4.dfa.DFA(ds, index) );

const sharedContextCache = new antlr4.atn.PredictionContextCache();

export default class JavadocParser extends antlr4.Parser {

    static grammarFileName = "JavadocParser.g4";
    static literalNames = [ null, null, null, null, null, null, null, null, 
                            null, "'['", "']'", "'TRUE'", "'FALSE'", null, 
                            null, null, "'>'", "'<='", "'%'", null, null, 
                            null, null, null, null, null, "'.'", "','", 
                            null, "'-'", "'_'", "'/'", "'\\'", "'*'" ];
    static symbolicNames = [ null, "JDD_TAG_ESC", "JDD_AT", "JDD_WS", "JDD_NEWLINE", 
                             "JDD_UNi_NEWLINE", "JDD_UNI_CRLF", "JDD_WORD", 
                             "JDT_AT", "JDT_LSQUARE", "JDT_RSQUARE", "JDT_TRUE", 
                             "JDT_FALSE", "JDT_NEWLINE", "JDT_WS", "JDT_TAG", 
                             "JDT_LOWERPTILE", "JDT_UPPERPTILE", "JDT_PERC", 
                             "JDT_INT", "JDT_HEXINT", "JDT_BININT", "JDT_REAL", 
                             "JDT_STR", "JDT_TYPDCONST", "JDT_ESC", "JDT_DOT", 
                             "JDT_COMMA", "JDT_ID", "JDT_HYPHEN", "JDT_UNDER", 
                             "JDT_FORWARDSLASH", "JDT_BACKSLASH", "JDT_STAR", 
                             "BAD_JDT_BIN", "JDT_HEX_NO_X", "BAD_JDT_HEX", 
                             "BAD_JDT_MIX", "BAD_JDT_REAL_A", "BAD_JDT_REAL_B", 
                             "BAD_JDT_REAL_C" ];
    static ruleNames = [ "javadoc", "javadocStatement", "javadocDescription", 
                         "javadocProperty", "javadocTagValue", "javadocTag", 
                         "javadocConstant", "javadocSimpleConstant", "javadocIntConstant", 
                         "javadocRealConstant" ];

    constructor(input) {
        super(input);
        this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
        this.ruleNames = JavadocParser.ruleNames;
        this.literalNames = JavadocParser.literalNames;
        this.symbolicNames = JavadocParser.symbolicNames;
    }



	javadoc() {
	    let localctx = new JavadocContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 0, JavadocParser.RULE_javadoc);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 21;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
	        if(la_===1) {
	            this.state = 20;
	            localctx.content = this.javadocStatement();

	        }
	        this.state = 26;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,1,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 23;
	                _la = this._input.LA(1);
	                if(!(_la===3 || _la===14)) {
	                this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                } 
	            }
	            this.state = 28;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,1,this._ctx);
	        }

	        this.state = 29;
	        this.match(JavadocParser.EOF);
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	javadocStatement() {
	    let localctx = new JavadocStatementContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 2, JavadocParser.RULE_javadocStatement);
	    try {
	        this.state = 43;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,4,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new JavadocNoDescriptionContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 32; 
	            this._errHandler.sync(this);
	            var _alt = 1;
	            do {
	            	switch (_alt) {
	            	case 1:
	            		this.state = 31;
	            		this.javadocProperty();
	            		break;
	            	default:
	            		throw new antlr4.error.NoViableAltException(this);
	            	}
	            	this.state = 34; 
	            	this._errHandler.sync(this);
	            	_alt = this._interp.adaptivePredict(this._input,2, this._ctx);
	            } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
	            break;

	        case 2:
	            localctx = new JavadocWithDescriptionContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 36;
	            localctx.description = this.javadocDescription();
	            this.state = 40;
	            this._errHandler.sync(this);
	            var _alt = this._interp.adaptivePredict(this._input,3,this._ctx)
	            while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	                if(_alt===1) {
	                    this.state = 37;
	                    this.javadocProperty(); 
	                }
	                this.state = 42;
	                this._errHandler.sync(this);
	                _alt = this._interp.adaptivePredict(this._input,3,this._ctx);
	            }

	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	javadocDescription() {
	    let localctx = new JavadocDescriptionContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 4, JavadocParser.RULE_javadocDescription);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 48;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,5,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 45;
	                _la = this._input.LA(1);
	                if(!(_la===3 || _la===4)) {
	                this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                } 
	            }
	            this.state = 50;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,5,this._ctx);
	        }

	        this.state = 51;
	        this.match(JavadocParser.JDD_WORD);
	        this.state = 60;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,7,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 53; 
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	                do {
	                    this.state = 52;
	                    _la = this._input.LA(1);
	                    if(!(_la===3 || _la===4)) {
	                    this._errHandler.recoverInline(this);
	                    }
	                    else {
	                    	this._errHandler.reportMatch(this);
	                        this.consume();
	                    }
	                    this.state = 55; 
	                    this._errHandler.sync(this);
	                    _la = this._input.LA(1);
	                } while(_la===3 || _la===4);
	                this.state = 57;
	                this.match(JavadocParser.JDD_WORD); 
	            }
	            this.state = 62;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,7,this._ctx);
	        }

	        this.state = 66;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,8,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 63;
	                _la = this._input.LA(1);
	                if(!(_la===3 || _la===4)) {
	                this._errHandler.recoverInline(this);
	                }
	                else {
	                	this._errHandler.reportMatch(this);
	                    this.consume();
	                } 
	            }
	            this.state = 68;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,8,this._ctx);
	        }

	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	javadocProperty() {
	    let localctx = new JavadocPropertyContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 6, JavadocParser.RULE_javadocProperty);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 72;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,9,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 69;
	                this.match(JavadocParser.JDD_WS); 
	            }
	            this.state = 74;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,9,this._ctx);
	        }

	        this.state = 78;
	        this._errHandler.sync(this);
	        var _alt = this._interp.adaptivePredict(this._input,10,this._ctx)
	        while(_alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
	            if(_alt===1+1) {
	                this.state = 75;
	                this.match(JavadocParser.JDT_WS); 
	            }
	            this.state = 80;
	            this._errHandler.sync(this);
	            _alt = this._interp.adaptivePredict(this._input,10,this._ctx);
	        }

	        this.state = 81;
	        this.javadocTag();
	        this.state = 95; 
	        this._errHandler.sync(this);
	        var _alt = 1+1;
	        do {
	        	switch (_alt) {
	        	case 1+1:
	        		this.state = 88; 
	        		this._errHandler.sync(this);
	        		var _alt = 1+1;
	        		do {
	        			switch (_alt) {
	        			case 1+1:
	        				this.state = 83; 
	        				this._errHandler.sync(this);
	        				var _alt = 1;
	        				do {
	        					switch (_alt) {
	        					case 1:
	        						this.state = 82;
	        						_la = this._input.LA(1);
	        						if(!((((_la) & ~0x1f) === 0 && ((1 << _la) & 134234120) !== 0))) {
	        						this._errHandler.recoverInline(this);
	        						}
	        						else {
	        							this._errHandler.reportMatch(this);
	        						    this.consume();
	        						}
	        						break;
	        					default:
	        						throw new antlr4.error.NoViableAltException(this);
	        					}
	        					this.state = 85; 
	        					this._errHandler.sync(this);
	        					_alt = this._interp.adaptivePredict(this._input,11, this._ctx);
	        				} while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
	        				this.state = 87;
	        				localctx.value = this.javadocTagValue();
	        				break;
	        			default:
	        				throw new antlr4.error.NoViableAltException(this);
	        			}
	        			this.state = 90; 
	        			this._errHandler.sync(this);
	        			_alt = this._interp.adaptivePredict(this._input,12, this._ctx);
	        		} while ( _alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
	        		this.state = 93;
	        		this._errHandler.sync(this);
	        		var la_ = this._interp.adaptivePredict(this._input,13,this._ctx);
	        		if(la_===1+1) {
	        		    this.state = 92;
	        		    this.match(JavadocParser.JDT_DOT);

	        		}
	        		break;
	        	default:
	        		throw new antlr4.error.NoViableAltException(this);
	        	}
	        	this.state = 97; 
	        	this._errHandler.sync(this);
	        	_alt = this._interp.adaptivePredict(this._input,14, this._ctx);
	        } while ( _alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	javadocTagValue() {
	    let localctx = new JavadocTagValueContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 8, JavadocParser.RULE_javadocTagValue);
	    var _la = 0;
	    try {
	        this.state = 105;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,16,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new JavadocTagConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 99;
	            localctx.c = this.javadocConstant();
	            break;

	        case 2:
	            localctx = new JavadocTagTextContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 101; 
	            this._errHandler.sync(this);
	            var _alt = 1;
	            do {
	            	switch (_alt) {
	            	case 1:
	            		this.state = 100;
	            		_la = this._input.LA(1);
	            		if(_la<=0 || (((_la) & ~0x1f) === 0 && ((1 << _la) & 67158272) !== 0)) {
	            		this._errHandler.recoverInline(this);
	            		}
	            		else {
	            			this._errHandler.reportMatch(this);
	            		    this.consume();
	            		}
	            		break;
	            	default:
	            		throw new antlr4.error.NoViableAltException(this);
	            	}
	            	this.state = 103; 
	            	this._errHandler.sync(this);
	            	_alt = this._interp.adaptivePredict(this._input,15, this._ctx);
	            } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	javadocTag() {
	    let localctx = new JavadocTagContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 10, JavadocParser.RULE_javadocTag);
	    var _la = 0;
	    try {
	        this.enterOuterAlt(localctx, 1);
	        this.state = 107;
	        _la = this._input.LA(1);
	        if(!(_la===1 || _la===15)) {
	        this._errHandler.recoverInline(this);
	        }
	        else {
	        	this._errHandler.reportMatch(this);
	            this.consume();
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	javadocConstant() {
	    let localctx = new JavadocConstantContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 12, JavadocParser.RULE_javadocConstant);
	    var _la = 0;
	    try {
	        this.state = 118;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 11:
	        case 12:
	        case 19:
	        case 20:
	        case 21:
	        case 22:
	        case 23:
	        case 24:
	        case 29:
	        case 34:
	        case 35:
	        case 36:
	        case 37:
	        case 38:
	        case 39:
	        case 40:
	            localctx = new NonSetJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 109;
	            localctx.c = this.javadocSimpleConstant();
	            break;
	        case 9:
	            localctx = new EmptySetJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 110;
	            localctx.c = this.match(JavadocParser.JDT_LSQUARE);
	            this.state = 114;
	            this._errHandler.sync(this);
	            _la = this._input.LA(1);
	            while(_la===14) {
	                this.state = 111;
	                this.match(JavadocParser.JDT_WS);
	                this.state = 116;
	                this._errHandler.sync(this);
	                _la = this._input.LA(1);
	            }
	            this.state = 117;
	            this.match(JavadocParser.JDT_RSQUARE);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	javadocSimpleConstant() {
	    let localctx = new JavadocSimpleConstantContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 14, JavadocParser.RULE_javadocSimpleConstant);
	    try {
	        this.state = 126;
	        this._errHandler.sync(this);
	        var la_ = this._interp.adaptivePredict(this._input,19,this._ctx);
	        switch(la_) {
	        case 1:
	            localctx = new StringJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 120;
	            localctx.s = this.match(JavadocParser.JDT_STR);
	            break;

	        case 2:
	            localctx = new RealJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 121;
	            localctx.r = this.javadocRealConstant();
	            break;

	        case 3:
	            localctx = new TrueJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 122;
	            localctx.b = this.match(JavadocParser.JDT_TRUE);
	            break;

	        case 4:
	            localctx = new FalseJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 123;
	            localctx.b = this.match(JavadocParser.JDT_FALSE);
	            break;

	        case 5:
	            localctx = new TypedJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 124;
	            localctx.t = this.match(JavadocParser.JDT_TYPDCONST);
	            break;

	        case 6:
	            localctx = new GeneralIntJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 125;
	            localctx.i = this.javadocIntConstant();
	            break;

	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	javadocIntConstant() {
	    let localctx = new JavadocIntConstantContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 16, JavadocParser.RULE_javadocIntConstant);
	    try {
	        this.state = 137;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 19:
	            localctx = new DecIntJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 128;
	            localctx.i = this.match(JavadocParser.JDT_INT);
	            break;
	        case 29:
	            localctx = new NegIntJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 129;
	            this.match(JavadocParser.JDT_HYPHEN);
	            this.state = 130;
	            localctx.i = this.match(JavadocParser.JDT_INT);
	            break;
	        case 20:
	            localctx = new HexJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 131;
	            localctx.i = this.match(JavadocParser.JDT_HEXINT);
	            break;
	        case 21:
	            localctx = new BinJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 132;
	            localctx.i = this.match(JavadocParser.JDT_BININT);
	            break;
	        case 36:
	            localctx = new BadHexJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 133;
	            localctx.i = this.match(JavadocParser.BAD_JDT_HEX);
	            break;
	        case 34:
	            localctx = new BadBinJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 6);
	            this.state = 134;
	            localctx.i = this.match(JavadocParser.BAD_JDT_BIN);
	            break;
	        case 35:
	            localctx = new NoFlagHexJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 7);
	            this.state = 135;
	            localctx.i = this.match(JavadocParser.JDT_HEX_NO_X);
	            break;
	        case 37:
	            localctx = new BadMixJDConstantContext(this, localctx);
	            this.enterOuterAlt(localctx, 8);
	            this.state = 136;
	            localctx.i = this.match(JavadocParser.BAD_JDT_MIX);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}



	javadocRealConstant() {
	    let localctx = new JavadocRealConstantContext(this, this._ctx, this.state);
	    this.enterRule(localctx, 18, JavadocParser.RULE_javadocRealConstant);
	    try {
	        this.state = 145;
	        this._errHandler.sync(this);
	        switch(this._input.LA(1)) {
	        case 22:
	            localctx = new JavadocRealConstContext(this, localctx);
	            this.enterOuterAlt(localctx, 1);
	            this.state = 139;
	            localctx.r = this.match(JavadocParser.JDT_REAL);
	            break;
	        case 29:
	            localctx = new JavadocRealConstContext(this, localctx);
	            this.enterOuterAlt(localctx, 2);
	            this.state = 140;
	            this.match(JavadocParser.JDT_HYPHEN);
	            this.state = 141;
	            localctx.r = this.match(JavadocParser.JDT_REAL);
	            break;
	        case 38:
	            localctx = new JavadocBadRealConstContext(this, localctx);
	            this.enterOuterAlt(localctx, 3);
	            this.state = 142;
	            localctx.r = this.match(JavadocParser.BAD_JDT_REAL_A);
	            break;
	        case 39:
	            localctx = new JavadocBadRealConstContext(this, localctx);
	            this.enterOuterAlt(localctx, 4);
	            this.state = 143;
	            localctx.r = this.match(JavadocParser.BAD_JDT_REAL_B);
	            break;
	        case 40:
	            localctx = new JavadocBadRealConstContext(this, localctx);
	            this.enterOuterAlt(localctx, 5);
	            this.state = 144;
	            localctx.r = this.match(JavadocParser.BAD_JDT_REAL_C);
	            break;
	        default:
	            throw new antlr4.error.NoViableAltException(this);
	        }
	    } catch (re) {
	    	if(re instanceof antlr4.error.RecognitionException) {
		        localctx.exception = re;
		        this._errHandler.reportError(this, re);
		        this._errHandler.recover(this, re);
		    } else {
		    	throw re;
		    }
	    } finally {
	        this.exitRule();
	    }
	    return localctx;
	}


}

JavadocParser.EOF = antlr4.Token.EOF;
JavadocParser.JDD_TAG_ESC = 1;
JavadocParser.JDD_AT = 2;
JavadocParser.JDD_WS = 3;
JavadocParser.JDD_NEWLINE = 4;
JavadocParser.JDD_UNi_NEWLINE = 5;
JavadocParser.JDD_UNI_CRLF = 6;
JavadocParser.JDD_WORD = 7;
JavadocParser.JDT_AT = 8;
JavadocParser.JDT_LSQUARE = 9;
JavadocParser.JDT_RSQUARE = 10;
JavadocParser.JDT_TRUE = 11;
JavadocParser.JDT_FALSE = 12;
JavadocParser.JDT_NEWLINE = 13;
JavadocParser.JDT_WS = 14;
JavadocParser.JDT_TAG = 15;
JavadocParser.JDT_LOWERPTILE = 16;
JavadocParser.JDT_UPPERPTILE = 17;
JavadocParser.JDT_PERC = 18;
JavadocParser.JDT_INT = 19;
JavadocParser.JDT_HEXINT = 20;
JavadocParser.JDT_BININT = 21;
JavadocParser.JDT_REAL = 22;
JavadocParser.JDT_STR = 23;
JavadocParser.JDT_TYPDCONST = 24;
JavadocParser.JDT_ESC = 25;
JavadocParser.JDT_DOT = 26;
JavadocParser.JDT_COMMA = 27;
JavadocParser.JDT_ID = 28;
JavadocParser.JDT_HYPHEN = 29;
JavadocParser.JDT_UNDER = 30;
JavadocParser.JDT_FORWARDSLASH = 31;
JavadocParser.JDT_BACKSLASH = 32;
JavadocParser.JDT_STAR = 33;
JavadocParser.BAD_JDT_BIN = 34;
JavadocParser.JDT_HEX_NO_X = 35;
JavadocParser.BAD_JDT_HEX = 36;
JavadocParser.BAD_JDT_MIX = 37;
JavadocParser.BAD_JDT_REAL_A = 38;
JavadocParser.BAD_JDT_REAL_B = 39;
JavadocParser.BAD_JDT_REAL_C = 40;

JavadocParser.RULE_javadoc = 0;
JavadocParser.RULE_javadocStatement = 1;
JavadocParser.RULE_javadocDescription = 2;
JavadocParser.RULE_javadocProperty = 3;
JavadocParser.RULE_javadocTagValue = 4;
JavadocParser.RULE_javadocTag = 5;
JavadocParser.RULE_javadocConstant = 6;
JavadocParser.RULE_javadocSimpleConstant = 7;
JavadocParser.RULE_javadocIntConstant = 8;
JavadocParser.RULE_javadocRealConstant = 9;

class JavadocContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JavadocParser.RULE_javadoc;
        this.content = null;
    }

	EOF() {
	    return this.getToken(JavadocParser.EOF, 0);
	};

	javadocStatement() {
	    return this.getTypedRuleContext(JavadocStatementContext,0);
	};

	JDD_WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDD_WS);
	    } else {
	        return this.getToken(JavadocParser.JDD_WS, i);
	    }
	};


	JDT_WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDT_WS);
	    } else {
	        return this.getToken(JavadocParser.JDT_WS, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterJavadoc(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitJavadoc(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitJavadoc(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class JavadocStatementContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JavadocParser.RULE_javadocStatement;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class JavadocNoDescriptionContext extends JavadocStatementContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	javadocProperty = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(JavadocPropertyContext);
	    } else {
	        return this.getTypedRuleContext(JavadocPropertyContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterJavadocNoDescription(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitJavadocNoDescription(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitJavadocNoDescription(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.JavadocNoDescriptionContext = JavadocNoDescriptionContext;

class JavadocWithDescriptionContext extends JavadocStatementContext {

    constructor(parser, ctx) {
        super(parser);
        this.description = null;;
        super.copyFrom(ctx);
    }

	javadocDescription() {
	    return this.getTypedRuleContext(JavadocDescriptionContext,0);
	};

	javadocProperty = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(JavadocPropertyContext);
	    } else {
	        return this.getTypedRuleContext(JavadocPropertyContext,i);
	    }
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterJavadocWithDescription(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitJavadocWithDescription(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitJavadocWithDescription(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.JavadocWithDescriptionContext = JavadocWithDescriptionContext;

class JavadocDescriptionContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JavadocParser.RULE_javadocDescription;
    }

	JDD_WORD = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDD_WORD);
	    } else {
	        return this.getToken(JavadocParser.JDD_WORD, i);
	    }
	};


	JDD_WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDD_WS);
	    } else {
	        return this.getToken(JavadocParser.JDD_WS, i);
	    }
	};


	JDD_NEWLINE = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDD_NEWLINE);
	    } else {
	        return this.getToken(JavadocParser.JDD_NEWLINE, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterJavadocDescription(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitJavadocDescription(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitJavadocDescription(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class JavadocPropertyContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JavadocParser.RULE_javadocProperty;
        this.value = null;
    }

	javadocTag() {
	    return this.getTypedRuleContext(JavadocTagContext,0);
	};

	JDD_WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDD_WS);
	    } else {
	        return this.getToken(JavadocParser.JDD_WS, i);
	    }
	};


	JDT_WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDT_WS);
	    } else {
	        return this.getToken(JavadocParser.JDT_WS, i);
	    }
	};


	JDT_DOT = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDT_DOT);
	    } else {
	        return this.getToken(JavadocParser.JDT_DOT, i);
	    }
	};


	javadocTagValue = function(i) {
	    if(i===undefined) {
	        i = null;
	    }
	    if(i===null) {
	        return this.getTypedRuleContexts(JavadocTagValueContext);
	    } else {
	        return this.getTypedRuleContext(JavadocTagValueContext,i);
	    }
	};

	JDT_COMMA = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDT_COMMA);
	    } else {
	        return this.getToken(JavadocParser.JDT_COMMA, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterJavadocProperty(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitJavadocProperty(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitJavadocProperty(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class JavadocTagValueContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JavadocParser.RULE_javadocTagValue;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class JavadocTagConstantContext extends JavadocTagValueContext {

    constructor(parser, ctx) {
        super(parser);
        this.c = null;;
        super.copyFrom(ctx);
    }

	javadocConstant() {
	    return this.getTypedRuleContext(JavadocConstantContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterJavadocTagConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitJavadocTagConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitJavadocTagConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.JavadocTagConstantContext = JavadocTagConstantContext;

class JavadocTagTextContext extends JavadocTagValueContext {

    constructor(parser, ctx) {
        super(parser);
        super.copyFrom(ctx);
    }

	JDT_DOT = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDT_DOT);
	    } else {
	        return this.getToken(JavadocParser.JDT_DOT, i);
	    }
	};


	JDT_TAG = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDT_TAG);
	    } else {
	        return this.getToken(JavadocParser.JDT_TAG, i);
	    }
	};


	JDT_WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDT_WS);
	    } else {
	        return this.getToken(JavadocParser.JDT_WS, i);
	    }
	};


	JDT_AT = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDT_AT);
	    } else {
	        return this.getToken(JavadocParser.JDT_AT, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterJavadocTagText(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitJavadocTagText(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitJavadocTagText(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.JavadocTagTextContext = JavadocTagTextContext;

class JavadocTagContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JavadocParser.RULE_javadocTag;
    }

	JDT_TAG() {
	    return this.getToken(JavadocParser.JDT_TAG, 0);
	};

	JDD_TAG_ESC() {
	    return this.getToken(JavadocParser.JDD_TAG_ESC, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterJavadocTag(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitJavadocTag(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitJavadocTag(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}



class JavadocConstantContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JavadocParser.RULE_javadocConstant;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class EmptySetJDConstantContext extends JavadocConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.c = null;;
        super.copyFrom(ctx);
    }

	JDT_RSQUARE() {
	    return this.getToken(JavadocParser.JDT_RSQUARE, 0);
	};

	JDT_LSQUARE() {
	    return this.getToken(JavadocParser.JDT_LSQUARE, 0);
	};

	JDT_WS = function(i) {
		if(i===undefined) {
			i = null;
		}
	    if(i===null) {
	        return this.getTokens(JavadocParser.JDT_WS);
	    } else {
	        return this.getToken(JavadocParser.JDT_WS, i);
	    }
	};


	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterEmptySetJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitEmptySetJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitEmptySetJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.EmptySetJDConstantContext = EmptySetJDConstantContext;

class NonSetJDConstantContext extends JavadocConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.c = null;;
        super.copyFrom(ctx);
    }

	javadocSimpleConstant() {
	    return this.getTypedRuleContext(JavadocSimpleConstantContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterNonSetJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitNonSetJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitNonSetJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.NonSetJDConstantContext = NonSetJDConstantContext;

class JavadocSimpleConstantContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JavadocParser.RULE_javadocSimpleConstant;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class TrueJDConstantContext extends JavadocSimpleConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.b = null;;
        super.copyFrom(ctx);
    }

	JDT_TRUE() {
	    return this.getToken(JavadocParser.JDT_TRUE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterTrueJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitTrueJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitTrueJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.TrueJDConstantContext = TrueJDConstantContext;

class TypedJDConstantContext extends JavadocSimpleConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.t = null;;
        super.copyFrom(ctx);
    }

	JDT_TYPDCONST() {
	    return this.getToken(JavadocParser.JDT_TYPDCONST, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterTypedJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitTypedJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitTypedJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.TypedJDConstantContext = TypedJDConstantContext;

class GeneralIntJDConstantContext extends JavadocSimpleConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.i = null;;
        super.copyFrom(ctx);
    }

	javadocIntConstant() {
	    return this.getTypedRuleContext(JavadocIntConstantContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterGeneralIntJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitGeneralIntJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitGeneralIntJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.GeneralIntJDConstantContext = GeneralIntJDConstantContext;

class RealJDConstantContext extends JavadocSimpleConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.r = null;;
        super.copyFrom(ctx);
    }

	javadocRealConstant() {
	    return this.getTypedRuleContext(JavadocRealConstantContext,0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterRealJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitRealJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitRealJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.RealJDConstantContext = RealJDConstantContext;

class StringJDConstantContext extends JavadocSimpleConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.s = null;;
        super.copyFrom(ctx);
    }

	JDT_STR() {
	    return this.getToken(JavadocParser.JDT_STR, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterStringJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitStringJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitStringJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.StringJDConstantContext = StringJDConstantContext;

class FalseJDConstantContext extends JavadocSimpleConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.b = null;;
        super.copyFrom(ctx);
    }

	JDT_FALSE() {
	    return this.getToken(JavadocParser.JDT_FALSE, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterFalseJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitFalseJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitFalseJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.FalseJDConstantContext = FalseJDConstantContext;

class JavadocIntConstantContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JavadocParser.RULE_javadocIntConstant;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class BadBinJDConstantContext extends JavadocIntConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.i = null;;
        super.copyFrom(ctx);
    }

	BAD_JDT_BIN() {
	    return this.getToken(JavadocParser.BAD_JDT_BIN, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterBadBinJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitBadBinJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitBadBinJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.BadBinJDConstantContext = BadBinJDConstantContext;

class BinJDConstantContext extends JavadocIntConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.i = null;;
        super.copyFrom(ctx);
    }

	JDT_BININT() {
	    return this.getToken(JavadocParser.JDT_BININT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterBinJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitBinJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitBinJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.BinJDConstantContext = BinJDConstantContext;

class BadMixJDConstantContext extends JavadocIntConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.i = null;;
        super.copyFrom(ctx);
    }

	BAD_JDT_MIX() {
	    return this.getToken(JavadocParser.BAD_JDT_MIX, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterBadMixJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitBadMixJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitBadMixJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.BadMixJDConstantContext = BadMixJDConstantContext;

class DecIntJDConstantContext extends JavadocIntConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.i = null;;
        super.copyFrom(ctx);
    }

	JDT_INT() {
	    return this.getToken(JavadocParser.JDT_INT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterDecIntJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitDecIntJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitDecIntJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.DecIntJDConstantContext = DecIntJDConstantContext;

class HexJDConstantContext extends JavadocIntConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.i = null;;
        super.copyFrom(ctx);
    }

	JDT_HEXINT() {
	    return this.getToken(JavadocParser.JDT_HEXINT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterHexJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitHexJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitHexJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.HexJDConstantContext = HexJDConstantContext;

class NegIntJDConstantContext extends JavadocIntConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.i = null;;
        super.copyFrom(ctx);
    }

	JDT_HYPHEN() {
	    return this.getToken(JavadocParser.JDT_HYPHEN, 0);
	};

	JDT_INT() {
	    return this.getToken(JavadocParser.JDT_INT, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterNegIntJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitNegIntJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitNegIntJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.NegIntJDConstantContext = NegIntJDConstantContext;

class NoFlagHexJDConstantContext extends JavadocIntConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.i = null;;
        super.copyFrom(ctx);
    }

	JDT_HEX_NO_X() {
	    return this.getToken(JavadocParser.JDT_HEX_NO_X, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterNoFlagHexJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitNoFlagHexJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitNoFlagHexJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.NoFlagHexJDConstantContext = NoFlagHexJDConstantContext;

class BadHexJDConstantContext extends JavadocIntConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.i = null;;
        super.copyFrom(ctx);
    }

	BAD_JDT_HEX() {
	    return this.getToken(JavadocParser.BAD_JDT_HEX, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterBadHexJDConstant(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitBadHexJDConstant(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitBadHexJDConstant(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.BadHexJDConstantContext = BadHexJDConstantContext;

class JavadocRealConstantContext extends antlr4.ParserRuleContext {

    constructor(parser, parent, invokingState) {
        if(parent===undefined) {
            parent = null;
        }
        if(invokingState===undefined || invokingState===null) {
            invokingState = -1;
        }
        super(parent, invokingState);
        this.parser = parser;
        this.ruleIndex = JavadocParser.RULE_javadocRealConstant;
    }


	 
		copyFrom(ctx) {
			super.copyFrom(ctx);
		}

}


class JavadocRealConstContext extends JavadocRealConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.r = null;;
        super.copyFrom(ctx);
    }

	JDT_REAL() {
	    return this.getToken(JavadocParser.JDT_REAL, 0);
	};

	JDT_HYPHEN() {
	    return this.getToken(JavadocParser.JDT_HYPHEN, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterJavadocRealConst(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitJavadocRealConst(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitJavadocRealConst(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.JavadocRealConstContext = JavadocRealConstContext;

class JavadocBadRealConstContext extends JavadocRealConstantContext {

    constructor(parser, ctx) {
        super(parser);
        this.r = null;;
        super.copyFrom(ctx);
    }

	BAD_JDT_REAL_A() {
	    return this.getToken(JavadocParser.BAD_JDT_REAL_A, 0);
	};

	BAD_JDT_REAL_B() {
	    return this.getToken(JavadocParser.BAD_JDT_REAL_B, 0);
	};

	BAD_JDT_REAL_C() {
	    return this.getToken(JavadocParser.BAD_JDT_REAL_C, 0);
	};

	enterRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.enterJavadocBadRealConst(this);
		}
	}

	exitRule(listener) {
	    if(listener instanceof JavadocParserListener ) {
	        listener.exitJavadocBadRealConst(this);
		}
	}

	accept(visitor) {
	    if ( visitor instanceof JavadocParserVisitor ) {
	        return visitor.visitJavadocBadRealConst(this);
	    } else {
	        return visitor.visitChildren(this);
	    }
	}


}

JavadocParser.JavadocBadRealConstContext = JavadocBadRealConstContext;


JavadocParser.JavadocContext = JavadocContext; 
JavadocParser.JavadocStatementContext = JavadocStatementContext; 
JavadocParser.JavadocDescriptionContext = JavadocDescriptionContext; 
JavadocParser.JavadocPropertyContext = JavadocPropertyContext; 
JavadocParser.JavadocTagValueContext = JavadocTagValueContext; 
JavadocParser.JavadocTagContext = JavadocTagContext; 
JavadocParser.JavadocConstantContext = JavadocConstantContext; 
JavadocParser.JavadocSimpleConstantContext = JavadocSimpleConstantContext; 
JavadocParser.JavadocIntConstantContext = JavadocIntConstantContext; 
JavadocParser.JavadocRealConstantContext = JavadocRealConstantContext; 

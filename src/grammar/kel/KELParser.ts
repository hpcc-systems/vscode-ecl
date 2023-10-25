// Generated from ./KELParser.g4 by ANTLR 4.13.1
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import KELParserListener from "./KELParserListener.js";
import KELParserVisitor from "./KELParserVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class KELParser extends Parser {
	public static readonly LP = 1;
	public static readonly RP = 2;
	public static readonly EQ = 3;
	public static readonly DQUOTE = 4;
	public static readonly LT = 5;
	public static readonly GT = 6;
	public static readonly DOT = 7;
	public static readonly COMMA = 8;
	public static readonly SEMI = 9;
	public static readonly COLON = 10;
	public static readonly LCURL = 11;
	public static readonly RCURL = 12;
	public static readonly LSQUARE = 13;
	public static readonly RSQUARE = 14;
	public static readonly STAR = 15;
	public static readonly SIGIL = 16;
	public static readonly AMP = 17;
	public static readonly TILDE = 18;
	public static readonly EXCLAIM = 19;
	public static readonly HYPHEN = 20;
	public static readonly MOD = 21;
	public static readonly PLUS = 22;
	public static readonly FSLASH = 23;
	public static readonly CARET = 24;
	public static readonly PIPE = 25;
	public static readonly DEFEQ = 26;
	public static readonly NEQ = 27;
	public static readonly LTGT = 28;
	public static readonly LARROW = 29;
	public static readonly RARROW = 30;
	public static readonly GTEQ = 31;
	public static readonly LEQ = 32;
	public static readonly NNEQ = 33;
	public static readonly IN = 34;
	public static readonly OR = 35;
	public static readonly NOT = 36;
	public static readonly AND = 37;
	public static readonly ERA = 38;
	public static readonly NULL = 39;
	public static readonly DIV = 40;
	public static readonly TRUE = 41;
	public static readonly FALSE = 42;
	public static readonly LINK = 43;
	public static readonly ECL = 44;
	public static readonly RETURNS = 45;
	public static readonly OPTION = 46;
	public static readonly PERMITS = 47;
	public static readonly ENTITY = 48;
	public static readonly ASSOCIATION = 49;
	public static readonly IMPORT = 50;
	public static readonly FROM = 51;
	public static readonly PACKAGE = 52;
	public static readonly END = 53;
	public static readonly SHELL = 54;
	public static readonly FLAT = 55;
	public static readonly QUERY = 56;
	public static readonly UID = 57;
	public static readonly FORMAT = 58;
	public static readonly MODEL = 59;
	public static readonly USE = 60;
	public static readonly KELBASE = 61;
	public static readonly KELQUERY = 62;
	public static readonly FDC = 63;
	public static readonly FILTER = 64;
	public static readonly HINT = 65;
	public static readonly GLOBAL = 66;
	public static readonly FUNCTION = 67;
	public static readonly DATASET = 68;
	public static readonly OF = 69;
	public static readonly SET = 70;
	public static readonly ASOF = 71;
	public static readonly USING = 72;
	public static readonly VIS = 73;
	public static readonly ENDVIS = 74;
	public static readonly RESOURCES = 75;
	public static readonly ENDRESOURCES = 76;
	public static readonly AS = 77;
	public static readonly SPC = 78;
	public static readonly LIKE = 79;
	public static readonly DOUBLESTRING = 80;
	public static readonly SID = 81;
	public static readonly SINT = 82;
	public static readonly PID = 83;
	public static readonly PSID = 84;
	public static readonly ID = 85;
	public static readonly INT = 86;
	public static readonly HEXINT = 87;
	public static readonly BININT = 88;
	public static readonly REAL = 89;
	public static readonly STR = 90;
	public static readonly TYPDCONST = 91;
	public static readonly ESC = 92;
	public static readonly SEP_COMMENT = 93;
	public static readonly ML_COMMENT = 94;
	public static readonly MLMS_COMMENT = 95;
	public static readonly EMPTY_JAVADOC = 96;
	public static readonly JAVADOC_OPEN = 97;
	public static readonly NEWLINE = 98;
	public static readonly COMMENT = 99;
	public static readonly WS = 100;
	public static readonly BAD_BIN = 101;
	public static readonly HEX_NO_X = 102;
	public static readonly BAD_HEX = 103;
	public static readonly BAD_MIX = 104;
	public static readonly BAD_REAL_A = 105;
	public static readonly BAD_REAL_B = 106;
	public static readonly BAD_REAL_C = 107;
	public static readonly ML_COMMENT_START = 108;
	public static readonly MLMS_COMMENT_START = 109;
	public static readonly JD_COMMENT_START = 110;
	public static readonly EOF = Token.EOF;
	public static readonly RULE_program = 0;
	public static readonly RULE_annotation = 1;
	public static readonly RULE_statement = 2;
	public static readonly RULE_option = 3;
	public static readonly RULE_eraDeclaration = 4;
	public static readonly RULE_epoch = 5;
	public static readonly RULE_permitsDeclaration = 6;
	public static readonly RULE_permit = 7;
	public static readonly RULE_importStatement = 8;
	public static readonly RULE_inlinePackage = 9;
	public static readonly RULE_outoflinePackage = 10;
	public static readonly RULE_packageDeclaration = 11;
	public static readonly RULE_packageStatement = 12;
	public static readonly RULE_packageExportDeclaration = 13;
	public static readonly RULE_entityDeclaration = 14;
	public static readonly RULE_entityProperty = 15;
	public static readonly RULE_fieldMapping = 16;
	public static readonly RULE_fileType = 17;
	public static readonly RULE_mappingElement = 18;
	public static readonly RULE_nullSpec = 19;
	public static readonly RULE_formatSpec = 20;
	public static readonly RULE_likeSpec = 21;
	public static readonly RULE_compositeIdSpec = 22;
	public static readonly RULE_modelDeclaration = 23;
	public static readonly RULE_submodelDeclaration = 24;
	public static readonly RULE_submodelId = 25;
	public static readonly RULE_useDeclaration = 26;
	public static readonly RULE_useKelBaseDeclaration = 27;
	public static readonly RULE_useKelQueryDeclaration = 28;
	public static readonly RULE_useElement = 29;
	public static readonly RULE_useFileType = 30;
	public static readonly RULE_useClause = 31;
	public static readonly RULE_useClauseElement = 32;
	public static readonly RULE_useClauseFileType = 33;
	public static readonly RULE_nestedEntityMapping = 34;
	public static readonly RULE_entityMapping = 35;
	public static readonly RULE_useMappingOverride = 36;
	public static readonly RULE_dotId = 37;
	public static readonly RULE_permitsClause = 38;
	public static readonly RULE_permitsSpec = 39;
	public static readonly RULE_hintsClause = 40;
	public static readonly RULE_logicStatement = 41;
	public static readonly RULE_logicPredicate = 42;
	public static readonly RULE_logicProductions = 43;
	public static readonly RULE_logicProduction = 44;
	public static readonly RULE_entityProductions = 45;
	public static readonly RULE_entityProduction = 46;
	public static readonly RULE_functionStatement = 47;
	public static readonly RULE_fparams = 48;
	public static readonly RULE_fparam = 49;
	public static readonly RULE_functionBody = 50;
	public static readonly RULE_queryDeclaration = 51;
	public static readonly RULE_qparams = 52;
	public static readonly RULE_qparam = 53;
	public static readonly RULE_paramTypeId = 54;
	public static readonly RULE_simpleTypeId = 55;
	public static readonly RULE_asof = 56;
	public static readonly RULE_using = 57;
	public static readonly RULE_shellDeclaration = 58;
	public static readonly RULE_visual_section = 59;
	public static readonly RULE_resource_section = 60;
	public static readonly RULE_expression = 61;
	public static readonly RULE_booleanDisjunction = 62;
	public static readonly RULE_booleanConjunction = 63;
	public static readonly RULE_booleanTerm = 64;
	public static readonly RULE_booleanAtom = 65;
	public static readonly RULE_valueExpression = 66;
	public static readonly RULE_valueTerm = 67;
	public static readonly RULE_valueFactor = 68;
	public static readonly RULE_valueAtom = 69;
	public static readonly RULE_queryFuncOp = 70;
	public static readonly RULE_funcOrFilter = 71;
	public static readonly RULE_pair = 72;
	public static readonly RULE_linkExp = 73;
	public static readonly RULE_linkSpec = 74;
	public static readonly RULE_linkDegree = 75;
	public static readonly RULE_entityProjection = 76;
	public static readonly RULE_namedExpression = 77;
	public static readonly RULE_patternModel = 78;
	public static readonly RULE_patternSubmodel = 79;
	public static readonly RULE_fieldSelector = 80;
	public static readonly RULE_scopeExpression = 81;
	public static readonly RULE_tableProperty = 82;
	public static readonly RULE_func_id = 83;
	public static readonly RULE_qualifiedId = 84;
	public static readonly RULE_leadingId = 85;
	public static readonly RULE_fieldId = 86;
	public static readonly RULE_tablePropId = 87;
	public static readonly RULE_propertyId = 88;
	public static readonly RULE_constant = 89;
	public static readonly RULE_simpleConstant = 90;
	public static readonly RULE_intConstant = 91;
	public static readonly RULE_realConstant = 92;
	public static readonly RULE_eclExpression = 93;
	public static readonly RULE_eclBody = 94;
	public static readonly RULE_eclFragment = 95;
	public static readonly RULE_eclImportList = 96;
	public static readonly RULE_eclImportItem = 97;
	public static readonly RULE_returnTypeId = 98;
	public static readonly literalNames: (string | null)[] = [ null, "'('", 
                                                            "')'", "'='", 
                                                            "'\"'", "'<'", 
                                                            "'>'", "'.'", 
                                                            "','", "';'", 
                                                            "':'", "'{'", 
                                                            "'}'", "'['", 
                                                            "']'", "'*'", 
                                                            "'$'", "'&'", 
                                                            "'~'", "'!'", 
                                                            "'-'", "'%'", 
                                                            "'+'", "'/'", 
                                                            "'^'", "'|'", 
                                                            "':='", "'!='", 
                                                            "'<>'", "'<='", 
                                                            "'=>'", "'>='", 
                                                            "'==='", "'!!='", 
                                                            "'IN'", "'OR'", 
                                                            "'NOT'", "'AND'", 
                                                            "'ERA'", "'NULL'", 
                                                            "'DIV'", "'TRUE'", 
                                                            "'FALSE'", "'LINK'", 
                                                            "'ECL'", "'RETURNS'", 
                                                            "'#OPTION'", 
                                                            "'PERMITS'", 
                                                            "'ENTITY'", 
                                                            "'ASSOCIATION'", 
                                                            "'IMPORT'", 
                                                            "'FROM'", "'PACKAGE'", 
                                                            "'END'", "'SHELL'", 
                                                            "'FLAT'", "'QUERY'", 
                                                            "'UID'", "'FORMAT'", 
                                                            "'MODEL'", "'USE'", 
                                                            "'KELBASE'", 
                                                            "'KELQUERY'", 
                                                            "'FDC'", "'FILTER'", 
                                                            "'HINT'", "'GLOBAL'", 
                                                            "'FUNCTION'", 
                                                            "'DATASET'", 
                                                            "'OF'", "'SET'", 
                                                            "'ASOF'", "'USING'", 
                                                            "'VISUALIZE'", 
                                                            "'ENDVISUALIZE'", 
                                                            "'RESOURCES'", 
                                                            "'ENDRESOURCES'", 
                                                            "'AS'", "'SPC'", 
                                                            "'LIKE'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "LP", 
                                                             "RP", "EQ", 
                                                             "DQUOTE", "LT", 
                                                             "GT", "DOT", 
                                                             "COMMA", "SEMI", 
                                                             "COLON", "LCURL", 
                                                             "RCURL", "LSQUARE", 
                                                             "RSQUARE", 
                                                             "STAR", "SIGIL", 
                                                             "AMP", "TILDE", 
                                                             "EXCLAIM", 
                                                             "HYPHEN", "MOD", 
                                                             "PLUS", "FSLASH", 
                                                             "CARET", "PIPE", 
                                                             "DEFEQ", "NEQ", 
                                                             "LTGT", "LARROW", 
                                                             "RARROW", "GTEQ", 
                                                             "LEQ", "NNEQ", 
                                                             "IN", "OR", 
                                                             "NOT", "AND", 
                                                             "ERA", "NULL", 
                                                             "DIV", "TRUE", 
                                                             "FALSE", "LINK", 
                                                             "ECL", "RETURNS", 
                                                             "OPTION", "PERMITS", 
                                                             "ENTITY", "ASSOCIATION", 
                                                             "IMPORT", "FROM", 
                                                             "PACKAGE", 
                                                             "END", "SHELL", 
                                                             "FLAT", "QUERY", 
                                                             "UID", "FORMAT", 
                                                             "MODEL", "USE", 
                                                             "KELBASE", 
                                                             "KELQUERY", 
                                                             "FDC", "FILTER", 
                                                             "HINT", "GLOBAL", 
                                                             "FUNCTION", 
                                                             "DATASET", 
                                                             "OF", "SET", 
                                                             "ASOF", "USING", 
                                                             "VIS", "ENDVIS", 
                                                             "RESOURCES", 
                                                             "ENDRESOURCES", 
                                                             "AS", "SPC", 
                                                             "LIKE", "DOUBLESTRING", 
                                                             "SID", "SINT", 
                                                             "PID", "PSID", 
                                                             "ID", "INT", 
                                                             "HEXINT", "BININT", 
                                                             "REAL", "STR", 
                                                             "TYPDCONST", 
                                                             "ESC", "SEP_COMMENT", 
                                                             "ML_COMMENT", 
                                                             "MLMS_COMMENT", 
                                                             "EMPTY_JAVADOC", 
                                                             "JAVADOC_OPEN", 
                                                             "NEWLINE", 
                                                             "COMMENT", 
                                                             "WS", "BAD_BIN", 
                                                             "HEX_NO_X", 
                                                             "BAD_HEX", 
                                                             "BAD_MIX", 
                                                             "BAD_REAL_A", 
                                                             "BAD_REAL_B", 
                                                             "BAD_REAL_C", 
                                                             "ML_COMMENT_START", 
                                                             "MLMS_COMMENT_START", 
                                                             "JD_COMMENT_START" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "annotation", "statement", "option", "eraDeclaration", "epoch", 
		"permitsDeclaration", "permit", "importStatement", "inlinePackage", "outoflinePackage", 
		"packageDeclaration", "packageStatement", "packageExportDeclaration", 
		"entityDeclaration", "entityProperty", "fieldMapping", "fileType", "mappingElement", 
		"nullSpec", "formatSpec", "likeSpec", "compositeIdSpec", "modelDeclaration", 
		"submodelDeclaration", "submodelId", "useDeclaration", "useKelBaseDeclaration", 
		"useKelQueryDeclaration", "useElement", "useFileType", "useClause", "useClauseElement", 
		"useClauseFileType", "nestedEntityMapping", "entityMapping", "useMappingOverride", 
		"dotId", "permitsClause", "permitsSpec", "hintsClause", "logicStatement", 
		"logicPredicate", "logicProductions", "logicProduction", "entityProductions", 
		"entityProduction", "functionStatement", "fparams", "fparam", "functionBody", 
		"queryDeclaration", "qparams", "qparam", "paramTypeId", "simpleTypeId", 
		"asof", "using", "shellDeclaration", "visual_section", "resource_section", 
		"expression", "booleanDisjunction", "booleanConjunction", "booleanTerm", 
		"booleanAtom", "valueExpression", "valueTerm", "valueFactor", "valueAtom", 
		"queryFuncOp", "funcOrFilter", "pair", "linkExp", "linkSpec", "linkDegree", 
		"entityProjection", "namedExpression", "patternModel", "patternSubmodel", 
		"fieldSelector", "scopeExpression", "tableProperty", "func_id", "qualifiedId", 
		"leadingId", "fieldId", "tablePropId", "propertyId", "constant", "simpleConstant", 
		"intConstant", "realConstant", "eclExpression", "eclBody", "eclFragment", 
		"eclImportList", "eclImportItem", "returnTypeId",
	];
	public get grammarFileName(): string { return "KELParser.g4"; }
	public get literalNames(): (string | null)[] { return KELParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return KELParser.symbolicNames; }
	public get ruleNames(): string[] { return KELParser.ruleNames; }
	public get serializedATN(): number[] { return KELParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, KELParser._ATN, KELParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public program(): ProgramContext {
		let localctx: ProgramContext = new ProgramContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, KELParser.RULE_program);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 201;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===46) {
				{
				{
				this.state = 198;
				this.option();
				}
				}
				this.state = 203;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 209;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===38 || _la===47) {
				{
				{
				this.state = 204;
				this.annotation();
				this.state = 205;
				this.match(KELParser.SEMI);
				}
				}
				this.state = 211;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 225;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 50)) & ~0x1F) === 0 && ((1 << (_la - 50)) & 42140757) !== 0) || _la===85) {
				{
				this.state = 223;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 50:
				case 52:
				case 54:
				case 56:
				case 60:
				case 66:
				case 67:
				case 85:
					{
					this.state = 212;
					this.statement();
					this.state = 213;
					this.match(KELParser.SEMI);
					}
					break;
				case 73:
					{
					this.state = 215;
					this.visual_section();
					this.state = 217;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===9) {
						{
						this.state = 216;
						this.match(KELParser.SEMI);
						}
					}

					}
					break;
				case 75:
					{
					this.state = 219;
					this.resource_section();
					this.state = 221;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===9) {
						{
						this.state = 220;
						this.match(KELParser.SEMI);
						}
					}

					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 227;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 228;
			this.match(KELParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public annotation(): AnnotationContext {
		let localctx: AnnotationContext = new AnnotationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, KELParser.RULE_annotation);
		try {
			this.state = 232;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 38:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 230;
				this.eraDeclaration();
				}
				break;
			case 47:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 231;
				this.permitsDeclaration();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public statement(): StatementContext {
		let localctx: StatementContext = new StatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, KELParser.RULE_statement);
		try {
			this.state = 244;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 234;
				this.importStatement();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 235;
				this.inlinePackage();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 236;
				this.entityDeclaration();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 237;
				this.useDeclaration();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 238;
				this.useKelBaseDeclaration();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 239;
				this.useKelQueryDeclaration();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 240;
				this.logicStatement();
				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 241;
				this.functionStatement();
				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 242;
				this.queryDeclaration();
				}
				break;
			case 10:
				this.enterOuterAlt(localctx, 10);
				{
				this.state = 243;
				this.shellDeclaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public option(): OptionContext {
		let localctx: OptionContext = new OptionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, KELParser.RULE_option);
		try {
			this.state = 262;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 8, this._ctx) ) {
			case 1:
				localctx = new OptionBoolContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 246;
				this.match(KELParser.OPTION);
				this.state = 247;
				this.match(KELParser.LP);
				this.state = 248;
				(localctx as OptionBoolContext)._name = this.match(KELParser.ID);
				this.state = 249;
				this.match(KELParser.RP);
				}
				break;
			case 2:
				localctx = new OptionStrContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 250;
				this.match(KELParser.OPTION);
				this.state = 251;
				this.match(KELParser.LP);
				this.state = 252;
				(localctx as OptionStrContext)._name = this.match(KELParser.ID);
				this.state = 253;
				this.match(KELParser.COMMA);
				this.state = 254;
				(localctx as OptionStrContext)._value = this.match(KELParser.STR);
				this.state = 255;
				this.match(KELParser.RP);
				}
				break;
			case 3:
				localctx = new OptionIntContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 256;
				this.match(KELParser.OPTION);
				this.state = 257;
				this.match(KELParser.LP);
				this.state = 258;
				(localctx as OptionIntContext)._name = this.match(KELParser.ID);
				this.state = 259;
				this.match(KELParser.COMMA);
				this.state = 260;
				(localctx as OptionIntContext)._value = this.match(KELParser.INT);
				this.state = 261;
				this.match(KELParser.RP);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eraDeclaration(): EraDeclarationContext {
		let localctx: EraDeclarationContext = new EraDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, KELParser.RULE_eraDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 264;
			this.match(KELParser.ERA);
			this.state = 265;
			localctx._name = this.match(KELParser.ID);
			this.state = 266;
			localctx._type_ = this.match(KELParser.ID);
			this.state = 267;
			this.match(KELParser.LP);
			this.state = 268;
			this.epoch();
			this.state = 273;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 269;
				this.match(KELParser.COMMA);
				this.state = 270;
				this.epoch();
				}
				}
				this.state = 275;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 276;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public epoch(): EpochContext {
		let localctx: EpochContext = new EpochContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, KELParser.RULE_epoch);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 278;
			localctx._name = this.match(KELParser.ID);
			this.state = 287;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===3) {
				{
				this.state = 279;
				this.match(KELParser.EQ);
				this.state = 280;
				this.match(KELParser.NULL);
				this.state = 281;
				this.match(KELParser.LP);
				this.state = 282;
				localctx._nulltype = this.match(KELParser.ID);
				this.state = 284;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===85) {
					{
					this.state = 283;
					localctx._sw = this.match(KELParser.ID);
					}
				}

				this.state = 286;
				this.match(KELParser.RP);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public permitsDeclaration(): PermitsDeclarationContext {
		let localctx: PermitsDeclarationContext = new PermitsDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, KELParser.RULE_permitsDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 289;
			this.match(KELParser.PERMITS);
			this.state = 290;
			this.permit();
			this.state = 295;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 291;
				this.match(KELParser.COMMA);
				this.state = 292;
				this.permit();
				}
				}
				this.state = 297;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public permit(): PermitContext {
		let localctx: PermitContext = new PermitContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, KELParser.RULE_permit);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 298;
			this.match(KELParser.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public importStatement(): ImportStatementContext {
		let localctx: ImportStatementContext = new ImportStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, KELParser.RULE_importStatement);
		let _la: number;
		try {
			this.state = 327;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				localctx = new SimpleImportContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 300;
				this.match(KELParser.IMPORT);
				this.state = 301;
				this.dotId();
				this.state = 306;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 302;
					this.match(KELParser.COMMA);
					this.state = 303;
					this.dotId();
					}
					}
					this.state = 308;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case 2:
				localctx = new PackageImportContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 309;
				this.match(KELParser.IMPORT);
				this.state = 310;
				this.match(KELParser.ID);
				this.state = 315;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 311;
					this.match(KELParser.COMMA);
					this.state = 312;
					this.match(KELParser.ID);
					}
					}
					this.state = 317;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 318;
				this.match(KELParser.FROM);
				this.state = 319;
				this.dotId();
				}
				break;
			case 3:
				localctx = new SpcImportContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 320;
				this.match(KELParser.IMPORT);
				this.state = 321;
				this.match(KELParser.SPC);
				this.state = 322;
				this.match(KELParser.FROM);
				this.state = 323;
				this.dotId();
				this.state = 324;
				this.match(KELParser.AS);
				this.state = 325;
				this.match(KELParser.ID);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public inlinePackage(): InlinePackageContext {
		let localctx: InlinePackageContext = new InlinePackageContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, KELParser.RULE_inlinePackage);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 329;
			this.packageDeclaration();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public outoflinePackage(): OutoflinePackageContext {
		let localctx: OutoflinePackageContext = new OutoflinePackageContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, KELParser.RULE_outoflinePackage);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 331;
			this.packageDeclaration();
			this.state = 332;
			this.match(KELParser.SEMI);
			this.state = 333;
			this.match(KELParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public packageDeclaration(): PackageDeclarationContext {
		let localctx: PackageDeclarationContext = new PackageDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, KELParser.RULE_packageDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 335;
			this.match(KELParser.PACKAGE);
			this.state = 336;
			this.match(KELParser.ID);
			this.state = 337;
			this.match(KELParser.SEMI);
			this.state = 341;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 338;
				this.packageStatement();
				this.state = 339;
				this.match(KELParser.SEMI);
				}
				}
				this.state = 343;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 50)) & ~0x1F) === 0 && ((1 << (_la - 50)) & 197649) !== 0) || _la===85);
			this.state = 345;
			this.match(KELParser.END);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public packageStatement(): PackageStatementContext {
		let localctx: PackageStatementContext = new PackageStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, KELParser.RULE_packageStatement);
		try {
			this.state = 353;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 17, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 347;
				this.importStatement();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 348;
				this.entityDeclaration();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 349;
				this.useDeclaration();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 350;
				this.logicStatement();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 351;
				this.functionStatement();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 352;
				this.packageExportDeclaration();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public packageExportDeclaration(): PackageExportDeclarationContext {
		let localctx: PackageExportDeclarationContext = new PackageExportDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, KELParser.RULE_packageExportDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 355;
			this.match(KELParser.SHELL);
			this.state = 356;
			this.match(KELParser.COLON);
			this.state = 357;
			localctx._name = this.match(KELParser.ID);
			this.state = 358;
			this.match(KELParser.LARROW);
			this.state = 359;
			this.expression();
			this.state = 364;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 360;
				this.match(KELParser.COMMA);
				this.state = 361;
				this.expression();
				}
				}
				this.state = 366;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public entityDeclaration(): EntityDeclarationContext {
		let localctx: EntityDeclarationContext = new EntityDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 28, KELParser.RULE_entityDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 367;
			this.match(KELParser.ID);
			this.state = 368;
			this.match(KELParser.DEFEQ);
			this.state = 369;
			localctx._t = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(_la===48 || _la===49)) {
			    localctx._t = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 370;
			this.match(KELParser.LP);
			this.state = 371;
			this.entityProperty();
			this.state = 376;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 372;
				this.match(KELParser.COMMA);
				this.state = 373;
				this.entityProperty();
				}
				}
				this.state = 378;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 379;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public entityProperty(): EntityPropertyContext {
		let localctx: EntityPropertyContext = new EntityPropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 30, KELParser.RULE_entityProperty);
		try {
			this.state = 383;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 55:
			case 56:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 381;
				localctx._fm = this.fieldMapping();
				}
				break;
			case 59:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 382;
				localctx._m = this.modelDeclaration();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fieldMapping(): FieldMappingContext {
		let localctx: FieldMappingContext = new FieldMappingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, KELParser.RULE_fieldMapping);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 385;
			this.fileType();
			this.state = 386;
			this.match(KELParser.LP);
			this.state = 387;
			this.mappingElement();
			this.state = 392;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 388;
				this.match(KELParser.COMMA);
				this.state = 389;
				localctx._m = this.mappingElement();
				}
				}
				this.state = 394;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 395;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fileType(): FileTypeContext {
		let localctx: FileTypeContext = new FileTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 34, KELParser.RULE_fileType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 397;
			_la = this._input.LA(1);
			if(!(_la===55 || _la===56)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public mappingElement(): MappingElementContext {
		let localctx: MappingElementContext = new MappingElementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 36, KELParser.RULE_mappingElement);
		let _la: number;
		try {
			this.state = 456;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 32, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 400;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 22, this._ctx) ) {
				case 1:
					{
					this.state = 399;
					localctx._t = this.match(KELParser.ID);
					}
					break;
				}
				this.state = 402;
				localctx._i = this.match(KELParser.ID);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 404;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 23, this._ctx) ) {
				case 1:
					{
					this.state = 403;
					localctx._t = this.match(KELParser.ID);
					}
					break;
				}
				this.state = 406;
				localctx._i = this.match(KELParser.ID);
				this.state = 407;
				this.match(KELParser.EQ);
				this.state = 409;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===39) {
					{
					this.state = 408;
					localctx._nspec = this.nullSpec();
					}
				}

				this.state = 412;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===58) {
					{
					this.state = 411;
					localctx._fspec = this.formatSpec();
					}
				}

				this.state = 414;
				localctx._from_ = this.dotId();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 416;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 26, this._ctx) ) {
				case 1:
					{
					this.state = 415;
					localctx._t = this.match(KELParser.ID);
					}
					break;
				}
				this.state = 418;
				localctx._i = this.match(KELParser.ID);
				this.state = 419;
				this.match(KELParser.EQ);
				this.state = 421;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===39) {
					{
					this.state = 420;
					localctx._nspec = this.nullSpec();
					}
				}

				this.state = 423;
				localctx._fspec = this.formatSpec();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 425;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 28, this._ctx) ) {
				case 1:
					{
					this.state = 424;
					localctx._t = this.match(KELParser.ID);
					}
					break;
				}
				this.state = 427;
				localctx._i = this.match(KELParser.ID);
				this.state = 428;
				this.match(KELParser.EQ);
				this.state = 429;
				localctx._nspec = this.nullSpec();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 431;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 29, this._ctx) ) {
				case 1:
					{
					this.state = 430;
					localctx._t = this.match(KELParser.ID);
					}
					break;
				}
				this.state = 433;
				localctx._i = this.match(KELParser.ID);
				this.state = 434;
				this.match(KELParser.EQ);
				this.state = 435;
				localctx._lspec = this.likeSpec();
				this.state = 436;
				localctx._from_ = this.dotId();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 439;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 30, this._ctx) ) {
				case 1:
					{
					this.state = 438;
					localctx._t = this.match(KELParser.ID);
					}
					break;
				}
				this.state = 441;
				localctx._i = this.match(KELParser.ID);
				this.state = 442;
				this.match(KELParser.EQ);
				this.state = 443;
				localctx._lspec = this.likeSpec();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 444;
				localctx._i = this.match(KELParser.UID);
				this.state = 447;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===3) {
					{
					this.state = 445;
					this.match(KELParser.EQ);
					this.state = 446;
					localctx._from_ = this.dotId();
					}
				}

				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 449;
				localctx._i = this.match(KELParser.UID);
				this.state = 450;
				localctx._c = this.compositeIdSpec();
				}
				break;
			case 9:
				this.enterOuterAlt(localctx, 9);
				{
				this.state = 451;
				localctx._t = this.match(KELParser.ID);
				this.state = 452;
				localctx._i = this.match(KELParser.ID);
				this.state = 453;
				this.match(KELParser.EQ);
				this.state = 454;
				localctx._u = this.match(KELParser.UID);
				this.state = 455;
				localctx._c = this.compositeIdSpec();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public nullSpec(): NullSpecContext {
		let localctx: NullSpecContext = new NullSpecContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, KELParser.RULE_nullSpec);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 458;
			this.match(KELParser.NULL);
			this.state = 459;
			this.match(KELParser.LP);
			this.state = 461;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 6291457) !== 0) || ((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & 4161599) !== 0)) {
				{
				this.state = 460;
				localctx._c = this.simpleConstant();
				}
			}

			this.state = 463;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public formatSpec(): FormatSpecContext {
		let localctx: FormatSpecContext = new FormatSpecContext(this, this._ctx, this.state);
		this.enterRule(localctx, 40, KELParser.RULE_formatSpec);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 465;
			this.match(KELParser.FORMAT);
			this.state = 466;
			this.match(KELParser.LP);
			this.state = 475;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 20)) & ~0x1F) === 0 && ((1 << (_la - 20)) & 6291457) !== 0) || ((((_la - 86)) & ~0x1F) === 0 && ((1 << (_la - 86)) & 4161599) !== 0)) {
				{
				this.state = 467;
				this.simpleConstant();
				this.state = 472;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 468;
					this.match(KELParser.COMMA);
					this.state = 469;
					this.simpleConstant();
					}
					}
					this.state = 474;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 477;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public likeSpec(): LikeSpecContext {
		let localctx: LikeSpecContext = new LikeSpecContext(this, this._ctx, this.state);
		this.enterRule(localctx, 42, KELParser.RULE_likeSpec);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 479;
			this.match(KELParser.LIKE);
			this.state = 480;
			this.match(KELParser.LP);
			this.state = 481;
			this.dotId();
			this.state = 482;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public compositeIdSpec(): CompositeIdSpecContext {
		let localctx: CompositeIdSpecContext = new CompositeIdSpecContext(this, this._ctx, this.state);
		this.enterRule(localctx, 44, KELParser.RULE_compositeIdSpec);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 484;
			this.match(KELParser.LP);
			this.state = 485;
			this.dotId();
			this.state = 490;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 486;
				this.match(KELParser.COMMA);
				this.state = 487;
				this.dotId();
				}
				}
				this.state = 492;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 493;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public modelDeclaration(): ModelDeclarationContext {
		let localctx: ModelDeclarationContext = new ModelDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 46, KELParser.RULE_modelDeclaration);
		let _la: number;
		try {
			this.state = 511;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 38, this._ctx) ) {
			case 1:
				localctx = new ComplexModelContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 495;
				(localctx as ComplexModelContext)._md = this.match(KELParser.MODEL);
				this.state = 496;
				this.match(KELParser.LP);
				this.state = 497;
				this.submodelDeclaration();
				this.state = 502;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 498;
					this.match(KELParser.COMMA);
					this.state = 499;
					this.submodelDeclaration();
					}
					}
					this.state = 504;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 505;
				this.match(KELParser.RP);
				}
				break;
			case 2:
				localctx = new SingleRowModelContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 507;
				(localctx as SingleRowModelContext)._md = this.match(KELParser.MODEL);
				this.state = 508;
				this.match(KELParser.LP);
				this.state = 509;
				this.match(KELParser.STAR);
				this.state = 510;
				this.match(KELParser.RP);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public submodelDeclaration(): SubmodelDeclarationContext {
		let localctx: SubmodelDeclarationContext = new SubmodelDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 48, KELParser.RULE_submodelDeclaration);
		let _la: number;
		try {
			this.state = 531;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 41, this._ctx) ) {
			case 1:
				localctx = new SingleValueSubModelContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 513;
				(localctx as SingleValueSubModelContext)._i = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===57 || _la===85)) {
				    (localctx as SingleValueSubModelContext)._i = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			case 2:
				localctx = new RemainderSubModelContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 514;
				(localctx as RemainderSubModelContext)._b = this.match(KELParser.LCURL);
				this.state = 515;
				this.match(KELParser.STAR);
				this.state = 516;
				this.match(KELParser.RCURL);
				}
				break;
			case 3:
				localctx = new ExplicitSubModelContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 518;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===85) {
					{
					this.state = 517;
					(localctx as ExplicitSubModelContext)._n = this.match(KELParser.ID);
					}
				}

				this.state = 520;
				(localctx as ExplicitSubModelContext)._b = this.match(KELParser.LCURL);
				this.state = 521;
				this.submodelId();
				this.state = 526;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 522;
					this.match(KELParser.COMMA);
					this.state = 523;
					this.submodelId();
					}
					}
					this.state = 528;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 529;
				this.match(KELParser.RCURL);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public submodelId(): SubmodelIdContext {
		let localctx: SubmodelIdContext = new SubmodelIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 50, KELParser.RULE_submodelId);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 533;
			_la = this._input.LA(1);
			if(!(_la===57 || _la===85)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public useDeclaration(): UseDeclarationContext {
		let localctx: UseDeclarationContext = new UseDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 52, KELParser.RULE_useDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 535;
			this.match(KELParser.USE);
			this.state = 536;
			this.useElement();
			this.state = 541;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 537;
				this.match(KELParser.COMMA);
				this.state = 538;
				this.useElement();
				}
				}
				this.state = 543;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public useKelBaseDeclaration(): UseKelBaseDeclarationContext {
		let localctx: UseKelBaseDeclarationContext = new UseKelBaseDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, KELParser.RULE_useKelBaseDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 544;
			this.match(KELParser.USE);
			this.state = 545;
			localctx._attr = this.dotId();
			this.state = 546;
			this.match(KELParser.LP);
			this.state = 547;
			this.match(KELParser.KELBASE);
			this.state = 550;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 548;
				this.match(KELParser.COMMA);
				this.state = 549;
				this.expression();
				}
				}
				this.state = 552;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===8);
			this.state = 554;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public useKelQueryDeclaration(): UseKelQueryDeclarationContext {
		let localctx: UseKelQueryDeclarationContext = new UseKelQueryDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 56, KELParser.RULE_useKelQueryDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 556;
			this.match(KELParser.USE);
			this.state = 557;
			localctx._attr = this.dotId();
			this.state = 558;
			this.match(KELParser.LP);
			this.state = 559;
			this.match(KELParser.KELQUERY);
			this.state = 562;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 560;
				this.match(KELParser.COMMA);
				this.state = 561;
				this.match(KELParser.ID);
				}
				}
				this.state = 564;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===8);
			this.state = 566;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public useElement(): UseElementContext {
		let localctx: UseElementContext = new UseElementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 58, KELParser.RULE_useElement);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 568;
			localctx._attr = this.dotId();
			this.state = 569;
			this.match(KELParser.LP);
			this.state = 570;
			localctx._t = this.useFileType();
			this.state = 578;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 571;
				this.match(KELParser.COMMA);
				this.state = 576;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 45, this._ctx) ) {
				case 1:
					{
					this.state = 572;
					localctx._ne = this.nestedEntityMapping();
					}
					break;
				case 2:
					{
					this.state = 573;
					localctx._e = this.entityMapping();
					}
					break;
				case 3:
					{
					this.state = 574;
					localctx._p = this.permitsClause();
					}
					break;
				case 4:
					{
					this.state = 575;
					this.hintsClause();
					}
					break;
				}
				}
				}
				this.state = 580;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===8);
			this.state = 582;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public useFileType(): UseFileTypeContext {
		let localctx: UseFileTypeContext = new UseFileTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 60, KELParser.RULE_useFileType);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 584;
			_la = this._input.LA(1);
			if(!(_la===55 || _la===63)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public useClause(): UseClauseContext {
		let localctx: UseClauseContext = new UseClauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 62, KELParser.RULE_useClause);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 586;
			this.match(KELParser.USE);
			this.state = 587;
			this.useClauseElement();
			this.state = 592;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 588;
				this.match(KELParser.COMMA);
				this.state = 589;
				this.useClauseElement();
				}
				}
				this.state = 594;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public useClauseElement(): UseClauseElementContext {
		let localctx: UseClauseElementContext = new UseClauseElementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 64, KELParser.RULE_useClauseElement);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 595;
			localctx._attr = this.match(KELParser.ID);
			this.state = 596;
			this.match(KELParser.LP);
			this.state = 597;
			localctx._t = this.useClauseFileType();
			this.state = 603;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 598;
				this.match(KELParser.COMMA);
				this.state = 601;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 85:
					{
					this.state = 599;
					localctx._e = this.entityMapping();
					}
					break;
				case 47:
					{
					this.state = 600;
					localctx._p = this.permitsClause();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				}
				this.state = 605;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===8);
			this.state = 607;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public useClauseFileType(): UseClauseFileTypeContext {
		let localctx: UseClauseFileTypeContext = new UseClauseFileTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 66, KELParser.RULE_useClauseFileType);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 609;
			this.match(KELParser.FLAT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public nestedEntityMapping(): NestedEntityMappingContext {
		let localctx: NestedEntityMappingContext = new NestedEntityMappingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 68, KELParser.RULE_nestedEntityMapping);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 611;
			localctx._child = this.match(KELParser.ID);
			this.state = 612;
			this.match(KELParser.LP);
			this.state = 615;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 85:
				{
				this.state = 613;
				localctx._e1 = this.entityMapping();
				}
				break;
			case 47:
				{
				this.state = 614;
				localctx._p1 = this.permitsClause();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 624;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 617;
				this.match(KELParser.COMMA);
				this.state = 620;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 85:
					{
					this.state = 618;
					localctx._e2 = this.entityMapping();
					}
					break;
				case 47:
					{
					this.state = 619;
					localctx._p2 = this.permitsClause();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				}
				this.state = 626;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 627;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public entityMapping(): EntityMappingContext {
		let localctx: EntityMappingContext = new EntityMappingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 70, KELParser.RULE_entityMapping);
		let _la: number;
		try {
			this.state = 687;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 57, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 629;
				localctx._e = this.match(KELParser.ID);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 630;
				localctx._e = this.match(KELParser.ID);
				this.state = 631;
				this.match(KELParser.LP);
				this.state = 632;
				this.useMappingOverride();
				this.state = 637;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 633;
					this.match(KELParser.COMMA);
					this.state = 634;
					this.useMappingOverride();
					}
					}
					this.state = 639;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 640;
				this.match(KELParser.RP);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 642;
				localctx._e = this.match(KELParser.ID);
				this.state = 643;
				this.match(KELParser.LP);
				this.state = 644;
				localctx._p = this.match(KELParser.ID);
				this.state = 645;
				this.match(KELParser.STAR);
				this.state = 650;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 646;
					this.match(KELParser.COMMA);
					this.state = 647;
					this.useMappingOverride();
					}
					}
					this.state = 652;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 653;
				this.match(KELParser.RP);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 654;
				localctx._e = this.match(KELParser.ID);
				this.state = 655;
				this.match(KELParser.LP);
				this.state = 656;
				this.match(KELParser.FILTER);
				this.state = 657;
				this.match(KELParser.LP);
				this.state = 658;
				localctx._f = this.eclBody();
				this.state = 659;
				this.match(KELParser.RP);
				this.state = 664;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 660;
					this.match(KELParser.COMMA);
					this.state = 661;
					this.useMappingOverride();
					}
					}
					this.state = 666;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 667;
				this.match(KELParser.RP);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 669;
				localctx._e = this.match(KELParser.ID);
				this.state = 670;
				this.match(KELParser.LP);
				this.state = 671;
				localctx._p = this.match(KELParser.ID);
				this.state = 672;
				this.match(KELParser.STAR);
				this.state = 673;
				this.match(KELParser.COMMA);
				this.state = 674;
				this.match(KELParser.FILTER);
				this.state = 675;
				this.match(KELParser.LP);
				this.state = 676;
				localctx._f = this.eclBody();
				this.state = 677;
				this.match(KELParser.RP);
				this.state = 682;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 678;
					this.match(KELParser.COMMA);
					this.state = 679;
					this.useMappingOverride();
					}
					}
					this.state = 684;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 685;
				this.match(KELParser.RP);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public useMappingOverride(): UseMappingOverrideContext {
		let localctx: UseMappingOverrideContext = new UseMappingOverrideContext(this, this._ctx, this.state);
		this.enterRule(localctx, 72, KELParser.RULE_useMappingOverride);
		let _la: number;
		try {
			this.state = 722;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 62, this._ctx) ) {
			case 1:
				localctx = new NormalMappingOverrideContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 689;
				(localctx as NormalMappingOverrideContext)._ef = this.match(KELParser.UID);
				this.state = 690;
				this.match(KELParser.EQ);
				this.state = 691;
				(localctx as NormalMappingOverrideContext)._from_ = this.dotId();
				}
				break;
			case 2:
				localctx = new NormalMappingOverrideContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 692;
				(localctx as NormalMappingOverrideContext)._ef = this.match(KELParser.ID);
				this.state = 693;
				this.match(KELParser.EQ);
				this.state = 695;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===39) {
					{
					this.state = 694;
					(localctx as NormalMappingOverrideContext)._nspec = this.nullSpec();
					}
				}

				this.state = 698;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===58) {
					{
					this.state = 697;
					(localctx as NormalMappingOverrideContext)._fspec = this.formatSpec();
					}
				}

				this.state = 700;
				(localctx as NormalMappingOverrideContext)._from_ = this.dotId();
				}
				break;
			case 3:
				localctx = new NormalMappingOverrideContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 701;
				(localctx as NormalMappingOverrideContext)._ef = this.match(KELParser.ID);
				this.state = 702;
				this.match(KELParser.EQ);
				this.state = 704;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===39) {
					{
					this.state = 703;
					(localctx as NormalMappingOverrideContext)._nspec = this.nullSpec();
					}
				}

				this.state = 706;
				(localctx as NormalMappingOverrideContext)._fspec = this.formatSpec();
				}
				break;
			case 4:
				localctx = new NormalMappingOverrideContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 707;
				(localctx as NormalMappingOverrideContext)._ef = this.match(KELParser.ID);
				this.state = 708;
				this.match(KELParser.EQ);
				this.state = 709;
				(localctx as NormalMappingOverrideContext)._nspec = this.nullSpec();
				}
				break;
			case 5:
				localctx = new NormalMappingOverrideContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 710;
				(localctx as NormalMappingOverrideContext)._ef = this.match(KELParser.ID);
				this.state = 711;
				this.match(KELParser.EQ);
				this.state = 713;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===79) {
					{
					this.state = 712;
					(localctx as NormalMappingOverrideContext)._lspec = this.likeSpec();
					}
				}

				this.state = 715;
				(localctx as NormalMappingOverrideContext)._from_ = this.dotId();
				}
				break;
			case 6:
				localctx = new NormalMappingOverrideContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 716;
				(localctx as NormalMappingOverrideContext)._ef = this.match(KELParser.ID);
				this.state = 717;
				this.match(KELParser.EQ);
				this.state = 718;
				(localctx as NormalMappingOverrideContext)._lspec = this.likeSpec();
				}
				break;
			case 7:
				localctx = new ConstantMappingOverrideContext(this, localctx);
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 719;
				(localctx as ConstantMappingOverrideContext)._ef = this.match(KELParser.ID);
				this.state = 720;
				this.match(KELParser.EQ);
				this.state = 721;
				(localctx as ConstantMappingOverrideContext)._c = this.simpleConstant();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dotId(): DotIdContext {
		let localctx: DotIdContext = new DotIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 74, KELParser.RULE_dotId);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 724;
			this.match(KELParser.ID);
			this.state = 729;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===7) {
				{
				{
				this.state = 725;
				this.match(KELParser.DOT);
				this.state = 726;
				this.match(KELParser.ID);
				}
				}
				this.state = 731;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public permitsClause(): PermitsClauseContext {
		let localctx: PermitsClauseContext = new PermitsClauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 76, KELParser.RULE_permitsClause);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 732;
			this.match(KELParser.PERMITS);
			this.state = 733;
			this.match(KELParser.LP);
			this.state = 734;
			this.permitsSpec();
			this.state = 735;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public permitsSpec(): PermitsSpecContext {
		let localctx: PermitsSpecContext = new PermitsSpecContext(this, this._ctx, this.state);
		this.enterRule(localctx, 78, KELParser.RULE_permitsSpec);
		let _la: number;
		try {
			this.state = 748;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 85:
				localctx = new VariablePermitsContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 737;
				this.dotId();
				}
				break;
			case 13:
				localctx = new ConstantPermitsContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 738;
				this.match(KELParser.LSQUARE);
				this.state = 739;
				this.match(KELParser.ID);
				this.state = 744;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 740;
					this.match(KELParser.COMMA);
					this.state = 741;
					this.match(KELParser.ID);
					}
					}
					this.state = 746;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 747;
				this.match(KELParser.RSQUARE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public hintsClause(): HintsClauseContext {
		let localctx: HintsClauseContext = new HintsClauseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 80, KELParser.RULE_hintsClause);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 750;
			this.match(KELParser.HINT);
			this.state = 751;
			this.match(KELParser.LP);
			this.state = 752;
			this.match(KELParser.ID);
			this.state = 753;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public logicStatement(): LogicStatementContext {
		let localctx: LogicStatementContext = new LogicStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 82, KELParser.RULE_logicStatement);
		try {
			this.state = 778;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 66, this._ctx) ) {
			case 1:
				localctx = new LogicPropertyStatementContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 755;
				(localctx as LogicPropertyStatementContext)._c = this.match(KELParser.ID);
				this.state = 756;
				this.match(KELParser.COLON);
				this.state = 757;
				(localctx as LogicPropertyStatementContext)._p = this.logicPredicate();
				this.state = 758;
				this.match(KELParser.RARROW);
				this.state = 759;
				this.logicProductions();
				}
				break;
			case 2:
				localctx = new LogicPropertyStatementContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 761;
				(localctx as LogicPropertyStatementContext)._c = this.match(KELParser.ID);
				this.state = 762;
				this.match(KELParser.DOT);
				this.state = 763;
				(localctx as LogicPropertyStatementContext)._mvp = this.match(KELParser.ID);
				this.state = 764;
				this.match(KELParser.COLON);
				this.state = 765;
				(localctx as LogicPropertyStatementContext)._p = this.logicPredicate();
				this.state = 766;
				this.match(KELParser.RARROW);
				this.state = 767;
				this.logicProductions();
				}
				break;
			case 3:
				localctx = new ConstantDeclStatementContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 769;
				(localctx as ConstantDeclStatementContext)._c = this.match(KELParser.ID);
				this.state = 770;
				this.match(KELParser.COLON);
				this.state = 771;
				this.logicProductions();
				}
				break;
			case 4:
				localctx = new EntityGeneratorStatementContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 772;
				this.match(KELParser.GLOBAL);
				this.state = 773;
				this.match(KELParser.COLON);
				this.state = 774;
				(localctx as EntityGeneratorStatementContext)._p = this.logicPredicate();
				this.state = 775;
				this.match(KELParser.RARROW);
				this.state = 776;
				this.entityProductions();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public logicPredicate(): LogicPredicateContext {
		let localctx: LogicPredicateContext = new LogicPredicateContext(this, this._ctx, this.state);
		this.enterRule(localctx, 84, KELParser.RULE_logicPredicate);
		let _la: number;
		try {
			this.state = 789;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 11:
			case 13:
			case 20:
			case 36:
			case 41:
			case 42:
			case 43:
			case 57:
			case 59:
			case 81:
			case 82:
			case 83:
			case 84:
			case 85:
			case 86:
			case 87:
			case 88:
			case 89:
			case 90:
			case 91:
			case 101:
			case 102:
			case 103:
			case 104:
			case 105:
			case 106:
			case 107:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 780;
				localctx._ex1 = this.expression();
				this.state = 785;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 781;
					this.match(KELParser.COMMA);
					this.state = 782;
					localctx._ex2 = this.expression();
					}
					}
					this.state = 787;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case 30:
				this.enterOuterAlt(localctx, 2);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public logicProductions(): LogicProductionsContext {
		let localctx: LogicProductionsContext = new LogicProductionsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 86, KELParser.RULE_logicProductions);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 791;
			this.logicProduction();
			this.state = 796;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 792;
				this.match(KELParser.COMMA);
				this.state = 793;
				this.logicProduction();
				}
				}
				this.state = 798;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public logicProduction(): LogicProductionContext {
		let localctx: LogicProductionContext = new LogicProductionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 88, KELParser.RULE_logicProduction);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 799;
			localctx._name = this.match(KELParser.ID);
			this.state = 800;
			this.match(KELParser.DEFEQ);
			this.state = 801;
			localctx._ex = this.expression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public entityProductions(): EntityProductionsContext {
		let localctx: EntityProductionsContext = new EntityProductionsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 90, KELParser.RULE_entityProductions);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 803;
			this.entityProduction();
			this.state = 808;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 804;
				this.match(KELParser.COMMA);
				this.state = 805;
				this.entityProduction();
				}
				}
				this.state = 810;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public entityProduction(): EntityProductionContext {
		let localctx: EntityProductionContext = new EntityProductionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 92, KELParser.RULE_entityProduction);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 811;
			localctx._name = this.match(KELParser.ID);
			this.state = 812;
			this.match(KELParser.LP);
			this.state = 813;
			localctx._e1 = this.expression();
			this.state = 818;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 814;
				localctx._op = this.match(KELParser.COMMA);
				this.state = 815;
				localctx._e2 = this.expression();
				}
				}
				this.state = 820;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 821;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionStatement(): FunctionStatementContext {
		let localctx: FunctionStatementContext = new FunctionStatementContext(this, this._ctx, this.state);
		this.enterRule(localctx, 94, KELParser.RULE_functionStatement);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 823;
			this.match(KELParser.FUNCTION);
			this.state = 824;
			this.match(KELParser.COLON);
			this.state = 825;
			localctx._name = this.match(KELParser.ID);
			this.state = 827;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===1) {
				{
				this.state = 826;
				localctx._ps = this.fparams();
				}
			}

			this.state = 829;
			this.match(KELParser.LARROW);
			this.state = 830;
			this.functionBody();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fparams(): FparamsContext {
		let localctx: FparamsContext = new FparamsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 96, KELParser.RULE_fparams);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 832;
			this.match(KELParser.LP);
			this.state = 833;
			localctx._q1 = this.fparam();
			this.state = 838;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 834;
				this.match(KELParser.COMMA);
				this.state = 835;
				localctx._q2 = this.fparam();
				}
				}
				this.state = 840;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 841;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fparam(): FparamContext {
		let localctx: FparamContext = new FparamContext(this, this._ctx, this.state);
		this.enterRule(localctx, 98, KELParser.RULE_fparam);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 844;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 74, this._ctx) ) {
			case 1:
				{
				this.state = 843;
				localctx._pt = this.paramTypeId();
				}
				break;
			}
			this.state = 846;
			localctx._id = this.match(KELParser.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public functionBody(): FunctionBodyContext {
		let localctx: FunctionBodyContext = new FunctionBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 100, KELParser.RULE_functionBody);
		try {
			this.state = 850;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
			case 11:
			case 13:
			case 20:
			case 36:
			case 41:
			case 42:
			case 43:
			case 57:
			case 59:
			case 81:
			case 82:
			case 83:
			case 84:
			case 85:
			case 86:
			case 87:
			case 88:
			case 89:
			case 90:
			case 91:
			case 101:
			case 102:
			case 103:
			case 104:
			case 105:
			case 106:
			case 107:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 848;
				localctx._kel = this.expression();
				}
				break;
			case 44:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 849;
				localctx._ecl = this.eclExpression();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public queryDeclaration(): QueryDeclarationContext {
		let localctx: QueryDeclarationContext = new QueryDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 102, KELParser.RULE_queryDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 852;
			this.match(KELParser.QUERY);
			this.state = 853;
			this.match(KELParser.COLON);
			this.state = 854;
			localctx._name = this.match(KELParser.ID);
			this.state = 856;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===1) {
				{
				this.state = 855;
				localctx._ps = this.qparams();
				}
			}

			this.state = 858;
			this.match(KELParser.LARROW);
			this.state = 859;
			this.expression();
			this.state = 864;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 860;
				this.match(KELParser.COMMA);
				this.state = 861;
				this.expression();
				}
				}
				this.state = 866;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 870;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===71) {
				{
				{
				this.state = 867;
				this.asof();
				}
				}
				this.state = 872;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 874;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===72) {
				{
				this.state = 873;
				this.using();
				}
			}

			this.state = 877;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===60) {
				{
				this.state = 876;
				this.useClause();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public qparams(): QparamsContext {
		let localctx: QparamsContext = new QparamsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 104, KELParser.RULE_qparams);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 879;
			this.match(KELParser.LP);
			this.state = 880;
			localctx._q1 = this.qparam();
			this.state = 885;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 881;
				this.match(KELParser.COMMA);
				this.state = 882;
				localctx._q2 = this.qparam();
				}
				}
				this.state = 887;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 888;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public qparam(): QparamContext {
		let localctx: QparamContext = new QparamContext(this, this._ctx, this.state);
		this.enterRule(localctx, 106, KELParser.RULE_qparam);
		let _la: number;
		try {
			this.state = 905;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 84, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 891;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 82, this._ctx) ) {
				case 1:
					{
					this.state = 890;
					localctx._pt = this.paramTypeId();
					}
					break;
				}
				this.state = 893;
				localctx._id = this.match(KELParser.ID);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 895;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===57 || _la===85) {
					{
					this.state = 894;
					localctx._at = this.simpleTypeId();
					}
				}

				this.state = 897;
				localctx._sid = this.match(KELParser.SID);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 898;
				this.match(KELParser.PERMITS);
				this.state = 899;
				localctx._pid = this.match(KELParser.ID);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 900;
				this.match(KELParser.DATASET);
				this.state = 901;
				this.match(KELParser.OF);
				this.state = 902;
				localctx._dstype = this.dotId();
				this.state = 903;
				localctx._dsid = this.match(KELParser.ID);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public paramTypeId(): ParamTypeIdContext {
		let localctx: ParamTypeIdContext = new ParamTypeIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 108, KELParser.RULE_paramTypeId);
		try {
			this.state = 911;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 57:
			case 85:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 907;
				localctx._simple = this.simpleTypeId();
				}
				break;
			case 70:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 908;
				localctx._isSet = this.match(KELParser.SET);
				this.state = 909;
				this.match(KELParser.OF);
				this.state = 910;
				localctx._simple = this.simpleTypeId();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simpleTypeId(): SimpleTypeIdContext {
		let localctx: SimpleTypeIdContext = new SimpleTypeIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 110, KELParser.RULE_simpleTypeId);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 913;
			_la = this._input.LA(1);
			if(!(_la===57 || _la===85)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public asof(): AsofContext {
		let localctx: AsofContext = new AsofContext(this, this._ctx, this.state);
		this.enterRule(localctx, 112, KELParser.RULE_asof);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 915;
			this.match(KELParser.ASOF);
			this.state = 916;
			localctx._eraname = this.match(KELParser.ID);
			this.state = 917;
			this.match(KELParser.LP);
			this.state = 918;
			this.expression();
			this.state = 921;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===8) {
				{
				this.state = 919;
				this.match(KELParser.COMMA);
				this.state = 920;
				this.expression();
				}
			}

			this.state = 923;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public using(): UsingContext {
		let localctx: UsingContext = new UsingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 114, KELParser.RULE_using);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 925;
			this.match(KELParser.USING);
			this.state = 926;
			this.permitsSpec();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public shellDeclaration(): ShellDeclarationContext {
		let localctx: ShellDeclarationContext = new ShellDeclarationContext(this, this._ctx, this.state);
		this.enterRule(localctx, 116, KELParser.RULE_shellDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 928;
			this.match(KELParser.SHELL);
			this.state = 929;
			this.match(KELParser.COLON);
			this.state = 930;
			localctx._name = this.match(KELParser.ID);
			this.state = 932;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===1) {
				{
				this.state = 931;
				localctx._ps = this.qparams();
				}
			}

			this.state = 934;
			this.match(KELParser.LARROW);
			this.state = 935;
			localctx._ex = this.expression();
			this.state = 939;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===71) {
				{
				{
				this.state = 936;
				this.asof();
				}
				}
				this.state = 941;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 943;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===72) {
				{
				this.state = 942;
				this.using();
				}
			}

			this.state = 946;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===60) {
				{
				this.state = 945;
				this.useClause();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public visual_section(): Visual_sectionContext {
		let localctx: Visual_sectionContext = new Visual_sectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 118, KELParser.RULE_visual_section);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 948;
			this.match(KELParser.VIS);
			this.state = 952;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4294967294) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 4294967295) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & 4294966271) !== 0) || ((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 32767) !== 0)) {
				{
				{
				this.state = 949;
				_la = this._input.LA(1);
				if(_la<=0 || _la===74) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				}
				this.state = 954;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 955;
			this.match(KELParser.ENDVIS);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public resource_section(): Resource_sectionContext {
		let localctx: Resource_sectionContext = new Resource_sectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 120, KELParser.RULE_resource_section);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 957;
			this.match(KELParser.RESOURCES);
			this.state = 961;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4294967294) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 4294967295) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & 4294963199) !== 0) || ((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 32767) !== 0)) {
				{
				{
				this.state = 958;
				_la = this._input.LA(1);
				if(_la<=0 || _la===76) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				}
				this.state = 963;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 964;
			this.match(KELParser.ENDRESOURCES);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let localctx: ExpressionContext = new ExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 122, KELParser.RULE_expression);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 966;
			localctx._be = this.booleanDisjunction();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public booleanDisjunction(): BooleanDisjunctionContext {
		let localctx: BooleanDisjunctionContext = new BooleanDisjunctionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 124, KELParser.RULE_booleanDisjunction);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 968;
			this.booleanConjunction();
			this.state = 973;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===35) {
				{
				{
				this.state = 969;
				localctx._op = this.match(KELParser.OR);
				this.state = 970;
				this.booleanConjunction();
				}
				}
				this.state = 975;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public booleanConjunction(): BooleanConjunctionContext {
		let localctx: BooleanConjunctionContext = new BooleanConjunctionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 126, KELParser.RULE_booleanConjunction);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 976;
			this.booleanTerm();
			this.state = 981;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===37) {
				{
				{
				this.state = 977;
				localctx._op = this.match(KELParser.AND);
				this.state = 978;
				this.booleanTerm();
				}
				}
				this.state = 983;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public booleanTerm(): BooleanTermContext {
		let localctx: BooleanTermContext = new BooleanTermContext(this, this._ctx, this.state);
		this.enterRule(localctx, 128, KELParser.RULE_booleanTerm);
		try {
			this.state = 987;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 36:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 984;
				localctx._op = this.match(KELParser.NOT);
				this.state = 985;
				localctx._t = this.booleanTerm();
				}
				break;
			case 1:
			case 11:
			case 13:
			case 20:
			case 41:
			case 42:
			case 43:
			case 57:
			case 59:
			case 81:
			case 82:
			case 83:
			case 84:
			case 85:
			case 86:
			case 87:
			case 88:
			case 89:
			case 90:
			case 91:
			case 101:
			case 102:
			case 103:
			case 104:
			case 105:
			case 106:
			case 107:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 986;
				localctx._a = this.booleanAtom();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public booleanAtom(): BooleanAtomContext {
		let localctx: BooleanAtomContext = new BooleanAtomContext(this, this._ctx, this.state);
		this.enterRule(localctx, 130, KELParser.RULE_booleanAtom);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 989;
			localctx._e1 = this.valueExpression();
			this.state = 992;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 3)) & ~0x1F) === 0 && ((1 << (_la - 3)) & 4143972365) !== 0)) {
				{
				this.state = 990;
				localctx._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 3)) & ~0x1F) === 0 && ((1 << (_la - 3)) & 4143972365) !== 0))) {
				    localctx._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 991;
				localctx._e2 = this.valueExpression();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public valueExpression(): ValueExpressionContext {
		let localctx: ValueExpressionContext = new ValueExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 132, KELParser.RULE_valueExpression);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 994;
			localctx._l = this.valueTerm();
			this.state = 999;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===20 || _la===22) {
				{
				{
				this.state = 995;
				localctx._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===20 || _la===22)) {
				    localctx._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 996;
				localctx._r = this.valueTerm();
				}
				}
				this.state = 1001;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public valueTerm(): ValueTermContext {
		let localctx: ValueTermContext = new ValueTermContext(this, this._ctx, this.state);
		this.enterRule(localctx, 134, KELParser.RULE_valueTerm);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1002;
			localctx._l = this.valueFactor();
			this.state = 1007;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 15)) & ~0x1F) === 0 && ((1 << (_la - 15)) & 33554753) !== 0)) {
				{
				{
				this.state = 1003;
				localctx._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 15)) & ~0x1F) === 0 && ((1 << (_la - 15)) & 33554753) !== 0))) {
				    localctx._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1004;
				localctx._r = this.valueFactor();
				}
				}
				this.state = 1009;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public valueFactor(): ValueFactorContext {
		let localctx: ValueFactorContext = new ValueFactorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 136, KELParser.RULE_valueFactor);
		let _la: number;
		try {
			this.state = 1037;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 101, this._ctx) ) {
			case 1:
				localctx = new UnaryValueFactorContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1010;
				(localctx as UnaryValueFactorContext)._op = this.match(KELParser.HYPHEN);
				this.state = 1011;
				(localctx as UnaryValueFactorContext)._f = this.valueFactor();
				}
				break;
			case 2:
				localctx = new PropValueFactorContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1012;
				(localctx as PropValueFactorContext)._a = this.valueAtom();
				this.state = 1015;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===10) {
					{
					this.state = 1013;
					(localctx as PropValueFactorContext)._op = this.match(KELParser.COLON);
					this.state = 1014;
					(localctx as PropValueFactorContext)._tp = this.tableProperty();
					}
				}

				}
				break;
			case 3:
				localctx = new ScopedValueFactorContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1017;
				(localctx as ScopedValueFactorContext)._ref = this.qualifiedId();
				this.state = 1018;
				this.match(KELParser.SIGIL);
				this.state = 1019;
				(localctx as ScopedValueFactorContext)._se = this.scopeExpression();
				}
				break;
			case 4:
				localctx = new ConstValueFactorContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1021;
				(localctx as ConstValueFactorContext)._c = this.constant();
				}
				break;
			case 5:
				localctx = new NestedValueFactorContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1022;
				this.match(KELParser.LP);
				this.state = 1023;
				(localctx as NestedValueFactorContext)._e = this.expression();
				this.state = 1024;
				this.match(KELParser.RP);
				}
				break;
			case 6:
				localctx = new SetValueFactorContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1026;
				this.match(KELParser.LSQUARE);
				this.state = 1027;
				this.expression();
				this.state = 1032;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 1028;
					this.match(KELParser.COMMA);
					this.state = 1029;
					this.expression();
					}
					}
					this.state = 1034;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1035;
				this.match(KELParser.RSQUARE);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public valueAtom(): ValueAtomContext {
		let localctx: ValueAtomContext = new ValueAtomContext(this, this._ctx, this.state);
		this.enterRule(localctx, 138, KELParser.RULE_valueAtom);
		let _la: number;
		try {
			this.state = 1050;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 103, this._ctx) ) {
			case 1:
				localctx = new QueryOpValueAtomContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1039;
				(localctx as QueryOpValueAtomContext)._base = this.leadingId();
				this.state = 1041;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1040;
					(localctx as QueryOpValueAtomContext)._qo = this.queryFuncOp();
					}
					}
					this.state = 1043;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 2178) !== 0));
				}
				break;
			case 2:
				localctx = new ProjValueAtomContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1045;
				(localctx as ProjValueAtomContext)._p = this.entityProjection();
				}
				break;
			case 3:
				localctx = new PatternModelAtomContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1046;
				(localctx as PatternModelAtomContext)._m = this.patternModel();
				}
				break;
			case 4:
				localctx = new IdValueAtomContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1047;
				(localctx as IdValueAtomContext)._id = this.leadingId();
				}
				break;
			case 5:
				localctx = new AutoMatchValueAtomContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1048;
				(localctx as AutoMatchValueAtomContext)._sid = this.match(KELParser.SID);
				}
				break;
			case 6:
				localctx = new LinkAtomContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1049;
				this.linkExp();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public queryFuncOp(): QueryFuncOpContext {
		let localctx: QueryFuncOpContext = new QueryFuncOpContext(this, this._ctx, this.state);
		this.enterRule(localctx, 140, KELParser.RULE_queryFuncOp);
		try {
			this.state = 1055;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1052;
				localctx._f = this.funcOrFilter();
				}
				break;
			case 11:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1053;
				localctx._p = this.entityProjection();
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1054;
				localctx._fs = this.fieldSelector();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public funcOrFilter(): FuncOrFilterContext {
		let localctx: FuncOrFilterContext = new FuncOrFilterContext(this, this._ctx, this.state);
		this.enterRule(localctx, 142, KELParser.RULE_funcOrFilter);
		let _la: number;
		try {
			let _alt: number;
			this.state = 1085;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 108, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1057;
				this.match(KELParser.LP);
				this.state = 1058;
				this.match(KELParser.RP);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1059;
				this.match(KELParser.LP);
				this.state = 1060;
				localctx._p1 = this.pair();
				this.state = 1065;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 105, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 1061;
						localctx._op1 = this.match(KELParser.COMMA);
						this.state = 1062;
						localctx._p2 = this.pair();
						}
						}
					}
					this.state = 1067;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 105, this._ctx);
				}
				this.state = 1070;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===8) {
					{
					this.state = 1068;
					localctx._op2 = this.match(KELParser.COMMA);
					this.state = 1069;
					localctx._def = this.expression();
					}
				}

				this.state = 1072;
				this.match(KELParser.RP);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1074;
				this.match(KELParser.LP);
				this.state = 1075;
				localctx._e1 = this.expression();
				this.state = 1080;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 1076;
					localctx._op = this.match(KELParser.COMMA);
					this.state = 1077;
					localctx._e2 = this.expression();
					}
					}
					this.state = 1082;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1083;
				this.match(KELParser.RP);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public pair(): PairContext {
		let localctx: PairContext = new PairContext(this, this._ctx, this.state);
		this.enterRule(localctx, 144, KELParser.RULE_pair);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1087;
			localctx._test = this.expression();
			this.state = 1088;
			localctx._op = this.match(KELParser.RARROW);
			this.state = 1089;
			localctx._value = this.expression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public linkExp(): LinkExpContext {
		let localctx: LinkExpContext = new LinkExpContext(this, this._ctx, this.state);
		this.enterRule(localctx, 146, KELParser.RULE_linkExp);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1091;
			this.match(KELParser.LINK);
			this.state = 1092;
			this.match(KELParser.LP);
			this.state = 1093;
			localctx._start = this.expression();
			this.state = 1094;
			this.match(KELParser.COMMA);
			this.state = 1095;
			localctx._body = this.valueAtom();
			this.state = 1097;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===13) {
				{
				this.state = 1096;
				this.linkSpec();
				}
			}

			this.state = 1099;
			this.linkDegree();
			this.state = 1100;
			this.match(KELParser.COMMA);
			this.state = 1101;
			localctx._end = this.expression();
			this.state = 1102;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public linkSpec(): LinkSpecContext {
		let localctx: LinkSpecContext = new LinkSpecContext(this, this._ctx, this.state);
		this.enterRule(localctx, 148, KELParser.RULE_linkSpec);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1104;
			this.match(KELParser.LSQUARE);
			this.state = 1105;
			localctx._from_ = this.propertyId();
			this.state = 1106;
			this.match(KELParser.COMMA);
			this.state = 1107;
			localctx._to = this.propertyId();
			this.state = 1108;
			this.match(KELParser.RSQUARE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public linkDegree(): LinkDegreeContext {
		let localctx: LinkDegreeContext = new LinkDegreeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 150, KELParser.RULE_linkDegree);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1110;
			this.match(KELParser.STAR);
			this.state = 1111;
			this.match(KELParser.INT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public entityProjection(): EntityProjectionContext {
		let localctx: EntityProjectionContext = new EntityProjectionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 152, KELParser.RULE_entityProjection);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1113;
			localctx._b = this.match(KELParser.LCURL);
			this.state = 1114;
			localctx._e1 = this.namedExpression();
			this.state = 1119;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 1115;
				this.match(KELParser.COMMA);
				this.state = 1116;
				localctx._e2 = this.namedExpression();
				}
				}
				this.state = 1121;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1122;
			this.match(KELParser.RCURL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public namedExpression(): NamedExpressionContext {
		let localctx: NamedExpressionContext = new NamedExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 154, KELParser.RULE_namedExpression);
		try {
			this.state = 1128;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 111, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1124;
				localctx._n = this.match(KELParser.ID);
				this.state = 1125;
				this.match(KELParser.DEFEQ);
				this.state = 1126;
				localctx._ex = this.expression();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1127;
				localctx._ex = this.expression();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public patternModel(): PatternModelContext {
		let localctx: PatternModelContext = new PatternModelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 156, KELParser.RULE_patternModel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1130;
			this.match(KELParser.MODEL);
			this.state = 1131;
			this.match(KELParser.LP);
			this.state = 1132;
			this.patternSubmodel();
			this.state = 1137;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 1133;
				this.match(KELParser.COMMA);
				this.state = 1134;
				this.patternSubmodel();
				}
				}
				this.state = 1139;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1140;
			this.match(KELParser.RP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public patternSubmodel(): PatternSubmodelContext {
		let localctx: PatternSubmodelContext = new PatternSubmodelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 158, KELParser.RULE_patternSubmodel);
		let _la: number;
		try {
			this.state = 1156;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 83:
				localctx = new SingleValuedPatternSubmodelContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1142;
				this.match(KELParser.PID);
				}
				break;
			case 11:
			case 84:
				localctx = new MultiValuedPatternSubmodelContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1144;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===84) {
					{
					this.state = 1143;
					(localctx as MultiValuedPatternSubmodelContext)._n = this.match(KELParser.PSID);
					}
				}

				this.state = 1146;
				this.match(KELParser.LCURL);
				this.state = 1147;
				this.match(KELParser.PID);
				this.state = 1152;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===8) {
					{
					{
					this.state = 1148;
					this.match(KELParser.COMMA);
					this.state = 1149;
					this.match(KELParser.PID);
					}
					}
					this.state = 1154;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1155;
				this.match(KELParser.RCURL);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fieldSelector(): FieldSelectorContext {
		let localctx: FieldSelectorContext = new FieldSelectorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 160, KELParser.RULE_fieldSelector);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1158;
			this.match(KELParser.DOT);
			this.state = 1159;
			localctx._id = this.fieldId();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public scopeExpression(): ScopeExpressionContext {
		let localctx: ScopeExpressionContext = new ScopeExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 162, KELParser.RULE_scopeExpression);
		try {
			this.state = 1168;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 116, this._ctx) ) {
			case 1:
				localctx = new SelfScopeExpressionContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1161;
				(localctx as SelfScopeExpressionContext)._p = this.tableProperty();
				}
				break;
			case 2:
				localctx = new OuterScopeExpressionContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1162;
				this.match(KELParser.CARET);
				this.state = 1163;
				(localctx as OuterScopeExpressionContext)._p = this.tableProperty();
				}
				break;
			case 3:
				localctx = new ExplicitScopeExpressionContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1164;
				(localctx as ExplicitScopeExpressionContext)._se = this.valueAtom();
				this.state = 1165;
				this.match(KELParser.COLON);
				this.state = 1166;
				(localctx as ExplicitScopeExpressionContext)._p = this.tableProperty();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tableProperty(): TablePropertyContext {
		let localctx: TablePropertyContext = new TablePropertyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 164, KELParser.RULE_tableProperty);
		let _la: number;
		try {
			this.state = 1180;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 118, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1170;
				localctx._id = this.tablePropId();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1171;
				localctx._id = this.tablePropId();
				this.state = 1172;
				this.match(KELParser.LP);
				this.state = 1173;
				localctx._v = this.expression();
				this.state = 1176;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===8) {
					{
					this.state = 1174;
					this.match(KELParser.COMMA);
					this.state = 1175;
					localctx._w = this.expression();
					}
				}

				this.state = 1178;
				this.match(KELParser.RP);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public func_id(): Func_idContext {
		let localctx: Func_idContext = new Func_idContext(this, this._ctx, this.state);
		this.enterRule(localctx, 166, KELParser.RULE_func_id);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1182;
			this.match(KELParser.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public qualifiedId(): QualifiedIdContext {
		let localctx: QualifiedIdContext = new QualifiedIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 168, KELParser.RULE_qualifiedId);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1184;
			localctx._id1 = this.leadingId();
			this.state = 1189;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===7) {
				{
				{
				this.state = 1185;
				this.match(KELParser.DOT);
				this.state = 1186;
				localctx._id2 = this.fieldId();
				}
				}
				this.state = 1191;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public leadingId(): LeadingIdContext {
		let localctx: LeadingIdContext = new LeadingIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 170, KELParser.RULE_leadingId);
		try {
			this.state = 1197;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 85:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1192;
				localctx._id = this.match(KELParser.ID);
				}
				break;
			case 57:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1193;
				localctx._id = this.match(KELParser.UID);
				}
				break;
			case 82:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1194;
				localctx._id = this.match(KELParser.SINT);
				}
				break;
			case 83:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1195;
				localctx._pid = this.match(KELParser.PID);
				}
				break;
			case 84:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1196;
				localctx._psid = this.match(KELParser.PSID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public fieldId(): FieldIdContext {
		let localctx: FieldIdContext = new FieldIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 172, KELParser.RULE_fieldId);
		try {
			this.state = 1203;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 85:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1199;
				localctx._id = this.match(KELParser.ID);
				}
				break;
			case 57:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1200;
				localctx._id = this.match(KELParser.UID);
				}
				break;
			case 83:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1201;
				localctx._id = this.match(KELParser.PID);
				}
				break;
			case 84:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1202;
				localctx._id = this.match(KELParser.PSID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tablePropId(): TablePropIdContext {
		let localctx: TablePropIdContext = new TablePropIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 174, KELParser.RULE_tablePropId);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1205;
			localctx._id = this.match(KELParser.ID);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public propertyId(): PropertyIdContext {
		let localctx: PropertyIdContext = new PropertyIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 176, KELParser.RULE_propertyId);
		try {
			this.state = 1209;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 85:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1207;
				localctx._id = this.match(KELParser.ID);
				}
				break;
			case 57:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1208;
				localctx._id = this.match(KELParser.UID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public constant(): ConstantContext {
		let localctx: ConstantContext = new ConstantContext(this, this._ctx, this.state);
		this.enterRule(localctx, 178, KELParser.RULE_constant);
		try {
			this.state = 1214;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 20:
			case 41:
			case 42:
			case 86:
			case 87:
			case 88:
			case 89:
			case 90:
			case 91:
			case 101:
			case 102:
			case 103:
			case 104:
			case 105:
			case 106:
			case 107:
				localctx = new NonSetConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1211;
				this.simpleConstant();
				}
				break;
			case 13:
				localctx = new EmptySetConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1212;
				this.match(KELParser.LSQUARE);
				this.state = 1213;
				this.match(KELParser.RSQUARE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simpleConstant(): SimpleConstantContext {
		let localctx: SimpleConstantContext = new SimpleConstantContext(this, this._ctx, this.state);
		this.enterRule(localctx, 180, KELParser.RULE_simpleConstant);
		try {
			this.state = 1222;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 124, this._ctx) ) {
			case 1:
				localctx = new StringConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1216;
				(localctx as StringConstantContext)._s = this.match(KELParser.STR);
				}
				break;
			case 2:
				localctx = new GeneralRealConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1217;
				(localctx as GeneralRealConstantContext)._r = this.realConstant();
				}
				break;
			case 3:
				localctx = new TrueConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1218;
				(localctx as TrueConstantContext)._b = this.match(KELParser.TRUE);
				}
				break;
			case 4:
				localctx = new FalseConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1219;
				(localctx as FalseConstantContext)._b = this.match(KELParser.FALSE);
				}
				break;
			case 5:
				localctx = new TypedConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1220;
				(localctx as TypedConstantContext)._t = this.match(KELParser.TYPDCONST);
				}
				break;
			case 6:
				localctx = new GeneralIntConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1221;
				(localctx as GeneralIntConstantContext)._i = this.intConstant();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public intConstant(): IntConstantContext {
		let localctx: IntConstantContext = new IntConstantContext(this, this._ctx, this.state);
		this.enterRule(localctx, 182, KELParser.RULE_intConstant);
		try {
			this.state = 1233;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 86:
				localctx = new DecIntConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1224;
				(localctx as DecIntConstantContext)._i = this.match(KELParser.INT);
				}
				break;
			case 20:
				localctx = new NegIntConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1225;
				this.match(KELParser.HYPHEN);
				this.state = 1226;
				(localctx as NegIntConstantContext)._i = this.match(KELParser.INT);
				}
				break;
			case 87:
				localctx = new HexConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1227;
				(localctx as HexConstantContext)._i = this.match(KELParser.HEXINT);
				}
				break;
			case 88:
				localctx = new BinConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1228;
				(localctx as BinConstantContext)._i = this.match(KELParser.BININT);
				}
				break;
			case 103:
				localctx = new BadHexConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1229;
				(localctx as BadHexConstantContext)._i = this.match(KELParser.BAD_HEX);
				}
				break;
			case 101:
				localctx = new BadBinConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1230;
				(localctx as BadBinConstantContext)._i = this.match(KELParser.BAD_BIN);
				}
				break;
			case 102:
				localctx = new NoFlagHexConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 1231;
				(localctx as NoFlagHexConstantContext)._i = this.match(KELParser.HEX_NO_X);
				}
				break;
			case 104:
				localctx = new BadMixConstantContext(this, localctx);
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 1232;
				(localctx as BadMixConstantContext)._i = this.match(KELParser.BAD_MIX);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public realConstant(): RealConstantContext {
		let localctx: RealConstantContext = new RealConstantContext(this, this._ctx, this.state);
		this.enterRule(localctx, 184, KELParser.RULE_realConstant);
		try {
			this.state = 1241;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 89:
				localctx = new RealConstContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1235;
				(localctx as RealConstContext)._r = this.match(KELParser.REAL);
				}
				break;
			case 20:
				localctx = new RealConstContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1236;
				this.match(KELParser.HYPHEN);
				this.state = 1237;
				(localctx as RealConstContext)._r = this.match(KELParser.REAL);
				}
				break;
			case 105:
				localctx = new BadRealConstContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1238;
				(localctx as BadRealConstContext)._r = this.match(KELParser.BAD_REAL_A);
				}
				break;
			case 106:
				localctx = new BadRealConstContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1239;
				(localctx as BadRealConstContext)._r = this.match(KELParser.BAD_REAL_B);
				}
				break;
			case 107:
				localctx = new BadRealConstContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1240;
				(localctx as BadRealConstContext)._r = this.match(KELParser.BAD_REAL_C);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eclExpression(): EclExpressionContext {
		let localctx: EclExpressionContext = new EclExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 186, KELParser.RULE_eclExpression);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1243;
			this.match(KELParser.ECL);
			this.state = 1244;
			this.match(KELParser.LP);
			this.state = 1245;
			this.eclBody();
			this.state = 1246;
			this.match(KELParser.RP);
			this.state = 1249;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===51) {
				{
				this.state = 1247;
				this.match(KELParser.FROM);
				this.state = 1248;
				this.eclImportList();
				}
			}

			this.state = 1251;
			this.match(KELParser.RETURNS);
			this.state = 1252;
			this.returnTypeId();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eclBody(): EclBodyContext {
		let localctx: EclBodyContext = new EclBodyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 188, KELParser.RULE_eclBody);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1255;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1254;
					this.eclFragment();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1257;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 128, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eclFragment(): EclFragmentContext {
		let localctx: EclFragmentContext = new EclFragmentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 190, KELParser.RULE_eclFragment);
		let _la: number;
		try {
			this.state = 1272;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 130, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1259;
				this.match(KELParser.LP);
				this.state = 1263;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 4294967290) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 4294967295) !== 0) || ((((_la - 64)) & ~0x1F) === 0 && ((1 << (_la - 64)) & 4294967295) !== 0) || ((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 32767) !== 0)) {
					{
					{
					this.state = 1260;
					this.eclBody();
					}
					}
					this.state = 1265;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1266;
				this.match(KELParser.RP);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1267;
				_la = this._input.LA(1);
				if(_la<=0 || _la===1 || _la===2) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1268;
				this.match(KELParser.EXCLAIM);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1269;
				this.match(KELParser.TILDE);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1270;
				this.match(KELParser.AMP);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1271;
				this.match(KELParser.PIPE);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eclImportList(): EclImportListContext {
		let localctx: EclImportListContext = new EclImportListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 192, KELParser.RULE_eclImportList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1274;
			this.eclImportItem();
			this.state = 1279;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===8) {
				{
				{
				this.state = 1275;
				this.match(KELParser.COMMA);
				this.state = 1276;
				this.eclImportItem();
				}
				}
				this.state = 1281;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eclImportItem(): EclImportItemContext {
		let localctx: EclImportItemContext = new EclImportItemContext(this, this._ctx, this.state);
		this.enterRule(localctx, 194, KELParser.RULE_eclImportItem);
		try {
			this.state = 1284;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 85:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1282;
				this.dotId();
				}
				break;
			case 16:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1283;
				this.match(KELParser.SIGIL);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public returnTypeId(): ReturnTypeIdContext {
		let localctx: ReturnTypeIdContext = new ReturnTypeIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 196, KELParser.RULE_returnTypeId);
		try {
			this.state = 1290;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 57:
			case 85:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1286;
				localctx._simple = this.simpleTypeId();
				}
				break;
			case 70:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1287;
				localctx._isSet = this.match(KELParser.SET);
				this.state = 1288;
				this.match(KELParser.OF);
				this.state = 1289;
				localctx._simple = this.simpleTypeId();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public static readonly _serializedATN: number[] = [4,1,110,1293,2,0,7,0,
	2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,
	2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,
	17,7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,
	7,24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,
	31,2,32,7,32,2,33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,
	2,39,7,39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
	46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,52,2,53,
	7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,2,59,7,59,2,60,7,
	60,2,61,7,61,2,62,7,62,2,63,7,63,2,64,7,64,2,65,7,65,2,66,7,66,2,67,7,67,
	2,68,7,68,2,69,7,69,2,70,7,70,2,71,7,71,2,72,7,72,2,73,7,73,2,74,7,74,2,
	75,7,75,2,76,7,76,2,77,7,77,2,78,7,78,2,79,7,79,2,80,7,80,2,81,7,81,2,82,
	7,82,2,83,7,83,2,84,7,84,2,85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,2,89,7,
	89,2,90,7,90,2,91,7,91,2,92,7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,96,7,96,
	2,97,7,97,2,98,7,98,1,0,5,0,200,8,0,10,0,12,0,203,9,0,1,0,1,0,1,0,5,0,208,
	8,0,10,0,12,0,211,9,0,1,0,1,0,1,0,1,0,1,0,3,0,218,8,0,1,0,1,0,3,0,222,8,
	0,5,0,224,8,0,10,0,12,0,227,9,0,1,0,1,0,1,1,1,1,3,1,233,8,1,1,2,1,2,1,2,
	1,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,245,8,2,1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,
	1,3,1,3,1,3,1,3,1,3,1,3,1,3,1,3,3,3,263,8,3,1,4,1,4,1,4,1,4,1,4,1,4,1,4,
	5,4,272,8,4,10,4,12,4,275,9,4,1,4,1,4,1,5,1,5,1,5,1,5,1,5,1,5,3,5,285,8,
	5,1,5,3,5,288,8,5,1,6,1,6,1,6,1,6,5,6,294,8,6,10,6,12,6,297,9,6,1,7,1,7,
	1,8,1,8,1,8,1,8,5,8,305,8,8,10,8,12,8,308,9,8,1,8,1,8,1,8,1,8,5,8,314,8,
	8,10,8,12,8,317,9,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,3,8,328,8,8,1,9,
	1,9,1,10,1,10,1,10,1,10,1,11,1,11,1,11,1,11,1,11,1,11,4,11,342,8,11,11,
	11,12,11,343,1,11,1,11,1,12,1,12,1,12,1,12,1,12,1,12,3,12,354,8,12,1,13,
	1,13,1,13,1,13,1,13,1,13,1,13,5,13,363,8,13,10,13,12,13,366,9,13,1,14,1,
	14,1,14,1,14,1,14,1,14,1,14,5,14,375,8,14,10,14,12,14,378,9,14,1,14,1,14,
	1,15,1,15,3,15,384,8,15,1,16,1,16,1,16,1,16,1,16,5,16,391,8,16,10,16,12,
	16,394,9,16,1,16,1,16,1,17,1,17,1,18,3,18,401,8,18,1,18,1,18,3,18,405,8,
	18,1,18,1,18,1,18,3,18,410,8,18,1,18,3,18,413,8,18,1,18,1,18,3,18,417,8,
	18,1,18,1,18,1,18,3,18,422,8,18,1,18,1,18,3,18,426,8,18,1,18,1,18,1,18,
	1,18,3,18,432,8,18,1,18,1,18,1,18,1,18,1,18,1,18,3,18,440,8,18,1,18,1,18,
	1,18,1,18,1,18,1,18,3,18,448,8,18,1,18,1,18,1,18,1,18,1,18,1,18,1,18,3,
	18,457,8,18,1,19,1,19,1,19,3,19,462,8,19,1,19,1,19,1,20,1,20,1,20,1,20,
	1,20,5,20,471,8,20,10,20,12,20,474,9,20,3,20,476,8,20,1,20,1,20,1,21,1,
	21,1,21,1,21,1,21,1,22,1,22,1,22,1,22,5,22,489,8,22,10,22,12,22,492,9,22,
	1,22,1,22,1,23,1,23,1,23,1,23,1,23,5,23,501,8,23,10,23,12,23,504,9,23,1,
	23,1,23,1,23,1,23,1,23,1,23,3,23,512,8,23,1,24,1,24,1,24,1,24,1,24,3,24,
	519,8,24,1,24,1,24,1,24,1,24,5,24,525,8,24,10,24,12,24,528,9,24,1,24,1,
	24,3,24,532,8,24,1,25,1,25,1,26,1,26,1,26,1,26,5,26,540,8,26,10,26,12,26,
	543,9,26,1,27,1,27,1,27,1,27,1,27,1,27,4,27,551,8,27,11,27,12,27,552,1,
	27,1,27,1,28,1,28,1,28,1,28,1,28,1,28,4,28,563,8,28,11,28,12,28,564,1,28,
	1,28,1,29,1,29,1,29,1,29,1,29,1,29,1,29,1,29,3,29,577,8,29,4,29,579,8,29,
	11,29,12,29,580,1,29,1,29,1,30,1,30,1,31,1,31,1,31,1,31,5,31,591,8,31,10,
	31,12,31,594,9,31,1,32,1,32,1,32,1,32,1,32,1,32,3,32,602,8,32,4,32,604,
	8,32,11,32,12,32,605,1,32,1,32,1,33,1,33,1,34,1,34,1,34,1,34,3,34,616,8,
	34,1,34,1,34,1,34,3,34,621,8,34,5,34,623,8,34,10,34,12,34,626,9,34,1,34,
	1,34,1,35,1,35,1,35,1,35,1,35,1,35,5,35,636,8,35,10,35,12,35,639,9,35,1,
	35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,5,35,649,8,35,10,35,12,35,652,9,35,
	1,35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,5,35,663,8,35,10,35,12,35,
	666,9,35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,1,35,1,
	35,5,35,681,8,35,10,35,12,35,684,9,35,1,35,1,35,3,35,688,8,35,1,36,1,36,
	1,36,1,36,1,36,1,36,3,36,696,8,36,1,36,3,36,699,8,36,1,36,1,36,1,36,1,36,
	3,36,705,8,36,1,36,1,36,1,36,1,36,1,36,1,36,1,36,3,36,714,8,36,1,36,1,36,
	1,36,1,36,1,36,1,36,1,36,3,36,723,8,36,1,37,1,37,1,37,5,37,728,8,37,10,
	37,12,37,731,9,37,1,38,1,38,1,38,1,38,1,38,1,39,1,39,1,39,1,39,1,39,5,39,
	743,8,39,10,39,12,39,746,9,39,1,39,3,39,749,8,39,1,40,1,40,1,40,1,40,1,
	40,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,
	1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,1,41,3,41,779,8,41,1,42,1,42,1,
	42,5,42,784,8,42,10,42,12,42,787,9,42,1,42,3,42,790,8,42,1,43,1,43,1,43,
	5,43,795,8,43,10,43,12,43,798,9,43,1,44,1,44,1,44,1,44,1,45,1,45,1,45,5,
	45,807,8,45,10,45,12,45,810,9,45,1,46,1,46,1,46,1,46,1,46,5,46,817,8,46,
	10,46,12,46,820,9,46,1,46,1,46,1,47,1,47,1,47,1,47,3,47,828,8,47,1,47,1,
	47,1,47,1,48,1,48,1,48,1,48,5,48,837,8,48,10,48,12,48,840,9,48,1,48,1,48,
	1,49,3,49,845,8,49,1,49,1,49,1,50,1,50,3,50,851,8,50,1,51,1,51,1,51,1,51,
	3,51,857,8,51,1,51,1,51,1,51,1,51,5,51,863,8,51,10,51,12,51,866,9,51,1,
	51,5,51,869,8,51,10,51,12,51,872,9,51,1,51,3,51,875,8,51,1,51,3,51,878,
	8,51,1,52,1,52,1,52,1,52,5,52,884,8,52,10,52,12,52,887,9,52,1,52,1,52,1,
	53,3,53,892,8,53,1,53,1,53,3,53,896,8,53,1,53,1,53,1,53,1,53,1,53,1,53,
	1,53,1,53,3,53,906,8,53,1,54,1,54,1,54,1,54,3,54,912,8,54,1,55,1,55,1,56,
	1,56,1,56,1,56,1,56,1,56,3,56,922,8,56,1,56,1,56,1,57,1,57,1,57,1,58,1,
	58,1,58,1,58,3,58,933,8,58,1,58,1,58,1,58,5,58,938,8,58,10,58,12,58,941,
	9,58,1,58,3,58,944,8,58,1,58,3,58,947,8,58,1,59,1,59,5,59,951,8,59,10,59,
	12,59,954,9,59,1,59,1,59,1,60,1,60,5,60,960,8,60,10,60,12,60,963,9,60,1,
	60,1,60,1,61,1,61,1,62,1,62,1,62,5,62,972,8,62,10,62,12,62,975,9,62,1,63,
	1,63,1,63,5,63,980,8,63,10,63,12,63,983,9,63,1,64,1,64,1,64,3,64,988,8,
	64,1,65,1,65,1,65,3,65,993,8,65,1,66,1,66,1,66,5,66,998,8,66,10,66,12,66,
	1001,9,66,1,67,1,67,1,67,5,67,1006,8,67,10,67,12,67,1009,9,67,1,68,1,68,
	1,68,1,68,1,68,3,68,1016,8,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,
	68,1,68,1,68,1,68,1,68,5,68,1031,8,68,10,68,12,68,1034,9,68,1,68,1,68,3,
	68,1038,8,68,1,69,1,69,4,69,1042,8,69,11,69,12,69,1043,1,69,1,69,1,69,1,
	69,1,69,3,69,1051,8,69,1,70,1,70,1,70,3,70,1056,8,70,1,71,1,71,1,71,1,71,
	1,71,1,71,5,71,1064,8,71,10,71,12,71,1067,9,71,1,71,1,71,3,71,1071,8,71,
	1,71,1,71,1,71,1,71,1,71,1,71,5,71,1079,8,71,10,71,12,71,1082,9,71,1,71,
	1,71,3,71,1086,8,71,1,72,1,72,1,72,1,72,1,73,1,73,1,73,1,73,1,73,1,73,3,
	73,1098,8,73,1,73,1,73,1,73,1,73,1,73,1,74,1,74,1,74,1,74,1,74,1,74,1,75,
	1,75,1,75,1,76,1,76,1,76,1,76,5,76,1118,8,76,10,76,12,76,1121,9,76,1,76,
	1,76,1,77,1,77,1,77,1,77,3,77,1129,8,77,1,78,1,78,1,78,1,78,1,78,5,78,1136,
	8,78,10,78,12,78,1139,9,78,1,78,1,78,1,79,1,79,3,79,1145,8,79,1,79,1,79,
	1,79,1,79,5,79,1151,8,79,10,79,12,79,1154,9,79,1,79,3,79,1157,8,79,1,80,
	1,80,1,80,1,81,1,81,1,81,1,81,1,81,1,81,1,81,3,81,1169,8,81,1,82,1,82,1,
	82,1,82,1,82,1,82,3,82,1177,8,82,1,82,1,82,3,82,1181,8,82,1,83,1,83,1,84,
	1,84,1,84,5,84,1188,8,84,10,84,12,84,1191,9,84,1,85,1,85,1,85,1,85,1,85,
	3,85,1198,8,85,1,86,1,86,1,86,1,86,3,86,1204,8,86,1,87,1,87,1,88,1,88,3,
	88,1210,8,88,1,89,1,89,1,89,3,89,1215,8,89,1,90,1,90,1,90,1,90,1,90,1,90,
	3,90,1223,8,90,1,91,1,91,1,91,1,91,1,91,1,91,1,91,1,91,1,91,3,91,1234,8,
	91,1,92,1,92,1,92,1,92,1,92,1,92,3,92,1242,8,92,1,93,1,93,1,93,1,93,1,93,
	1,93,3,93,1250,8,93,1,93,1,93,1,93,1,94,4,94,1256,8,94,11,94,12,94,1257,
	1,95,1,95,5,95,1262,8,95,10,95,12,95,1265,9,95,1,95,1,95,1,95,1,95,1,95,
	1,95,3,95,1273,8,95,1,96,1,96,1,96,5,96,1278,8,96,10,96,12,96,1281,9,96,
	1,97,1,97,3,97,1285,8,97,1,98,1,98,1,98,1,98,3,98,1291,8,98,1,98,0,0,99,
	0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,
	52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,
	100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,130,132,134,
	136,138,140,142,144,146,148,150,152,154,156,158,160,162,164,166,168,170,
	172,174,176,178,180,182,184,186,188,190,192,194,196,0,10,1,0,48,49,1,0,
	55,56,2,0,57,57,85,85,2,0,55,55,63,63,1,0,74,74,1,0,76,76,4,0,3,3,5,6,27,
	29,31,34,2,0,20,20,22,22,4,0,15,15,21,21,23,23,40,40,1,0,1,2,1397,0,201,
	1,0,0,0,2,232,1,0,0,0,4,244,1,0,0,0,6,262,1,0,0,0,8,264,1,0,0,0,10,278,
	1,0,0,0,12,289,1,0,0,0,14,298,1,0,0,0,16,327,1,0,0,0,18,329,1,0,0,0,20,
	331,1,0,0,0,22,335,1,0,0,0,24,353,1,0,0,0,26,355,1,0,0,0,28,367,1,0,0,0,
	30,383,1,0,0,0,32,385,1,0,0,0,34,397,1,0,0,0,36,456,1,0,0,0,38,458,1,0,
	0,0,40,465,1,0,0,0,42,479,1,0,0,0,44,484,1,0,0,0,46,511,1,0,0,0,48,531,
	1,0,0,0,50,533,1,0,0,0,52,535,1,0,0,0,54,544,1,0,0,0,56,556,1,0,0,0,58,
	568,1,0,0,0,60,584,1,0,0,0,62,586,1,0,0,0,64,595,1,0,0,0,66,609,1,0,0,0,
	68,611,1,0,0,0,70,687,1,0,0,0,72,722,1,0,0,0,74,724,1,0,0,0,76,732,1,0,
	0,0,78,748,1,0,0,0,80,750,1,0,0,0,82,778,1,0,0,0,84,789,1,0,0,0,86,791,
	1,0,0,0,88,799,1,0,0,0,90,803,1,0,0,0,92,811,1,0,0,0,94,823,1,0,0,0,96,
	832,1,0,0,0,98,844,1,0,0,0,100,850,1,0,0,0,102,852,1,0,0,0,104,879,1,0,
	0,0,106,905,1,0,0,0,108,911,1,0,0,0,110,913,1,0,0,0,112,915,1,0,0,0,114,
	925,1,0,0,0,116,928,1,0,0,0,118,948,1,0,0,0,120,957,1,0,0,0,122,966,1,0,
	0,0,124,968,1,0,0,0,126,976,1,0,0,0,128,987,1,0,0,0,130,989,1,0,0,0,132,
	994,1,0,0,0,134,1002,1,0,0,0,136,1037,1,0,0,0,138,1050,1,0,0,0,140,1055,
	1,0,0,0,142,1085,1,0,0,0,144,1087,1,0,0,0,146,1091,1,0,0,0,148,1104,1,0,
	0,0,150,1110,1,0,0,0,152,1113,1,0,0,0,154,1128,1,0,0,0,156,1130,1,0,0,0,
	158,1156,1,0,0,0,160,1158,1,0,0,0,162,1168,1,0,0,0,164,1180,1,0,0,0,166,
	1182,1,0,0,0,168,1184,1,0,0,0,170,1197,1,0,0,0,172,1203,1,0,0,0,174,1205,
	1,0,0,0,176,1209,1,0,0,0,178,1214,1,0,0,0,180,1222,1,0,0,0,182,1233,1,0,
	0,0,184,1241,1,0,0,0,186,1243,1,0,0,0,188,1255,1,0,0,0,190,1272,1,0,0,0,
	192,1274,1,0,0,0,194,1284,1,0,0,0,196,1290,1,0,0,0,198,200,3,6,3,0,199,
	198,1,0,0,0,200,203,1,0,0,0,201,199,1,0,0,0,201,202,1,0,0,0,202,209,1,0,
	0,0,203,201,1,0,0,0,204,205,3,2,1,0,205,206,5,9,0,0,206,208,1,0,0,0,207,
	204,1,0,0,0,208,211,1,0,0,0,209,207,1,0,0,0,209,210,1,0,0,0,210,225,1,0,
	0,0,211,209,1,0,0,0,212,213,3,4,2,0,213,214,5,9,0,0,214,224,1,0,0,0,215,
	217,3,118,59,0,216,218,5,9,0,0,217,216,1,0,0,0,217,218,1,0,0,0,218,224,
	1,0,0,0,219,221,3,120,60,0,220,222,5,9,0,0,221,220,1,0,0,0,221,222,1,0,
	0,0,222,224,1,0,0,0,223,212,1,0,0,0,223,215,1,0,0,0,223,219,1,0,0,0,224,
	227,1,0,0,0,225,223,1,0,0,0,225,226,1,0,0,0,226,228,1,0,0,0,227,225,1,0,
	0,0,228,229,5,0,0,1,229,1,1,0,0,0,230,233,3,8,4,0,231,233,3,12,6,0,232,
	230,1,0,0,0,232,231,1,0,0,0,233,3,1,0,0,0,234,245,3,16,8,0,235,245,3,18,
	9,0,236,245,3,28,14,0,237,245,3,52,26,0,238,245,3,54,27,0,239,245,3,56,
	28,0,240,245,3,82,41,0,241,245,3,94,47,0,242,245,3,102,51,0,243,245,3,116,
	58,0,244,234,1,0,0,0,244,235,1,0,0,0,244,236,1,0,0,0,244,237,1,0,0,0,244,
	238,1,0,0,0,244,239,1,0,0,0,244,240,1,0,0,0,244,241,1,0,0,0,244,242,1,0,
	0,0,244,243,1,0,0,0,245,5,1,0,0,0,246,247,5,46,0,0,247,248,5,1,0,0,248,
	249,5,85,0,0,249,263,5,2,0,0,250,251,5,46,0,0,251,252,5,1,0,0,252,253,5,
	85,0,0,253,254,5,8,0,0,254,255,5,90,0,0,255,263,5,2,0,0,256,257,5,46,0,
	0,257,258,5,1,0,0,258,259,5,85,0,0,259,260,5,8,0,0,260,261,5,86,0,0,261,
	263,5,2,0,0,262,246,1,0,0,0,262,250,1,0,0,0,262,256,1,0,0,0,263,7,1,0,0,
	0,264,265,5,38,0,0,265,266,5,85,0,0,266,267,5,85,0,0,267,268,5,1,0,0,268,
	273,3,10,5,0,269,270,5,8,0,0,270,272,3,10,5,0,271,269,1,0,0,0,272,275,1,
	0,0,0,273,271,1,0,0,0,273,274,1,0,0,0,274,276,1,0,0,0,275,273,1,0,0,0,276,
	277,5,2,0,0,277,9,1,0,0,0,278,287,5,85,0,0,279,280,5,3,0,0,280,281,5,39,
	0,0,281,282,5,1,0,0,282,284,5,85,0,0,283,285,5,85,0,0,284,283,1,0,0,0,284,
	285,1,0,0,0,285,286,1,0,0,0,286,288,5,2,0,0,287,279,1,0,0,0,287,288,1,0,
	0,0,288,11,1,0,0,0,289,290,5,47,0,0,290,295,3,14,7,0,291,292,5,8,0,0,292,
	294,3,14,7,0,293,291,1,0,0,0,294,297,1,0,0,0,295,293,1,0,0,0,295,296,1,
	0,0,0,296,13,1,0,0,0,297,295,1,0,0,0,298,299,5,85,0,0,299,15,1,0,0,0,300,
	301,5,50,0,0,301,306,3,74,37,0,302,303,5,8,0,0,303,305,3,74,37,0,304,302,
	1,0,0,0,305,308,1,0,0,0,306,304,1,0,0,0,306,307,1,0,0,0,307,328,1,0,0,0,
	308,306,1,0,0,0,309,310,5,50,0,0,310,315,5,85,0,0,311,312,5,8,0,0,312,314,
	5,85,0,0,313,311,1,0,0,0,314,317,1,0,0,0,315,313,1,0,0,0,315,316,1,0,0,
	0,316,318,1,0,0,0,317,315,1,0,0,0,318,319,5,51,0,0,319,328,3,74,37,0,320,
	321,5,50,0,0,321,322,5,78,0,0,322,323,5,51,0,0,323,324,3,74,37,0,324,325,
	5,77,0,0,325,326,5,85,0,0,326,328,1,0,0,0,327,300,1,0,0,0,327,309,1,0,0,
	0,327,320,1,0,0,0,328,17,1,0,0,0,329,330,3,22,11,0,330,19,1,0,0,0,331,332,
	3,22,11,0,332,333,5,9,0,0,333,334,5,0,0,1,334,21,1,0,0,0,335,336,5,52,0,
	0,336,337,5,85,0,0,337,341,5,9,0,0,338,339,3,24,12,0,339,340,5,9,0,0,340,
	342,1,0,0,0,341,338,1,0,0,0,342,343,1,0,0,0,343,341,1,0,0,0,343,344,1,0,
	0,0,344,345,1,0,0,0,345,346,5,53,0,0,346,23,1,0,0,0,347,354,3,16,8,0,348,
	354,3,28,14,0,349,354,3,52,26,0,350,354,3,82,41,0,351,354,3,94,47,0,352,
	354,3,26,13,0,353,347,1,0,0,0,353,348,1,0,0,0,353,349,1,0,0,0,353,350,1,
	0,0,0,353,351,1,0,0,0,353,352,1,0,0,0,354,25,1,0,0,0,355,356,5,54,0,0,356,
	357,5,10,0,0,357,358,5,85,0,0,358,359,5,29,0,0,359,364,3,122,61,0,360,361,
	5,8,0,0,361,363,3,122,61,0,362,360,1,0,0,0,363,366,1,0,0,0,364,362,1,0,
	0,0,364,365,1,0,0,0,365,27,1,0,0,0,366,364,1,0,0,0,367,368,5,85,0,0,368,
	369,5,26,0,0,369,370,7,0,0,0,370,371,5,1,0,0,371,376,3,30,15,0,372,373,
	5,8,0,0,373,375,3,30,15,0,374,372,1,0,0,0,375,378,1,0,0,0,376,374,1,0,0,
	0,376,377,1,0,0,0,377,379,1,0,0,0,378,376,1,0,0,0,379,380,5,2,0,0,380,29,
	1,0,0,0,381,384,3,32,16,0,382,384,3,46,23,0,383,381,1,0,0,0,383,382,1,0,
	0,0,384,31,1,0,0,0,385,386,3,34,17,0,386,387,5,1,0,0,387,392,3,36,18,0,
	388,389,5,8,0,0,389,391,3,36,18,0,390,388,1,0,0,0,391,394,1,0,0,0,392,390,
	1,0,0,0,392,393,1,0,0,0,393,395,1,0,0,0,394,392,1,0,0,0,395,396,5,2,0,0,
	396,33,1,0,0,0,397,398,7,1,0,0,398,35,1,0,0,0,399,401,5,85,0,0,400,399,
	1,0,0,0,400,401,1,0,0,0,401,402,1,0,0,0,402,457,5,85,0,0,403,405,5,85,0,
	0,404,403,1,0,0,0,404,405,1,0,0,0,405,406,1,0,0,0,406,407,5,85,0,0,407,
	409,5,3,0,0,408,410,3,38,19,0,409,408,1,0,0,0,409,410,1,0,0,0,410,412,1,
	0,0,0,411,413,3,40,20,0,412,411,1,0,0,0,412,413,1,0,0,0,413,414,1,0,0,0,
	414,457,3,74,37,0,415,417,5,85,0,0,416,415,1,0,0,0,416,417,1,0,0,0,417,
	418,1,0,0,0,418,419,5,85,0,0,419,421,5,3,0,0,420,422,3,38,19,0,421,420,
	1,0,0,0,421,422,1,0,0,0,422,423,1,0,0,0,423,457,3,40,20,0,424,426,5,85,
	0,0,425,424,1,0,0,0,425,426,1,0,0,0,426,427,1,0,0,0,427,428,5,85,0,0,428,
	429,5,3,0,0,429,457,3,38,19,0,430,432,5,85,0,0,431,430,1,0,0,0,431,432,
	1,0,0,0,432,433,1,0,0,0,433,434,5,85,0,0,434,435,5,3,0,0,435,436,3,42,21,
	0,436,437,3,74,37,0,437,457,1,0,0,0,438,440,5,85,0,0,439,438,1,0,0,0,439,
	440,1,0,0,0,440,441,1,0,0,0,441,442,5,85,0,0,442,443,5,3,0,0,443,457,3,
	42,21,0,444,447,5,57,0,0,445,446,5,3,0,0,446,448,3,74,37,0,447,445,1,0,
	0,0,447,448,1,0,0,0,448,457,1,0,0,0,449,450,5,57,0,0,450,457,3,44,22,0,
	451,452,5,85,0,0,452,453,5,85,0,0,453,454,5,3,0,0,454,455,5,57,0,0,455,
	457,3,44,22,0,456,400,1,0,0,0,456,404,1,0,0,0,456,416,1,0,0,0,456,425,1,
	0,0,0,456,431,1,0,0,0,456,439,1,0,0,0,456,444,1,0,0,0,456,449,1,0,0,0,456,
	451,1,0,0,0,457,37,1,0,0,0,458,459,5,39,0,0,459,461,5,1,0,0,460,462,3,180,
	90,0,461,460,1,0,0,0,461,462,1,0,0,0,462,463,1,0,0,0,463,464,5,2,0,0,464,
	39,1,0,0,0,465,466,5,58,0,0,466,475,5,1,0,0,467,472,3,180,90,0,468,469,
	5,8,0,0,469,471,3,180,90,0,470,468,1,0,0,0,471,474,1,0,0,0,472,470,1,0,
	0,0,472,473,1,0,0,0,473,476,1,0,0,0,474,472,1,0,0,0,475,467,1,0,0,0,475,
	476,1,0,0,0,476,477,1,0,0,0,477,478,5,2,0,0,478,41,1,0,0,0,479,480,5,79,
	0,0,480,481,5,1,0,0,481,482,3,74,37,0,482,483,5,2,0,0,483,43,1,0,0,0,484,
	485,5,1,0,0,485,490,3,74,37,0,486,487,5,8,0,0,487,489,3,74,37,0,488,486,
	1,0,0,0,489,492,1,0,0,0,490,488,1,0,0,0,490,491,1,0,0,0,491,493,1,0,0,0,
	492,490,1,0,0,0,493,494,5,2,0,0,494,45,1,0,0,0,495,496,5,59,0,0,496,497,
	5,1,0,0,497,502,3,48,24,0,498,499,5,8,0,0,499,501,3,48,24,0,500,498,1,0,
	0,0,501,504,1,0,0,0,502,500,1,0,0,0,502,503,1,0,0,0,503,505,1,0,0,0,504,
	502,1,0,0,0,505,506,5,2,0,0,506,512,1,0,0,0,507,508,5,59,0,0,508,509,5,
	1,0,0,509,510,5,15,0,0,510,512,5,2,0,0,511,495,1,0,0,0,511,507,1,0,0,0,
	512,47,1,0,0,0,513,532,7,2,0,0,514,515,5,11,0,0,515,516,5,15,0,0,516,532,
	5,12,0,0,517,519,5,85,0,0,518,517,1,0,0,0,518,519,1,0,0,0,519,520,1,0,0,
	0,520,521,5,11,0,0,521,526,3,50,25,0,522,523,5,8,0,0,523,525,3,50,25,0,
	524,522,1,0,0,0,525,528,1,0,0,0,526,524,1,0,0,0,526,527,1,0,0,0,527,529,
	1,0,0,0,528,526,1,0,0,0,529,530,5,12,0,0,530,532,1,0,0,0,531,513,1,0,0,
	0,531,514,1,0,0,0,531,518,1,0,0,0,532,49,1,0,0,0,533,534,7,2,0,0,534,51,
	1,0,0,0,535,536,5,60,0,0,536,541,3,58,29,0,537,538,5,8,0,0,538,540,3,58,
	29,0,539,537,1,0,0,0,540,543,1,0,0,0,541,539,1,0,0,0,541,542,1,0,0,0,542,
	53,1,0,0,0,543,541,1,0,0,0,544,545,5,60,0,0,545,546,3,74,37,0,546,547,5,
	1,0,0,547,550,5,61,0,0,548,549,5,8,0,0,549,551,3,122,61,0,550,548,1,0,0,
	0,551,552,1,0,0,0,552,550,1,0,0,0,552,553,1,0,0,0,553,554,1,0,0,0,554,555,
	5,2,0,0,555,55,1,0,0,0,556,557,5,60,0,0,557,558,3,74,37,0,558,559,5,1,0,
	0,559,562,5,62,0,0,560,561,5,8,0,0,561,563,5,85,0,0,562,560,1,0,0,0,563,
	564,1,0,0,0,564,562,1,0,0,0,564,565,1,0,0,0,565,566,1,0,0,0,566,567,5,2,
	0,0,567,57,1,0,0,0,568,569,3,74,37,0,569,570,5,1,0,0,570,578,3,60,30,0,
	571,576,5,8,0,0,572,577,3,68,34,0,573,577,3,70,35,0,574,577,3,76,38,0,575,
	577,3,80,40,0,576,572,1,0,0,0,576,573,1,0,0,0,576,574,1,0,0,0,576,575,1,
	0,0,0,577,579,1,0,0,0,578,571,1,0,0,0,579,580,1,0,0,0,580,578,1,0,0,0,580,
	581,1,0,0,0,581,582,1,0,0,0,582,583,5,2,0,0,583,59,1,0,0,0,584,585,7,3,
	0,0,585,61,1,0,0,0,586,587,5,60,0,0,587,592,3,64,32,0,588,589,5,8,0,0,589,
	591,3,64,32,0,590,588,1,0,0,0,591,594,1,0,0,0,592,590,1,0,0,0,592,593,1,
	0,0,0,593,63,1,0,0,0,594,592,1,0,0,0,595,596,5,85,0,0,596,597,5,1,0,0,597,
	603,3,66,33,0,598,601,5,8,0,0,599,602,3,70,35,0,600,602,3,76,38,0,601,599,
	1,0,0,0,601,600,1,0,0,0,602,604,1,0,0,0,603,598,1,0,0,0,604,605,1,0,0,0,
	605,603,1,0,0,0,605,606,1,0,0,0,606,607,1,0,0,0,607,608,5,2,0,0,608,65,
	1,0,0,0,609,610,5,55,0,0,610,67,1,0,0,0,611,612,5,85,0,0,612,615,5,1,0,
	0,613,616,3,70,35,0,614,616,3,76,38,0,615,613,1,0,0,0,615,614,1,0,0,0,616,
	624,1,0,0,0,617,620,5,8,0,0,618,621,3,70,35,0,619,621,3,76,38,0,620,618,
	1,0,0,0,620,619,1,0,0,0,621,623,1,0,0,0,622,617,1,0,0,0,623,626,1,0,0,0,
	624,622,1,0,0,0,624,625,1,0,0,0,625,627,1,0,0,0,626,624,1,0,0,0,627,628,
	5,2,0,0,628,69,1,0,0,0,629,688,5,85,0,0,630,631,5,85,0,0,631,632,5,1,0,
	0,632,637,3,72,36,0,633,634,5,8,0,0,634,636,3,72,36,0,635,633,1,0,0,0,636,
	639,1,0,0,0,637,635,1,0,0,0,637,638,1,0,0,0,638,640,1,0,0,0,639,637,1,0,
	0,0,640,641,5,2,0,0,641,688,1,0,0,0,642,643,5,85,0,0,643,644,5,1,0,0,644,
	645,5,85,0,0,645,650,5,15,0,0,646,647,5,8,0,0,647,649,3,72,36,0,648,646,
	1,0,0,0,649,652,1,0,0,0,650,648,1,0,0,0,650,651,1,0,0,0,651,653,1,0,0,0,
	652,650,1,0,0,0,653,688,5,2,0,0,654,655,5,85,0,0,655,656,5,1,0,0,656,657,
	5,64,0,0,657,658,5,1,0,0,658,659,3,188,94,0,659,664,5,2,0,0,660,661,5,8,
	0,0,661,663,3,72,36,0,662,660,1,0,0,0,663,666,1,0,0,0,664,662,1,0,0,0,664,
	665,1,0,0,0,665,667,1,0,0,0,666,664,1,0,0,0,667,668,5,2,0,0,668,688,1,0,
	0,0,669,670,5,85,0,0,670,671,5,1,0,0,671,672,5,85,0,0,672,673,5,15,0,0,
	673,674,5,8,0,0,674,675,5,64,0,0,675,676,5,1,0,0,676,677,3,188,94,0,677,
	682,5,2,0,0,678,679,5,8,0,0,679,681,3,72,36,0,680,678,1,0,0,0,681,684,1,
	0,0,0,682,680,1,0,0,0,682,683,1,0,0,0,683,685,1,0,0,0,684,682,1,0,0,0,685,
	686,5,2,0,0,686,688,1,0,0,0,687,629,1,0,0,0,687,630,1,0,0,0,687,642,1,0,
	0,0,687,654,1,0,0,0,687,669,1,0,0,0,688,71,1,0,0,0,689,690,5,57,0,0,690,
	691,5,3,0,0,691,723,3,74,37,0,692,693,5,85,0,0,693,695,5,3,0,0,694,696,
	3,38,19,0,695,694,1,0,0,0,695,696,1,0,0,0,696,698,1,0,0,0,697,699,3,40,
	20,0,698,697,1,0,0,0,698,699,1,0,0,0,699,700,1,0,0,0,700,723,3,74,37,0,
	701,702,5,85,0,0,702,704,5,3,0,0,703,705,3,38,19,0,704,703,1,0,0,0,704,
	705,1,0,0,0,705,706,1,0,0,0,706,723,3,40,20,0,707,708,5,85,0,0,708,709,
	5,3,0,0,709,723,3,38,19,0,710,711,5,85,0,0,711,713,5,3,0,0,712,714,3,42,
	21,0,713,712,1,0,0,0,713,714,1,0,0,0,714,715,1,0,0,0,715,723,3,74,37,0,
	716,717,5,85,0,0,717,718,5,3,0,0,718,723,3,42,21,0,719,720,5,85,0,0,720,
	721,5,3,0,0,721,723,3,180,90,0,722,689,1,0,0,0,722,692,1,0,0,0,722,701,
	1,0,0,0,722,707,1,0,0,0,722,710,1,0,0,0,722,716,1,0,0,0,722,719,1,0,0,0,
	723,73,1,0,0,0,724,729,5,85,0,0,725,726,5,7,0,0,726,728,5,85,0,0,727,725,
	1,0,0,0,728,731,1,0,0,0,729,727,1,0,0,0,729,730,1,0,0,0,730,75,1,0,0,0,
	731,729,1,0,0,0,732,733,5,47,0,0,733,734,5,1,0,0,734,735,3,78,39,0,735,
	736,5,2,0,0,736,77,1,0,0,0,737,749,3,74,37,0,738,739,5,13,0,0,739,744,5,
	85,0,0,740,741,5,8,0,0,741,743,5,85,0,0,742,740,1,0,0,0,743,746,1,0,0,0,
	744,742,1,0,0,0,744,745,1,0,0,0,745,747,1,0,0,0,746,744,1,0,0,0,747,749,
	5,14,0,0,748,737,1,0,0,0,748,738,1,0,0,0,749,79,1,0,0,0,750,751,5,65,0,
	0,751,752,5,1,0,0,752,753,5,85,0,0,753,754,5,2,0,0,754,81,1,0,0,0,755,756,
	5,85,0,0,756,757,5,10,0,0,757,758,3,84,42,0,758,759,5,30,0,0,759,760,3,
	86,43,0,760,779,1,0,0,0,761,762,5,85,0,0,762,763,5,7,0,0,763,764,5,85,0,
	0,764,765,5,10,0,0,765,766,3,84,42,0,766,767,5,30,0,0,767,768,3,86,43,0,
	768,779,1,0,0,0,769,770,5,85,0,0,770,771,5,10,0,0,771,779,3,86,43,0,772,
	773,5,66,0,0,773,774,5,10,0,0,774,775,3,84,42,0,775,776,5,30,0,0,776,777,
	3,90,45,0,777,779,1,0,0,0,778,755,1,0,0,0,778,761,1,0,0,0,778,769,1,0,0,
	0,778,772,1,0,0,0,779,83,1,0,0,0,780,785,3,122,61,0,781,782,5,8,0,0,782,
	784,3,122,61,0,783,781,1,0,0,0,784,787,1,0,0,0,785,783,1,0,0,0,785,786,
	1,0,0,0,786,790,1,0,0,0,787,785,1,0,0,0,788,790,1,0,0,0,789,780,1,0,0,0,
	789,788,1,0,0,0,790,85,1,0,0,0,791,796,3,88,44,0,792,793,5,8,0,0,793,795,
	3,88,44,0,794,792,1,0,0,0,795,798,1,0,0,0,796,794,1,0,0,0,796,797,1,0,0,
	0,797,87,1,0,0,0,798,796,1,0,0,0,799,800,5,85,0,0,800,801,5,26,0,0,801,
	802,3,122,61,0,802,89,1,0,0,0,803,808,3,92,46,0,804,805,5,8,0,0,805,807,
	3,92,46,0,806,804,1,0,0,0,807,810,1,0,0,0,808,806,1,0,0,0,808,809,1,0,0,
	0,809,91,1,0,0,0,810,808,1,0,0,0,811,812,5,85,0,0,812,813,5,1,0,0,813,818,
	3,122,61,0,814,815,5,8,0,0,815,817,3,122,61,0,816,814,1,0,0,0,817,820,1,
	0,0,0,818,816,1,0,0,0,818,819,1,0,0,0,819,821,1,0,0,0,820,818,1,0,0,0,821,
	822,5,2,0,0,822,93,1,0,0,0,823,824,5,67,0,0,824,825,5,10,0,0,825,827,5,
	85,0,0,826,828,3,96,48,0,827,826,1,0,0,0,827,828,1,0,0,0,828,829,1,0,0,
	0,829,830,5,29,0,0,830,831,3,100,50,0,831,95,1,0,0,0,832,833,5,1,0,0,833,
	838,3,98,49,0,834,835,5,8,0,0,835,837,3,98,49,0,836,834,1,0,0,0,837,840,
	1,0,0,0,838,836,1,0,0,0,838,839,1,0,0,0,839,841,1,0,0,0,840,838,1,0,0,0,
	841,842,5,2,0,0,842,97,1,0,0,0,843,845,3,108,54,0,844,843,1,0,0,0,844,845,
	1,0,0,0,845,846,1,0,0,0,846,847,5,85,0,0,847,99,1,0,0,0,848,851,3,122,61,
	0,849,851,3,186,93,0,850,848,1,0,0,0,850,849,1,0,0,0,851,101,1,0,0,0,852,
	853,5,56,0,0,853,854,5,10,0,0,854,856,5,85,0,0,855,857,3,104,52,0,856,855,
	1,0,0,0,856,857,1,0,0,0,857,858,1,0,0,0,858,859,5,29,0,0,859,864,3,122,
	61,0,860,861,5,8,0,0,861,863,3,122,61,0,862,860,1,0,0,0,863,866,1,0,0,0,
	864,862,1,0,0,0,864,865,1,0,0,0,865,870,1,0,0,0,866,864,1,0,0,0,867,869,
	3,112,56,0,868,867,1,0,0,0,869,872,1,0,0,0,870,868,1,0,0,0,870,871,1,0,
	0,0,871,874,1,0,0,0,872,870,1,0,0,0,873,875,3,114,57,0,874,873,1,0,0,0,
	874,875,1,0,0,0,875,877,1,0,0,0,876,878,3,62,31,0,877,876,1,0,0,0,877,878,
	1,0,0,0,878,103,1,0,0,0,879,880,5,1,0,0,880,885,3,106,53,0,881,882,5,8,
	0,0,882,884,3,106,53,0,883,881,1,0,0,0,884,887,1,0,0,0,885,883,1,0,0,0,
	885,886,1,0,0,0,886,888,1,0,0,0,887,885,1,0,0,0,888,889,5,2,0,0,889,105,
	1,0,0,0,890,892,3,108,54,0,891,890,1,0,0,0,891,892,1,0,0,0,892,893,1,0,
	0,0,893,906,5,85,0,0,894,896,3,110,55,0,895,894,1,0,0,0,895,896,1,0,0,0,
	896,897,1,0,0,0,897,906,5,81,0,0,898,899,5,47,0,0,899,906,5,85,0,0,900,
	901,5,68,0,0,901,902,5,69,0,0,902,903,3,74,37,0,903,904,5,85,0,0,904,906,
	1,0,0,0,905,891,1,0,0,0,905,895,1,0,0,0,905,898,1,0,0,0,905,900,1,0,0,0,
	906,107,1,0,0,0,907,912,3,110,55,0,908,909,5,70,0,0,909,910,5,69,0,0,910,
	912,3,110,55,0,911,907,1,0,0,0,911,908,1,0,0,0,912,109,1,0,0,0,913,914,
	7,2,0,0,914,111,1,0,0,0,915,916,5,71,0,0,916,917,5,85,0,0,917,918,5,1,0,
	0,918,921,3,122,61,0,919,920,5,8,0,0,920,922,3,122,61,0,921,919,1,0,0,0,
	921,922,1,0,0,0,922,923,1,0,0,0,923,924,5,2,0,0,924,113,1,0,0,0,925,926,
	5,72,0,0,926,927,3,78,39,0,927,115,1,0,0,0,928,929,5,54,0,0,929,930,5,10,
	0,0,930,932,5,85,0,0,931,933,3,104,52,0,932,931,1,0,0,0,932,933,1,0,0,0,
	933,934,1,0,0,0,934,935,5,29,0,0,935,939,3,122,61,0,936,938,3,112,56,0,
	937,936,1,0,0,0,938,941,1,0,0,0,939,937,1,0,0,0,939,940,1,0,0,0,940,943,
	1,0,0,0,941,939,1,0,0,0,942,944,3,114,57,0,943,942,1,0,0,0,943,944,1,0,
	0,0,944,946,1,0,0,0,945,947,3,62,31,0,946,945,1,0,0,0,946,947,1,0,0,0,947,
	117,1,0,0,0,948,952,5,73,0,0,949,951,8,4,0,0,950,949,1,0,0,0,951,954,1,
	0,0,0,952,950,1,0,0,0,952,953,1,0,0,0,953,955,1,0,0,0,954,952,1,0,0,0,955,
	956,5,74,0,0,956,119,1,0,0,0,957,961,5,75,0,0,958,960,8,5,0,0,959,958,1,
	0,0,0,960,963,1,0,0,0,961,959,1,0,0,0,961,962,1,0,0,0,962,964,1,0,0,0,963,
	961,1,0,0,0,964,965,5,76,0,0,965,121,1,0,0,0,966,967,3,124,62,0,967,123,
	1,0,0,0,968,973,3,126,63,0,969,970,5,35,0,0,970,972,3,126,63,0,971,969,
	1,0,0,0,972,975,1,0,0,0,973,971,1,0,0,0,973,974,1,0,0,0,974,125,1,0,0,0,
	975,973,1,0,0,0,976,981,3,128,64,0,977,978,5,37,0,0,978,980,3,128,64,0,
	979,977,1,0,0,0,980,983,1,0,0,0,981,979,1,0,0,0,981,982,1,0,0,0,982,127,
	1,0,0,0,983,981,1,0,0,0,984,985,5,36,0,0,985,988,3,128,64,0,986,988,3,130,
	65,0,987,984,1,0,0,0,987,986,1,0,0,0,988,129,1,0,0,0,989,992,3,132,66,0,
	990,991,7,6,0,0,991,993,3,132,66,0,992,990,1,0,0,0,992,993,1,0,0,0,993,
	131,1,0,0,0,994,999,3,134,67,0,995,996,7,7,0,0,996,998,3,134,67,0,997,995,
	1,0,0,0,998,1001,1,0,0,0,999,997,1,0,0,0,999,1000,1,0,0,0,1000,133,1,0,
	0,0,1001,999,1,0,0,0,1002,1007,3,136,68,0,1003,1004,7,8,0,0,1004,1006,3,
	136,68,0,1005,1003,1,0,0,0,1006,1009,1,0,0,0,1007,1005,1,0,0,0,1007,1008,
	1,0,0,0,1008,135,1,0,0,0,1009,1007,1,0,0,0,1010,1011,5,20,0,0,1011,1038,
	3,136,68,0,1012,1015,3,138,69,0,1013,1014,5,10,0,0,1014,1016,3,164,82,0,
	1015,1013,1,0,0,0,1015,1016,1,0,0,0,1016,1038,1,0,0,0,1017,1018,3,168,84,
	0,1018,1019,5,16,0,0,1019,1020,3,162,81,0,1020,1038,1,0,0,0,1021,1038,3,
	178,89,0,1022,1023,5,1,0,0,1023,1024,3,122,61,0,1024,1025,5,2,0,0,1025,
	1038,1,0,0,0,1026,1027,5,13,0,0,1027,1032,3,122,61,0,1028,1029,5,8,0,0,
	1029,1031,3,122,61,0,1030,1028,1,0,0,0,1031,1034,1,0,0,0,1032,1030,1,0,
	0,0,1032,1033,1,0,0,0,1033,1035,1,0,0,0,1034,1032,1,0,0,0,1035,1036,5,14,
	0,0,1036,1038,1,0,0,0,1037,1010,1,0,0,0,1037,1012,1,0,0,0,1037,1017,1,0,
	0,0,1037,1021,1,0,0,0,1037,1022,1,0,0,0,1037,1026,1,0,0,0,1038,137,1,0,
	0,0,1039,1041,3,170,85,0,1040,1042,3,140,70,0,1041,1040,1,0,0,0,1042,1043,
	1,0,0,0,1043,1041,1,0,0,0,1043,1044,1,0,0,0,1044,1051,1,0,0,0,1045,1051,
	3,152,76,0,1046,1051,3,156,78,0,1047,1051,3,170,85,0,1048,1051,5,81,0,0,
	1049,1051,3,146,73,0,1050,1039,1,0,0,0,1050,1045,1,0,0,0,1050,1046,1,0,
	0,0,1050,1047,1,0,0,0,1050,1048,1,0,0,0,1050,1049,1,0,0,0,1051,139,1,0,
	0,0,1052,1056,3,142,71,0,1053,1056,3,152,76,0,1054,1056,3,160,80,0,1055,
	1052,1,0,0,0,1055,1053,1,0,0,0,1055,1054,1,0,0,0,1056,141,1,0,0,0,1057,
	1058,5,1,0,0,1058,1086,5,2,0,0,1059,1060,5,1,0,0,1060,1065,3,144,72,0,1061,
	1062,5,8,0,0,1062,1064,3,144,72,0,1063,1061,1,0,0,0,1064,1067,1,0,0,0,1065,
	1063,1,0,0,0,1065,1066,1,0,0,0,1066,1070,1,0,0,0,1067,1065,1,0,0,0,1068,
	1069,5,8,0,0,1069,1071,3,122,61,0,1070,1068,1,0,0,0,1070,1071,1,0,0,0,1071,
	1072,1,0,0,0,1072,1073,5,2,0,0,1073,1086,1,0,0,0,1074,1075,5,1,0,0,1075,
	1080,3,122,61,0,1076,1077,5,8,0,0,1077,1079,3,122,61,0,1078,1076,1,0,0,
	0,1079,1082,1,0,0,0,1080,1078,1,0,0,0,1080,1081,1,0,0,0,1081,1083,1,0,0,
	0,1082,1080,1,0,0,0,1083,1084,5,2,0,0,1084,1086,1,0,0,0,1085,1057,1,0,0,
	0,1085,1059,1,0,0,0,1085,1074,1,0,0,0,1086,143,1,0,0,0,1087,1088,3,122,
	61,0,1088,1089,5,30,0,0,1089,1090,3,122,61,0,1090,145,1,0,0,0,1091,1092,
	5,43,0,0,1092,1093,5,1,0,0,1093,1094,3,122,61,0,1094,1095,5,8,0,0,1095,
	1097,3,138,69,0,1096,1098,3,148,74,0,1097,1096,1,0,0,0,1097,1098,1,0,0,
	0,1098,1099,1,0,0,0,1099,1100,3,150,75,0,1100,1101,5,8,0,0,1101,1102,3,
	122,61,0,1102,1103,5,2,0,0,1103,147,1,0,0,0,1104,1105,5,13,0,0,1105,1106,
	3,176,88,0,1106,1107,5,8,0,0,1107,1108,3,176,88,0,1108,1109,5,14,0,0,1109,
	149,1,0,0,0,1110,1111,5,15,0,0,1111,1112,5,86,0,0,1112,151,1,0,0,0,1113,
	1114,5,11,0,0,1114,1119,3,154,77,0,1115,1116,5,8,0,0,1116,1118,3,154,77,
	0,1117,1115,1,0,0,0,1118,1121,1,0,0,0,1119,1117,1,0,0,0,1119,1120,1,0,0,
	0,1120,1122,1,0,0,0,1121,1119,1,0,0,0,1122,1123,5,12,0,0,1123,153,1,0,0,
	0,1124,1125,5,85,0,0,1125,1126,5,26,0,0,1126,1129,3,122,61,0,1127,1129,
	3,122,61,0,1128,1124,1,0,0,0,1128,1127,1,0,0,0,1129,155,1,0,0,0,1130,1131,
	5,59,0,0,1131,1132,5,1,0,0,1132,1137,3,158,79,0,1133,1134,5,8,0,0,1134,
	1136,3,158,79,0,1135,1133,1,0,0,0,1136,1139,1,0,0,0,1137,1135,1,0,0,0,1137,
	1138,1,0,0,0,1138,1140,1,0,0,0,1139,1137,1,0,0,0,1140,1141,5,2,0,0,1141,
	157,1,0,0,0,1142,1157,5,83,0,0,1143,1145,5,84,0,0,1144,1143,1,0,0,0,1144,
	1145,1,0,0,0,1145,1146,1,0,0,0,1146,1147,5,11,0,0,1147,1152,5,83,0,0,1148,
	1149,5,8,0,0,1149,1151,5,83,0,0,1150,1148,1,0,0,0,1151,1154,1,0,0,0,1152,
	1150,1,0,0,0,1152,1153,1,0,0,0,1153,1155,1,0,0,0,1154,1152,1,0,0,0,1155,
	1157,5,12,0,0,1156,1142,1,0,0,0,1156,1144,1,0,0,0,1157,159,1,0,0,0,1158,
	1159,5,7,0,0,1159,1160,3,172,86,0,1160,161,1,0,0,0,1161,1169,3,164,82,0,
	1162,1163,5,24,0,0,1163,1169,3,164,82,0,1164,1165,3,138,69,0,1165,1166,
	5,10,0,0,1166,1167,3,164,82,0,1167,1169,1,0,0,0,1168,1161,1,0,0,0,1168,
	1162,1,0,0,0,1168,1164,1,0,0,0,1169,163,1,0,0,0,1170,1181,3,174,87,0,1171,
	1172,3,174,87,0,1172,1173,5,1,0,0,1173,1176,3,122,61,0,1174,1175,5,8,0,
	0,1175,1177,3,122,61,0,1176,1174,1,0,0,0,1176,1177,1,0,0,0,1177,1178,1,
	0,0,0,1178,1179,5,2,0,0,1179,1181,1,0,0,0,1180,1170,1,0,0,0,1180,1171,1,
	0,0,0,1181,165,1,0,0,0,1182,1183,5,85,0,0,1183,167,1,0,0,0,1184,1189,3,
	170,85,0,1185,1186,5,7,0,0,1186,1188,3,172,86,0,1187,1185,1,0,0,0,1188,
	1191,1,0,0,0,1189,1187,1,0,0,0,1189,1190,1,0,0,0,1190,169,1,0,0,0,1191,
	1189,1,0,0,0,1192,1198,5,85,0,0,1193,1198,5,57,0,0,1194,1198,5,82,0,0,1195,
	1198,5,83,0,0,1196,1198,5,84,0,0,1197,1192,1,0,0,0,1197,1193,1,0,0,0,1197,
	1194,1,0,0,0,1197,1195,1,0,0,0,1197,1196,1,0,0,0,1198,171,1,0,0,0,1199,
	1204,5,85,0,0,1200,1204,5,57,0,0,1201,1204,5,83,0,0,1202,1204,5,84,0,0,
	1203,1199,1,0,0,0,1203,1200,1,0,0,0,1203,1201,1,0,0,0,1203,1202,1,0,0,0,
	1204,173,1,0,0,0,1205,1206,5,85,0,0,1206,175,1,0,0,0,1207,1210,5,85,0,0,
	1208,1210,5,57,0,0,1209,1207,1,0,0,0,1209,1208,1,0,0,0,1210,177,1,0,0,0,
	1211,1215,3,180,90,0,1212,1213,5,13,0,0,1213,1215,5,14,0,0,1214,1211,1,
	0,0,0,1214,1212,1,0,0,0,1215,179,1,0,0,0,1216,1223,5,90,0,0,1217,1223,3,
	184,92,0,1218,1223,5,41,0,0,1219,1223,5,42,0,0,1220,1223,5,91,0,0,1221,
	1223,3,182,91,0,1222,1216,1,0,0,0,1222,1217,1,0,0,0,1222,1218,1,0,0,0,1222,
	1219,1,0,0,0,1222,1220,1,0,0,0,1222,1221,1,0,0,0,1223,181,1,0,0,0,1224,
	1234,5,86,0,0,1225,1226,5,20,0,0,1226,1234,5,86,0,0,1227,1234,5,87,0,0,
	1228,1234,5,88,0,0,1229,1234,5,103,0,0,1230,1234,5,101,0,0,1231,1234,5,
	102,0,0,1232,1234,5,104,0,0,1233,1224,1,0,0,0,1233,1225,1,0,0,0,1233,1227,
	1,0,0,0,1233,1228,1,0,0,0,1233,1229,1,0,0,0,1233,1230,1,0,0,0,1233,1231,
	1,0,0,0,1233,1232,1,0,0,0,1234,183,1,0,0,0,1235,1242,5,89,0,0,1236,1237,
	5,20,0,0,1237,1242,5,89,0,0,1238,1242,5,105,0,0,1239,1242,5,106,0,0,1240,
	1242,5,107,0,0,1241,1235,1,0,0,0,1241,1236,1,0,0,0,1241,1238,1,0,0,0,1241,
	1239,1,0,0,0,1241,1240,1,0,0,0,1242,185,1,0,0,0,1243,1244,5,44,0,0,1244,
	1245,5,1,0,0,1245,1246,3,188,94,0,1246,1249,5,2,0,0,1247,1248,5,51,0,0,
	1248,1250,3,192,96,0,1249,1247,1,0,0,0,1249,1250,1,0,0,0,1250,1251,1,0,
	0,0,1251,1252,5,45,0,0,1252,1253,3,196,98,0,1253,187,1,0,0,0,1254,1256,
	3,190,95,0,1255,1254,1,0,0,0,1256,1257,1,0,0,0,1257,1255,1,0,0,0,1257,1258,
	1,0,0,0,1258,189,1,0,0,0,1259,1263,5,1,0,0,1260,1262,3,188,94,0,1261,1260,
	1,0,0,0,1262,1265,1,0,0,0,1263,1261,1,0,0,0,1263,1264,1,0,0,0,1264,1266,
	1,0,0,0,1265,1263,1,0,0,0,1266,1273,5,2,0,0,1267,1273,8,9,0,0,1268,1273,
	5,19,0,0,1269,1273,5,18,0,0,1270,1273,5,17,0,0,1271,1273,5,25,0,0,1272,
	1259,1,0,0,0,1272,1267,1,0,0,0,1272,1268,1,0,0,0,1272,1269,1,0,0,0,1272,
	1270,1,0,0,0,1272,1271,1,0,0,0,1273,191,1,0,0,0,1274,1279,3,194,97,0,1275,
	1276,5,8,0,0,1276,1278,3,194,97,0,1277,1275,1,0,0,0,1278,1281,1,0,0,0,1279,
	1277,1,0,0,0,1279,1280,1,0,0,0,1280,193,1,0,0,0,1281,1279,1,0,0,0,1282,
	1285,3,74,37,0,1283,1285,5,16,0,0,1284,1282,1,0,0,0,1284,1283,1,0,0,0,1285,
	195,1,0,0,0,1286,1291,3,110,55,0,1287,1288,5,70,0,0,1288,1289,5,69,0,0,
	1289,1291,3,110,55,0,1290,1286,1,0,0,0,1290,1287,1,0,0,0,1291,197,1,0,0,
	0,134,201,209,217,221,223,225,232,244,262,273,284,287,295,306,315,327,343,
	353,364,376,383,392,400,404,409,412,416,421,425,431,439,447,456,461,472,
	475,490,502,511,518,526,531,541,552,564,576,580,592,601,605,615,620,624,
	637,650,664,682,687,695,698,704,713,722,729,744,748,778,785,789,796,808,
	818,827,838,844,850,856,864,870,874,877,885,891,895,905,911,921,932,939,
	943,946,952,961,973,981,987,992,999,1007,1015,1032,1037,1043,1050,1055,
	1065,1070,1080,1085,1097,1119,1128,1137,1144,1152,1156,1168,1176,1180,1189,
	1197,1203,1209,1214,1222,1233,1241,1249,1257,1263,1272,1279,1284,1290];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!KELParser.__ATN) {
			KELParser.__ATN = new ATNDeserializer().deserialize(KELParser._serializedATN);
		}

		return KELParser.__ATN;
	}


	static DecisionsToDFA = KELParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class ProgramContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(KELParser.EOF, 0);
	}
	public option_list(): OptionContext[] {
		return this.getTypedRuleContexts(OptionContext) as OptionContext[];
	}
	public option(i: number): OptionContext {
		return this.getTypedRuleContext(OptionContext, i) as OptionContext;
	}
	public annotation_list(): AnnotationContext[] {
		return this.getTypedRuleContexts(AnnotationContext) as AnnotationContext[];
	}
	public annotation(i: number): AnnotationContext {
		return this.getTypedRuleContext(AnnotationContext, i) as AnnotationContext;
	}
	public SEMI_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.SEMI);
	}
	public SEMI(i: number): TerminalNode {
		return this.getToken(KELParser.SEMI, i);
	}
	public statement_list(): StatementContext[] {
		return this.getTypedRuleContexts(StatementContext) as StatementContext[];
	}
	public statement(i: number): StatementContext {
		return this.getTypedRuleContext(StatementContext, i) as StatementContext;
	}
	public visual_section_list(): Visual_sectionContext[] {
		return this.getTypedRuleContexts(Visual_sectionContext) as Visual_sectionContext[];
	}
	public visual_section(i: number): Visual_sectionContext {
		return this.getTypedRuleContext(Visual_sectionContext, i) as Visual_sectionContext;
	}
	public resource_section_list(): Resource_sectionContext[] {
		return this.getTypedRuleContexts(Resource_sectionContext) as Resource_sectionContext[];
	}
	public resource_section(i: number): Resource_sectionContext {
		return this.getTypedRuleContext(Resource_sectionContext, i) as Resource_sectionContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_program;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterProgram) {
	 		listener.enterProgram(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitProgram) {
	 		listener.exitProgram(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public eraDeclaration(): EraDeclarationContext {
		return this.getTypedRuleContext(EraDeclarationContext, 0) as EraDeclarationContext;
	}
	public permitsDeclaration(): PermitsDeclarationContext {
		return this.getTypedRuleContext(PermitsDeclarationContext, 0) as PermitsDeclarationContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_annotation;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterAnnotation) {
	 		listener.enterAnnotation(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitAnnotation) {
	 		listener.exitAnnotation(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitAnnotation) {
			return visitor.visitAnnotation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public importStatement(): ImportStatementContext {
		return this.getTypedRuleContext(ImportStatementContext, 0) as ImportStatementContext;
	}
	public inlinePackage(): InlinePackageContext {
		return this.getTypedRuleContext(InlinePackageContext, 0) as InlinePackageContext;
	}
	public entityDeclaration(): EntityDeclarationContext {
		return this.getTypedRuleContext(EntityDeclarationContext, 0) as EntityDeclarationContext;
	}
	public useDeclaration(): UseDeclarationContext {
		return this.getTypedRuleContext(UseDeclarationContext, 0) as UseDeclarationContext;
	}
	public useKelBaseDeclaration(): UseKelBaseDeclarationContext {
		return this.getTypedRuleContext(UseKelBaseDeclarationContext, 0) as UseKelBaseDeclarationContext;
	}
	public useKelQueryDeclaration(): UseKelQueryDeclarationContext {
		return this.getTypedRuleContext(UseKelQueryDeclarationContext, 0) as UseKelQueryDeclarationContext;
	}
	public logicStatement(): LogicStatementContext {
		return this.getTypedRuleContext(LogicStatementContext, 0) as LogicStatementContext;
	}
	public functionStatement(): FunctionStatementContext {
		return this.getTypedRuleContext(FunctionStatementContext, 0) as FunctionStatementContext;
	}
	public queryDeclaration(): QueryDeclarationContext {
		return this.getTypedRuleContext(QueryDeclarationContext, 0) as QueryDeclarationContext;
	}
	public shellDeclaration(): ShellDeclarationContext {
		return this.getTypedRuleContext(ShellDeclarationContext, 0) as ShellDeclarationContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_statement;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterStatement) {
	 		listener.enterStatement(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitStatement) {
	 		listener.exitStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OptionContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_option;
	}
	public copyFrom(ctx: OptionContext): void {
		super.copyFrom(ctx);
	}
}
export class OptionStrContext extends OptionContext {
	public _name!: Token;
	public _value!: Token;
	constructor(parser: KELParser, ctx: OptionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public OPTION(): TerminalNode {
		return this.getToken(KELParser.OPTION, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public COMMA(): TerminalNode {
		return this.getToken(KELParser.COMMA, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public STR(): TerminalNode {
		return this.getToken(KELParser.STR, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterOptionStr) {
	 		listener.enterOptionStr(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitOptionStr) {
	 		listener.exitOptionStr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitOptionStr) {
			return visitor.visitOptionStr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class OptionIntContext extends OptionContext {
	public _name!: Token;
	public _value!: Token;
	constructor(parser: KELParser, ctx: OptionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public OPTION(): TerminalNode {
		return this.getToken(KELParser.OPTION, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public COMMA(): TerminalNode {
		return this.getToken(KELParser.COMMA, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public INT(): TerminalNode {
		return this.getToken(KELParser.INT, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterOptionInt) {
	 		listener.enterOptionInt(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitOptionInt) {
	 		listener.exitOptionInt(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitOptionInt) {
			return visitor.visitOptionInt(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class OptionBoolContext extends OptionContext {
	public _name!: Token;
	constructor(parser: KELParser, ctx: OptionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public OPTION(): TerminalNode {
		return this.getToken(KELParser.OPTION, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterOptionBool) {
	 		listener.enterOptionBool(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitOptionBool) {
	 		listener.exitOptionBool(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitOptionBool) {
			return visitor.visitOptionBool(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EraDeclarationContext extends ParserRuleContext {
	public _name!: Token;
	public _type_!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ERA(): TerminalNode {
		return this.getToken(KELParser.ERA, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public epoch_list(): EpochContext[] {
		return this.getTypedRuleContexts(EpochContext) as EpochContext[];
	}
	public epoch(i: number): EpochContext {
		return this.getTypedRuleContext(EpochContext, i) as EpochContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(KELParser.ID, i);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_eraDeclaration;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEraDeclaration) {
	 		listener.enterEraDeclaration(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEraDeclaration) {
	 		listener.exitEraDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEraDeclaration) {
			return visitor.visitEraDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EpochContext extends ParserRuleContext {
	public _name!: Token;
	public _nulltype!: Token;
	public _sw!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(KELParser.ID, i);
	}
	public EQ(): TerminalNode {
		return this.getToken(KELParser.EQ, 0);
	}
	public NULL(): TerminalNode {
		return this.getToken(KELParser.NULL, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_epoch;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEpoch) {
	 		listener.enterEpoch(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEpoch) {
	 		listener.exitEpoch(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEpoch) {
			return visitor.visitEpoch(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PermitsDeclarationContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PERMITS(): TerminalNode {
		return this.getToken(KELParser.PERMITS, 0);
	}
	public permit_list(): PermitContext[] {
		return this.getTypedRuleContexts(PermitContext) as PermitContext[];
	}
	public permit(i: number): PermitContext {
		return this.getTypedRuleContext(PermitContext, i) as PermitContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_permitsDeclaration;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPermitsDeclaration) {
	 		listener.enterPermitsDeclaration(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPermitsDeclaration) {
	 		listener.exitPermitsDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPermitsDeclaration) {
			return visitor.visitPermitsDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PermitContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_permit;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPermit) {
	 		listener.enterPermit(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPermit) {
	 		listener.exitPermit(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPermit) {
			return visitor.visitPermit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportStatementContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_importStatement;
	}
	public copyFrom(ctx: ImportStatementContext): void {
		super.copyFrom(ctx);
	}
}
export class PackageImportContext extends ImportStatementContext {
	constructor(parser: KELParser, ctx: ImportStatementContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public IMPORT(): TerminalNode {
		return this.getToken(KELParser.IMPORT, 0);
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(KELParser.ID, i);
	}
	public FROM(): TerminalNode {
		return this.getToken(KELParser.FROM, 0);
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPackageImport) {
	 		listener.enterPackageImport(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPackageImport) {
	 		listener.exitPackageImport(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPackageImport) {
			return visitor.visitPackageImport(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SpcImportContext extends ImportStatementContext {
	constructor(parser: KELParser, ctx: ImportStatementContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public IMPORT(): TerminalNode {
		return this.getToken(KELParser.IMPORT, 0);
	}
	public SPC(): TerminalNode {
		return this.getToken(KELParser.SPC, 0);
	}
	public FROM(): TerminalNode {
		return this.getToken(KELParser.FROM, 0);
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
	public AS(): TerminalNode {
		return this.getToken(KELParser.AS, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterSpcImport) {
	 		listener.enterSpcImport(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitSpcImport) {
	 		listener.exitSpcImport(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitSpcImport) {
			return visitor.visitSpcImport(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SimpleImportContext extends ImportStatementContext {
	constructor(parser: KELParser, ctx: ImportStatementContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public IMPORT(): TerminalNode {
		return this.getToken(KELParser.IMPORT, 0);
	}
	public dotId_list(): DotIdContext[] {
		return this.getTypedRuleContexts(DotIdContext) as DotIdContext[];
	}
	public dotId(i: number): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, i) as DotIdContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterSimpleImport) {
	 		listener.enterSimpleImport(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitSimpleImport) {
	 		listener.exitSimpleImport(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitSimpleImport) {
			return visitor.visitSimpleImport(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InlinePackageContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public packageDeclaration(): PackageDeclarationContext {
		return this.getTypedRuleContext(PackageDeclarationContext, 0) as PackageDeclarationContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_inlinePackage;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterInlinePackage) {
	 		listener.enterInlinePackage(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitInlinePackage) {
	 		listener.exitInlinePackage(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitInlinePackage) {
			return visitor.visitInlinePackage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OutoflinePackageContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public packageDeclaration(): PackageDeclarationContext {
		return this.getTypedRuleContext(PackageDeclarationContext, 0) as PackageDeclarationContext;
	}
	public SEMI(): TerminalNode {
		return this.getToken(KELParser.SEMI, 0);
	}
	public EOF(): TerminalNode {
		return this.getToken(KELParser.EOF, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_outoflinePackage;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterOutoflinePackage) {
	 		listener.enterOutoflinePackage(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitOutoflinePackage) {
	 		listener.exitOutoflinePackage(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitOutoflinePackage) {
			return visitor.visitOutoflinePackage(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PackageDeclarationContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PACKAGE(): TerminalNode {
		return this.getToken(KELParser.PACKAGE, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public SEMI_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.SEMI);
	}
	public SEMI(i: number): TerminalNode {
		return this.getToken(KELParser.SEMI, i);
	}
	public END(): TerminalNode {
		return this.getToken(KELParser.END, 0);
	}
	public packageStatement_list(): PackageStatementContext[] {
		return this.getTypedRuleContexts(PackageStatementContext) as PackageStatementContext[];
	}
	public packageStatement(i: number): PackageStatementContext {
		return this.getTypedRuleContext(PackageStatementContext, i) as PackageStatementContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_packageDeclaration;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPackageDeclaration) {
	 		listener.enterPackageDeclaration(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPackageDeclaration) {
	 		listener.exitPackageDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPackageDeclaration) {
			return visitor.visitPackageDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PackageStatementContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public importStatement(): ImportStatementContext {
		return this.getTypedRuleContext(ImportStatementContext, 0) as ImportStatementContext;
	}
	public entityDeclaration(): EntityDeclarationContext {
		return this.getTypedRuleContext(EntityDeclarationContext, 0) as EntityDeclarationContext;
	}
	public useDeclaration(): UseDeclarationContext {
		return this.getTypedRuleContext(UseDeclarationContext, 0) as UseDeclarationContext;
	}
	public logicStatement(): LogicStatementContext {
		return this.getTypedRuleContext(LogicStatementContext, 0) as LogicStatementContext;
	}
	public functionStatement(): FunctionStatementContext {
		return this.getTypedRuleContext(FunctionStatementContext, 0) as FunctionStatementContext;
	}
	public packageExportDeclaration(): PackageExportDeclarationContext {
		return this.getTypedRuleContext(PackageExportDeclarationContext, 0) as PackageExportDeclarationContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_packageStatement;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPackageStatement) {
	 		listener.enterPackageStatement(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPackageStatement) {
	 		listener.exitPackageStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPackageStatement) {
			return visitor.visitPackageStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PackageExportDeclarationContext extends ParserRuleContext {
	public _name!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHELL(): TerminalNode {
		return this.getToken(KELParser.SHELL, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(KELParser.COLON, 0);
	}
	public LARROW(): TerminalNode {
		return this.getToken(KELParser.LARROW, 0);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_packageExportDeclaration;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPackageExportDeclaration) {
	 		listener.enterPackageExportDeclaration(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPackageExportDeclaration) {
	 		listener.exitPackageExportDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPackageExportDeclaration) {
			return visitor.visitPackageExportDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EntityDeclarationContext extends ParserRuleContext {
	public _t!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public DEFEQ(): TerminalNode {
		return this.getToken(KELParser.DEFEQ, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public entityProperty_list(): EntityPropertyContext[] {
		return this.getTypedRuleContexts(EntityPropertyContext) as EntityPropertyContext[];
	}
	public entityProperty(i: number): EntityPropertyContext {
		return this.getTypedRuleContext(EntityPropertyContext, i) as EntityPropertyContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public ENTITY(): TerminalNode {
		return this.getToken(KELParser.ENTITY, 0);
	}
	public ASSOCIATION(): TerminalNode {
		return this.getToken(KELParser.ASSOCIATION, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_entityDeclaration;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEntityDeclaration) {
	 		listener.enterEntityDeclaration(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEntityDeclaration) {
	 		listener.exitEntityDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEntityDeclaration) {
			return visitor.visitEntityDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EntityPropertyContext extends ParserRuleContext {
	public _fm!: FieldMappingContext;
	public _m!: ModelDeclarationContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public fieldMapping(): FieldMappingContext {
		return this.getTypedRuleContext(FieldMappingContext, 0) as FieldMappingContext;
	}
	public modelDeclaration(): ModelDeclarationContext {
		return this.getTypedRuleContext(ModelDeclarationContext, 0) as ModelDeclarationContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_entityProperty;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEntityProperty) {
	 		listener.enterEntityProperty(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEntityProperty) {
	 		listener.exitEntityProperty(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEntityProperty) {
			return visitor.visitEntityProperty(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FieldMappingContext extends ParserRuleContext {
	public _m!: MappingElementContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public fileType(): FileTypeContext {
		return this.getTypedRuleContext(FileTypeContext, 0) as FileTypeContext;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public mappingElement_list(): MappingElementContext[] {
		return this.getTypedRuleContexts(MappingElementContext) as MappingElementContext[];
	}
	public mappingElement(i: number): MappingElementContext {
		return this.getTypedRuleContext(MappingElementContext, i) as MappingElementContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_fieldMapping;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFieldMapping) {
	 		listener.enterFieldMapping(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFieldMapping) {
	 		listener.exitFieldMapping(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFieldMapping) {
			return visitor.visitFieldMapping(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FileTypeContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FLAT(): TerminalNode {
		return this.getToken(KELParser.FLAT, 0);
	}
	public QUERY(): TerminalNode {
		return this.getToken(KELParser.QUERY, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_fileType;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFileType) {
	 		listener.enterFileType(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFileType) {
	 		listener.exitFileType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFileType) {
			return visitor.visitFileType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MappingElementContext extends ParserRuleContext {
	public _t!: Token;
	public _i!: Token;
	public _nspec!: NullSpecContext;
	public _fspec!: FormatSpecContext;
	public _from_!: DotIdContext;
	public _lspec!: LikeSpecContext;
	public _c!: CompositeIdSpecContext;
	public _u!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(KELParser.ID, i);
	}
	public EQ(): TerminalNode {
		return this.getToken(KELParser.EQ, 0);
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
	public nullSpec(): NullSpecContext {
		return this.getTypedRuleContext(NullSpecContext, 0) as NullSpecContext;
	}
	public formatSpec(): FormatSpecContext {
		return this.getTypedRuleContext(FormatSpecContext, 0) as FormatSpecContext;
	}
	public likeSpec(): LikeSpecContext {
		return this.getTypedRuleContext(LikeSpecContext, 0) as LikeSpecContext;
	}
	public UID(): TerminalNode {
		return this.getToken(KELParser.UID, 0);
	}
	public compositeIdSpec(): CompositeIdSpecContext {
		return this.getTypedRuleContext(CompositeIdSpecContext, 0) as CompositeIdSpecContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_mappingElement;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterMappingElement) {
	 		listener.enterMappingElement(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitMappingElement) {
	 		listener.exitMappingElement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitMappingElement) {
			return visitor.visitMappingElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NullSpecContext extends ParserRuleContext {
	public _c!: SimpleConstantContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NULL(): TerminalNode {
		return this.getToken(KELParser.NULL, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public simpleConstant(): SimpleConstantContext {
		return this.getTypedRuleContext(SimpleConstantContext, 0) as SimpleConstantContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_nullSpec;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterNullSpec) {
	 		listener.enterNullSpec(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitNullSpec) {
	 		listener.exitNullSpec(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitNullSpec) {
			return visitor.visitNullSpec(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FormatSpecContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FORMAT(): TerminalNode {
		return this.getToken(KELParser.FORMAT, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public simpleConstant_list(): SimpleConstantContext[] {
		return this.getTypedRuleContexts(SimpleConstantContext) as SimpleConstantContext[];
	}
	public simpleConstant(i: number): SimpleConstantContext {
		return this.getTypedRuleContext(SimpleConstantContext, i) as SimpleConstantContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_formatSpec;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFormatSpec) {
	 		listener.enterFormatSpec(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFormatSpec) {
	 		listener.exitFormatSpec(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFormatSpec) {
			return visitor.visitFormatSpec(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LikeSpecContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LIKE(): TerminalNode {
		return this.getToken(KELParser.LIKE, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_likeSpec;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterLikeSpec) {
	 		listener.enterLikeSpec(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitLikeSpec) {
	 		listener.exitLikeSpec(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitLikeSpec) {
			return visitor.visitLikeSpec(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CompositeIdSpecContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public dotId_list(): DotIdContext[] {
		return this.getTypedRuleContexts(DotIdContext) as DotIdContext[];
	}
	public dotId(i: number): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, i) as DotIdContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_compositeIdSpec;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterCompositeIdSpec) {
	 		listener.enterCompositeIdSpec(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitCompositeIdSpec) {
	 		listener.exitCompositeIdSpec(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitCompositeIdSpec) {
			return visitor.visitCompositeIdSpec(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ModelDeclarationContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_modelDeclaration;
	}
	public copyFrom(ctx: ModelDeclarationContext): void {
		super.copyFrom(ctx);
	}
}
export class ComplexModelContext extends ModelDeclarationContext {
	public _md!: Token;
	constructor(parser: KELParser, ctx: ModelDeclarationContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public submodelDeclaration_list(): SubmodelDeclarationContext[] {
		return this.getTypedRuleContexts(SubmodelDeclarationContext) as SubmodelDeclarationContext[];
	}
	public submodelDeclaration(i: number): SubmodelDeclarationContext {
		return this.getTypedRuleContext(SubmodelDeclarationContext, i) as SubmodelDeclarationContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public MODEL(): TerminalNode {
		return this.getToken(KELParser.MODEL, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterComplexModel) {
	 		listener.enterComplexModel(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitComplexModel) {
	 		listener.exitComplexModel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitComplexModel) {
			return visitor.visitComplexModel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SingleRowModelContext extends ModelDeclarationContext {
	public _md!: Token;
	constructor(parser: KELParser, ctx: ModelDeclarationContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public STAR(): TerminalNode {
		return this.getToken(KELParser.STAR, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public MODEL(): TerminalNode {
		return this.getToken(KELParser.MODEL, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterSingleRowModel) {
	 		listener.enterSingleRowModel(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitSingleRowModel) {
	 		listener.exitSingleRowModel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitSingleRowModel) {
			return visitor.visitSingleRowModel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SubmodelDeclarationContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_submodelDeclaration;
	}
	public copyFrom(ctx: SubmodelDeclarationContext): void {
		super.copyFrom(ctx);
	}
}
export class ExplicitSubModelContext extends SubmodelDeclarationContext {
	public _n!: Token;
	public _b!: Token;
	constructor(parser: KELParser, ctx: SubmodelDeclarationContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public submodelId_list(): SubmodelIdContext[] {
		return this.getTypedRuleContexts(SubmodelIdContext) as SubmodelIdContext[];
	}
	public submodelId(i: number): SubmodelIdContext {
		return this.getTypedRuleContext(SubmodelIdContext, i) as SubmodelIdContext;
	}
	public RCURL(): TerminalNode {
		return this.getToken(KELParser.RCURL, 0);
	}
	public LCURL(): TerminalNode {
		return this.getToken(KELParser.LCURL, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterExplicitSubModel) {
	 		listener.enterExplicitSubModel(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitExplicitSubModel) {
	 		listener.exitExplicitSubModel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitExplicitSubModel) {
			return visitor.visitExplicitSubModel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SingleValueSubModelContext extends SubmodelDeclarationContext {
	public _i!: Token;
	constructor(parser: KELParser, ctx: SubmodelDeclarationContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public UID(): TerminalNode {
		return this.getToken(KELParser.UID, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterSingleValueSubModel) {
	 		listener.enterSingleValueSubModel(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitSingleValueSubModel) {
	 		listener.exitSingleValueSubModel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitSingleValueSubModel) {
			return visitor.visitSingleValueSubModel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RemainderSubModelContext extends SubmodelDeclarationContext {
	public _b!: Token;
	constructor(parser: KELParser, ctx: SubmodelDeclarationContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public STAR(): TerminalNode {
		return this.getToken(KELParser.STAR, 0);
	}
	public RCURL(): TerminalNode {
		return this.getToken(KELParser.RCURL, 0);
	}
	public LCURL(): TerminalNode {
		return this.getToken(KELParser.LCURL, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterRemainderSubModel) {
	 		listener.enterRemainderSubModel(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitRemainderSubModel) {
	 		listener.exitRemainderSubModel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitRemainderSubModel) {
			return visitor.visitRemainderSubModel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SubmodelIdContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public UID(): TerminalNode {
		return this.getToken(KELParser.UID, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_submodelId;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterSubmodelId) {
	 		listener.enterSubmodelId(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitSubmodelId) {
	 		listener.exitSubmodelId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitSubmodelId) {
			return visitor.visitSubmodelId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseDeclarationContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USE(): TerminalNode {
		return this.getToken(KELParser.USE, 0);
	}
	public useElement_list(): UseElementContext[] {
		return this.getTypedRuleContexts(UseElementContext) as UseElementContext[];
	}
	public useElement(i: number): UseElementContext {
		return this.getTypedRuleContext(UseElementContext, i) as UseElementContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_useDeclaration;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterUseDeclaration) {
	 		listener.enterUseDeclaration(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitUseDeclaration) {
	 		listener.exitUseDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitUseDeclaration) {
			return visitor.visitUseDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseKelBaseDeclarationContext extends ParserRuleContext {
	public _attr!: DotIdContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USE(): TerminalNode {
		return this.getToken(KELParser.USE, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public KELBASE(): TerminalNode {
		return this.getToken(KELParser.KELBASE, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_useKelBaseDeclaration;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterUseKelBaseDeclaration) {
	 		listener.enterUseKelBaseDeclaration(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitUseKelBaseDeclaration) {
	 		listener.exitUseKelBaseDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitUseKelBaseDeclaration) {
			return visitor.visitUseKelBaseDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseKelQueryDeclarationContext extends ParserRuleContext {
	public _attr!: DotIdContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USE(): TerminalNode {
		return this.getToken(KELParser.USE, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public KELQUERY(): TerminalNode {
		return this.getToken(KELParser.KELQUERY, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(KELParser.ID, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_useKelQueryDeclaration;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterUseKelQueryDeclaration) {
	 		listener.enterUseKelQueryDeclaration(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitUseKelQueryDeclaration) {
	 		listener.exitUseKelQueryDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitUseKelQueryDeclaration) {
			return visitor.visitUseKelQueryDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseElementContext extends ParserRuleContext {
	public _attr!: DotIdContext;
	public _t!: UseFileTypeContext;
	public _ne!: NestedEntityMappingContext;
	public _e!: EntityMappingContext;
	public _p!: PermitsClauseContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
	public useFileType(): UseFileTypeContext {
		return this.getTypedRuleContext(UseFileTypeContext, 0) as UseFileTypeContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public hintsClause_list(): HintsClauseContext[] {
		return this.getTypedRuleContexts(HintsClauseContext) as HintsClauseContext[];
	}
	public hintsClause(i: number): HintsClauseContext {
		return this.getTypedRuleContext(HintsClauseContext, i) as HintsClauseContext;
	}
	public nestedEntityMapping_list(): NestedEntityMappingContext[] {
		return this.getTypedRuleContexts(NestedEntityMappingContext) as NestedEntityMappingContext[];
	}
	public nestedEntityMapping(i: number): NestedEntityMappingContext {
		return this.getTypedRuleContext(NestedEntityMappingContext, i) as NestedEntityMappingContext;
	}
	public entityMapping_list(): EntityMappingContext[] {
		return this.getTypedRuleContexts(EntityMappingContext) as EntityMappingContext[];
	}
	public entityMapping(i: number): EntityMappingContext {
		return this.getTypedRuleContext(EntityMappingContext, i) as EntityMappingContext;
	}
	public permitsClause_list(): PermitsClauseContext[] {
		return this.getTypedRuleContexts(PermitsClauseContext) as PermitsClauseContext[];
	}
	public permitsClause(i: number): PermitsClauseContext {
		return this.getTypedRuleContext(PermitsClauseContext, i) as PermitsClauseContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_useElement;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterUseElement) {
	 		listener.enterUseElement(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitUseElement) {
	 		listener.exitUseElement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitUseElement) {
			return visitor.visitUseElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseFileTypeContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FLAT(): TerminalNode {
		return this.getToken(KELParser.FLAT, 0);
	}
	public FDC(): TerminalNode {
		return this.getToken(KELParser.FDC, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_useFileType;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterUseFileType) {
	 		listener.enterUseFileType(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitUseFileType) {
	 		listener.exitUseFileType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitUseFileType) {
			return visitor.visitUseFileType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseClauseContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USE(): TerminalNode {
		return this.getToken(KELParser.USE, 0);
	}
	public useClauseElement_list(): UseClauseElementContext[] {
		return this.getTypedRuleContexts(UseClauseElementContext) as UseClauseElementContext[];
	}
	public useClauseElement(i: number): UseClauseElementContext {
		return this.getTypedRuleContext(UseClauseElementContext, i) as UseClauseElementContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_useClause;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterUseClause) {
	 		listener.enterUseClause(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitUseClause) {
	 		listener.exitUseClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitUseClause) {
			return visitor.visitUseClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseClauseElementContext extends ParserRuleContext {
	public _attr!: Token;
	public _t!: UseClauseFileTypeContext;
	public _e!: EntityMappingContext;
	public _p!: PermitsClauseContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public useClauseFileType(): UseClauseFileTypeContext {
		return this.getTypedRuleContext(UseClauseFileTypeContext, 0) as UseClauseFileTypeContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public entityMapping_list(): EntityMappingContext[] {
		return this.getTypedRuleContexts(EntityMappingContext) as EntityMappingContext[];
	}
	public entityMapping(i: number): EntityMappingContext {
		return this.getTypedRuleContext(EntityMappingContext, i) as EntityMappingContext;
	}
	public permitsClause_list(): PermitsClauseContext[] {
		return this.getTypedRuleContexts(PermitsClauseContext) as PermitsClauseContext[];
	}
	public permitsClause(i: number): PermitsClauseContext {
		return this.getTypedRuleContext(PermitsClauseContext, i) as PermitsClauseContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_useClauseElement;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterUseClauseElement) {
	 		listener.enterUseClauseElement(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitUseClauseElement) {
	 		listener.exitUseClauseElement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitUseClauseElement) {
			return visitor.visitUseClauseElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseClauseFileTypeContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FLAT(): TerminalNode {
		return this.getToken(KELParser.FLAT, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_useClauseFileType;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterUseClauseFileType) {
	 		listener.enterUseClauseFileType(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitUseClauseFileType) {
	 		listener.exitUseClauseFileType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitUseClauseFileType) {
			return visitor.visitUseClauseFileType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NestedEntityMappingContext extends ParserRuleContext {
	public _child!: Token;
	public _e1!: EntityMappingContext;
	public _p1!: PermitsClauseContext;
	public _e2!: EntityMappingContext;
	public _p2!: PermitsClauseContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public entityMapping_list(): EntityMappingContext[] {
		return this.getTypedRuleContexts(EntityMappingContext) as EntityMappingContext[];
	}
	public entityMapping(i: number): EntityMappingContext {
		return this.getTypedRuleContext(EntityMappingContext, i) as EntityMappingContext;
	}
	public permitsClause_list(): PermitsClauseContext[] {
		return this.getTypedRuleContexts(PermitsClauseContext) as PermitsClauseContext[];
	}
	public permitsClause(i: number): PermitsClauseContext {
		return this.getTypedRuleContext(PermitsClauseContext, i) as PermitsClauseContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_nestedEntityMapping;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterNestedEntityMapping) {
	 		listener.enterNestedEntityMapping(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitNestedEntityMapping) {
	 		listener.exitNestedEntityMapping(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitNestedEntityMapping) {
			return visitor.visitNestedEntityMapping(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EntityMappingContext extends ParserRuleContext {
	public _e!: Token;
	public _p!: Token;
	public _f!: EclBodyContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(KELParser.ID, i);
	}
	public LP_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.LP);
	}
	public LP(i: number): TerminalNode {
		return this.getToken(KELParser.LP, i);
	}
	public useMappingOverride_list(): UseMappingOverrideContext[] {
		return this.getTypedRuleContexts(UseMappingOverrideContext) as UseMappingOverrideContext[];
	}
	public useMappingOverride(i: number): UseMappingOverrideContext {
		return this.getTypedRuleContext(UseMappingOverrideContext, i) as UseMappingOverrideContext;
	}
	public RP_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.RP);
	}
	public RP(i: number): TerminalNode {
		return this.getToken(KELParser.RP, i);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public STAR(): TerminalNode {
		return this.getToken(KELParser.STAR, 0);
	}
	public FILTER(): TerminalNode {
		return this.getToken(KELParser.FILTER, 0);
	}
	public eclBody(): EclBodyContext {
		return this.getTypedRuleContext(EclBodyContext, 0) as EclBodyContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_entityMapping;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEntityMapping) {
	 		listener.enterEntityMapping(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEntityMapping) {
	 		listener.exitEntityMapping(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEntityMapping) {
			return visitor.visitEntityMapping(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UseMappingOverrideContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_useMappingOverride;
	}
	public copyFrom(ctx: UseMappingOverrideContext): void {
		super.copyFrom(ctx);
	}
}
export class NormalMappingOverrideContext extends UseMappingOverrideContext {
	public _ef!: Token;
	public _from_!: DotIdContext;
	public _nspec!: NullSpecContext;
	public _fspec!: FormatSpecContext;
	public _lspec!: LikeSpecContext;
	constructor(parser: KELParser, ctx: UseMappingOverrideContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public EQ(): TerminalNode {
		return this.getToken(KELParser.EQ, 0);
	}
	public UID(): TerminalNode {
		return this.getToken(KELParser.UID, 0);
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public nullSpec(): NullSpecContext {
		return this.getTypedRuleContext(NullSpecContext, 0) as NullSpecContext;
	}
	public formatSpec(): FormatSpecContext {
		return this.getTypedRuleContext(FormatSpecContext, 0) as FormatSpecContext;
	}
	public likeSpec(): LikeSpecContext {
		return this.getTypedRuleContext(LikeSpecContext, 0) as LikeSpecContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterNormalMappingOverride) {
	 		listener.enterNormalMappingOverride(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitNormalMappingOverride) {
	 		listener.exitNormalMappingOverride(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitNormalMappingOverride) {
			return visitor.visitNormalMappingOverride(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ConstantMappingOverrideContext extends UseMappingOverrideContext {
	public _ef!: Token;
	public _c!: SimpleConstantContext;
	constructor(parser: KELParser, ctx: UseMappingOverrideContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public EQ(): TerminalNode {
		return this.getToken(KELParser.EQ, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public simpleConstant(): SimpleConstantContext {
		return this.getTypedRuleContext(SimpleConstantContext, 0) as SimpleConstantContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterConstantMappingOverride) {
	 		listener.enterConstantMappingOverride(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitConstantMappingOverride) {
	 		listener.exitConstantMappingOverride(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitConstantMappingOverride) {
			return visitor.visitConstantMappingOverride(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DotIdContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(KELParser.ID, i);
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(KELParser.DOT, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_dotId;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterDotId) {
	 		listener.enterDotId(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitDotId) {
	 		listener.exitDotId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitDotId) {
			return visitor.visitDotId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PermitsClauseContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PERMITS(): TerminalNode {
		return this.getToken(KELParser.PERMITS, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public permitsSpec(): PermitsSpecContext {
		return this.getTypedRuleContext(PermitsSpecContext, 0) as PermitsSpecContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_permitsClause;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPermitsClause) {
	 		listener.enterPermitsClause(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPermitsClause) {
	 		listener.exitPermitsClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPermitsClause) {
			return visitor.visitPermitsClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PermitsSpecContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_permitsSpec;
	}
	public copyFrom(ctx: PermitsSpecContext): void {
		super.copyFrom(ctx);
	}
}
export class ConstantPermitsContext extends PermitsSpecContext {
	constructor(parser: KELParser, ctx: PermitsSpecContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LSQUARE(): TerminalNode {
		return this.getToken(KELParser.LSQUARE, 0);
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(KELParser.ID, i);
	}
	public RSQUARE(): TerminalNode {
		return this.getToken(KELParser.RSQUARE, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterConstantPermits) {
	 		listener.enterConstantPermits(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitConstantPermits) {
	 		listener.exitConstantPermits(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitConstantPermits) {
			return visitor.visitConstantPermits(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VariablePermitsContext extends PermitsSpecContext {
	constructor(parser: KELParser, ctx: PermitsSpecContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterVariablePermits) {
	 		listener.enterVariablePermits(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitVariablePermits) {
	 		listener.exitVariablePermits(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitVariablePermits) {
			return visitor.visitVariablePermits(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HintsClauseContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public HINT(): TerminalNode {
		return this.getToken(KELParser.HINT, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_hintsClause;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterHintsClause) {
	 		listener.enterHintsClause(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitHintsClause) {
	 		listener.exitHintsClause(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitHintsClause) {
			return visitor.visitHintsClause(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicStatementContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_logicStatement;
	}
	public copyFrom(ctx: LogicStatementContext): void {
		super.copyFrom(ctx);
	}
}
export class ConstantDeclStatementContext extends LogicStatementContext {
	public _c!: Token;
	constructor(parser: KELParser, ctx: LogicStatementContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public COLON(): TerminalNode {
		return this.getToken(KELParser.COLON, 0);
	}
	public logicProductions(): LogicProductionsContext {
		return this.getTypedRuleContext(LogicProductionsContext, 0) as LogicProductionsContext;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterConstantDeclStatement) {
	 		listener.enterConstantDeclStatement(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitConstantDeclStatement) {
	 		listener.exitConstantDeclStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitConstantDeclStatement) {
			return visitor.visitConstantDeclStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LogicPropertyStatementContext extends LogicStatementContext {
	public _c!: Token;
	public _p!: LogicPredicateContext;
	public _mvp!: Token;
	constructor(parser: KELParser, ctx: LogicStatementContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public COLON(): TerminalNode {
		return this.getToken(KELParser.COLON, 0);
	}
	public RARROW(): TerminalNode {
		return this.getToken(KELParser.RARROW, 0);
	}
	public logicProductions(): LogicProductionsContext {
		return this.getTypedRuleContext(LogicProductionsContext, 0) as LogicProductionsContext;
	}
	public ID_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ID);
	}
	public ID(i: number): TerminalNode {
		return this.getToken(KELParser.ID, i);
	}
	public logicPredicate(): LogicPredicateContext {
		return this.getTypedRuleContext(LogicPredicateContext, 0) as LogicPredicateContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(KELParser.DOT, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterLogicPropertyStatement) {
	 		listener.enterLogicPropertyStatement(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitLogicPropertyStatement) {
	 		listener.exitLogicPropertyStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitLogicPropertyStatement) {
			return visitor.visitLogicPropertyStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class EntityGeneratorStatementContext extends LogicStatementContext {
	public _p!: LogicPredicateContext;
	constructor(parser: KELParser, ctx: LogicStatementContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public GLOBAL(): TerminalNode {
		return this.getToken(KELParser.GLOBAL, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(KELParser.COLON, 0);
	}
	public RARROW(): TerminalNode {
		return this.getToken(KELParser.RARROW, 0);
	}
	public entityProductions(): EntityProductionsContext {
		return this.getTypedRuleContext(EntityProductionsContext, 0) as EntityProductionsContext;
	}
	public logicPredicate(): LogicPredicateContext {
		return this.getTypedRuleContext(LogicPredicateContext, 0) as LogicPredicateContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEntityGeneratorStatement) {
	 		listener.enterEntityGeneratorStatement(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEntityGeneratorStatement) {
	 		listener.exitEntityGeneratorStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEntityGeneratorStatement) {
			return visitor.visitEntityGeneratorStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicPredicateContext extends ParserRuleContext {
	public _ex1!: ExpressionContext;
	public _ex2!: ExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_logicPredicate;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterLogicPredicate) {
	 		listener.enterLogicPredicate(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitLogicPredicate) {
	 		listener.exitLogicPredicate(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitLogicPredicate) {
			return visitor.visitLogicPredicate(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicProductionsContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public logicProduction_list(): LogicProductionContext[] {
		return this.getTypedRuleContexts(LogicProductionContext) as LogicProductionContext[];
	}
	public logicProduction(i: number): LogicProductionContext {
		return this.getTypedRuleContext(LogicProductionContext, i) as LogicProductionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_logicProductions;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterLogicProductions) {
	 		listener.enterLogicProductions(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitLogicProductions) {
	 		listener.exitLogicProductions(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitLogicProductions) {
			return visitor.visitLogicProductions(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicProductionContext extends ParserRuleContext {
	public _name!: Token;
	public _ex!: ExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEFEQ(): TerminalNode {
		return this.getToken(KELParser.DEFEQ, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_logicProduction;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterLogicProduction) {
	 		listener.enterLogicProduction(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitLogicProduction) {
	 		listener.exitLogicProduction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitLogicProduction) {
			return visitor.visitLogicProduction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EntityProductionsContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public entityProduction_list(): EntityProductionContext[] {
		return this.getTypedRuleContexts(EntityProductionContext) as EntityProductionContext[];
	}
	public entityProduction(i: number): EntityProductionContext {
		return this.getTypedRuleContext(EntityProductionContext, i) as EntityProductionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_entityProductions;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEntityProductions) {
	 		listener.enterEntityProductions(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEntityProductions) {
	 		listener.exitEntityProductions(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEntityProductions) {
			return visitor.visitEntityProductions(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EntityProductionContext extends ParserRuleContext {
	public _name!: Token;
	public _e1!: ExpressionContext;
	public _op!: Token;
	public _e2!: ExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_entityProduction;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEntityProduction) {
	 		listener.enterEntityProduction(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEntityProduction) {
	 		listener.exitEntityProduction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEntityProduction) {
			return visitor.visitEntityProduction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionStatementContext extends ParserRuleContext {
	public _name!: Token;
	public _ps!: FparamsContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FUNCTION(): TerminalNode {
		return this.getToken(KELParser.FUNCTION, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(KELParser.COLON, 0);
	}
	public LARROW(): TerminalNode {
		return this.getToken(KELParser.LARROW, 0);
	}
	public functionBody(): FunctionBodyContext {
		return this.getTypedRuleContext(FunctionBodyContext, 0) as FunctionBodyContext;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public fparams(): FparamsContext {
		return this.getTypedRuleContext(FparamsContext, 0) as FparamsContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_functionStatement;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFunctionStatement) {
	 		listener.enterFunctionStatement(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFunctionStatement) {
	 		listener.exitFunctionStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFunctionStatement) {
			return visitor.visitFunctionStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FparamsContext extends ParserRuleContext {
	public _q1!: FparamContext;
	public _q2!: FparamContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public fparam_list(): FparamContext[] {
		return this.getTypedRuleContexts(FparamContext) as FparamContext[];
	}
	public fparam(i: number): FparamContext {
		return this.getTypedRuleContext(FparamContext, i) as FparamContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_fparams;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFparams) {
	 		listener.enterFparams(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFparams) {
	 		listener.exitFparams(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFparams) {
			return visitor.visitFparams(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FparamContext extends ParserRuleContext {
	public _pt!: ParamTypeIdContext;
	public _id!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public paramTypeId(): ParamTypeIdContext {
		return this.getTypedRuleContext(ParamTypeIdContext, 0) as ParamTypeIdContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_fparam;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFparam) {
	 		listener.enterFparam(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFparam) {
	 		listener.exitFparam(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFparam) {
			return visitor.visitFparam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionBodyContext extends ParserRuleContext {
	public _kel!: ExpressionContext;
	public _ecl!: EclExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public eclExpression(): EclExpressionContext {
		return this.getTypedRuleContext(EclExpressionContext, 0) as EclExpressionContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_functionBody;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFunctionBody) {
	 		listener.enterFunctionBody(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFunctionBody) {
	 		listener.exitFunctionBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFunctionBody) {
			return visitor.visitFunctionBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QueryDeclarationContext extends ParserRuleContext {
	public _name!: Token;
	public _ps!: QparamsContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public QUERY(): TerminalNode {
		return this.getToken(KELParser.QUERY, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(KELParser.COLON, 0);
	}
	public LARROW(): TerminalNode {
		return this.getToken(KELParser.LARROW, 0);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public asof_list(): AsofContext[] {
		return this.getTypedRuleContexts(AsofContext) as AsofContext[];
	}
	public asof(i: number): AsofContext {
		return this.getTypedRuleContext(AsofContext, i) as AsofContext;
	}
	public using(): UsingContext {
		return this.getTypedRuleContext(UsingContext, 0) as UsingContext;
	}
	public useClause(): UseClauseContext {
		return this.getTypedRuleContext(UseClauseContext, 0) as UseClauseContext;
	}
	public qparams(): QparamsContext {
		return this.getTypedRuleContext(QparamsContext, 0) as QparamsContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_queryDeclaration;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterQueryDeclaration) {
	 		listener.enterQueryDeclaration(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitQueryDeclaration) {
	 		listener.exitQueryDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitQueryDeclaration) {
			return visitor.visitQueryDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QparamsContext extends ParserRuleContext {
	public _q1!: QparamContext;
	public _q2!: QparamContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public qparam_list(): QparamContext[] {
		return this.getTypedRuleContexts(QparamContext) as QparamContext[];
	}
	public qparam(i: number): QparamContext {
		return this.getTypedRuleContext(QparamContext, i) as QparamContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_qparams;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterQparams) {
	 		listener.enterQparams(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitQparams) {
	 		listener.exitQparams(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitQparams) {
			return visitor.visitQparams(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QparamContext extends ParserRuleContext {
	public _pt!: ParamTypeIdContext;
	public _id!: Token;
	public _at!: SimpleTypeIdContext;
	public _sid!: Token;
	public _pid!: Token;
	public _dstype!: DotIdContext;
	public _dsid!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public paramTypeId(): ParamTypeIdContext {
		return this.getTypedRuleContext(ParamTypeIdContext, 0) as ParamTypeIdContext;
	}
	public SID(): TerminalNode {
		return this.getToken(KELParser.SID, 0);
	}
	public simpleTypeId(): SimpleTypeIdContext {
		return this.getTypedRuleContext(SimpleTypeIdContext, 0) as SimpleTypeIdContext;
	}
	public PERMITS(): TerminalNode {
		return this.getToken(KELParser.PERMITS, 0);
	}
	public DATASET(): TerminalNode {
		return this.getToken(KELParser.DATASET, 0);
	}
	public OF(): TerminalNode {
		return this.getToken(KELParser.OF, 0);
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_qparam;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterQparam) {
	 		listener.enterQparam(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitQparam) {
	 		listener.exitQparam(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitQparam) {
			return visitor.visitQparam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParamTypeIdContext extends ParserRuleContext {
	public _simple!: SimpleTypeIdContext;
	public _isSet!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleTypeId(): SimpleTypeIdContext {
		return this.getTypedRuleContext(SimpleTypeIdContext, 0) as SimpleTypeIdContext;
	}
	public OF(): TerminalNode {
		return this.getToken(KELParser.OF, 0);
	}
	public SET(): TerminalNode {
		return this.getToken(KELParser.SET, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_paramTypeId;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterParamTypeId) {
	 		listener.enterParamTypeId(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitParamTypeId) {
	 		listener.exitParamTypeId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitParamTypeId) {
			return visitor.visitParamTypeId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SimpleTypeIdContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public UID(): TerminalNode {
		return this.getToken(KELParser.UID, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_simpleTypeId;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterSimpleTypeId) {
	 		listener.enterSimpleTypeId(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitSimpleTypeId) {
	 		listener.exitSimpleTypeId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitSimpleTypeId) {
			return visitor.visitSimpleTypeId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AsofContext extends ParserRuleContext {
	public _eraname!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ASOF(): TerminalNode {
		return this.getToken(KELParser.ASOF, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public COMMA(): TerminalNode {
		return this.getToken(KELParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_asof;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterAsof) {
	 		listener.enterAsof(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitAsof) {
	 		listener.exitAsof(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitAsof) {
			return visitor.visitAsof(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UsingContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public USING(): TerminalNode {
		return this.getToken(KELParser.USING, 0);
	}
	public permitsSpec(): PermitsSpecContext {
		return this.getTypedRuleContext(PermitsSpecContext, 0) as PermitsSpecContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_using;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterUsing) {
	 		listener.enterUsing(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitUsing) {
	 		listener.exitUsing(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitUsing) {
			return visitor.visitUsing(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ShellDeclarationContext extends ParserRuleContext {
	public _name!: Token;
	public _ps!: QparamsContext;
	public _ex!: ExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SHELL(): TerminalNode {
		return this.getToken(KELParser.SHELL, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(KELParser.COLON, 0);
	}
	public LARROW(): TerminalNode {
		return this.getToken(KELParser.LARROW, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public asof_list(): AsofContext[] {
		return this.getTypedRuleContexts(AsofContext) as AsofContext[];
	}
	public asof(i: number): AsofContext {
		return this.getTypedRuleContext(AsofContext, i) as AsofContext;
	}
	public using(): UsingContext {
		return this.getTypedRuleContext(UsingContext, 0) as UsingContext;
	}
	public useClause(): UseClauseContext {
		return this.getTypedRuleContext(UseClauseContext, 0) as UseClauseContext;
	}
	public qparams(): QparamsContext {
		return this.getTypedRuleContext(QparamsContext, 0) as QparamsContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_shellDeclaration;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterShellDeclaration) {
	 		listener.enterShellDeclaration(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitShellDeclaration) {
	 		listener.exitShellDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitShellDeclaration) {
			return visitor.visitShellDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Visual_sectionContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VIS(): TerminalNode {
		return this.getToken(KELParser.VIS, 0);
	}
	public ENDVIS_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ENDVIS);
	}
	public ENDVIS(i: number): TerminalNode {
		return this.getToken(KELParser.ENDVIS, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_visual_section;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterVisual_section) {
	 		listener.enterVisual_section(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitVisual_section) {
	 		listener.exitVisual_section(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitVisual_section) {
			return visitor.visitVisual_section(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Resource_sectionContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public RESOURCES(): TerminalNode {
		return this.getToken(KELParser.RESOURCES, 0);
	}
	public ENDRESOURCES_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.ENDRESOURCES);
	}
	public ENDRESOURCES(i: number): TerminalNode {
		return this.getToken(KELParser.ENDRESOURCES, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_resource_section;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterResource_section) {
	 		listener.enterResource_section(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitResource_section) {
	 		listener.exitResource_section(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitResource_section) {
			return visitor.visitResource_section(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public _be!: BooleanDisjunctionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public booleanDisjunction(): BooleanDisjunctionContext {
		return this.getTypedRuleContext(BooleanDisjunctionContext, 0) as BooleanDisjunctionContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_expression;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterExpression) {
	 		listener.enterExpression(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitExpression) {
	 		listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BooleanDisjunctionContext extends ParserRuleContext {
	public _op!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public booleanConjunction_list(): BooleanConjunctionContext[] {
		return this.getTypedRuleContexts(BooleanConjunctionContext) as BooleanConjunctionContext[];
	}
	public booleanConjunction(i: number): BooleanConjunctionContext {
		return this.getTypedRuleContext(BooleanConjunctionContext, i) as BooleanConjunctionContext;
	}
	public OR_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.OR);
	}
	public OR(i: number): TerminalNode {
		return this.getToken(KELParser.OR, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_booleanDisjunction;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterBooleanDisjunction) {
	 		listener.enterBooleanDisjunction(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitBooleanDisjunction) {
	 		listener.exitBooleanDisjunction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitBooleanDisjunction) {
			return visitor.visitBooleanDisjunction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BooleanConjunctionContext extends ParserRuleContext {
	public _op!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public booleanTerm_list(): BooleanTermContext[] {
		return this.getTypedRuleContexts(BooleanTermContext) as BooleanTermContext[];
	}
	public booleanTerm(i: number): BooleanTermContext {
		return this.getTypedRuleContext(BooleanTermContext, i) as BooleanTermContext;
	}
	public AND_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.AND);
	}
	public AND(i: number): TerminalNode {
		return this.getToken(KELParser.AND, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_booleanConjunction;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterBooleanConjunction) {
	 		listener.enterBooleanConjunction(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitBooleanConjunction) {
	 		listener.exitBooleanConjunction(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitBooleanConjunction) {
			return visitor.visitBooleanConjunction(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BooleanTermContext extends ParserRuleContext {
	public _op!: Token;
	public _t!: BooleanTermContext;
	public _a!: BooleanAtomContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NOT(): TerminalNode {
		return this.getToken(KELParser.NOT, 0);
	}
	public booleanTerm(): BooleanTermContext {
		return this.getTypedRuleContext(BooleanTermContext, 0) as BooleanTermContext;
	}
	public booleanAtom(): BooleanAtomContext {
		return this.getTypedRuleContext(BooleanAtomContext, 0) as BooleanAtomContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_booleanTerm;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterBooleanTerm) {
	 		listener.enterBooleanTerm(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitBooleanTerm) {
	 		listener.exitBooleanTerm(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitBooleanTerm) {
			return visitor.visitBooleanTerm(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BooleanAtomContext extends ParserRuleContext {
	public _e1!: ValueExpressionContext;
	public _op!: Token;
	public _e2!: ValueExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public valueExpression_list(): ValueExpressionContext[] {
		return this.getTypedRuleContexts(ValueExpressionContext) as ValueExpressionContext[];
	}
	public valueExpression(i: number): ValueExpressionContext {
		return this.getTypedRuleContext(ValueExpressionContext, i) as ValueExpressionContext;
	}
	public EQ(): TerminalNode {
		return this.getToken(KELParser.EQ, 0);
	}
	public NEQ(): TerminalNode {
		return this.getToken(KELParser.NEQ, 0);
	}
	public LTGT(): TerminalNode {
		return this.getToken(KELParser.LTGT, 0);
	}
	public GTEQ(): TerminalNode {
		return this.getToken(KELParser.GTEQ, 0);
	}
	public GT(): TerminalNode {
		return this.getToken(KELParser.GT, 0);
	}
	public LT(): TerminalNode {
		return this.getToken(KELParser.LT, 0);
	}
	public LARROW(): TerminalNode {
		return this.getToken(KELParser.LARROW, 0);
	}
	public LEQ(): TerminalNode {
		return this.getToken(KELParser.LEQ, 0);
	}
	public NNEQ(): TerminalNode {
		return this.getToken(KELParser.NNEQ, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(KELParser.IN, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_booleanAtom;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterBooleanAtom) {
	 		listener.enterBooleanAtom(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitBooleanAtom) {
	 		listener.exitBooleanAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitBooleanAtom) {
			return visitor.visitBooleanAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ValueExpressionContext extends ParserRuleContext {
	public _l!: ValueTermContext;
	public _op!: Token;
	public _r!: ValueTermContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public valueTerm_list(): ValueTermContext[] {
		return this.getTypedRuleContexts(ValueTermContext) as ValueTermContext[];
	}
	public valueTerm(i: number): ValueTermContext {
		return this.getTypedRuleContext(ValueTermContext, i) as ValueTermContext;
	}
	public PLUS_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.PLUS);
	}
	public PLUS(i: number): TerminalNode {
		return this.getToken(KELParser.PLUS, i);
	}
	public HYPHEN_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.HYPHEN);
	}
	public HYPHEN(i: number): TerminalNode {
		return this.getToken(KELParser.HYPHEN, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_valueExpression;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterValueExpression) {
	 		listener.enterValueExpression(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitValueExpression) {
	 		listener.exitValueExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitValueExpression) {
			return visitor.visitValueExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ValueTermContext extends ParserRuleContext {
	public _l!: ValueFactorContext;
	public _op!: Token;
	public _r!: ValueFactorContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public valueFactor_list(): ValueFactorContext[] {
		return this.getTypedRuleContexts(ValueFactorContext) as ValueFactorContext[];
	}
	public valueFactor(i: number): ValueFactorContext {
		return this.getTypedRuleContext(ValueFactorContext, i) as ValueFactorContext;
	}
	public STAR_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.STAR);
	}
	public STAR(i: number): TerminalNode {
		return this.getToken(KELParser.STAR, i);
	}
	public FSLASH_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.FSLASH);
	}
	public FSLASH(i: number): TerminalNode {
		return this.getToken(KELParser.FSLASH, i);
	}
	public DIV_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.DIV);
	}
	public DIV(i: number): TerminalNode {
		return this.getToken(KELParser.DIV, i);
	}
	public MOD_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.MOD);
	}
	public MOD(i: number): TerminalNode {
		return this.getToken(KELParser.MOD, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_valueTerm;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterValueTerm) {
	 		listener.enterValueTerm(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitValueTerm) {
	 		listener.exitValueTerm(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitValueTerm) {
			return visitor.visitValueTerm(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ValueFactorContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_valueFactor;
	}
	public copyFrom(ctx: ValueFactorContext): void {
		super.copyFrom(ctx);
	}
}
export class PropValueFactorContext extends ValueFactorContext {
	public _a!: ValueAtomContext;
	public _op!: Token;
	public _tp!: TablePropertyContext;
	constructor(parser: KELParser, ctx: ValueFactorContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public valueAtom(): ValueAtomContext {
		return this.getTypedRuleContext(ValueAtomContext, 0) as ValueAtomContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(KELParser.COLON, 0);
	}
	public tableProperty(): TablePropertyContext {
		return this.getTypedRuleContext(TablePropertyContext, 0) as TablePropertyContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPropValueFactor) {
	 		listener.enterPropValueFactor(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPropValueFactor) {
	 		listener.exitPropValueFactor(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPropValueFactor) {
			return visitor.visitPropValueFactor(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ScopedValueFactorContext extends ValueFactorContext {
	public _ref!: QualifiedIdContext;
	public _se!: ScopeExpressionContext;
	constructor(parser: KELParser, ctx: ValueFactorContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public SIGIL(): TerminalNode {
		return this.getToken(KELParser.SIGIL, 0);
	}
	public qualifiedId(): QualifiedIdContext {
		return this.getTypedRuleContext(QualifiedIdContext, 0) as QualifiedIdContext;
	}
	public scopeExpression(): ScopeExpressionContext {
		return this.getTypedRuleContext(ScopeExpressionContext, 0) as ScopeExpressionContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterScopedValueFactor) {
	 		listener.enterScopedValueFactor(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitScopedValueFactor) {
	 		listener.exitScopedValueFactor(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitScopedValueFactor) {
			return visitor.visitScopedValueFactor(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NestedValueFactorContext extends ValueFactorContext {
	public _e!: ExpressionContext;
	constructor(parser: KELParser, ctx: ValueFactorContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterNestedValueFactor) {
	 		listener.enterNestedValueFactor(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitNestedValueFactor) {
	 		listener.exitNestedValueFactor(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitNestedValueFactor) {
			return visitor.visitNestedValueFactor(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryValueFactorContext extends ValueFactorContext {
	public _op!: Token;
	public _f!: ValueFactorContext;
	constructor(parser: KELParser, ctx: ValueFactorContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HYPHEN(): TerminalNode {
		return this.getToken(KELParser.HYPHEN, 0);
	}
	public valueFactor(): ValueFactorContext {
		return this.getTypedRuleContext(ValueFactorContext, 0) as ValueFactorContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterUnaryValueFactor) {
	 		listener.enterUnaryValueFactor(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitUnaryValueFactor) {
	 		listener.exitUnaryValueFactor(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitUnaryValueFactor) {
			return visitor.visitUnaryValueFactor(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ConstValueFactorContext extends ValueFactorContext {
	public _c!: ConstantContext;
	constructor(parser: KELParser, ctx: ValueFactorContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public constant(): ConstantContext {
		return this.getTypedRuleContext(ConstantContext, 0) as ConstantContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterConstValueFactor) {
	 		listener.enterConstValueFactor(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitConstValueFactor) {
	 		listener.exitConstValueFactor(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitConstValueFactor) {
			return visitor.visitConstValueFactor(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SetValueFactorContext extends ValueFactorContext {
	constructor(parser: KELParser, ctx: ValueFactorContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LSQUARE(): TerminalNode {
		return this.getToken(KELParser.LSQUARE, 0);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public RSQUARE(): TerminalNode {
		return this.getToken(KELParser.RSQUARE, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterSetValueFactor) {
	 		listener.enterSetValueFactor(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitSetValueFactor) {
	 		listener.exitSetValueFactor(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitSetValueFactor) {
			return visitor.visitSetValueFactor(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ValueAtomContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_valueAtom;
	}
	public copyFrom(ctx: ValueAtomContext): void {
		super.copyFrom(ctx);
	}
}
export class ProjValueAtomContext extends ValueAtomContext {
	public _p!: EntityProjectionContext;
	constructor(parser: KELParser, ctx: ValueAtomContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public entityProjection(): EntityProjectionContext {
		return this.getTypedRuleContext(EntityProjectionContext, 0) as EntityProjectionContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterProjValueAtom) {
	 		listener.enterProjValueAtom(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitProjValueAtom) {
	 		listener.exitProjValueAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitProjValueAtom) {
			return visitor.visitProjValueAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IdValueAtomContext extends ValueAtomContext {
	public _id!: LeadingIdContext;
	constructor(parser: KELParser, ctx: ValueAtomContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public leadingId(): LeadingIdContext {
		return this.getTypedRuleContext(LeadingIdContext, 0) as LeadingIdContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterIdValueAtom) {
	 		listener.enterIdValueAtom(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitIdValueAtom) {
	 		listener.exitIdValueAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitIdValueAtom) {
			return visitor.visitIdValueAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AutoMatchValueAtomContext extends ValueAtomContext {
	public _sid!: Token;
	constructor(parser: KELParser, ctx: ValueAtomContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public SID(): TerminalNode {
		return this.getToken(KELParser.SID, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterAutoMatchValueAtom) {
	 		listener.enterAutoMatchValueAtom(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitAutoMatchValueAtom) {
	 		listener.exitAutoMatchValueAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitAutoMatchValueAtom) {
			return visitor.visitAutoMatchValueAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PatternModelAtomContext extends ValueAtomContext {
	public _m!: PatternModelContext;
	constructor(parser: KELParser, ctx: ValueAtomContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public patternModel(): PatternModelContext {
		return this.getTypedRuleContext(PatternModelContext, 0) as PatternModelContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPatternModelAtom) {
	 		listener.enterPatternModelAtom(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPatternModelAtom) {
	 		listener.exitPatternModelAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPatternModelAtom) {
			return visitor.visitPatternModelAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class QueryOpValueAtomContext extends ValueAtomContext {
	public _base!: LeadingIdContext;
	public _qo!: QueryFuncOpContext;
	constructor(parser: KELParser, ctx: ValueAtomContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public leadingId(): LeadingIdContext {
		return this.getTypedRuleContext(LeadingIdContext, 0) as LeadingIdContext;
	}
	public queryFuncOp_list(): QueryFuncOpContext[] {
		return this.getTypedRuleContexts(QueryFuncOpContext) as QueryFuncOpContext[];
	}
	public queryFuncOp(i: number): QueryFuncOpContext {
		return this.getTypedRuleContext(QueryFuncOpContext, i) as QueryFuncOpContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterQueryOpValueAtom) {
	 		listener.enterQueryOpValueAtom(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitQueryOpValueAtom) {
	 		listener.exitQueryOpValueAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitQueryOpValueAtom) {
			return visitor.visitQueryOpValueAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LinkAtomContext extends ValueAtomContext {
	constructor(parser: KELParser, ctx: ValueAtomContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public linkExp(): LinkExpContext {
		return this.getTypedRuleContext(LinkExpContext, 0) as LinkExpContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterLinkAtom) {
	 		listener.enterLinkAtom(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitLinkAtom) {
	 		listener.exitLinkAtom(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitLinkAtom) {
			return visitor.visitLinkAtom(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QueryFuncOpContext extends ParserRuleContext {
	public _f!: FuncOrFilterContext;
	public _p!: EntityProjectionContext;
	public _fs!: FieldSelectorContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public funcOrFilter(): FuncOrFilterContext {
		return this.getTypedRuleContext(FuncOrFilterContext, 0) as FuncOrFilterContext;
	}
	public entityProjection(): EntityProjectionContext {
		return this.getTypedRuleContext(EntityProjectionContext, 0) as EntityProjectionContext;
	}
	public fieldSelector(): FieldSelectorContext {
		return this.getTypedRuleContext(FieldSelectorContext, 0) as FieldSelectorContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_queryFuncOp;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterQueryFuncOp) {
	 		listener.enterQueryFuncOp(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitQueryFuncOp) {
	 		listener.exitQueryFuncOp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitQueryFuncOp) {
			return visitor.visitQueryFuncOp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FuncOrFilterContext extends ParserRuleContext {
	public _p1!: PairContext;
	public _op1!: Token;
	public _p2!: PairContext;
	public _op2!: Token;
	public _def!: ExpressionContext;
	public _e1!: ExpressionContext;
	public _op!: Token;
	public _e2!: ExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public pair_list(): PairContext[] {
		return this.getTypedRuleContexts(PairContext) as PairContext[];
	}
	public pair(i: number): PairContext {
		return this.getTypedRuleContext(PairContext, i) as PairContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_funcOrFilter;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFuncOrFilter) {
	 		listener.enterFuncOrFilter(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFuncOrFilter) {
	 		listener.exitFuncOrFilter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFuncOrFilter) {
			return visitor.visitFuncOrFilter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PairContext extends ParserRuleContext {
	public _test!: ExpressionContext;
	public _op!: Token;
	public _value!: ExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public RARROW(): TerminalNode {
		return this.getToken(KELParser.RARROW, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_pair;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPair) {
	 		listener.enterPair(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPair) {
	 		listener.exitPair(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPair) {
			return visitor.visitPair(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LinkExpContext extends ParserRuleContext {
	public _start!: ExpressionContext;
	public _body!: ValueAtomContext;
	public _end!: ExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LINK(): TerminalNode {
		return this.getToken(KELParser.LINK, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public linkDegree(): LinkDegreeContext {
		return this.getTypedRuleContext(LinkDegreeContext, 0) as LinkDegreeContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public valueAtom(): ValueAtomContext {
		return this.getTypedRuleContext(ValueAtomContext, 0) as ValueAtomContext;
	}
	public linkSpec(): LinkSpecContext {
		return this.getTypedRuleContext(LinkSpecContext, 0) as LinkSpecContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_linkExp;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterLinkExp) {
	 		listener.enterLinkExp(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitLinkExp) {
	 		listener.exitLinkExp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitLinkExp) {
			return visitor.visitLinkExp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LinkSpecContext extends ParserRuleContext {
	public _from_!: PropertyIdContext;
	public _to!: PropertyIdContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LSQUARE(): TerminalNode {
		return this.getToken(KELParser.LSQUARE, 0);
	}
	public COMMA(): TerminalNode {
		return this.getToken(KELParser.COMMA, 0);
	}
	public RSQUARE(): TerminalNode {
		return this.getToken(KELParser.RSQUARE, 0);
	}
	public propertyId_list(): PropertyIdContext[] {
		return this.getTypedRuleContexts(PropertyIdContext) as PropertyIdContext[];
	}
	public propertyId(i: number): PropertyIdContext {
		return this.getTypedRuleContext(PropertyIdContext, i) as PropertyIdContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_linkSpec;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterLinkSpec) {
	 		listener.enterLinkSpec(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitLinkSpec) {
	 		listener.exitLinkSpec(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitLinkSpec) {
			return visitor.visitLinkSpec(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LinkDegreeContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public STAR(): TerminalNode {
		return this.getToken(KELParser.STAR, 0);
	}
	public INT(): TerminalNode {
		return this.getToken(KELParser.INT, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_linkDegree;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterLinkDegree) {
	 		listener.enterLinkDegree(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitLinkDegree) {
	 		listener.exitLinkDegree(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitLinkDegree) {
			return visitor.visitLinkDegree(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EntityProjectionContext extends ParserRuleContext {
	public _b!: Token;
	public _e1!: NamedExpressionContext;
	public _e2!: NamedExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public RCURL(): TerminalNode {
		return this.getToken(KELParser.RCURL, 0);
	}
	public LCURL(): TerminalNode {
		return this.getToken(KELParser.LCURL, 0);
	}
	public namedExpression_list(): NamedExpressionContext[] {
		return this.getTypedRuleContexts(NamedExpressionContext) as NamedExpressionContext[];
	}
	public namedExpression(i: number): NamedExpressionContext {
		return this.getTypedRuleContext(NamedExpressionContext, i) as NamedExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_entityProjection;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEntityProjection) {
	 		listener.enterEntityProjection(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEntityProjection) {
	 		listener.exitEntityProjection(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEntityProjection) {
			return visitor.visitEntityProjection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NamedExpressionContext extends ParserRuleContext {
	public _n!: Token;
	public _ex!: ExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEFEQ(): TerminalNode {
		return this.getToken(KELParser.DEFEQ, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public expression(): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, 0) as ExpressionContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_namedExpression;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterNamedExpression) {
	 		listener.enterNamedExpression(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitNamedExpression) {
	 		listener.exitNamedExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitNamedExpression) {
			return visitor.visitNamedExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PatternModelContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MODEL(): TerminalNode {
		return this.getToken(KELParser.MODEL, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public patternSubmodel_list(): PatternSubmodelContext[] {
		return this.getTypedRuleContexts(PatternSubmodelContext) as PatternSubmodelContext[];
	}
	public patternSubmodel(i: number): PatternSubmodelContext {
		return this.getTypedRuleContext(PatternSubmodelContext, i) as PatternSubmodelContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_patternModel;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPatternModel) {
	 		listener.enterPatternModel(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPatternModel) {
	 		listener.exitPatternModel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPatternModel) {
			return visitor.visitPatternModel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PatternSubmodelContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_patternSubmodel;
	}
	public copyFrom(ctx: PatternSubmodelContext): void {
		super.copyFrom(ctx);
	}
}
export class SingleValuedPatternSubmodelContext extends PatternSubmodelContext {
	constructor(parser: KELParser, ctx: PatternSubmodelContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public PID(): TerminalNode {
		return this.getToken(KELParser.PID, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterSingleValuedPatternSubmodel) {
	 		listener.enterSingleValuedPatternSubmodel(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitSingleValuedPatternSubmodel) {
	 		listener.exitSingleValuedPatternSubmodel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitSingleValuedPatternSubmodel) {
			return visitor.visitSingleValuedPatternSubmodel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MultiValuedPatternSubmodelContext extends PatternSubmodelContext {
	public _n!: Token;
	constructor(parser: KELParser, ctx: PatternSubmodelContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LCURL(): TerminalNode {
		return this.getToken(KELParser.LCURL, 0);
	}
	public PID_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.PID);
	}
	public PID(i: number): TerminalNode {
		return this.getToken(KELParser.PID, i);
	}
	public RCURL(): TerminalNode {
		return this.getToken(KELParser.RCURL, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
	public PSID(): TerminalNode {
		return this.getToken(KELParser.PSID, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterMultiValuedPatternSubmodel) {
	 		listener.enterMultiValuedPatternSubmodel(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitMultiValuedPatternSubmodel) {
	 		listener.exitMultiValuedPatternSubmodel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitMultiValuedPatternSubmodel) {
			return visitor.visitMultiValuedPatternSubmodel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FieldSelectorContext extends ParserRuleContext {
	public _id!: FieldIdContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOT(): TerminalNode {
		return this.getToken(KELParser.DOT, 0);
	}
	public fieldId(): FieldIdContext {
		return this.getTypedRuleContext(FieldIdContext, 0) as FieldIdContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_fieldSelector;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFieldSelector) {
	 		listener.enterFieldSelector(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFieldSelector) {
	 		listener.exitFieldSelector(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFieldSelector) {
			return visitor.visitFieldSelector(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ScopeExpressionContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_scopeExpression;
	}
	public copyFrom(ctx: ScopeExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class ExplicitScopeExpressionContext extends ScopeExpressionContext {
	public _se!: ValueAtomContext;
	public _p!: TablePropertyContext;
	constructor(parser: KELParser, ctx: ScopeExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public COLON(): TerminalNode {
		return this.getToken(KELParser.COLON, 0);
	}
	public valueAtom(): ValueAtomContext {
		return this.getTypedRuleContext(ValueAtomContext, 0) as ValueAtomContext;
	}
	public tableProperty(): TablePropertyContext {
		return this.getTypedRuleContext(TablePropertyContext, 0) as TablePropertyContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterExplicitScopeExpression) {
	 		listener.enterExplicitScopeExpression(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitExplicitScopeExpression) {
	 		listener.exitExplicitScopeExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitExplicitScopeExpression) {
			return visitor.visitExplicitScopeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class OuterScopeExpressionContext extends ScopeExpressionContext {
	public _p!: TablePropertyContext;
	constructor(parser: KELParser, ctx: ScopeExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public CARET(): TerminalNode {
		return this.getToken(KELParser.CARET, 0);
	}
	public tableProperty(): TablePropertyContext {
		return this.getTypedRuleContext(TablePropertyContext, 0) as TablePropertyContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterOuterScopeExpression) {
	 		listener.enterOuterScopeExpression(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitOuterScopeExpression) {
	 		listener.exitOuterScopeExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitOuterScopeExpression) {
			return visitor.visitOuterScopeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SelfScopeExpressionContext extends ScopeExpressionContext {
	public _p!: TablePropertyContext;
	constructor(parser: KELParser, ctx: ScopeExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public tableProperty(): TablePropertyContext {
		return this.getTypedRuleContext(TablePropertyContext, 0) as TablePropertyContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterSelfScopeExpression) {
	 		listener.enterSelfScopeExpression(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitSelfScopeExpression) {
	 		listener.exitSelfScopeExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitSelfScopeExpression) {
			return visitor.visitSelfScopeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TablePropertyContext extends ParserRuleContext {
	public _id!: TablePropIdContext;
	public _v!: ExpressionContext;
	public _w!: ExpressionContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public tablePropId(): TablePropIdContext {
		return this.getTypedRuleContext(TablePropIdContext, 0) as TablePropIdContext;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public expression_list(): ExpressionContext[] {
		return this.getTypedRuleContexts(ExpressionContext) as ExpressionContext[];
	}
	public expression(i: number): ExpressionContext {
		return this.getTypedRuleContext(ExpressionContext, i) as ExpressionContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(KELParser.COMMA, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_tableProperty;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterTableProperty) {
	 		listener.enterTableProperty(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitTableProperty) {
	 		listener.exitTableProperty(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitTableProperty) {
			return visitor.visitTableProperty(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Func_idContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_func_id;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFunc_id) {
	 		listener.enterFunc_id(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFunc_id) {
	 		listener.exitFunc_id(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFunc_id) {
			return visitor.visitFunc_id(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class QualifiedIdContext extends ParserRuleContext {
	public _id1!: LeadingIdContext;
	public _id2!: FieldIdContext;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public leadingId(): LeadingIdContext {
		return this.getTypedRuleContext(LeadingIdContext, 0) as LeadingIdContext;
	}
	public DOT_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.DOT);
	}
	public DOT(i: number): TerminalNode {
		return this.getToken(KELParser.DOT, i);
	}
	public fieldId_list(): FieldIdContext[] {
		return this.getTypedRuleContexts(FieldIdContext) as FieldIdContext[];
	}
	public fieldId(i: number): FieldIdContext {
		return this.getTypedRuleContext(FieldIdContext, i) as FieldIdContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_qualifiedId;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterQualifiedId) {
	 		listener.enterQualifiedId(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitQualifiedId) {
	 		listener.exitQualifiedId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitQualifiedId) {
			return visitor.visitQualifiedId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LeadingIdContext extends ParserRuleContext {
	public _id!: Token;
	public _pid!: Token;
	public _psid!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public UID(): TerminalNode {
		return this.getToken(KELParser.UID, 0);
	}
	public SINT(): TerminalNode {
		return this.getToken(KELParser.SINT, 0);
	}
	public PID(): TerminalNode {
		return this.getToken(KELParser.PID, 0);
	}
	public PSID(): TerminalNode {
		return this.getToken(KELParser.PSID, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_leadingId;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterLeadingId) {
	 		listener.enterLeadingId(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitLeadingId) {
	 		listener.exitLeadingId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitLeadingId) {
			return visitor.visitLeadingId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FieldIdContext extends ParserRuleContext {
	public _id!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public UID(): TerminalNode {
		return this.getToken(KELParser.UID, 0);
	}
	public PID(): TerminalNode {
		return this.getToken(KELParser.PID, 0);
	}
	public PSID(): TerminalNode {
		return this.getToken(KELParser.PSID, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_fieldId;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFieldId) {
	 		listener.enterFieldId(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFieldId) {
	 		listener.exitFieldId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFieldId) {
			return visitor.visitFieldId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TablePropIdContext extends ParserRuleContext {
	public _id!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_tablePropId;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterTablePropId) {
	 		listener.enterTablePropId(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitTablePropId) {
	 		listener.exitTablePropId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitTablePropId) {
			return visitor.visitTablePropId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PropertyIdContext extends ParserRuleContext {
	public _id!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(KELParser.ID, 0);
	}
	public UID(): TerminalNode {
		return this.getToken(KELParser.UID, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_propertyId;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterPropertyId) {
	 		listener.enterPropertyId(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitPropertyId) {
	 		listener.exitPropertyId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitPropertyId) {
			return visitor.visitPropertyId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConstantContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_constant;
	}
	public copyFrom(ctx: ConstantContext): void {
		super.copyFrom(ctx);
	}
}
export class EmptySetConstantContext extends ConstantContext {
	constructor(parser: KELParser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LSQUARE(): TerminalNode {
		return this.getToken(KELParser.LSQUARE, 0);
	}
	public RSQUARE(): TerminalNode {
		return this.getToken(KELParser.RSQUARE, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEmptySetConstant) {
	 		listener.enterEmptySetConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEmptySetConstant) {
	 		listener.exitEmptySetConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEmptySetConstant) {
			return visitor.visitEmptySetConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NonSetConstantContext extends ConstantContext {
	constructor(parser: KELParser, ctx: ConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public simpleConstant(): SimpleConstantContext {
		return this.getTypedRuleContext(SimpleConstantContext, 0) as SimpleConstantContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterNonSetConstant) {
	 		listener.enterNonSetConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitNonSetConstant) {
	 		listener.exitNonSetConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitNonSetConstant) {
			return visitor.visitNonSetConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SimpleConstantContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_simpleConstant;
	}
	public copyFrom(ctx: SimpleConstantContext): void {
		super.copyFrom(ctx);
	}
}
export class GeneralIntConstantContext extends SimpleConstantContext {
	public _i!: IntConstantContext;
	constructor(parser: KELParser, ctx: SimpleConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public intConstant(): IntConstantContext {
		return this.getTypedRuleContext(IntConstantContext, 0) as IntConstantContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterGeneralIntConstant) {
	 		listener.enterGeneralIntConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitGeneralIntConstant) {
	 		listener.exitGeneralIntConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitGeneralIntConstant) {
			return visitor.visitGeneralIntConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TypedConstantContext extends SimpleConstantContext {
	public _t!: Token;
	constructor(parser: KELParser, ctx: SimpleConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public TYPDCONST(): TerminalNode {
		return this.getToken(KELParser.TYPDCONST, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterTypedConstant) {
	 		listener.enterTypedConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitTypedConstant) {
	 		listener.exitTypedConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitTypedConstant) {
			return visitor.visitTypedConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class StringConstantContext extends SimpleConstantContext {
	public _s!: Token;
	constructor(parser: KELParser, ctx: SimpleConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public STR(): TerminalNode {
		return this.getToken(KELParser.STR, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterStringConstant) {
	 		listener.enterStringConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitStringConstant) {
	 		listener.exitStringConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitStringConstant) {
			return visitor.visitStringConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FalseConstantContext extends SimpleConstantContext {
	public _b!: Token;
	constructor(parser: KELParser, ctx: SimpleConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public FALSE(): TerminalNode {
		return this.getToken(KELParser.FALSE, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterFalseConstant) {
	 		listener.enterFalseConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitFalseConstant) {
	 		listener.exitFalseConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitFalseConstant) {
			return visitor.visitFalseConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class GeneralRealConstantContext extends SimpleConstantContext {
	public _r!: RealConstantContext;
	constructor(parser: KELParser, ctx: SimpleConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public realConstant(): RealConstantContext {
		return this.getTypedRuleContext(RealConstantContext, 0) as RealConstantContext;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterGeneralRealConstant) {
	 		listener.enterGeneralRealConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitGeneralRealConstant) {
	 		listener.exitGeneralRealConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitGeneralRealConstant) {
			return visitor.visitGeneralRealConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TrueConstantContext extends SimpleConstantContext {
	public _b!: Token;
	constructor(parser: KELParser, ctx: SimpleConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public TRUE(): TerminalNode {
		return this.getToken(KELParser.TRUE, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterTrueConstant) {
	 		listener.enterTrueConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitTrueConstant) {
	 		listener.exitTrueConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitTrueConstant) {
			return visitor.visitTrueConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IntConstantContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_intConstant;
	}
	public copyFrom(ctx: IntConstantContext): void {
		super.copyFrom(ctx);
	}
}
export class DecIntConstantContext extends IntConstantContext {
	public _i!: Token;
	constructor(parser: KELParser, ctx: IntConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public INT(): TerminalNode {
		return this.getToken(KELParser.INT, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterDecIntConstant) {
	 		listener.enterDecIntConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitDecIntConstant) {
	 		listener.exitDecIntConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitDecIntConstant) {
			return visitor.visitDecIntConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NegIntConstantContext extends IntConstantContext {
	public _i!: Token;
	constructor(parser: KELParser, ctx: IntConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HYPHEN(): TerminalNode {
		return this.getToken(KELParser.HYPHEN, 0);
	}
	public INT(): TerminalNode {
		return this.getToken(KELParser.INT, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterNegIntConstant) {
	 		listener.enterNegIntConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitNegIntConstant) {
	 		listener.exitNegIntConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitNegIntConstant) {
			return visitor.visitNegIntConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BadBinConstantContext extends IntConstantContext {
	public _i!: Token;
	constructor(parser: KELParser, ctx: IntConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public BAD_BIN(): TerminalNode {
		return this.getToken(KELParser.BAD_BIN, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterBadBinConstant) {
	 		listener.enterBadBinConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitBadBinConstant) {
	 		listener.exitBadBinConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitBadBinConstant) {
			return visitor.visitBadBinConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class HexConstantContext extends IntConstantContext {
	public _i!: Token;
	constructor(parser: KELParser, ctx: IntConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HEXINT(): TerminalNode {
		return this.getToken(KELParser.HEXINT, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterHexConstant) {
	 		listener.enterHexConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitHexConstant) {
	 		listener.exitHexConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitHexConstant) {
			return visitor.visitHexConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BadHexConstantContext extends IntConstantContext {
	public _i!: Token;
	constructor(parser: KELParser, ctx: IntConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public BAD_HEX(): TerminalNode {
		return this.getToken(KELParser.BAD_HEX, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterBadHexConstant) {
	 		listener.enterBadHexConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitBadHexConstant) {
	 		listener.exitBadHexConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitBadHexConstant) {
			return visitor.visitBadHexConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BadMixConstantContext extends IntConstantContext {
	public _i!: Token;
	constructor(parser: KELParser, ctx: IntConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public BAD_MIX(): TerminalNode {
		return this.getToken(KELParser.BAD_MIX, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterBadMixConstant) {
	 		listener.enterBadMixConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitBadMixConstant) {
	 		listener.exitBadMixConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitBadMixConstant) {
			return visitor.visitBadMixConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BinConstantContext extends IntConstantContext {
	public _i!: Token;
	constructor(parser: KELParser, ctx: IntConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public BININT(): TerminalNode {
		return this.getToken(KELParser.BININT, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterBinConstant) {
	 		listener.enterBinConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitBinConstant) {
	 		listener.exitBinConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitBinConstant) {
			return visitor.visitBinConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NoFlagHexConstantContext extends IntConstantContext {
	public _i!: Token;
	constructor(parser: KELParser, ctx: IntConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HEX_NO_X(): TerminalNode {
		return this.getToken(KELParser.HEX_NO_X, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterNoFlagHexConstant) {
	 		listener.enterNoFlagHexConstant(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitNoFlagHexConstant) {
	 		listener.exitNoFlagHexConstant(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitNoFlagHexConstant) {
			return visitor.visitNoFlagHexConstant(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RealConstantContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_realConstant;
	}
	public copyFrom(ctx: RealConstantContext): void {
		super.copyFrom(ctx);
	}
}
export class BadRealConstContext extends RealConstantContext {
	public _r!: Token;
	constructor(parser: KELParser, ctx: RealConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public BAD_REAL_A(): TerminalNode {
		return this.getToken(KELParser.BAD_REAL_A, 0);
	}
	public BAD_REAL_B(): TerminalNode {
		return this.getToken(KELParser.BAD_REAL_B, 0);
	}
	public BAD_REAL_C(): TerminalNode {
		return this.getToken(KELParser.BAD_REAL_C, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterBadRealConst) {
	 		listener.enterBadRealConst(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitBadRealConst) {
	 		listener.exitBadRealConst(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitBadRealConst) {
			return visitor.visitBadRealConst(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RealConstContext extends RealConstantContext {
	public _r!: Token;
	constructor(parser: KELParser, ctx: RealConstantContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public REAL(): TerminalNode {
		return this.getToken(KELParser.REAL, 0);
	}
	public HYPHEN(): TerminalNode {
		return this.getToken(KELParser.HYPHEN, 0);
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterRealConst) {
	 		listener.enterRealConst(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitRealConst) {
	 		listener.exitRealConst(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitRealConst) {
			return visitor.visitRealConst(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EclExpressionContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ECL(): TerminalNode {
		return this.getToken(KELParser.ECL, 0);
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public eclBody(): EclBodyContext {
		return this.getTypedRuleContext(EclBodyContext, 0) as EclBodyContext;
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public RETURNS(): TerminalNode {
		return this.getToken(KELParser.RETURNS, 0);
	}
	public returnTypeId(): ReturnTypeIdContext {
		return this.getTypedRuleContext(ReturnTypeIdContext, 0) as ReturnTypeIdContext;
	}
	public FROM(): TerminalNode {
		return this.getToken(KELParser.FROM, 0);
	}
	public eclImportList(): EclImportListContext {
		return this.getTypedRuleContext(EclImportListContext, 0) as EclImportListContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_eclExpression;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEclExpression) {
	 		listener.enterEclExpression(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEclExpression) {
	 		listener.exitEclExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEclExpression) {
			return visitor.visitEclExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EclBodyContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public eclFragment_list(): EclFragmentContext[] {
		return this.getTypedRuleContexts(EclFragmentContext) as EclFragmentContext[];
	}
	public eclFragment(i: number): EclFragmentContext {
		return this.getTypedRuleContext(EclFragmentContext, i) as EclFragmentContext;
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_eclBody;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEclBody) {
	 		listener.enterEclBody(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEclBody) {
	 		listener.exitEclBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEclBody) {
			return visitor.visitEclBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EclFragmentContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LP(): TerminalNode {
		return this.getToken(KELParser.LP, 0);
	}
	public RP(): TerminalNode {
		return this.getToken(KELParser.RP, 0);
	}
	public eclBody_list(): EclBodyContext[] {
		return this.getTypedRuleContexts(EclBodyContext) as EclBodyContext[];
	}
	public eclBody(i: number): EclBodyContext {
		return this.getTypedRuleContext(EclBodyContext, i) as EclBodyContext;
	}
	public EXCLAIM(): TerminalNode {
		return this.getToken(KELParser.EXCLAIM, 0);
	}
	public TILDE(): TerminalNode {
		return this.getToken(KELParser.TILDE, 0);
	}
	public AMP(): TerminalNode {
		return this.getToken(KELParser.AMP, 0);
	}
	public PIPE(): TerminalNode {
		return this.getToken(KELParser.PIPE, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_eclFragment;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEclFragment) {
	 		listener.enterEclFragment(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEclFragment) {
	 		listener.exitEclFragment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEclFragment) {
			return visitor.visitEclFragment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EclImportListContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public eclImportItem_list(): EclImportItemContext[] {
		return this.getTypedRuleContexts(EclImportItemContext) as EclImportItemContext[];
	}
	public eclImportItem(i: number): EclImportItemContext {
		return this.getTypedRuleContext(EclImportItemContext, i) as EclImportItemContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(KELParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(KELParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_eclImportList;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEclImportList) {
	 		listener.enterEclImportList(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEclImportList) {
	 		listener.exitEclImportList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEclImportList) {
			return visitor.visitEclImportList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EclImportItemContext extends ParserRuleContext {
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public dotId(): DotIdContext {
		return this.getTypedRuleContext(DotIdContext, 0) as DotIdContext;
	}
	public SIGIL(): TerminalNode {
		return this.getToken(KELParser.SIGIL, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_eclImportItem;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterEclImportItem) {
	 		listener.enterEclImportItem(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitEclImportItem) {
	 		listener.exitEclImportItem(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitEclImportItem) {
			return visitor.visitEclImportItem(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReturnTypeIdContext extends ParserRuleContext {
	public _simple!: SimpleTypeIdContext;
	public _isSet!: Token;
	constructor(parser?: KELParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public simpleTypeId(): SimpleTypeIdContext {
		return this.getTypedRuleContext(SimpleTypeIdContext, 0) as SimpleTypeIdContext;
	}
	public OF(): TerminalNode {
		return this.getToken(KELParser.OF, 0);
	}
	public SET(): TerminalNode {
		return this.getToken(KELParser.SET, 0);
	}
    public get ruleIndex(): number {
    	return KELParser.RULE_returnTypeId;
	}
	public enterRule(listener: KELParserListener): void {
	    if(listener.enterReturnTypeId) {
	 		listener.enterReturnTypeId(this);
		}
	}
	public exitRule(listener: KELParserListener): void {
	    if(listener.exitReturnTypeId) {
	 		listener.exitReturnTypeId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: KELParserVisitor<Result>): Result {
		if (visitor.visitReturnTypeId) {
			return visitor.visitReturnTypeId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}

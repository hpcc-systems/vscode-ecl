// Generated from ./KELParser.g4 by ANTLR 4.13.1

import {ParseTreeVisitor} from 'antlr4';


import { ProgramContext } from "./KELParser";
import { AnnotationContext } from "./KELParser";
import { StatementContext } from "./KELParser";
import { OptionBoolContext } from "./KELParser";
import { OptionStrContext } from "./KELParser";
import { OptionIntContext } from "./KELParser";
import { EraDeclarationContext } from "./KELParser";
import { EpochContext } from "./KELParser";
import { PermitsDeclarationContext } from "./KELParser";
import { PermitContext } from "./KELParser";
import { SimpleImportContext } from "./KELParser";
import { PackageImportContext } from "./KELParser";
import { SpcImportContext } from "./KELParser";
import { InlinePackageContext } from "./KELParser";
import { OutoflinePackageContext } from "./KELParser";
import { PackageDeclarationContext } from "./KELParser";
import { PackageStatementContext } from "./KELParser";
import { PackageExportDeclarationContext } from "./KELParser";
import { EntityDeclarationContext } from "./KELParser";
import { EntityPropertyContext } from "./KELParser";
import { FieldMappingContext } from "./KELParser";
import { FileTypeContext } from "./KELParser";
import { MappingElementContext } from "./KELParser";
import { NullSpecContext } from "./KELParser";
import { FormatSpecContext } from "./KELParser";
import { LikeSpecContext } from "./KELParser";
import { CompositeIdSpecContext } from "./KELParser";
import { ComplexModelContext } from "./KELParser";
import { SingleRowModelContext } from "./KELParser";
import { SingleValueSubModelContext } from "./KELParser";
import { RemainderSubModelContext } from "./KELParser";
import { ExplicitSubModelContext } from "./KELParser";
import { SubmodelIdContext } from "./KELParser";
import { UseDeclarationContext } from "./KELParser";
import { UseKelBaseDeclarationContext } from "./KELParser";
import { UseKelQueryDeclarationContext } from "./KELParser";
import { UseElementContext } from "./KELParser";
import { UseFileTypeContext } from "./KELParser";
import { UseClauseContext } from "./KELParser";
import { UseClauseElementContext } from "./KELParser";
import { UseClauseFileTypeContext } from "./KELParser";
import { NestedEntityMappingContext } from "./KELParser";
import { EntityMappingContext } from "./KELParser";
import { NormalMappingOverrideContext } from "./KELParser";
import { ConstantMappingOverrideContext } from "./KELParser";
import { DotIdContext } from "./KELParser";
import { PermitsClauseContext } from "./KELParser";
import { VariablePermitsContext } from "./KELParser";
import { ConstantPermitsContext } from "./KELParser";
import { HintsClauseContext } from "./KELParser";
import { LogicPropertyStatementContext } from "./KELParser";
import { ConstantDeclStatementContext } from "./KELParser";
import { EntityGeneratorStatementContext } from "./KELParser";
import { LogicPredicateContext } from "./KELParser";
import { LogicProductionsContext } from "./KELParser";
import { LogicProductionContext } from "./KELParser";
import { EntityProductionsContext } from "./KELParser";
import { EntityProductionContext } from "./KELParser";
import { FunctionStatementContext } from "./KELParser";
import { FparamsContext } from "./KELParser";
import { FparamContext } from "./KELParser";
import { FunctionBodyContext } from "./KELParser";
import { QueryDeclarationContext } from "./KELParser";
import { QparamsContext } from "./KELParser";
import { QparamContext } from "./KELParser";
import { ParamTypeIdContext } from "./KELParser";
import { SimpleTypeIdContext } from "./KELParser";
import { AsofContext } from "./KELParser";
import { UsingContext } from "./KELParser";
import { ShellDeclarationContext } from "./KELParser";
import { Visual_sectionContext } from "./KELParser";
import { Resource_sectionContext } from "./KELParser";
import { ExpressionContext } from "./KELParser";
import { BooleanDisjunctionContext } from "./KELParser";
import { BooleanConjunctionContext } from "./KELParser";
import { BooleanTermContext } from "./KELParser";
import { BooleanAtomContext } from "./KELParser";
import { ValueExpressionContext } from "./KELParser";
import { ValueTermContext } from "./KELParser";
import { UnaryValueFactorContext } from "./KELParser";
import { PropValueFactorContext } from "./KELParser";
import { ScopedValueFactorContext } from "./KELParser";
import { ConstValueFactorContext } from "./KELParser";
import { NestedValueFactorContext } from "./KELParser";
import { SetValueFactorContext } from "./KELParser";
import { QueryOpValueAtomContext } from "./KELParser";
import { ProjValueAtomContext } from "./KELParser";
import { PatternModelAtomContext } from "./KELParser";
import { IdValueAtomContext } from "./KELParser";
import { AutoMatchValueAtomContext } from "./KELParser";
import { LinkAtomContext } from "./KELParser";
import { QueryFuncOpContext } from "./KELParser";
import { FuncOrFilterContext } from "./KELParser";
import { PairContext } from "./KELParser";
import { LinkExpContext } from "./KELParser";
import { LinkSpecContext } from "./KELParser";
import { LinkDegreeContext } from "./KELParser";
import { EntityProjectionContext } from "./KELParser";
import { NamedExpressionContext } from "./KELParser";
import { PatternModelContext } from "./KELParser";
import { SingleValuedPatternSubmodelContext } from "./KELParser";
import { MultiValuedPatternSubmodelContext } from "./KELParser";
import { FieldSelectorContext } from "./KELParser";
import { SelfScopeExpressionContext } from "./KELParser";
import { OuterScopeExpressionContext } from "./KELParser";
import { ExplicitScopeExpressionContext } from "./KELParser";
import { TablePropertyContext } from "./KELParser";
import { Func_idContext } from "./KELParser";
import { QualifiedIdContext } from "./KELParser";
import { LeadingIdContext } from "./KELParser";
import { FieldIdContext } from "./KELParser";
import { TablePropIdContext } from "./KELParser";
import { PropertyIdContext } from "./KELParser";
import { NonSetConstantContext } from "./KELParser";
import { EmptySetConstantContext } from "./KELParser";
import { StringConstantContext } from "./KELParser";
import { GeneralRealConstantContext } from "./KELParser";
import { TrueConstantContext } from "./KELParser";
import { FalseConstantContext } from "./KELParser";
import { TypedConstantContext } from "./KELParser";
import { GeneralIntConstantContext } from "./KELParser";
import { DecIntConstantContext } from "./KELParser";
import { NegIntConstantContext } from "./KELParser";
import { HexConstantContext } from "./KELParser";
import { BinConstantContext } from "./KELParser";
import { BadHexConstantContext } from "./KELParser";
import { BadBinConstantContext } from "./KELParser";
import { NoFlagHexConstantContext } from "./KELParser";
import { BadMixConstantContext } from "./KELParser";
import { RealConstContext } from "./KELParser";
import { BadRealConstContext } from "./KELParser";
import { EclExpressionContext } from "./KELParser";
import { EclBodyContext } from "./KELParser";
import { EclFragmentContext } from "./KELParser";
import { EclImportListContext } from "./KELParser";
import { EclImportItemContext } from "./KELParser";
import { ReturnTypeIdContext } from "./KELParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `KELParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class KELParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `KELParser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.annotation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotation?: (ctx: AnnotationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;
	/**
	 * Visit a parse tree produced by the `optionBool`
	 * labeled alternative in `KELParser.option`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptionBool?: (ctx: OptionBoolContext) => Result;
	/**
	 * Visit a parse tree produced by the `optionStr`
	 * labeled alternative in `KELParser.option`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptionStr?: (ctx: OptionStrContext) => Result;
	/**
	 * Visit a parse tree produced by the `optionInt`
	 * labeled alternative in `KELParser.option`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOptionInt?: (ctx: OptionIntContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.eraDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEraDeclaration?: (ctx: EraDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.epoch`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEpoch?: (ctx: EpochContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.permitsDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPermitsDeclaration?: (ctx: PermitsDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.permit`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPermit?: (ctx: PermitContext) => Result;
	/**
	 * Visit a parse tree produced by the `simpleImport`
	 * labeled alternative in `KELParser.importStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSimpleImport?: (ctx: SimpleImportContext) => Result;
	/**
	 * Visit a parse tree produced by the `packageImport`
	 * labeled alternative in `KELParser.importStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPackageImport?: (ctx: PackageImportContext) => Result;
	/**
	 * Visit a parse tree produced by the `spcImport`
	 * labeled alternative in `KELParser.importStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSpcImport?: (ctx: SpcImportContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.inlinePackage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInlinePackage?: (ctx: InlinePackageContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.outoflinePackage`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOutoflinePackage?: (ctx: OutoflinePackageContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.packageDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPackageDeclaration?: (ctx: PackageDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.packageStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPackageStatement?: (ctx: PackageStatementContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.packageExportDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPackageExportDeclaration?: (ctx: PackageExportDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.entityDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEntityDeclaration?: (ctx: EntityDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.entityProperty`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEntityProperty?: (ctx: EntityPropertyContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.fieldMapping`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFieldMapping?: (ctx: FieldMappingContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.fileType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFileType?: (ctx: FileTypeContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.mappingElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMappingElement?: (ctx: MappingElementContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.nullSpec`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNullSpec?: (ctx: NullSpecContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.formatSpec`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFormatSpec?: (ctx: FormatSpecContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.likeSpec`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLikeSpec?: (ctx: LikeSpecContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.compositeIdSpec`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompositeIdSpec?: (ctx: CompositeIdSpecContext) => Result;
	/**
	 * Visit a parse tree produced by the `complexModel`
	 * labeled alternative in `KELParser.modelDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComplexModel?: (ctx: ComplexModelContext) => Result;
	/**
	 * Visit a parse tree produced by the `singleRowModel`
	 * labeled alternative in `KELParser.modelDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSingleRowModel?: (ctx: SingleRowModelContext) => Result;
	/**
	 * Visit a parse tree produced by the `singleValueSubModel`
	 * labeled alternative in `KELParser.submodelDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSingleValueSubModel?: (ctx: SingleValueSubModelContext) => Result;
	/**
	 * Visit a parse tree produced by the `remainderSubModel`
	 * labeled alternative in `KELParser.submodelDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRemainderSubModel?: (ctx: RemainderSubModelContext) => Result;
	/**
	 * Visit a parse tree produced by the `explicitSubModel`
	 * labeled alternative in `KELParser.submodelDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExplicitSubModel?: (ctx: ExplicitSubModelContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.submodelId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSubmodelId?: (ctx: SubmodelIdContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.useDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUseDeclaration?: (ctx: UseDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.useKelBaseDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUseKelBaseDeclaration?: (ctx: UseKelBaseDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.useKelQueryDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUseKelQueryDeclaration?: (ctx: UseKelQueryDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.useElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUseElement?: (ctx: UseElementContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.useFileType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUseFileType?: (ctx: UseFileTypeContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.useClause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUseClause?: (ctx: UseClauseContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.useClauseElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUseClauseElement?: (ctx: UseClauseElementContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.useClauseFileType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUseClauseFileType?: (ctx: UseClauseFileTypeContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.nestedEntityMapping`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNestedEntityMapping?: (ctx: NestedEntityMappingContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.entityMapping`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEntityMapping?: (ctx: EntityMappingContext) => Result;
	/**
	 * Visit a parse tree produced by the `normalMappingOverride`
	 * labeled alternative in `KELParser.useMappingOverride`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNormalMappingOverride?: (ctx: NormalMappingOverrideContext) => Result;
	/**
	 * Visit a parse tree produced by the `constantMappingOverride`
	 * labeled alternative in `KELParser.useMappingOverride`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstantMappingOverride?: (ctx: ConstantMappingOverrideContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.dotId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDotId?: (ctx: DotIdContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.permitsClause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPermitsClause?: (ctx: PermitsClauseContext) => Result;
	/**
	 * Visit a parse tree produced by the `variablePermits`
	 * labeled alternative in `KELParser.permitsSpec`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariablePermits?: (ctx: VariablePermitsContext) => Result;
	/**
	 * Visit a parse tree produced by the `constantPermits`
	 * labeled alternative in `KELParser.permitsSpec`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstantPermits?: (ctx: ConstantPermitsContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.hintsClause`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHintsClause?: (ctx: HintsClauseContext) => Result;
	/**
	 * Visit a parse tree produced by the `logicPropertyStatement`
	 * labeled alternative in `KELParser.logicStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicPropertyStatement?: (ctx: LogicPropertyStatementContext) => Result;
	/**
	 * Visit a parse tree produced by the `constantDeclStatement`
	 * labeled alternative in `KELParser.logicStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstantDeclStatement?: (ctx: ConstantDeclStatementContext) => Result;
	/**
	 * Visit a parse tree produced by the `entityGeneratorStatement`
	 * labeled alternative in `KELParser.logicStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEntityGeneratorStatement?: (ctx: EntityGeneratorStatementContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.logicPredicate`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicPredicate?: (ctx: LogicPredicateContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.logicProductions`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicProductions?: (ctx: LogicProductionsContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.logicProduction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicProduction?: (ctx: LogicProductionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.entityProductions`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEntityProductions?: (ctx: EntityProductionsContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.entityProduction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEntityProduction?: (ctx: EntityProductionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.functionStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionStatement?: (ctx: FunctionStatementContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.fparams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFparams?: (ctx: FparamsContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.fparam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFparam?: (ctx: FparamContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.functionBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionBody?: (ctx: FunctionBodyContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.queryDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQueryDeclaration?: (ctx: QueryDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.qparams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQparams?: (ctx: QparamsContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.qparam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQparam?: (ctx: QparamContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.paramTypeId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParamTypeId?: (ctx: ParamTypeIdContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.simpleTypeId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSimpleTypeId?: (ctx: SimpleTypeIdContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.asof`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAsof?: (ctx: AsofContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.using`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUsing?: (ctx: UsingContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.shellDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitShellDeclaration?: (ctx: ShellDeclarationContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.visual_section`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVisual_section?: (ctx: Visual_sectionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.resource_section`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitResource_section?: (ctx: Resource_sectionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.booleanDisjunction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBooleanDisjunction?: (ctx: BooleanDisjunctionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.booleanConjunction`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBooleanConjunction?: (ctx: BooleanConjunctionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.booleanTerm`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBooleanTerm?: (ctx: BooleanTermContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.booleanAtom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBooleanAtom?: (ctx: BooleanAtomContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.valueExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitValueExpression?: (ctx: ValueExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.valueTerm`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitValueTerm?: (ctx: ValueTermContext) => Result;
	/**
	 * Visit a parse tree produced by the `unaryValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryValueFactor?: (ctx: UnaryValueFactorContext) => Result;
	/**
	 * Visit a parse tree produced by the `propValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropValueFactor?: (ctx: PropValueFactorContext) => Result;
	/**
	 * Visit a parse tree produced by the `scopedValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitScopedValueFactor?: (ctx: ScopedValueFactorContext) => Result;
	/**
	 * Visit a parse tree produced by the `constValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConstValueFactor?: (ctx: ConstValueFactorContext) => Result;
	/**
	 * Visit a parse tree produced by the `nestedValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNestedValueFactor?: (ctx: NestedValueFactorContext) => Result;
	/**
	 * Visit a parse tree produced by the `setValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSetValueFactor?: (ctx: SetValueFactorContext) => Result;
	/**
	 * Visit a parse tree produced by the `queryOpValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQueryOpValueAtom?: (ctx: QueryOpValueAtomContext) => Result;
	/**
	 * Visit a parse tree produced by the `projValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProjValueAtom?: (ctx: ProjValueAtomContext) => Result;
	/**
	 * Visit a parse tree produced by the `patternModelAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPatternModelAtom?: (ctx: PatternModelAtomContext) => Result;
	/**
	 * Visit a parse tree produced by the `idValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdValueAtom?: (ctx: IdValueAtomContext) => Result;
	/**
	 * Visit a parse tree produced by the `autoMatchValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAutoMatchValueAtom?: (ctx: AutoMatchValueAtomContext) => Result;
	/**
	 * Visit a parse tree produced by the `linkAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLinkAtom?: (ctx: LinkAtomContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.queryFuncOp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQueryFuncOp?: (ctx: QueryFuncOpContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.funcOrFilter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFuncOrFilter?: (ctx: FuncOrFilterContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.pair`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPair?: (ctx: PairContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.linkExp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLinkExp?: (ctx: LinkExpContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.linkSpec`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLinkSpec?: (ctx: LinkSpecContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.linkDegree`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLinkDegree?: (ctx: LinkDegreeContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.entityProjection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEntityProjection?: (ctx: EntityProjectionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.namedExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNamedExpression?: (ctx: NamedExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.patternModel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPatternModel?: (ctx: PatternModelContext) => Result;
	/**
	 * Visit a parse tree produced by the `singleValuedPatternSubmodel`
	 * labeled alternative in `KELParser.patternSubmodel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSingleValuedPatternSubmodel?: (ctx: SingleValuedPatternSubmodelContext) => Result;
	/**
	 * Visit a parse tree produced by the `multiValuedPatternSubmodel`
	 * labeled alternative in `KELParser.patternSubmodel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiValuedPatternSubmodel?: (ctx: MultiValuedPatternSubmodelContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.fieldSelector`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFieldSelector?: (ctx: FieldSelectorContext) => Result;
	/**
	 * Visit a parse tree produced by the `selfScopeExpression`
	 * labeled alternative in `KELParser.scopeExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSelfScopeExpression?: (ctx: SelfScopeExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by the `outerScopeExpression`
	 * labeled alternative in `KELParser.scopeExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOuterScopeExpression?: (ctx: OuterScopeExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by the `explicitScopeExpression`
	 * labeled alternative in `KELParser.scopeExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExplicitScopeExpression?: (ctx: ExplicitScopeExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.tableProperty`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTableProperty?: (ctx: TablePropertyContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.func_id`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunc_id?: (ctx: Func_idContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.qualifiedId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitQualifiedId?: (ctx: QualifiedIdContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.leadingId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLeadingId?: (ctx: LeadingIdContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.fieldId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFieldId?: (ctx: FieldIdContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.tablePropId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTablePropId?: (ctx: TablePropIdContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.propertyId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyId?: (ctx: PropertyIdContext) => Result;
	/**
	 * Visit a parse tree produced by the `nonSetConstant`
	 * labeled alternative in `KELParser.constant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNonSetConstant?: (ctx: NonSetConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `emptySetConstant`
	 * labeled alternative in `KELParser.constant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEmptySetConstant?: (ctx: EmptySetConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `stringConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStringConstant?: (ctx: StringConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `generalRealConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGeneralRealConstant?: (ctx: GeneralRealConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `trueConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTrueConstant?: (ctx: TrueConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `falseConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFalseConstant?: (ctx: FalseConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `typedConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypedConstant?: (ctx: TypedConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `generalIntConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGeneralIntConstant?: (ctx: GeneralIntConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `decIntConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDecIntConstant?: (ctx: DecIntConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `negIntConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNegIntConstant?: (ctx: NegIntConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `hexConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHexConstant?: (ctx: HexConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `binConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBinConstant?: (ctx: BinConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `badHexConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBadHexConstant?: (ctx: BadHexConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `badBinConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBadBinConstant?: (ctx: BadBinConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `noFlagHexConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNoFlagHexConstant?: (ctx: NoFlagHexConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `badMixConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBadMixConstant?: (ctx: BadMixConstantContext) => Result;
	/**
	 * Visit a parse tree produced by the `realConst`
	 * labeled alternative in `KELParser.realConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRealConst?: (ctx: RealConstContext) => Result;
	/**
	 * Visit a parse tree produced by the `badRealConst`
	 * labeled alternative in `KELParser.realConstant`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBadRealConst?: (ctx: BadRealConstContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.eclExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEclExpression?: (ctx: EclExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.eclBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEclBody?: (ctx: EclBodyContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.eclFragment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEclFragment?: (ctx: EclFragmentContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.eclImportList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEclImportList?: (ctx: EclImportListContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.eclImportItem`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEclImportItem?: (ctx: EclImportItemContext) => Result;
	/**
	 * Visit a parse tree produced by `KELParser.returnTypeId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnTypeId?: (ctx: ReturnTypeIdContext) => Result;
}


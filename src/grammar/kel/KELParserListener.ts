// Generated from ./KELParser.g4 by ANTLR 4.13.1

import {ParseTreeListener} from "antlr4";


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
 * This interface defines a complete listener for a parse tree produced by
 * `KELParser`.
 */
export default class KELParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `KELParser.program`.
	 * @param ctx the parse tree
	 */
	enterProgram?: (ctx: ProgramContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.program`.
	 * @param ctx the parse tree
	 */
	exitProgram?: (ctx: ProgramContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.annotation`.
	 * @param ctx the parse tree
	 */
	enterAnnotation?: (ctx: AnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.annotation`.
	 * @param ctx the parse tree
	 */
	exitAnnotation?: (ctx: AnnotationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;
	/**
	 * Enter a parse tree produced by the `optionBool`
	 * labeled alternative in `KELParser.option`.
	 * @param ctx the parse tree
	 */
	enterOptionBool?: (ctx: OptionBoolContext) => void;
	/**
	 * Exit a parse tree produced by the `optionBool`
	 * labeled alternative in `KELParser.option`.
	 * @param ctx the parse tree
	 */
	exitOptionBool?: (ctx: OptionBoolContext) => void;
	/**
	 * Enter a parse tree produced by the `optionStr`
	 * labeled alternative in `KELParser.option`.
	 * @param ctx the parse tree
	 */
	enterOptionStr?: (ctx: OptionStrContext) => void;
	/**
	 * Exit a parse tree produced by the `optionStr`
	 * labeled alternative in `KELParser.option`.
	 * @param ctx the parse tree
	 */
	exitOptionStr?: (ctx: OptionStrContext) => void;
	/**
	 * Enter a parse tree produced by the `optionInt`
	 * labeled alternative in `KELParser.option`.
	 * @param ctx the parse tree
	 */
	enterOptionInt?: (ctx: OptionIntContext) => void;
	/**
	 * Exit a parse tree produced by the `optionInt`
	 * labeled alternative in `KELParser.option`.
	 * @param ctx the parse tree
	 */
	exitOptionInt?: (ctx: OptionIntContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.eraDeclaration`.
	 * @param ctx the parse tree
	 */
	enterEraDeclaration?: (ctx: EraDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.eraDeclaration`.
	 * @param ctx the parse tree
	 */
	exitEraDeclaration?: (ctx: EraDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.epoch`.
	 * @param ctx the parse tree
	 */
	enterEpoch?: (ctx: EpochContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.epoch`.
	 * @param ctx the parse tree
	 */
	exitEpoch?: (ctx: EpochContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.permitsDeclaration`.
	 * @param ctx the parse tree
	 */
	enterPermitsDeclaration?: (ctx: PermitsDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.permitsDeclaration`.
	 * @param ctx the parse tree
	 */
	exitPermitsDeclaration?: (ctx: PermitsDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.permit`.
	 * @param ctx the parse tree
	 */
	enterPermit?: (ctx: PermitContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.permit`.
	 * @param ctx the parse tree
	 */
	exitPermit?: (ctx: PermitContext) => void;
	/**
	 * Enter a parse tree produced by the `simpleImport`
	 * labeled alternative in `KELParser.importStatement`.
	 * @param ctx the parse tree
	 */
	enterSimpleImport?: (ctx: SimpleImportContext) => void;
	/**
	 * Exit a parse tree produced by the `simpleImport`
	 * labeled alternative in `KELParser.importStatement`.
	 * @param ctx the parse tree
	 */
	exitSimpleImport?: (ctx: SimpleImportContext) => void;
	/**
	 * Enter a parse tree produced by the `packageImport`
	 * labeled alternative in `KELParser.importStatement`.
	 * @param ctx the parse tree
	 */
	enterPackageImport?: (ctx: PackageImportContext) => void;
	/**
	 * Exit a parse tree produced by the `packageImport`
	 * labeled alternative in `KELParser.importStatement`.
	 * @param ctx the parse tree
	 */
	exitPackageImport?: (ctx: PackageImportContext) => void;
	/**
	 * Enter a parse tree produced by the `spcImport`
	 * labeled alternative in `KELParser.importStatement`.
	 * @param ctx the parse tree
	 */
	enterSpcImport?: (ctx: SpcImportContext) => void;
	/**
	 * Exit a parse tree produced by the `spcImport`
	 * labeled alternative in `KELParser.importStatement`.
	 * @param ctx the parse tree
	 */
	exitSpcImport?: (ctx: SpcImportContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.inlinePackage`.
	 * @param ctx the parse tree
	 */
	enterInlinePackage?: (ctx: InlinePackageContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.inlinePackage`.
	 * @param ctx the parse tree
	 */
	exitInlinePackage?: (ctx: InlinePackageContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.outoflinePackage`.
	 * @param ctx the parse tree
	 */
	enterOutoflinePackage?: (ctx: OutoflinePackageContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.outoflinePackage`.
	 * @param ctx the parse tree
	 */
	exitOutoflinePackage?: (ctx: OutoflinePackageContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.packageDeclaration`.
	 * @param ctx the parse tree
	 */
	enterPackageDeclaration?: (ctx: PackageDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.packageDeclaration`.
	 * @param ctx the parse tree
	 */
	exitPackageDeclaration?: (ctx: PackageDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.packageStatement`.
	 * @param ctx the parse tree
	 */
	enterPackageStatement?: (ctx: PackageStatementContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.packageStatement`.
	 * @param ctx the parse tree
	 */
	exitPackageStatement?: (ctx: PackageStatementContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.packageExportDeclaration`.
	 * @param ctx the parse tree
	 */
	enterPackageExportDeclaration?: (ctx: PackageExportDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.packageExportDeclaration`.
	 * @param ctx the parse tree
	 */
	exitPackageExportDeclaration?: (ctx: PackageExportDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.entityDeclaration`.
	 * @param ctx the parse tree
	 */
	enterEntityDeclaration?: (ctx: EntityDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.entityDeclaration`.
	 * @param ctx the parse tree
	 */
	exitEntityDeclaration?: (ctx: EntityDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.entityProperty`.
	 * @param ctx the parse tree
	 */
	enterEntityProperty?: (ctx: EntityPropertyContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.entityProperty`.
	 * @param ctx the parse tree
	 */
	exitEntityProperty?: (ctx: EntityPropertyContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.fieldMapping`.
	 * @param ctx the parse tree
	 */
	enterFieldMapping?: (ctx: FieldMappingContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.fieldMapping`.
	 * @param ctx the parse tree
	 */
	exitFieldMapping?: (ctx: FieldMappingContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.fileType`.
	 * @param ctx the parse tree
	 */
	enterFileType?: (ctx: FileTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.fileType`.
	 * @param ctx the parse tree
	 */
	exitFileType?: (ctx: FileTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.mappingElement`.
	 * @param ctx the parse tree
	 */
	enterMappingElement?: (ctx: MappingElementContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.mappingElement`.
	 * @param ctx the parse tree
	 */
	exitMappingElement?: (ctx: MappingElementContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.nullSpec`.
	 * @param ctx the parse tree
	 */
	enterNullSpec?: (ctx: NullSpecContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.nullSpec`.
	 * @param ctx the parse tree
	 */
	exitNullSpec?: (ctx: NullSpecContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.formatSpec`.
	 * @param ctx the parse tree
	 */
	enterFormatSpec?: (ctx: FormatSpecContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.formatSpec`.
	 * @param ctx the parse tree
	 */
	exitFormatSpec?: (ctx: FormatSpecContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.likeSpec`.
	 * @param ctx the parse tree
	 */
	enterLikeSpec?: (ctx: LikeSpecContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.likeSpec`.
	 * @param ctx the parse tree
	 */
	exitLikeSpec?: (ctx: LikeSpecContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.compositeIdSpec`.
	 * @param ctx the parse tree
	 */
	enterCompositeIdSpec?: (ctx: CompositeIdSpecContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.compositeIdSpec`.
	 * @param ctx the parse tree
	 */
	exitCompositeIdSpec?: (ctx: CompositeIdSpecContext) => void;
	/**
	 * Enter a parse tree produced by the `complexModel`
	 * labeled alternative in `KELParser.modelDeclaration`.
	 * @param ctx the parse tree
	 */
	enterComplexModel?: (ctx: ComplexModelContext) => void;
	/**
	 * Exit a parse tree produced by the `complexModel`
	 * labeled alternative in `KELParser.modelDeclaration`.
	 * @param ctx the parse tree
	 */
	exitComplexModel?: (ctx: ComplexModelContext) => void;
	/**
	 * Enter a parse tree produced by the `singleRowModel`
	 * labeled alternative in `KELParser.modelDeclaration`.
	 * @param ctx the parse tree
	 */
	enterSingleRowModel?: (ctx: SingleRowModelContext) => void;
	/**
	 * Exit a parse tree produced by the `singleRowModel`
	 * labeled alternative in `KELParser.modelDeclaration`.
	 * @param ctx the parse tree
	 */
	exitSingleRowModel?: (ctx: SingleRowModelContext) => void;
	/**
	 * Enter a parse tree produced by the `singleValueSubModel`
	 * labeled alternative in `KELParser.submodelDeclaration`.
	 * @param ctx the parse tree
	 */
	enterSingleValueSubModel?: (ctx: SingleValueSubModelContext) => void;
	/**
	 * Exit a parse tree produced by the `singleValueSubModel`
	 * labeled alternative in `KELParser.submodelDeclaration`.
	 * @param ctx the parse tree
	 */
	exitSingleValueSubModel?: (ctx: SingleValueSubModelContext) => void;
	/**
	 * Enter a parse tree produced by the `remainderSubModel`
	 * labeled alternative in `KELParser.submodelDeclaration`.
	 * @param ctx the parse tree
	 */
	enterRemainderSubModel?: (ctx: RemainderSubModelContext) => void;
	/**
	 * Exit a parse tree produced by the `remainderSubModel`
	 * labeled alternative in `KELParser.submodelDeclaration`.
	 * @param ctx the parse tree
	 */
	exitRemainderSubModel?: (ctx: RemainderSubModelContext) => void;
	/**
	 * Enter a parse tree produced by the `explicitSubModel`
	 * labeled alternative in `KELParser.submodelDeclaration`.
	 * @param ctx the parse tree
	 */
	enterExplicitSubModel?: (ctx: ExplicitSubModelContext) => void;
	/**
	 * Exit a parse tree produced by the `explicitSubModel`
	 * labeled alternative in `KELParser.submodelDeclaration`.
	 * @param ctx the parse tree
	 */
	exitExplicitSubModel?: (ctx: ExplicitSubModelContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.submodelId`.
	 * @param ctx the parse tree
	 */
	enterSubmodelId?: (ctx: SubmodelIdContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.submodelId`.
	 * @param ctx the parse tree
	 */
	exitSubmodelId?: (ctx: SubmodelIdContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.useDeclaration`.
	 * @param ctx the parse tree
	 */
	enterUseDeclaration?: (ctx: UseDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.useDeclaration`.
	 * @param ctx the parse tree
	 */
	exitUseDeclaration?: (ctx: UseDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.useKelBaseDeclaration`.
	 * @param ctx the parse tree
	 */
	enterUseKelBaseDeclaration?: (ctx: UseKelBaseDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.useKelBaseDeclaration`.
	 * @param ctx the parse tree
	 */
	exitUseKelBaseDeclaration?: (ctx: UseKelBaseDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.useKelQueryDeclaration`.
	 * @param ctx the parse tree
	 */
	enterUseKelQueryDeclaration?: (ctx: UseKelQueryDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.useKelQueryDeclaration`.
	 * @param ctx the parse tree
	 */
	exitUseKelQueryDeclaration?: (ctx: UseKelQueryDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.useElement`.
	 * @param ctx the parse tree
	 */
	enterUseElement?: (ctx: UseElementContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.useElement`.
	 * @param ctx the parse tree
	 */
	exitUseElement?: (ctx: UseElementContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.useFileType`.
	 * @param ctx the parse tree
	 */
	enterUseFileType?: (ctx: UseFileTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.useFileType`.
	 * @param ctx the parse tree
	 */
	exitUseFileType?: (ctx: UseFileTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.useClause`.
	 * @param ctx the parse tree
	 */
	enterUseClause?: (ctx: UseClauseContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.useClause`.
	 * @param ctx the parse tree
	 */
	exitUseClause?: (ctx: UseClauseContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.useClauseElement`.
	 * @param ctx the parse tree
	 */
	enterUseClauseElement?: (ctx: UseClauseElementContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.useClauseElement`.
	 * @param ctx the parse tree
	 */
	exitUseClauseElement?: (ctx: UseClauseElementContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.useClauseFileType`.
	 * @param ctx the parse tree
	 */
	enterUseClauseFileType?: (ctx: UseClauseFileTypeContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.useClauseFileType`.
	 * @param ctx the parse tree
	 */
	exitUseClauseFileType?: (ctx: UseClauseFileTypeContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.nestedEntityMapping`.
	 * @param ctx the parse tree
	 */
	enterNestedEntityMapping?: (ctx: NestedEntityMappingContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.nestedEntityMapping`.
	 * @param ctx the parse tree
	 */
	exitNestedEntityMapping?: (ctx: NestedEntityMappingContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.entityMapping`.
	 * @param ctx the parse tree
	 */
	enterEntityMapping?: (ctx: EntityMappingContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.entityMapping`.
	 * @param ctx the parse tree
	 */
	exitEntityMapping?: (ctx: EntityMappingContext) => void;
	/**
	 * Enter a parse tree produced by the `normalMappingOverride`
	 * labeled alternative in `KELParser.useMappingOverride`.
	 * @param ctx the parse tree
	 */
	enterNormalMappingOverride?: (ctx: NormalMappingOverrideContext) => void;
	/**
	 * Exit a parse tree produced by the `normalMappingOverride`
	 * labeled alternative in `KELParser.useMappingOverride`.
	 * @param ctx the parse tree
	 */
	exitNormalMappingOverride?: (ctx: NormalMappingOverrideContext) => void;
	/**
	 * Enter a parse tree produced by the `constantMappingOverride`
	 * labeled alternative in `KELParser.useMappingOverride`.
	 * @param ctx the parse tree
	 */
	enterConstantMappingOverride?: (ctx: ConstantMappingOverrideContext) => void;
	/**
	 * Exit a parse tree produced by the `constantMappingOverride`
	 * labeled alternative in `KELParser.useMappingOverride`.
	 * @param ctx the parse tree
	 */
	exitConstantMappingOverride?: (ctx: ConstantMappingOverrideContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.dotId`.
	 * @param ctx the parse tree
	 */
	enterDotId?: (ctx: DotIdContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.dotId`.
	 * @param ctx the parse tree
	 */
	exitDotId?: (ctx: DotIdContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.permitsClause`.
	 * @param ctx the parse tree
	 */
	enterPermitsClause?: (ctx: PermitsClauseContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.permitsClause`.
	 * @param ctx the parse tree
	 */
	exitPermitsClause?: (ctx: PermitsClauseContext) => void;
	/**
	 * Enter a parse tree produced by the `variablePermits`
	 * labeled alternative in `KELParser.permitsSpec`.
	 * @param ctx the parse tree
	 */
	enterVariablePermits?: (ctx: VariablePermitsContext) => void;
	/**
	 * Exit a parse tree produced by the `variablePermits`
	 * labeled alternative in `KELParser.permitsSpec`.
	 * @param ctx the parse tree
	 */
	exitVariablePermits?: (ctx: VariablePermitsContext) => void;
	/**
	 * Enter a parse tree produced by the `constantPermits`
	 * labeled alternative in `KELParser.permitsSpec`.
	 * @param ctx the parse tree
	 */
	enterConstantPermits?: (ctx: ConstantPermitsContext) => void;
	/**
	 * Exit a parse tree produced by the `constantPermits`
	 * labeled alternative in `KELParser.permitsSpec`.
	 * @param ctx the parse tree
	 */
	exitConstantPermits?: (ctx: ConstantPermitsContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.hintsClause`.
	 * @param ctx the parse tree
	 */
	enterHintsClause?: (ctx: HintsClauseContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.hintsClause`.
	 * @param ctx the parse tree
	 */
	exitHintsClause?: (ctx: HintsClauseContext) => void;
	/**
	 * Enter a parse tree produced by the `logicPropertyStatement`
	 * labeled alternative in `KELParser.logicStatement`.
	 * @param ctx the parse tree
	 */
	enterLogicPropertyStatement?: (ctx: LogicPropertyStatementContext) => void;
	/**
	 * Exit a parse tree produced by the `logicPropertyStatement`
	 * labeled alternative in `KELParser.logicStatement`.
	 * @param ctx the parse tree
	 */
	exitLogicPropertyStatement?: (ctx: LogicPropertyStatementContext) => void;
	/**
	 * Enter a parse tree produced by the `constantDeclStatement`
	 * labeled alternative in `KELParser.logicStatement`.
	 * @param ctx the parse tree
	 */
	enterConstantDeclStatement?: (ctx: ConstantDeclStatementContext) => void;
	/**
	 * Exit a parse tree produced by the `constantDeclStatement`
	 * labeled alternative in `KELParser.logicStatement`.
	 * @param ctx the parse tree
	 */
	exitConstantDeclStatement?: (ctx: ConstantDeclStatementContext) => void;
	/**
	 * Enter a parse tree produced by the `entityGeneratorStatement`
	 * labeled alternative in `KELParser.logicStatement`.
	 * @param ctx the parse tree
	 */
	enterEntityGeneratorStatement?: (ctx: EntityGeneratorStatementContext) => void;
	/**
	 * Exit a parse tree produced by the `entityGeneratorStatement`
	 * labeled alternative in `KELParser.logicStatement`.
	 * @param ctx the parse tree
	 */
	exitEntityGeneratorStatement?: (ctx: EntityGeneratorStatementContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.logicPredicate`.
	 * @param ctx the parse tree
	 */
	enterLogicPredicate?: (ctx: LogicPredicateContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.logicPredicate`.
	 * @param ctx the parse tree
	 */
	exitLogicPredicate?: (ctx: LogicPredicateContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.logicProductions`.
	 * @param ctx the parse tree
	 */
	enterLogicProductions?: (ctx: LogicProductionsContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.logicProductions`.
	 * @param ctx the parse tree
	 */
	exitLogicProductions?: (ctx: LogicProductionsContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.logicProduction`.
	 * @param ctx the parse tree
	 */
	enterLogicProduction?: (ctx: LogicProductionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.logicProduction`.
	 * @param ctx the parse tree
	 */
	exitLogicProduction?: (ctx: LogicProductionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.entityProductions`.
	 * @param ctx the parse tree
	 */
	enterEntityProductions?: (ctx: EntityProductionsContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.entityProductions`.
	 * @param ctx the parse tree
	 */
	exitEntityProductions?: (ctx: EntityProductionsContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.entityProduction`.
	 * @param ctx the parse tree
	 */
	enterEntityProduction?: (ctx: EntityProductionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.entityProduction`.
	 * @param ctx the parse tree
	 */
	exitEntityProduction?: (ctx: EntityProductionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.functionStatement`.
	 * @param ctx the parse tree
	 */
	enterFunctionStatement?: (ctx: FunctionStatementContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.functionStatement`.
	 * @param ctx the parse tree
	 */
	exitFunctionStatement?: (ctx: FunctionStatementContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.fparams`.
	 * @param ctx the parse tree
	 */
	enterFparams?: (ctx: FparamsContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.fparams`.
	 * @param ctx the parse tree
	 */
	exitFparams?: (ctx: FparamsContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.fparam`.
	 * @param ctx the parse tree
	 */
	enterFparam?: (ctx: FparamContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.fparam`.
	 * @param ctx the parse tree
	 */
	exitFparam?: (ctx: FparamContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.functionBody`.
	 * @param ctx the parse tree
	 */
	enterFunctionBody?: (ctx: FunctionBodyContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.functionBody`.
	 * @param ctx the parse tree
	 */
	exitFunctionBody?: (ctx: FunctionBodyContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.queryDeclaration`.
	 * @param ctx the parse tree
	 */
	enterQueryDeclaration?: (ctx: QueryDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.queryDeclaration`.
	 * @param ctx the parse tree
	 */
	exitQueryDeclaration?: (ctx: QueryDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.qparams`.
	 * @param ctx the parse tree
	 */
	enterQparams?: (ctx: QparamsContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.qparams`.
	 * @param ctx the parse tree
	 */
	exitQparams?: (ctx: QparamsContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.qparam`.
	 * @param ctx the parse tree
	 */
	enterQparam?: (ctx: QparamContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.qparam`.
	 * @param ctx the parse tree
	 */
	exitQparam?: (ctx: QparamContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.paramTypeId`.
	 * @param ctx the parse tree
	 */
	enterParamTypeId?: (ctx: ParamTypeIdContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.paramTypeId`.
	 * @param ctx the parse tree
	 */
	exitParamTypeId?: (ctx: ParamTypeIdContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.simpleTypeId`.
	 * @param ctx the parse tree
	 */
	enterSimpleTypeId?: (ctx: SimpleTypeIdContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.simpleTypeId`.
	 * @param ctx the parse tree
	 */
	exitSimpleTypeId?: (ctx: SimpleTypeIdContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.asof`.
	 * @param ctx the parse tree
	 */
	enterAsof?: (ctx: AsofContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.asof`.
	 * @param ctx the parse tree
	 */
	exitAsof?: (ctx: AsofContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.using`.
	 * @param ctx the parse tree
	 */
	enterUsing?: (ctx: UsingContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.using`.
	 * @param ctx the parse tree
	 */
	exitUsing?: (ctx: UsingContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.shellDeclaration`.
	 * @param ctx the parse tree
	 */
	enterShellDeclaration?: (ctx: ShellDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.shellDeclaration`.
	 * @param ctx the parse tree
	 */
	exitShellDeclaration?: (ctx: ShellDeclarationContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.visual_section`.
	 * @param ctx the parse tree
	 */
	enterVisual_section?: (ctx: Visual_sectionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.visual_section`.
	 * @param ctx the parse tree
	 */
	exitVisual_section?: (ctx: Visual_sectionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.resource_section`.
	 * @param ctx the parse tree
	 */
	enterResource_section?: (ctx: Resource_sectionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.resource_section`.
	 * @param ctx the parse tree
	 */
	exitResource_section?: (ctx: Resource_sectionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.booleanDisjunction`.
	 * @param ctx the parse tree
	 */
	enterBooleanDisjunction?: (ctx: BooleanDisjunctionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.booleanDisjunction`.
	 * @param ctx the parse tree
	 */
	exitBooleanDisjunction?: (ctx: BooleanDisjunctionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.booleanConjunction`.
	 * @param ctx the parse tree
	 */
	enterBooleanConjunction?: (ctx: BooleanConjunctionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.booleanConjunction`.
	 * @param ctx the parse tree
	 */
	exitBooleanConjunction?: (ctx: BooleanConjunctionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.booleanTerm`.
	 * @param ctx the parse tree
	 */
	enterBooleanTerm?: (ctx: BooleanTermContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.booleanTerm`.
	 * @param ctx the parse tree
	 */
	exitBooleanTerm?: (ctx: BooleanTermContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.booleanAtom`.
	 * @param ctx the parse tree
	 */
	enterBooleanAtom?: (ctx: BooleanAtomContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.booleanAtom`.
	 * @param ctx the parse tree
	 */
	exitBooleanAtom?: (ctx: BooleanAtomContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.valueExpression`.
	 * @param ctx the parse tree
	 */
	enterValueExpression?: (ctx: ValueExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.valueExpression`.
	 * @param ctx the parse tree
	 */
	exitValueExpression?: (ctx: ValueExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.valueTerm`.
	 * @param ctx the parse tree
	 */
	enterValueTerm?: (ctx: ValueTermContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.valueTerm`.
	 * @param ctx the parse tree
	 */
	exitValueTerm?: (ctx: ValueTermContext) => void;
	/**
	 * Enter a parse tree produced by the `unaryValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	enterUnaryValueFactor?: (ctx: UnaryValueFactorContext) => void;
	/**
	 * Exit a parse tree produced by the `unaryValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	exitUnaryValueFactor?: (ctx: UnaryValueFactorContext) => void;
	/**
	 * Enter a parse tree produced by the `propValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	enterPropValueFactor?: (ctx: PropValueFactorContext) => void;
	/**
	 * Exit a parse tree produced by the `propValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	exitPropValueFactor?: (ctx: PropValueFactorContext) => void;
	/**
	 * Enter a parse tree produced by the `scopedValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	enterScopedValueFactor?: (ctx: ScopedValueFactorContext) => void;
	/**
	 * Exit a parse tree produced by the `scopedValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	exitScopedValueFactor?: (ctx: ScopedValueFactorContext) => void;
	/**
	 * Enter a parse tree produced by the `constValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	enterConstValueFactor?: (ctx: ConstValueFactorContext) => void;
	/**
	 * Exit a parse tree produced by the `constValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	exitConstValueFactor?: (ctx: ConstValueFactorContext) => void;
	/**
	 * Enter a parse tree produced by the `nestedValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	enterNestedValueFactor?: (ctx: NestedValueFactorContext) => void;
	/**
	 * Exit a parse tree produced by the `nestedValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	exitNestedValueFactor?: (ctx: NestedValueFactorContext) => void;
	/**
	 * Enter a parse tree produced by the `setValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	enterSetValueFactor?: (ctx: SetValueFactorContext) => void;
	/**
	 * Exit a parse tree produced by the `setValueFactor`
	 * labeled alternative in `KELParser.valueFactor`.
	 * @param ctx the parse tree
	 */
	exitSetValueFactor?: (ctx: SetValueFactorContext) => void;
	/**
	 * Enter a parse tree produced by the `queryOpValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	enterQueryOpValueAtom?: (ctx: QueryOpValueAtomContext) => void;
	/**
	 * Exit a parse tree produced by the `queryOpValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	exitQueryOpValueAtom?: (ctx: QueryOpValueAtomContext) => void;
	/**
	 * Enter a parse tree produced by the `projValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	enterProjValueAtom?: (ctx: ProjValueAtomContext) => void;
	/**
	 * Exit a parse tree produced by the `projValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	exitProjValueAtom?: (ctx: ProjValueAtomContext) => void;
	/**
	 * Enter a parse tree produced by the `patternModelAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	enterPatternModelAtom?: (ctx: PatternModelAtomContext) => void;
	/**
	 * Exit a parse tree produced by the `patternModelAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	exitPatternModelAtom?: (ctx: PatternModelAtomContext) => void;
	/**
	 * Enter a parse tree produced by the `idValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	enterIdValueAtom?: (ctx: IdValueAtomContext) => void;
	/**
	 * Exit a parse tree produced by the `idValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	exitIdValueAtom?: (ctx: IdValueAtomContext) => void;
	/**
	 * Enter a parse tree produced by the `autoMatchValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	enterAutoMatchValueAtom?: (ctx: AutoMatchValueAtomContext) => void;
	/**
	 * Exit a parse tree produced by the `autoMatchValueAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	exitAutoMatchValueAtom?: (ctx: AutoMatchValueAtomContext) => void;
	/**
	 * Enter a parse tree produced by the `linkAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	enterLinkAtom?: (ctx: LinkAtomContext) => void;
	/**
	 * Exit a parse tree produced by the `linkAtom`
	 * labeled alternative in `KELParser.valueAtom`.
	 * @param ctx the parse tree
	 */
	exitLinkAtom?: (ctx: LinkAtomContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.queryFuncOp`.
	 * @param ctx the parse tree
	 */
	enterQueryFuncOp?: (ctx: QueryFuncOpContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.queryFuncOp`.
	 * @param ctx the parse tree
	 */
	exitQueryFuncOp?: (ctx: QueryFuncOpContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.funcOrFilter`.
	 * @param ctx the parse tree
	 */
	enterFuncOrFilter?: (ctx: FuncOrFilterContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.funcOrFilter`.
	 * @param ctx the parse tree
	 */
	exitFuncOrFilter?: (ctx: FuncOrFilterContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.pair`.
	 * @param ctx the parse tree
	 */
	enterPair?: (ctx: PairContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.pair`.
	 * @param ctx the parse tree
	 */
	exitPair?: (ctx: PairContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.linkExp`.
	 * @param ctx the parse tree
	 */
	enterLinkExp?: (ctx: LinkExpContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.linkExp`.
	 * @param ctx the parse tree
	 */
	exitLinkExp?: (ctx: LinkExpContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.linkSpec`.
	 * @param ctx the parse tree
	 */
	enterLinkSpec?: (ctx: LinkSpecContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.linkSpec`.
	 * @param ctx the parse tree
	 */
	exitLinkSpec?: (ctx: LinkSpecContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.linkDegree`.
	 * @param ctx the parse tree
	 */
	enterLinkDegree?: (ctx: LinkDegreeContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.linkDegree`.
	 * @param ctx the parse tree
	 */
	exitLinkDegree?: (ctx: LinkDegreeContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.entityProjection`.
	 * @param ctx the parse tree
	 */
	enterEntityProjection?: (ctx: EntityProjectionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.entityProjection`.
	 * @param ctx the parse tree
	 */
	exitEntityProjection?: (ctx: EntityProjectionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.namedExpression`.
	 * @param ctx the parse tree
	 */
	enterNamedExpression?: (ctx: NamedExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.namedExpression`.
	 * @param ctx the parse tree
	 */
	exitNamedExpression?: (ctx: NamedExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.patternModel`.
	 * @param ctx the parse tree
	 */
	enterPatternModel?: (ctx: PatternModelContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.patternModel`.
	 * @param ctx the parse tree
	 */
	exitPatternModel?: (ctx: PatternModelContext) => void;
	/**
	 * Enter a parse tree produced by the `singleValuedPatternSubmodel`
	 * labeled alternative in `KELParser.patternSubmodel`.
	 * @param ctx the parse tree
	 */
	enterSingleValuedPatternSubmodel?: (ctx: SingleValuedPatternSubmodelContext) => void;
	/**
	 * Exit a parse tree produced by the `singleValuedPatternSubmodel`
	 * labeled alternative in `KELParser.patternSubmodel`.
	 * @param ctx the parse tree
	 */
	exitSingleValuedPatternSubmodel?: (ctx: SingleValuedPatternSubmodelContext) => void;
	/**
	 * Enter a parse tree produced by the `multiValuedPatternSubmodel`
	 * labeled alternative in `KELParser.patternSubmodel`.
	 * @param ctx the parse tree
	 */
	enterMultiValuedPatternSubmodel?: (ctx: MultiValuedPatternSubmodelContext) => void;
	/**
	 * Exit a parse tree produced by the `multiValuedPatternSubmodel`
	 * labeled alternative in `KELParser.patternSubmodel`.
	 * @param ctx the parse tree
	 */
	exitMultiValuedPatternSubmodel?: (ctx: MultiValuedPatternSubmodelContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.fieldSelector`.
	 * @param ctx the parse tree
	 */
	enterFieldSelector?: (ctx: FieldSelectorContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.fieldSelector`.
	 * @param ctx the parse tree
	 */
	exitFieldSelector?: (ctx: FieldSelectorContext) => void;
	/**
	 * Enter a parse tree produced by the `selfScopeExpression`
	 * labeled alternative in `KELParser.scopeExpression`.
	 * @param ctx the parse tree
	 */
	enterSelfScopeExpression?: (ctx: SelfScopeExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `selfScopeExpression`
	 * labeled alternative in `KELParser.scopeExpression`.
	 * @param ctx the parse tree
	 */
	exitSelfScopeExpression?: (ctx: SelfScopeExpressionContext) => void;
	/**
	 * Enter a parse tree produced by the `outerScopeExpression`
	 * labeled alternative in `KELParser.scopeExpression`.
	 * @param ctx the parse tree
	 */
	enterOuterScopeExpression?: (ctx: OuterScopeExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `outerScopeExpression`
	 * labeled alternative in `KELParser.scopeExpression`.
	 * @param ctx the parse tree
	 */
	exitOuterScopeExpression?: (ctx: OuterScopeExpressionContext) => void;
	/**
	 * Enter a parse tree produced by the `explicitScopeExpression`
	 * labeled alternative in `KELParser.scopeExpression`.
	 * @param ctx the parse tree
	 */
	enterExplicitScopeExpression?: (ctx: ExplicitScopeExpressionContext) => void;
	/**
	 * Exit a parse tree produced by the `explicitScopeExpression`
	 * labeled alternative in `KELParser.scopeExpression`.
	 * @param ctx the parse tree
	 */
	exitExplicitScopeExpression?: (ctx: ExplicitScopeExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.tableProperty`.
	 * @param ctx the parse tree
	 */
	enterTableProperty?: (ctx: TablePropertyContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.tableProperty`.
	 * @param ctx the parse tree
	 */
	exitTableProperty?: (ctx: TablePropertyContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.func_id`.
	 * @param ctx the parse tree
	 */
	enterFunc_id?: (ctx: Func_idContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.func_id`.
	 * @param ctx the parse tree
	 */
	exitFunc_id?: (ctx: Func_idContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.qualifiedId`.
	 * @param ctx the parse tree
	 */
	enterQualifiedId?: (ctx: QualifiedIdContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.qualifiedId`.
	 * @param ctx the parse tree
	 */
	exitQualifiedId?: (ctx: QualifiedIdContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.leadingId`.
	 * @param ctx the parse tree
	 */
	enterLeadingId?: (ctx: LeadingIdContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.leadingId`.
	 * @param ctx the parse tree
	 */
	exitLeadingId?: (ctx: LeadingIdContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.fieldId`.
	 * @param ctx the parse tree
	 */
	enterFieldId?: (ctx: FieldIdContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.fieldId`.
	 * @param ctx the parse tree
	 */
	exitFieldId?: (ctx: FieldIdContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.tablePropId`.
	 * @param ctx the parse tree
	 */
	enterTablePropId?: (ctx: TablePropIdContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.tablePropId`.
	 * @param ctx the parse tree
	 */
	exitTablePropId?: (ctx: TablePropIdContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.propertyId`.
	 * @param ctx the parse tree
	 */
	enterPropertyId?: (ctx: PropertyIdContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.propertyId`.
	 * @param ctx the parse tree
	 */
	exitPropertyId?: (ctx: PropertyIdContext) => void;
	/**
	 * Enter a parse tree produced by the `nonSetConstant`
	 * labeled alternative in `KELParser.constant`.
	 * @param ctx the parse tree
	 */
	enterNonSetConstant?: (ctx: NonSetConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `nonSetConstant`
	 * labeled alternative in `KELParser.constant`.
	 * @param ctx the parse tree
	 */
	exitNonSetConstant?: (ctx: NonSetConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `emptySetConstant`
	 * labeled alternative in `KELParser.constant`.
	 * @param ctx the parse tree
	 */
	enterEmptySetConstant?: (ctx: EmptySetConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `emptySetConstant`
	 * labeled alternative in `KELParser.constant`.
	 * @param ctx the parse tree
	 */
	exitEmptySetConstant?: (ctx: EmptySetConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `stringConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	enterStringConstant?: (ctx: StringConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `stringConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	exitStringConstant?: (ctx: StringConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `generalRealConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	enterGeneralRealConstant?: (ctx: GeneralRealConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `generalRealConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	exitGeneralRealConstant?: (ctx: GeneralRealConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `trueConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	enterTrueConstant?: (ctx: TrueConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `trueConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	exitTrueConstant?: (ctx: TrueConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `falseConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	enterFalseConstant?: (ctx: FalseConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `falseConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	exitFalseConstant?: (ctx: FalseConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `typedConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	enterTypedConstant?: (ctx: TypedConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `typedConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	exitTypedConstant?: (ctx: TypedConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `generalIntConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	enterGeneralIntConstant?: (ctx: GeneralIntConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `generalIntConstant`
	 * labeled alternative in `KELParser.simpleConstant`.
	 * @param ctx the parse tree
	 */
	exitGeneralIntConstant?: (ctx: GeneralIntConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `decIntConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	enterDecIntConstant?: (ctx: DecIntConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `decIntConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	exitDecIntConstant?: (ctx: DecIntConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `negIntConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	enterNegIntConstant?: (ctx: NegIntConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `negIntConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	exitNegIntConstant?: (ctx: NegIntConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `hexConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	enterHexConstant?: (ctx: HexConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `hexConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	exitHexConstant?: (ctx: HexConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `binConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	enterBinConstant?: (ctx: BinConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `binConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	exitBinConstant?: (ctx: BinConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `badHexConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	enterBadHexConstant?: (ctx: BadHexConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `badHexConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	exitBadHexConstant?: (ctx: BadHexConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `badBinConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	enterBadBinConstant?: (ctx: BadBinConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `badBinConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	exitBadBinConstant?: (ctx: BadBinConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `noFlagHexConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	enterNoFlagHexConstant?: (ctx: NoFlagHexConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `noFlagHexConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	exitNoFlagHexConstant?: (ctx: NoFlagHexConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `badMixConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	enterBadMixConstant?: (ctx: BadMixConstantContext) => void;
	/**
	 * Exit a parse tree produced by the `badMixConstant`
	 * labeled alternative in `KELParser.intConstant`.
	 * @param ctx the parse tree
	 */
	exitBadMixConstant?: (ctx: BadMixConstantContext) => void;
	/**
	 * Enter a parse tree produced by the `realConst`
	 * labeled alternative in `KELParser.realConstant`.
	 * @param ctx the parse tree
	 */
	enterRealConst?: (ctx: RealConstContext) => void;
	/**
	 * Exit a parse tree produced by the `realConst`
	 * labeled alternative in `KELParser.realConstant`.
	 * @param ctx the parse tree
	 */
	exitRealConst?: (ctx: RealConstContext) => void;
	/**
	 * Enter a parse tree produced by the `badRealConst`
	 * labeled alternative in `KELParser.realConstant`.
	 * @param ctx the parse tree
	 */
	enterBadRealConst?: (ctx: BadRealConstContext) => void;
	/**
	 * Exit a parse tree produced by the `badRealConst`
	 * labeled alternative in `KELParser.realConstant`.
	 * @param ctx the parse tree
	 */
	exitBadRealConst?: (ctx: BadRealConstContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.eclExpression`.
	 * @param ctx the parse tree
	 */
	enterEclExpression?: (ctx: EclExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.eclExpression`.
	 * @param ctx the parse tree
	 */
	exitEclExpression?: (ctx: EclExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.eclBody`.
	 * @param ctx the parse tree
	 */
	enterEclBody?: (ctx: EclBodyContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.eclBody`.
	 * @param ctx the parse tree
	 */
	exitEclBody?: (ctx: EclBodyContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.eclFragment`.
	 * @param ctx the parse tree
	 */
	enterEclFragment?: (ctx: EclFragmentContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.eclFragment`.
	 * @param ctx the parse tree
	 */
	exitEclFragment?: (ctx: EclFragmentContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.eclImportList`.
	 * @param ctx the parse tree
	 */
	enterEclImportList?: (ctx: EclImportListContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.eclImportList`.
	 * @param ctx the parse tree
	 */
	exitEclImportList?: (ctx: EclImportListContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.eclImportItem`.
	 * @param ctx the parse tree
	 */
	enterEclImportItem?: (ctx: EclImportItemContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.eclImportItem`.
	 * @param ctx the parse tree
	 */
	exitEclImportItem?: (ctx: EclImportItemContext) => void;
	/**
	 * Enter a parse tree produced by `KELParser.returnTypeId`.
	 * @param ctx the parse tree
	 */
	enterReturnTypeId?: (ctx: ReturnTypeIdContext) => void;
	/**
	 * Exit a parse tree produced by `KELParser.returnTypeId`.
	 * @param ctx the parse tree
	 */
	exitReturnTypeId?: (ctx: ReturnTypeIdContext) => void;
}


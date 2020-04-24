// Generated from ./KELParser.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by KELParser.

function KELParserVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

KELParserVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
KELParserVisitor.prototype.constructor = KELParserVisitor;

// Visit a parse tree produced by KELParser#program.
KELParserVisitor.prototype.visitProgram = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#annotation.
KELParserVisitor.prototype.visitAnnotation = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#statement.
KELParserVisitor.prototype.visitStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#optionBool.
KELParserVisitor.prototype.visitOptionBool = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#optionStr.
KELParserVisitor.prototype.visitOptionStr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#optionInt.
KELParserVisitor.prototype.visitOptionInt = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#eraDeclaration.
KELParserVisitor.prototype.visitEraDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#epoch.
KELParserVisitor.prototype.visitEpoch = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#permitsDeclaration.
KELParserVisitor.prototype.visitPermitsDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#permit.
KELParserVisitor.prototype.visitPermit = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#simpleImport.
KELParserVisitor.prototype.visitSimpleImport = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#packageImport.
KELParserVisitor.prototype.visitPackageImport = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#inlinePackage.
KELParserVisitor.prototype.visitInlinePackage = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#outoflinePackage.
KELParserVisitor.prototype.visitOutoflinePackage = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#packageDeclaration.
KELParserVisitor.prototype.visitPackageDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#packageStatement.
KELParserVisitor.prototype.visitPackageStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#packageExportDeclaration.
KELParserVisitor.prototype.visitPackageExportDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#entityDeclaration.
KELParserVisitor.prototype.visitEntityDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#entityProperty.
KELParserVisitor.prototype.visitEntityProperty = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#fieldMapping.
KELParserVisitor.prototype.visitFieldMapping = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#fileType.
KELParserVisitor.prototype.visitFileType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#mappingElement.
KELParserVisitor.prototype.visitMappingElement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#nullSpec.
KELParserVisitor.prototype.visitNullSpec = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#formatSpec.
KELParserVisitor.prototype.visitFormatSpec = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#compositeIdSpec.
KELParserVisitor.prototype.visitCompositeIdSpec = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#complexModel.
KELParserVisitor.prototype.visitComplexModel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#singleRowModel.
KELParserVisitor.prototype.visitSingleRowModel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#singleValueSubModel.
KELParserVisitor.prototype.visitSingleValueSubModel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#remainderSubModel.
KELParserVisitor.prototype.visitRemainderSubModel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#explicitSubModel.
KELParserVisitor.prototype.visitExplicitSubModel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#submodelId.
KELParserVisitor.prototype.visitSubmodelId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#useDeclaration.
KELParserVisitor.prototype.visitUseDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#useKelBaseDeclaration.
KELParserVisitor.prototype.visitUseKelBaseDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#useKelQueryDeclaration.
KELParserVisitor.prototype.visitUseKelQueryDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#useElement.
KELParserVisitor.prototype.visitUseElement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#useFileType.
KELParserVisitor.prototype.visitUseFileType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#useClause.
KELParserVisitor.prototype.visitUseClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#useClauseElement.
KELParserVisitor.prototype.visitUseClauseElement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#useClauseFileType.
KELParserVisitor.prototype.visitUseClauseFileType = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#nestedEntityMapping.
KELParserVisitor.prototype.visitNestedEntityMapping = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#entityMapping.
KELParserVisitor.prototype.visitEntityMapping = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#normalMappingOverride.
KELParserVisitor.prototype.visitNormalMappingOverride = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#constantMappingOverride.
KELParserVisitor.prototype.visitConstantMappingOverride = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#dotId.
KELParserVisitor.prototype.visitDotId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#permitsClause.
KELParserVisitor.prototype.visitPermitsClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#variablePermits.
KELParserVisitor.prototype.visitVariablePermits = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#constantPermits.
KELParserVisitor.prototype.visitConstantPermits = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#hintsClause.
KELParserVisitor.prototype.visitHintsClause = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#logicPropertyStatement.
KELParserVisitor.prototype.visitLogicPropertyStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#constantDeclStatement.
KELParserVisitor.prototype.visitConstantDeclStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#entityGeneratorStatement.
KELParserVisitor.prototype.visitEntityGeneratorStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#logicPredicate.
KELParserVisitor.prototype.visitLogicPredicate = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#logicProductions.
KELParserVisitor.prototype.visitLogicProductions = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#logicProduction.
KELParserVisitor.prototype.visitLogicProduction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#entityProductions.
KELParserVisitor.prototype.visitEntityProductions = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#entityProduction.
KELParserVisitor.prototype.visitEntityProduction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#functionStatement.
KELParserVisitor.prototype.visitFunctionStatement = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#fparams.
KELParserVisitor.prototype.visitFparams = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#fparam.
KELParserVisitor.prototype.visitFparam = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#functionBody.
KELParserVisitor.prototype.visitFunctionBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#queryDeclaration.
KELParserVisitor.prototype.visitQueryDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#qparams.
KELParserVisitor.prototype.visitQparams = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#qparam.
KELParserVisitor.prototype.visitQparam = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#paramTypeId.
KELParserVisitor.prototype.visitParamTypeId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#simpleTypeId.
KELParserVisitor.prototype.visitSimpleTypeId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#asof.
KELParserVisitor.prototype.visitAsof = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#using.
KELParserVisitor.prototype.visitUsing = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#shellDeclaration.
KELParserVisitor.prototype.visitShellDeclaration = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#visual_section.
KELParserVisitor.prototype.visitVisual_section = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#resource_section.
KELParserVisitor.prototype.visitResource_section = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#expression.
KELParserVisitor.prototype.visitExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#booleanDisjunction.
KELParserVisitor.prototype.visitBooleanDisjunction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#booleanConjunction.
KELParserVisitor.prototype.visitBooleanConjunction = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#booleanTerm.
KELParserVisitor.prototype.visitBooleanTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#booleanAtom.
KELParserVisitor.prototype.visitBooleanAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#valueExpression.
KELParserVisitor.prototype.visitValueExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#valueTerm.
KELParserVisitor.prototype.visitValueTerm = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#unaryValueFactor.
KELParserVisitor.prototype.visitUnaryValueFactor = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#propValueFactor.
KELParserVisitor.prototype.visitPropValueFactor = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#scopedValueFactor.
KELParserVisitor.prototype.visitScopedValueFactor = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#constValueFactor.
KELParserVisitor.prototype.visitConstValueFactor = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#nestedValueFactor.
KELParserVisitor.prototype.visitNestedValueFactor = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#setValueFactor.
KELParserVisitor.prototype.visitSetValueFactor = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#queryOpValueAtom.
KELParserVisitor.prototype.visitQueryOpValueAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#projValueAtom.
KELParserVisitor.prototype.visitProjValueAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#patternModelAtom.
KELParserVisitor.prototype.visitPatternModelAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#idValueAtom.
KELParserVisitor.prototype.visitIdValueAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#autoMatchValueAtom.
KELParserVisitor.prototype.visitAutoMatchValueAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#linkAtom.
KELParserVisitor.prototype.visitLinkAtom = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#queryFuncOp.
KELParserVisitor.prototype.visitQueryFuncOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#funcOrFilter.
KELParserVisitor.prototype.visitFuncOrFilter = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#pair.
KELParserVisitor.prototype.visitPair = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#linkExp.
KELParserVisitor.prototype.visitLinkExp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#linkSpec.
KELParserVisitor.prototype.visitLinkSpec = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#linkDegree.
KELParserVisitor.prototype.visitLinkDegree = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#entityProjection.
KELParserVisitor.prototype.visitEntityProjection = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#namedExpression.
KELParserVisitor.prototype.visitNamedExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#patternModel.
KELParserVisitor.prototype.visitPatternModel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#singleValuedPatternSubmodel.
KELParserVisitor.prototype.visitSingleValuedPatternSubmodel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#multiValuedPatternSubmodel.
KELParserVisitor.prototype.visitMultiValuedPatternSubmodel = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#fieldSelector.
KELParserVisitor.prototype.visitFieldSelector = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#selfScopeExpression.
KELParserVisitor.prototype.visitSelfScopeExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#outerScopeExpression.
KELParserVisitor.prototype.visitOuterScopeExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#explicitScopeExpression.
KELParserVisitor.prototype.visitExplicitScopeExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#tableProperty.
KELParserVisitor.prototype.visitTableProperty = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#func_id.
KELParserVisitor.prototype.visitFunc_id = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#qualifiedId.
KELParserVisitor.prototype.visitQualifiedId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#leadingId.
KELParserVisitor.prototype.visitLeadingId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#fieldId.
KELParserVisitor.prototype.visitFieldId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#tablePropId.
KELParserVisitor.prototype.visitTablePropId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#propertyId.
KELParserVisitor.prototype.visitPropertyId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#nonSetConstant.
KELParserVisitor.prototype.visitNonSetConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#emptySetConstant.
KELParserVisitor.prototype.visitEmptySetConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#stringConstant.
KELParserVisitor.prototype.visitStringConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#generalRealConstant.
KELParserVisitor.prototype.visitGeneralRealConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#trueConstant.
KELParserVisitor.prototype.visitTrueConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#falseConstant.
KELParserVisitor.prototype.visitFalseConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#typedConstant.
KELParserVisitor.prototype.visitTypedConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#generalIntConstant.
KELParserVisitor.prototype.visitGeneralIntConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#decIntConstant.
KELParserVisitor.prototype.visitDecIntConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#negIntConstant.
KELParserVisitor.prototype.visitNegIntConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#hexConstant.
KELParserVisitor.prototype.visitHexConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#binConstant.
KELParserVisitor.prototype.visitBinConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#badHexConstant.
KELParserVisitor.prototype.visitBadHexConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#badBinConstant.
KELParserVisitor.prototype.visitBadBinConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#noFlagHexConstant.
KELParserVisitor.prototype.visitNoFlagHexConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#badMixConstant.
KELParserVisitor.prototype.visitBadMixConstant = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#realConst.
KELParserVisitor.prototype.visitRealConst = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#badRealConst.
KELParserVisitor.prototype.visitBadRealConst = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#eclExpression.
KELParserVisitor.prototype.visitEclExpression = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#eclBody.
KELParserVisitor.prototype.visitEclBody = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#eclFragment.
KELParserVisitor.prototype.visitEclFragment = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#eclImportList.
KELParserVisitor.prototype.visitEclImportList = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#eclImportItem.
KELParserVisitor.prototype.visitEclImportItem = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by KELParser#returnTypeId.
KELParserVisitor.prototype.visitReturnTypeId = function(ctx) {
  return this.visitChildren(ctx);
};



exports.KELParserVisitor = KELParserVisitor;
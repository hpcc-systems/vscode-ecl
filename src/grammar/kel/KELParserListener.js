// Generated from ./KELParser.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by KELParser.
function KELParserListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

KELParserListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
KELParserListener.prototype.constructor = KELParserListener;

// Enter a parse tree produced by KELParser#program.
KELParserListener.prototype.enterProgram = function(ctx) {
};

// Exit a parse tree produced by KELParser#program.
KELParserListener.prototype.exitProgram = function(ctx) {
};


// Enter a parse tree produced by KELParser#annotation.
KELParserListener.prototype.enterAnnotation = function(ctx) {
};

// Exit a parse tree produced by KELParser#annotation.
KELParserListener.prototype.exitAnnotation = function(ctx) {
};


// Enter a parse tree produced by KELParser#statement.
KELParserListener.prototype.enterStatement = function(ctx) {
};

// Exit a parse tree produced by KELParser#statement.
KELParserListener.prototype.exitStatement = function(ctx) {
};


// Enter a parse tree produced by KELParser#optionBool.
KELParserListener.prototype.enterOptionBool = function(ctx) {
};

// Exit a parse tree produced by KELParser#optionBool.
KELParserListener.prototype.exitOptionBool = function(ctx) {
};


// Enter a parse tree produced by KELParser#optionStr.
KELParserListener.prototype.enterOptionStr = function(ctx) {
};

// Exit a parse tree produced by KELParser#optionStr.
KELParserListener.prototype.exitOptionStr = function(ctx) {
};


// Enter a parse tree produced by KELParser#optionInt.
KELParserListener.prototype.enterOptionInt = function(ctx) {
};

// Exit a parse tree produced by KELParser#optionInt.
KELParserListener.prototype.exitOptionInt = function(ctx) {
};


// Enter a parse tree produced by KELParser#eraDeclaration.
KELParserListener.prototype.enterEraDeclaration = function(ctx) {
};

// Exit a parse tree produced by KELParser#eraDeclaration.
KELParserListener.prototype.exitEraDeclaration = function(ctx) {
};


// Enter a parse tree produced by KELParser#epoch.
KELParserListener.prototype.enterEpoch = function(ctx) {
};

// Exit a parse tree produced by KELParser#epoch.
KELParserListener.prototype.exitEpoch = function(ctx) {
};


// Enter a parse tree produced by KELParser#permitsDeclaration.
KELParserListener.prototype.enterPermitsDeclaration = function(ctx) {
};

// Exit a parse tree produced by KELParser#permitsDeclaration.
KELParserListener.prototype.exitPermitsDeclaration = function(ctx) {
};


// Enter a parse tree produced by KELParser#permit.
KELParserListener.prototype.enterPermit = function(ctx) {
};

// Exit a parse tree produced by KELParser#permit.
KELParserListener.prototype.exitPermit = function(ctx) {
};


// Enter a parse tree produced by KELParser#simpleImport.
KELParserListener.prototype.enterSimpleImport = function(ctx) {
};

// Exit a parse tree produced by KELParser#simpleImport.
KELParserListener.prototype.exitSimpleImport = function(ctx) {
};


// Enter a parse tree produced by KELParser#packageImport.
KELParserListener.prototype.enterPackageImport = function(ctx) {
};

// Exit a parse tree produced by KELParser#packageImport.
KELParserListener.prototype.exitPackageImport = function(ctx) {
};


// Enter a parse tree produced by KELParser#inlinePackage.
KELParserListener.prototype.enterInlinePackage = function(ctx) {
};

// Exit a parse tree produced by KELParser#inlinePackage.
KELParserListener.prototype.exitInlinePackage = function(ctx) {
};


// Enter a parse tree produced by KELParser#outoflinePackage.
KELParserListener.prototype.enterOutoflinePackage = function(ctx) {
};

// Exit a parse tree produced by KELParser#outoflinePackage.
KELParserListener.prototype.exitOutoflinePackage = function(ctx) {
};


// Enter a parse tree produced by KELParser#packageDeclaration.
KELParserListener.prototype.enterPackageDeclaration = function(ctx) {
};

// Exit a parse tree produced by KELParser#packageDeclaration.
KELParserListener.prototype.exitPackageDeclaration = function(ctx) {
};


// Enter a parse tree produced by KELParser#packageStatement.
KELParserListener.prototype.enterPackageStatement = function(ctx) {
};

// Exit a parse tree produced by KELParser#packageStatement.
KELParserListener.prototype.exitPackageStatement = function(ctx) {
};


// Enter a parse tree produced by KELParser#packageExportDeclaration.
KELParserListener.prototype.enterPackageExportDeclaration = function(ctx) {
};

// Exit a parse tree produced by KELParser#packageExportDeclaration.
KELParserListener.prototype.exitPackageExportDeclaration = function(ctx) {
};


// Enter a parse tree produced by KELParser#entityDeclaration.
KELParserListener.prototype.enterEntityDeclaration = function(ctx) {
};

// Exit a parse tree produced by KELParser#entityDeclaration.
KELParserListener.prototype.exitEntityDeclaration = function(ctx) {
};


// Enter a parse tree produced by KELParser#entityProperty.
KELParserListener.prototype.enterEntityProperty = function(ctx) {
};

// Exit a parse tree produced by KELParser#entityProperty.
KELParserListener.prototype.exitEntityProperty = function(ctx) {
};


// Enter a parse tree produced by KELParser#fieldMapping.
KELParserListener.prototype.enterFieldMapping = function(ctx) {
};

// Exit a parse tree produced by KELParser#fieldMapping.
KELParserListener.prototype.exitFieldMapping = function(ctx) {
};


// Enter a parse tree produced by KELParser#fileType.
KELParserListener.prototype.enterFileType = function(ctx) {
};

// Exit a parse tree produced by KELParser#fileType.
KELParserListener.prototype.exitFileType = function(ctx) {
};


// Enter a parse tree produced by KELParser#mappingElement.
KELParserListener.prototype.enterMappingElement = function(ctx) {
};

// Exit a parse tree produced by KELParser#mappingElement.
KELParserListener.prototype.exitMappingElement = function(ctx) {
};


// Enter a parse tree produced by KELParser#nullSpec.
KELParserListener.prototype.enterNullSpec = function(ctx) {
};

// Exit a parse tree produced by KELParser#nullSpec.
KELParserListener.prototype.exitNullSpec = function(ctx) {
};


// Enter a parse tree produced by KELParser#formatSpec.
KELParserListener.prototype.enterFormatSpec = function(ctx) {
};

// Exit a parse tree produced by KELParser#formatSpec.
KELParserListener.prototype.exitFormatSpec = function(ctx) {
};


// Enter a parse tree produced by KELParser#compositeIdSpec.
KELParserListener.prototype.enterCompositeIdSpec = function(ctx) {
};

// Exit a parse tree produced by KELParser#compositeIdSpec.
KELParserListener.prototype.exitCompositeIdSpec = function(ctx) {
};


// Enter a parse tree produced by KELParser#complexModel.
KELParserListener.prototype.enterComplexModel = function(ctx) {
};

// Exit a parse tree produced by KELParser#complexModel.
KELParserListener.prototype.exitComplexModel = function(ctx) {
};


// Enter a parse tree produced by KELParser#singleRowModel.
KELParserListener.prototype.enterSingleRowModel = function(ctx) {
};

// Exit a parse tree produced by KELParser#singleRowModel.
KELParserListener.prototype.exitSingleRowModel = function(ctx) {
};


// Enter a parse tree produced by KELParser#singleValueSubModel.
KELParserListener.prototype.enterSingleValueSubModel = function(ctx) {
};

// Exit a parse tree produced by KELParser#singleValueSubModel.
KELParserListener.prototype.exitSingleValueSubModel = function(ctx) {
};


// Enter a parse tree produced by KELParser#remainderSubModel.
KELParserListener.prototype.enterRemainderSubModel = function(ctx) {
};

// Exit a parse tree produced by KELParser#remainderSubModel.
KELParserListener.prototype.exitRemainderSubModel = function(ctx) {
};


// Enter a parse tree produced by KELParser#explicitSubModel.
KELParserListener.prototype.enterExplicitSubModel = function(ctx) {
};

// Exit a parse tree produced by KELParser#explicitSubModel.
KELParserListener.prototype.exitExplicitSubModel = function(ctx) {
};


// Enter a parse tree produced by KELParser#submodelId.
KELParserListener.prototype.enterSubmodelId = function(ctx) {
};

// Exit a parse tree produced by KELParser#submodelId.
KELParserListener.prototype.exitSubmodelId = function(ctx) {
};


// Enter a parse tree produced by KELParser#useDeclaration.
KELParserListener.prototype.enterUseDeclaration = function(ctx) {
};

// Exit a parse tree produced by KELParser#useDeclaration.
KELParserListener.prototype.exitUseDeclaration = function(ctx) {
};


// Enter a parse tree produced by KELParser#useKelBaseDeclaration.
KELParserListener.prototype.enterUseKelBaseDeclaration = function(ctx) {
};

// Exit a parse tree produced by KELParser#useKelBaseDeclaration.
KELParserListener.prototype.exitUseKelBaseDeclaration = function(ctx) {
};


// Enter a parse tree produced by KELParser#useKelQueryDeclaration.
KELParserListener.prototype.enterUseKelQueryDeclaration = function(ctx) {
};

// Exit a parse tree produced by KELParser#useKelQueryDeclaration.
KELParserListener.prototype.exitUseKelQueryDeclaration = function(ctx) {
};


// Enter a parse tree produced by KELParser#useElement.
KELParserListener.prototype.enterUseElement = function(ctx) {
};

// Exit a parse tree produced by KELParser#useElement.
KELParserListener.prototype.exitUseElement = function(ctx) {
};


// Enter a parse tree produced by KELParser#useFileType.
KELParserListener.prototype.enterUseFileType = function(ctx) {
};

// Exit a parse tree produced by KELParser#useFileType.
KELParserListener.prototype.exitUseFileType = function(ctx) {
};


// Enter a parse tree produced by KELParser#useClause.
KELParserListener.prototype.enterUseClause = function(ctx) {
};

// Exit a parse tree produced by KELParser#useClause.
KELParserListener.prototype.exitUseClause = function(ctx) {
};


// Enter a parse tree produced by KELParser#useClauseElement.
KELParserListener.prototype.enterUseClauseElement = function(ctx) {
};

// Exit a parse tree produced by KELParser#useClauseElement.
KELParserListener.prototype.exitUseClauseElement = function(ctx) {
};


// Enter a parse tree produced by KELParser#useClauseFileType.
KELParserListener.prototype.enterUseClauseFileType = function(ctx) {
};

// Exit a parse tree produced by KELParser#useClauseFileType.
KELParserListener.prototype.exitUseClauseFileType = function(ctx) {
};


// Enter a parse tree produced by KELParser#nestedEntityMapping.
KELParserListener.prototype.enterNestedEntityMapping = function(ctx) {
};

// Exit a parse tree produced by KELParser#nestedEntityMapping.
KELParserListener.prototype.exitNestedEntityMapping = function(ctx) {
};


// Enter a parse tree produced by KELParser#entityMapping.
KELParserListener.prototype.enterEntityMapping = function(ctx) {
};

// Exit a parse tree produced by KELParser#entityMapping.
KELParserListener.prototype.exitEntityMapping = function(ctx) {
};


// Enter a parse tree produced by KELParser#normalMappingOverride.
KELParserListener.prototype.enterNormalMappingOverride = function(ctx) {
};

// Exit a parse tree produced by KELParser#normalMappingOverride.
KELParserListener.prototype.exitNormalMappingOverride = function(ctx) {
};


// Enter a parse tree produced by KELParser#constantMappingOverride.
KELParserListener.prototype.enterConstantMappingOverride = function(ctx) {
};

// Exit a parse tree produced by KELParser#constantMappingOverride.
KELParserListener.prototype.exitConstantMappingOverride = function(ctx) {
};


// Enter a parse tree produced by KELParser#dotId.
KELParserListener.prototype.enterDotId = function(ctx) {
};

// Exit a parse tree produced by KELParser#dotId.
KELParserListener.prototype.exitDotId = function(ctx) {
};


// Enter a parse tree produced by KELParser#permitsClause.
KELParserListener.prototype.enterPermitsClause = function(ctx) {
};

// Exit a parse tree produced by KELParser#permitsClause.
KELParserListener.prototype.exitPermitsClause = function(ctx) {
};


// Enter a parse tree produced by KELParser#variablePermits.
KELParserListener.prototype.enterVariablePermits = function(ctx) {
};

// Exit a parse tree produced by KELParser#variablePermits.
KELParserListener.prototype.exitVariablePermits = function(ctx) {
};


// Enter a parse tree produced by KELParser#constantPermits.
KELParserListener.prototype.enterConstantPermits = function(ctx) {
};

// Exit a parse tree produced by KELParser#constantPermits.
KELParserListener.prototype.exitConstantPermits = function(ctx) {
};


// Enter a parse tree produced by KELParser#hintsClause.
KELParserListener.prototype.enterHintsClause = function(ctx) {
};

// Exit a parse tree produced by KELParser#hintsClause.
KELParserListener.prototype.exitHintsClause = function(ctx) {
};


// Enter a parse tree produced by KELParser#logicPropertyStatement.
KELParserListener.prototype.enterLogicPropertyStatement = function(ctx) {
};

// Exit a parse tree produced by KELParser#logicPropertyStatement.
KELParserListener.prototype.exitLogicPropertyStatement = function(ctx) {
};


// Enter a parse tree produced by KELParser#constantDeclStatement.
KELParserListener.prototype.enterConstantDeclStatement = function(ctx) {
};

// Exit a parse tree produced by KELParser#constantDeclStatement.
KELParserListener.prototype.exitConstantDeclStatement = function(ctx) {
};


// Enter a parse tree produced by KELParser#entityGeneratorStatement.
KELParserListener.prototype.enterEntityGeneratorStatement = function(ctx) {
};

// Exit a parse tree produced by KELParser#entityGeneratorStatement.
KELParserListener.prototype.exitEntityGeneratorStatement = function(ctx) {
};


// Enter a parse tree produced by KELParser#logicPredicate.
KELParserListener.prototype.enterLogicPredicate = function(ctx) {
};

// Exit a parse tree produced by KELParser#logicPredicate.
KELParserListener.prototype.exitLogicPredicate = function(ctx) {
};


// Enter a parse tree produced by KELParser#logicProductions.
KELParserListener.prototype.enterLogicProductions = function(ctx) {
};

// Exit a parse tree produced by KELParser#logicProductions.
KELParserListener.prototype.exitLogicProductions = function(ctx) {
};


// Enter a parse tree produced by KELParser#logicProduction.
KELParserListener.prototype.enterLogicProduction = function(ctx) {
};

// Exit a parse tree produced by KELParser#logicProduction.
KELParserListener.prototype.exitLogicProduction = function(ctx) {
};


// Enter a parse tree produced by KELParser#entityProductions.
KELParserListener.prototype.enterEntityProductions = function(ctx) {
};

// Exit a parse tree produced by KELParser#entityProductions.
KELParserListener.prototype.exitEntityProductions = function(ctx) {
};


// Enter a parse tree produced by KELParser#entityProduction.
KELParserListener.prototype.enterEntityProduction = function(ctx) {
};

// Exit a parse tree produced by KELParser#entityProduction.
KELParserListener.prototype.exitEntityProduction = function(ctx) {
};


// Enter a parse tree produced by KELParser#functionStatement.
KELParserListener.prototype.enterFunctionStatement = function(ctx) {
};

// Exit a parse tree produced by KELParser#functionStatement.
KELParserListener.prototype.exitFunctionStatement = function(ctx) {
};


// Enter a parse tree produced by KELParser#fparams.
KELParserListener.prototype.enterFparams = function(ctx) {
};

// Exit a parse tree produced by KELParser#fparams.
KELParserListener.prototype.exitFparams = function(ctx) {
};


// Enter a parse tree produced by KELParser#fparam.
KELParserListener.prototype.enterFparam = function(ctx) {
};

// Exit a parse tree produced by KELParser#fparam.
KELParserListener.prototype.exitFparam = function(ctx) {
};


// Enter a parse tree produced by KELParser#functionBody.
KELParserListener.prototype.enterFunctionBody = function(ctx) {
};

// Exit a parse tree produced by KELParser#functionBody.
KELParserListener.prototype.exitFunctionBody = function(ctx) {
};


// Enter a parse tree produced by KELParser#queryDeclaration.
KELParserListener.prototype.enterQueryDeclaration = function(ctx) {
};

// Exit a parse tree produced by KELParser#queryDeclaration.
KELParserListener.prototype.exitQueryDeclaration = function(ctx) {
};


// Enter a parse tree produced by KELParser#qparams.
KELParserListener.prototype.enterQparams = function(ctx) {
};

// Exit a parse tree produced by KELParser#qparams.
KELParserListener.prototype.exitQparams = function(ctx) {
};


// Enter a parse tree produced by KELParser#qparam.
KELParserListener.prototype.enterQparam = function(ctx) {
};

// Exit a parse tree produced by KELParser#qparam.
KELParserListener.prototype.exitQparam = function(ctx) {
};


// Enter a parse tree produced by KELParser#paramTypeId.
KELParserListener.prototype.enterParamTypeId = function(ctx) {
};

// Exit a parse tree produced by KELParser#paramTypeId.
KELParserListener.prototype.exitParamTypeId = function(ctx) {
};


// Enter a parse tree produced by KELParser#simpleTypeId.
KELParserListener.prototype.enterSimpleTypeId = function(ctx) {
};

// Exit a parse tree produced by KELParser#simpleTypeId.
KELParserListener.prototype.exitSimpleTypeId = function(ctx) {
};


// Enter a parse tree produced by KELParser#asof.
KELParserListener.prototype.enterAsof = function(ctx) {
};

// Exit a parse tree produced by KELParser#asof.
KELParserListener.prototype.exitAsof = function(ctx) {
};


// Enter a parse tree produced by KELParser#using.
KELParserListener.prototype.enterUsing = function(ctx) {
};

// Exit a parse tree produced by KELParser#using.
KELParserListener.prototype.exitUsing = function(ctx) {
};


// Enter a parse tree produced by KELParser#shellDeclaration.
KELParserListener.prototype.enterShellDeclaration = function(ctx) {
};

// Exit a parse tree produced by KELParser#shellDeclaration.
KELParserListener.prototype.exitShellDeclaration = function(ctx) {
};


// Enter a parse tree produced by KELParser#visual_section.
KELParserListener.prototype.enterVisual_section = function(ctx) {
};

// Exit a parse tree produced by KELParser#visual_section.
KELParserListener.prototype.exitVisual_section = function(ctx) {
};


// Enter a parse tree produced by KELParser#resource_section.
KELParserListener.prototype.enterResource_section = function(ctx) {
};

// Exit a parse tree produced by KELParser#resource_section.
KELParserListener.prototype.exitResource_section = function(ctx) {
};


// Enter a parse tree produced by KELParser#expression.
KELParserListener.prototype.enterExpression = function(ctx) {
};

// Exit a parse tree produced by KELParser#expression.
KELParserListener.prototype.exitExpression = function(ctx) {
};


// Enter a parse tree produced by KELParser#booleanDisjunction.
KELParserListener.prototype.enterBooleanDisjunction = function(ctx) {
};

// Exit a parse tree produced by KELParser#booleanDisjunction.
KELParserListener.prototype.exitBooleanDisjunction = function(ctx) {
};


// Enter a parse tree produced by KELParser#booleanConjunction.
KELParserListener.prototype.enterBooleanConjunction = function(ctx) {
};

// Exit a parse tree produced by KELParser#booleanConjunction.
KELParserListener.prototype.exitBooleanConjunction = function(ctx) {
};


// Enter a parse tree produced by KELParser#booleanTerm.
KELParserListener.prototype.enterBooleanTerm = function(ctx) {
};

// Exit a parse tree produced by KELParser#booleanTerm.
KELParserListener.prototype.exitBooleanTerm = function(ctx) {
};


// Enter a parse tree produced by KELParser#booleanAtom.
KELParserListener.prototype.enterBooleanAtom = function(ctx) {
};

// Exit a parse tree produced by KELParser#booleanAtom.
KELParserListener.prototype.exitBooleanAtom = function(ctx) {
};


// Enter a parse tree produced by KELParser#valueExpression.
KELParserListener.prototype.enterValueExpression = function(ctx) {
};

// Exit a parse tree produced by KELParser#valueExpression.
KELParserListener.prototype.exitValueExpression = function(ctx) {
};


// Enter a parse tree produced by KELParser#valueTerm.
KELParserListener.prototype.enterValueTerm = function(ctx) {
};

// Exit a parse tree produced by KELParser#valueTerm.
KELParserListener.prototype.exitValueTerm = function(ctx) {
};


// Enter a parse tree produced by KELParser#unaryValueFactor.
KELParserListener.prototype.enterUnaryValueFactor = function(ctx) {
};

// Exit a parse tree produced by KELParser#unaryValueFactor.
KELParserListener.prototype.exitUnaryValueFactor = function(ctx) {
};


// Enter a parse tree produced by KELParser#propValueFactor.
KELParserListener.prototype.enterPropValueFactor = function(ctx) {
};

// Exit a parse tree produced by KELParser#propValueFactor.
KELParserListener.prototype.exitPropValueFactor = function(ctx) {
};


// Enter a parse tree produced by KELParser#scopedValueFactor.
KELParserListener.prototype.enterScopedValueFactor = function(ctx) {
};

// Exit a parse tree produced by KELParser#scopedValueFactor.
KELParserListener.prototype.exitScopedValueFactor = function(ctx) {
};


// Enter a parse tree produced by KELParser#constValueFactor.
KELParserListener.prototype.enterConstValueFactor = function(ctx) {
};

// Exit a parse tree produced by KELParser#constValueFactor.
KELParserListener.prototype.exitConstValueFactor = function(ctx) {
};


// Enter a parse tree produced by KELParser#nestedValueFactor.
KELParserListener.prototype.enterNestedValueFactor = function(ctx) {
};

// Exit a parse tree produced by KELParser#nestedValueFactor.
KELParserListener.prototype.exitNestedValueFactor = function(ctx) {
};


// Enter a parse tree produced by KELParser#setValueFactor.
KELParserListener.prototype.enterSetValueFactor = function(ctx) {
};

// Exit a parse tree produced by KELParser#setValueFactor.
KELParserListener.prototype.exitSetValueFactor = function(ctx) {
};


// Enter a parse tree produced by KELParser#queryOpValueAtom.
KELParserListener.prototype.enterQueryOpValueAtom = function(ctx) {
};

// Exit a parse tree produced by KELParser#queryOpValueAtom.
KELParserListener.prototype.exitQueryOpValueAtom = function(ctx) {
};


// Enter a parse tree produced by KELParser#projValueAtom.
KELParserListener.prototype.enterProjValueAtom = function(ctx) {
};

// Exit a parse tree produced by KELParser#projValueAtom.
KELParserListener.prototype.exitProjValueAtom = function(ctx) {
};


// Enter a parse tree produced by KELParser#patternModelAtom.
KELParserListener.prototype.enterPatternModelAtom = function(ctx) {
};

// Exit a parse tree produced by KELParser#patternModelAtom.
KELParserListener.prototype.exitPatternModelAtom = function(ctx) {
};


// Enter a parse tree produced by KELParser#idValueAtom.
KELParserListener.prototype.enterIdValueAtom = function(ctx) {
};

// Exit a parse tree produced by KELParser#idValueAtom.
KELParserListener.prototype.exitIdValueAtom = function(ctx) {
};


// Enter a parse tree produced by KELParser#autoMatchValueAtom.
KELParserListener.prototype.enterAutoMatchValueAtom = function(ctx) {
};

// Exit a parse tree produced by KELParser#autoMatchValueAtom.
KELParserListener.prototype.exitAutoMatchValueAtom = function(ctx) {
};


// Enter a parse tree produced by KELParser#linkAtom.
KELParserListener.prototype.enterLinkAtom = function(ctx) {
};

// Exit a parse tree produced by KELParser#linkAtom.
KELParserListener.prototype.exitLinkAtom = function(ctx) {
};


// Enter a parse tree produced by KELParser#queryFuncOp.
KELParserListener.prototype.enterQueryFuncOp = function(ctx) {
};

// Exit a parse tree produced by KELParser#queryFuncOp.
KELParserListener.prototype.exitQueryFuncOp = function(ctx) {
};


// Enter a parse tree produced by KELParser#funcOrFilter.
KELParserListener.prototype.enterFuncOrFilter = function(ctx) {
};

// Exit a parse tree produced by KELParser#funcOrFilter.
KELParserListener.prototype.exitFuncOrFilter = function(ctx) {
};


// Enter a parse tree produced by KELParser#pair.
KELParserListener.prototype.enterPair = function(ctx) {
};

// Exit a parse tree produced by KELParser#pair.
KELParserListener.prototype.exitPair = function(ctx) {
};


// Enter a parse tree produced by KELParser#linkExp.
KELParserListener.prototype.enterLinkExp = function(ctx) {
};

// Exit a parse tree produced by KELParser#linkExp.
KELParserListener.prototype.exitLinkExp = function(ctx) {
};


// Enter a parse tree produced by KELParser#linkSpec.
KELParserListener.prototype.enterLinkSpec = function(ctx) {
};

// Exit a parse tree produced by KELParser#linkSpec.
KELParserListener.prototype.exitLinkSpec = function(ctx) {
};


// Enter a parse tree produced by KELParser#linkDegree.
KELParserListener.prototype.enterLinkDegree = function(ctx) {
};

// Exit a parse tree produced by KELParser#linkDegree.
KELParserListener.prototype.exitLinkDegree = function(ctx) {
};


// Enter a parse tree produced by KELParser#entityProjection.
KELParserListener.prototype.enterEntityProjection = function(ctx) {
};

// Exit a parse tree produced by KELParser#entityProjection.
KELParserListener.prototype.exitEntityProjection = function(ctx) {
};


// Enter a parse tree produced by KELParser#namedExpression.
KELParserListener.prototype.enterNamedExpression = function(ctx) {
};

// Exit a parse tree produced by KELParser#namedExpression.
KELParserListener.prototype.exitNamedExpression = function(ctx) {
};


// Enter a parse tree produced by KELParser#patternModel.
KELParserListener.prototype.enterPatternModel = function(ctx) {
};

// Exit a parse tree produced by KELParser#patternModel.
KELParserListener.prototype.exitPatternModel = function(ctx) {
};


// Enter a parse tree produced by KELParser#singleValuedPatternSubmodel.
KELParserListener.prototype.enterSingleValuedPatternSubmodel = function(ctx) {
};

// Exit a parse tree produced by KELParser#singleValuedPatternSubmodel.
KELParserListener.prototype.exitSingleValuedPatternSubmodel = function(ctx) {
};


// Enter a parse tree produced by KELParser#multiValuedPatternSubmodel.
KELParserListener.prototype.enterMultiValuedPatternSubmodel = function(ctx) {
};

// Exit a parse tree produced by KELParser#multiValuedPatternSubmodel.
KELParserListener.prototype.exitMultiValuedPatternSubmodel = function(ctx) {
};


// Enter a parse tree produced by KELParser#fieldSelector.
KELParserListener.prototype.enterFieldSelector = function(ctx) {
};

// Exit a parse tree produced by KELParser#fieldSelector.
KELParserListener.prototype.exitFieldSelector = function(ctx) {
};


// Enter a parse tree produced by KELParser#selfScopeExpression.
KELParserListener.prototype.enterSelfScopeExpression = function(ctx) {
};

// Exit a parse tree produced by KELParser#selfScopeExpression.
KELParserListener.prototype.exitSelfScopeExpression = function(ctx) {
};


// Enter a parse tree produced by KELParser#outerScopeExpression.
KELParserListener.prototype.enterOuterScopeExpression = function(ctx) {
};

// Exit a parse tree produced by KELParser#outerScopeExpression.
KELParserListener.prototype.exitOuterScopeExpression = function(ctx) {
};


// Enter a parse tree produced by KELParser#explicitScopeExpression.
KELParserListener.prototype.enterExplicitScopeExpression = function(ctx) {
};

// Exit a parse tree produced by KELParser#explicitScopeExpression.
KELParserListener.prototype.exitExplicitScopeExpression = function(ctx) {
};


// Enter a parse tree produced by KELParser#tableProperty.
KELParserListener.prototype.enterTableProperty = function(ctx) {
};

// Exit a parse tree produced by KELParser#tableProperty.
KELParserListener.prototype.exitTableProperty = function(ctx) {
};


// Enter a parse tree produced by KELParser#func_id.
KELParserListener.prototype.enterFunc_id = function(ctx) {
};

// Exit a parse tree produced by KELParser#func_id.
KELParserListener.prototype.exitFunc_id = function(ctx) {
};


// Enter a parse tree produced by KELParser#qualifiedId.
KELParserListener.prototype.enterQualifiedId = function(ctx) {
};

// Exit a parse tree produced by KELParser#qualifiedId.
KELParserListener.prototype.exitQualifiedId = function(ctx) {
};


// Enter a parse tree produced by KELParser#leadingId.
KELParserListener.prototype.enterLeadingId = function(ctx) {
};

// Exit a parse tree produced by KELParser#leadingId.
KELParserListener.prototype.exitLeadingId = function(ctx) {
};


// Enter a parse tree produced by KELParser#fieldId.
KELParserListener.prototype.enterFieldId = function(ctx) {
};

// Exit a parse tree produced by KELParser#fieldId.
KELParserListener.prototype.exitFieldId = function(ctx) {
};


// Enter a parse tree produced by KELParser#tablePropId.
KELParserListener.prototype.enterTablePropId = function(ctx) {
};

// Exit a parse tree produced by KELParser#tablePropId.
KELParserListener.prototype.exitTablePropId = function(ctx) {
};


// Enter a parse tree produced by KELParser#propertyId.
KELParserListener.prototype.enterPropertyId = function(ctx) {
};

// Exit a parse tree produced by KELParser#propertyId.
KELParserListener.prototype.exitPropertyId = function(ctx) {
};


// Enter a parse tree produced by KELParser#nonSetConstant.
KELParserListener.prototype.enterNonSetConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#nonSetConstant.
KELParserListener.prototype.exitNonSetConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#emptySetConstant.
KELParserListener.prototype.enterEmptySetConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#emptySetConstant.
KELParserListener.prototype.exitEmptySetConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#stringConstant.
KELParserListener.prototype.enterStringConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#stringConstant.
KELParserListener.prototype.exitStringConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#generalRealConstant.
KELParserListener.prototype.enterGeneralRealConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#generalRealConstant.
KELParserListener.prototype.exitGeneralRealConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#trueConstant.
KELParserListener.prototype.enterTrueConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#trueConstant.
KELParserListener.prototype.exitTrueConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#falseConstant.
KELParserListener.prototype.enterFalseConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#falseConstant.
KELParserListener.prototype.exitFalseConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#typedConstant.
KELParserListener.prototype.enterTypedConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#typedConstant.
KELParserListener.prototype.exitTypedConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#generalIntConstant.
KELParserListener.prototype.enterGeneralIntConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#generalIntConstant.
KELParserListener.prototype.exitGeneralIntConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#decIntConstant.
KELParserListener.prototype.enterDecIntConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#decIntConstant.
KELParserListener.prototype.exitDecIntConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#negIntConstant.
KELParserListener.prototype.enterNegIntConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#negIntConstant.
KELParserListener.prototype.exitNegIntConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#hexConstant.
KELParserListener.prototype.enterHexConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#hexConstant.
KELParserListener.prototype.exitHexConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#binConstant.
KELParserListener.prototype.enterBinConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#binConstant.
KELParserListener.prototype.exitBinConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#badHexConstant.
KELParserListener.prototype.enterBadHexConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#badHexConstant.
KELParserListener.prototype.exitBadHexConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#badBinConstant.
KELParserListener.prototype.enterBadBinConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#badBinConstant.
KELParserListener.prototype.exitBadBinConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#noFlagHexConstant.
KELParserListener.prototype.enterNoFlagHexConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#noFlagHexConstant.
KELParserListener.prototype.exitNoFlagHexConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#badMixConstant.
KELParserListener.prototype.enterBadMixConstant = function(ctx) {
};

// Exit a parse tree produced by KELParser#badMixConstant.
KELParserListener.prototype.exitBadMixConstant = function(ctx) {
};


// Enter a parse tree produced by KELParser#realConst.
KELParserListener.prototype.enterRealConst = function(ctx) {
};

// Exit a parse tree produced by KELParser#realConst.
KELParserListener.prototype.exitRealConst = function(ctx) {
};


// Enter a parse tree produced by KELParser#badRealConst.
KELParserListener.prototype.enterBadRealConst = function(ctx) {
};

// Exit a parse tree produced by KELParser#badRealConst.
KELParserListener.prototype.exitBadRealConst = function(ctx) {
};


// Enter a parse tree produced by KELParser#eclExpression.
KELParserListener.prototype.enterEclExpression = function(ctx) {
};

// Exit a parse tree produced by KELParser#eclExpression.
KELParserListener.prototype.exitEclExpression = function(ctx) {
};


// Enter a parse tree produced by KELParser#eclBody.
KELParserListener.prototype.enterEclBody = function(ctx) {
};

// Exit a parse tree produced by KELParser#eclBody.
KELParserListener.prototype.exitEclBody = function(ctx) {
};


// Enter a parse tree produced by KELParser#eclFragment.
KELParserListener.prototype.enterEclFragment = function(ctx) {
};

// Exit a parse tree produced by KELParser#eclFragment.
KELParserListener.prototype.exitEclFragment = function(ctx) {
};


// Enter a parse tree produced by KELParser#eclImportList.
KELParserListener.prototype.enterEclImportList = function(ctx) {
};

// Exit a parse tree produced by KELParser#eclImportList.
KELParserListener.prototype.exitEclImportList = function(ctx) {
};


// Enter a parse tree produced by KELParser#eclImportItem.
KELParserListener.prototype.enterEclImportItem = function(ctx) {
};

// Exit a parse tree produced by KELParser#eclImportItem.
KELParserListener.prototype.exitEclImportItem = function(ctx) {
};


// Enter a parse tree produced by KELParser#returnTypeId.
KELParserListener.prototype.enterReturnTypeId = function(ctx) {
};

// Exit a parse tree produced by KELParser#returnTypeId.
KELParserListener.prototype.exitReturnTypeId = function(ctx) {
};



exports.KELParserListener = KELParserListener;
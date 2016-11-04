const ATTR_DEFINITION = 'definition';

class GraphItem {
	parent: Subgraph;
	id: string;
	attrs: Map<string, string>;
	constructor(parent: Subgraph, id: string, attrs: Map<string, string>) {
		this.parent = parent;
		this.id = id;
		this.attrs = attrs;
	}

	hasECLDefinition() {
		return this.attrs.has(ATTR_DEFINITION);
	}

	getECLDefinition() {
		let match = /([a-z]:\\(?:[-\w\.\d]+\\)*(?:[-\w\.\d]+)?|(?:\/[\w\.\-]+)+)\((\d*),(\d*)\)/.exec(this.attrs.get(ATTR_DEFINITION));
		if (match) {
			let id = this.id;
			let [_, file, row, _col] = match;
			let line: number = +row;
			let col: number = +_col;
			return { file, line, col, id };
		}
		throw `Bad definition:  ${this.attrs.get(ATTR_DEFINITION)}`;
	}
}

class Subgraph extends GraphItem {
	subgraphs: Array<Subgraph> = [];
	subgraphsMap = new Map<string, Subgraph>();
	vertices: Array<Vertex> = [];
	verticesMap = new Map<string, Vertex>();
	edges: Array<Edge> = [];
	edgesMap = new Map<string, Edge>();

	constructor(parent: Subgraph, id: string, attrs: Map<string, string>) {
		super(parent, id, attrs);
		if (parent) {  //  Only needed for root node
			parent.addSubgraph(this);
		}
	}

	addSubgraph(subgraph: Subgraph) {
		if (this.subgraphsMap.has(subgraph.id)) {
			throw 'Vertex already exists';
		}
		this.subgraphsMap.set(subgraph.id, subgraph);
		this.subgraphs.push(subgraph);
	}

	addVertex(vertex: Vertex) {
		if (this.verticesMap.has(vertex.id)) {
			throw 'Vertex already exists';
		}
		this.verticesMap.set(vertex.id, vertex);
		this.vertices.push(vertex);
	}

	addEdge(edge: Edge) {
		if (this.edgesMap.has(edge.id)) {
			throw 'Edge already exists';
		}
		this.edgesMap.set(edge.id, edge);
		this.edges.push(edge);
	}

	getNearestDefinition(backwards: boolean = true): any {
		if (this.hasECLDefinition()) {
			return this.getECLDefinition();
		}
		if (backwards) {
			for (let i = this.vertices.length - 1; i >= 0; --i) {
				let vertex = this.vertices[i] 
				if (this.vertices[i].hasECLDefinition()) {
					return this.vertices[i].getECLDefinition();
				}
			}
		}
		let retVal;
		this.vertices.some((vertex) => {
			retVal = vertex.getNearestDefinition();
			if (retVal) {
				return true;
			}
			return false;
		});
		return retVal;
	}
}

class Vertex extends GraphItem {
	label: string;
	inEdges: Edge[] = [];
	outEdges: Edge[] = [];

	constructor(parent: Subgraph, id: string, label: string, attrs: Map<string, string>) {
		super(parent, id, attrs);
		this.label = label;
		parent.addVertex(this);
	}

	getNearestDefinition(): any {
		if (this.hasECLDefinition()) {
			return this.getECLDefinition();
		}
		let retVal;
		this.inEdges.some((edge) => {
			retVal = edge.getNearestDefinition();
			if (retVal) {
				return true;
			}
			return false;
		});
		return retVal;
	}
}

export class Graph extends Subgraph {
	allSubgraphs = new Map<string, Subgraph>();
	allVertices = new Map<string, Vertex>();
	allEdges = new Map<string, Edge>();

	constructor() {
		super(null, 'root', new Map<string, string>());
	}

	breakpointLocations(path?) {
		let retVal: any[] = [];
		this.allVertices.forEach((vertex) => {
			if (vertex.hasECLDefinition()) {
				let definition = vertex.getECLDefinition();
				if (definition && !path || path === definition.file) {
					retVal.push(definition);
				}
			}
		});
		return retVal.sort((l, r) => {
			return l.line - r.line;
		});
	}
}

class Edge extends Subgraph {
	sourceID: string;
	source: Vertex;
	targetID: string;
	target: Vertex;

	constructor(parent: Subgraph, id, sourceID, targetID, attrs: Map<string, string>) {
		super(parent, id, attrs);
		this.sourceID = sourceID;
		this.targetID = targetID;
		parent.addEdge(this);
	}

	getNearestDefinition(): any {
		if (this.hasECLDefinition()) {
			return this.getECLDefinition();
		}
		return this.source.getNearestDefinition();
	}
}


function walkXmlJson(node, callback, stack?) {
	stack = stack || [];
	stack.push(node);
	for (let key in node) {
		if (node.hasOwnProperty(key)) {
			let childNode = node[key];
			callback(key, childNode, stack);
			if (childNode instanceof Array) {
				childNode.forEach(child => {
					walkXmlJson(child, callback, stack);
				});
			} else if (typeof childNode === 'object') {
				walkXmlJson(childNode, callback, stack);
			}
		}
	}
	stack.pop();
}

function flattenAtt(atts = []) {
	let retVal = new Map<string, string>();
	atts.forEach(att => {
		if (att.$) {
			retVal.set(att.$.name, att.$.value);
		}
	});
	return retVal;
}

export function createGraph(graphs) {
	let graph = new Graph();
	let stack: Array<Subgraph> = [graph];
	walkXmlJson(graphs, (key, childNode, _stack) => {
		let top = stack[stack.length - 1];
		switch (key) {
			case 'graph':
				break;
			case 'node':
				if (childNode.length) {
					childNode.forEach(node => {
						if (node.att && node.att.length && node.att[0].graph) {
							let subgraph = new Subgraph(top, `graph${node.$.id}`, flattenAtt(node.att));
							graph.allSubgraphs.set(subgraph.id, subgraph);
							stack.push(subgraph);
						} else {
							let vertex = new Vertex(top, node.$.id, node.$.label, flattenAtt(node.att));
							graph.allVertices.set(vertex.id, vertex);
						}
					});
				}
				break;
			case 'edge':
				if (childNode.length) {
					childNode.forEach(node => {
						let edge = new Edge(top, node.$.id, node.$.source, node.$.target, flattenAtt(node.att));
						graph.allEdges.set(edge.id, edge);
					});
				}
				break;
		}
	});
	graph.allEdges.forEach(edge => {
		try {
		edge.source = graph.allVertices.get(edge.sourceID);
		edge.target = graph.allVertices.get(edge.targetID);
		edge.source.outEdges.push(edge);
		edge.source.inEdges.push(edge);
		} catch(e) {}
	});
	return graph;
}
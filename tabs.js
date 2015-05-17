if (global['+'] === undefined) {
	global['+'] = function() {
		var result = arguments[0];
		for (var i = 1; i < arguments.length; i += 1) {
			result += arguments[i];
		}
		return result;
	};
}

if (global['-'] === undefined) {
	global['-'] = function(a, b) {
		var result = arguments[0];
		for (var i = 1; i < arguments.length; i += 1) {
			result -= arguments[i];
		}
		return result;
	};
}

if (global['*'] === undefined) {
	global['*'] = function(a, b) {
		var result = arguments[0];
		for (var i = 1; i < arguments.length; i += 1) {
			result *= arguments[i];
		}
		return result;
	};
}

if (global['/'] === undefined) {
	global['/'] = function(a, b) {
		var result = arguments[0];
		for (var i = 1; i < arguments.length; i += 1) {
			result /= arguments[i];
		}
		return result;
	};
}

if (global['=='] === undefined) {
	global['=='] = function(a, b) {
		var first = arguments[0];
		for (var i = 1; i < arguments.length; i += 1) {
			if (first !== arguments[i]) {
				return false;
			}
		}
		return true;
	};
}

if (global['!='] === undefined) {
	global['!='] = function(a, b) {
		var first = arguments[0];
		for (var i = 1; i < arguments.length; i += 1) {
			if (first === arguments[i]) {
				return false;
			}
		}
		return true;
	};
}

if (global.array === undefined) {
	global.array = function() {
		var array = [];
		for (var i = 0; i < arguments.length; i += 1) {
			array.push(arguments[i]);
		}
		return array;
	};
}

module.exports = function(code) {
	
	var length = code.length;
	var i, j;
	var c, js = '', keyword = '', isString, tree = [], tempTree, nowTabLevel = 0, tabLevel = 0, isNewLine = true;
	
	var addKeywordToTree = function() {
		if (keyword !== '') {
			tree.push(keyword);
			keyword = '';
		}
	};
	
	var analyze = function() {
		
		var i, isIf, js = '';
		
		if (tree.length > 0) {
			
			if (tree[0] === 'if') {
				tree.splice(0, 1);
				js += 'if(';
				isIf = true;
			}
			
			if (tree[0] === 'while') {
				tree.splice(0, 1);
				js += 'while(';
				isIf = true;
			}
			
			if (tree[0] === 'return') {
				tree.splice(0, 1);
				js += 'return ';
			}
			
			if (tree[0] === 'func') {
				tree.splice(0, 1);
				js += 'function ' + tree[0];
			} else if (tree[0] === 'var') {
				tree.splice(0, 1);
				js += 'var ' + tree[0] + '=';
			} else if (tree[0] === '=') {
				tree.splice(0, 1);
				js += tree[0] + '=';
			} else if (tree[0] === '+' || tree[0] === '-' || tree[0] === '*' || tree[0] === '/' || tree[0] === '==' || tree[0] === '!=') {
				js += 'global[\'' + tree[0] + '\']';
			} else {
				js += tree[0];
			}
			
			tree.splice(0, 1);
			
			js += '(';
			for (i = 0; i < tree.length; i += 1) {
				
				if (i > 0) {
					js += ',';
				}
				
				if (tree[i] === 'nil') {
					js += 'undefined';
				} else {
					js += tree[i];
				}
			}
			js += ')';
			
			if (isIf === true) {
				js += ')';
			}
		}
		
		return js;
	};
	
	// 한글자씩 해석
	for (i = 0; i <= length; i += 1) {
		
		c = code[i];
		
		if (isString !== true) {
			
			if (isNewLine === true && c === '\t') {
				
				tabLevel += 1;
				
				if (nowTabLevel < tabLevel) {
					js += '{';
					nowTabLevel = tabLevel;
				}
				
			} else {
				
				if (isNewLine) {
					for (j = 0; j < nowTabLevel - tabLevel; j += 1) {
						js += '}';
					}
					nowTabLevel = tabLevel;
				}
				
				isNewLine = false;
			
				// 한 라인이 만들어진 경우
				if (c === '\n' || i === length) {
					addKeywordToTree();
					
					js += analyze() + '\n';
					
					// 트리 초기화
					tree = [];
					
					isNewLine = true;
					tabLevel = 0;
					
					if (i === length) {
						for (j = 0; j < nowTabLevel; j += 1) {
							js += '}';
						}
					}
				}
				
				else if (c === '(') {
					addKeywordToTree();
					
					tempTree = tree;
					tree = [];
					tree.parent = tempTree;
				}
				
				else if (c === ')') {
					addKeywordToTree();
					
					tempTree = tree.parent;
					tempTree.push(analyze());
					tree = tempTree;
				}
				
				else if (c === ' ') {
					addKeywordToTree();
				}
				
				// 키워드 생성
				else if (c !== '\r') {
					
					keyword += c;
					
					if (c === '\'') {
						isString = true;
					}
				}
			}
		}
		
		else {
			
			keyword += c;
			
			if (c === '\'') {
				isString = false;
			}
		}
	}
	
	return js;
};

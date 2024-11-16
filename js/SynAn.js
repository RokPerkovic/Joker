// Literal node (e.g., numbers)
class Literal {
  constructor(value) {
    this.value = value;
  }
}

// Binary operation node (e.g., +, -, *, /)
class BinaryExpression {
  constructor(operator, left, right) {
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

// Unary operation node (e.g., -x)
class UnaryExpression {
  constructor(operator, operand) {
    this.operator = operator;
    this.operand = operand;
  }
}

function exampleAST (){
	// 1 + 1 + 2
	return new BinaryExpression('+', '1', new BinaryExpression('+', '1', '2'));
}


class SynAn {
	
	#currToken;
	
	constructor(lexAn){
		this.lexAn = lexAn;
	}

	#peek(){
		// get the next token
		this.#currToken = this.lexAn.tokenizeInput();
		//console.log(this.#currToken);
		return this.#currToken;
	}

	#remove(tokenType){
		//  advance the input
		//console.log("to remove:" + tokenType);
		let t = this.#currToken;
		if (tokenType == this.#currToken.type) {
			this.#peek();
		} else {
			//throw Error('Expected ' + tokenType + ', got ' + this.#currToken.type);
			throw Error('Unexpected token ' + '"' + t.value + '" ' + ': ' + t.type + " at: " + this.#currToken.posFrom + '; ' + 'Expected ' + tokenType + ', got ' + t.type); 
		}
		return t;
	}

	/*
		Expr -> T E_ .
		E_ -> '+' T E_ | '-' T E_ | .
		T -> '+' F T_ | '-' F T_ | F T_ .
		T_ -> '*' F T_ | '/' F T_ | .
		F -> '(' Expr ')' | NUMBER .
	*/
	
	parse(){
		let binExpr;
		this.#peek();
		let root = this.#parseExpr();
		this.#remove('EOF');
		
		return root; // AST root node
	}

	// Expr -> T E_ .
	// Term, expression continuation
	#parseExpr(){
		//console.log('parse E');
		
		let left;
		let operator;
		let right;
		switch(this.#currToken.type){
			case "NUMBER":
				//console.log('Expr -> T E_ .');
				left = this.#parseT();
				//console.log(left);
				return this.#parseE_(left);
			case "L_PAREN":
				//console.log('Expr -> T E_ .');
				left = this.#parseT();
				//console.log(left);
				return this.#parseE_(left);
			case 'OP_ADD':
				//this.#remove("OP_ADD");
				left = this.#parseT();
				
				return this.#parseE_(left);
			case 'OP_SUB':
				//this.#remove("OP_SUB");
				left = this.#parseT();
				
				return this.#parseE_(left);
			case 'EOF': 
				//console.log('eof: Expr -> .');
				break;
			default: 
				throw Error('Unexpected token ' + '"' +  this.#currToken.value + '" ' + ': ' + this.#currToken.type + " at: " + this.#currToken.posFrom);				
				break;
		}
		
		return left;
	}

	// T -> F T_ .
	// Term
	#parseT(){
		//console.log('parse T');
		let operand;
		let left;
		let right;
		let operator;
		let unaryExpr;
		switch(this.#currToken.type){
			case "L_PAREN": 
				//console.log('T -> F T_ .');
				left = this.#parseF();
				
				return this.#parseT_(left);
			case "NUMBER":
				//console.log('T -> F T_ .');
				left = this.#parseF();
				
				return this.#parseT_(left);
			case 'OP_ADD':
				this.#remove("OP_ADD");
				operand = this.#parseF();
				unaryExpr = new UnaryExpression("OP_ADD", operand);
				
				return this.#parseT_(unaryExpr); //TODO: handle T_
			case 'OP_SUB':
				this.#remove("OP_SUB");
				operand = this.#parseF();
				unaryExpr = new UnaryExpression("OP_SUB", operand);
				
				return this.#parseT_(unaryExpr); //TODO: handle T_
			default: 
				throw Error('Unexpected token: ' + this.#currToken.type + " at: " + this.#currToken.posFrom); 
				break;
		}
	}
	// Expression continuation
	// E_ -> '+' T E_ | '-' T E_ | .
	// additive
	#parseE_(left){
		//console.log('parse E_');
		let right;
		let binExpr
		switch(this.#currToken.type){
			case "OP_ADD": 
				//console.log('E_ -> + T E_');
				//console.log("E_: OP_ADD");
				this.#remove("OP_ADD");
				right = this.#parseT();
				//console.log("E_ right: ", right);
				binExpr = new BinaryExpression("OP_ADD", left, right);
				
				return this.#parseE_(binExpr);
			case "OP_SUB": 
				//console.log('E_ -> - T E_');
				this.#remove("OP_SUB");
				right = this.#parseT();
				binExpr = new BinaryExpression("OP_SUB", left, right);
				
				return this.#parseE_(binExpr);
			case "R_PAREN": 
				//console.log('E_ -> .');
				break;
			case "EOF": 
				//console.log('eof: E_ -> .');
				break;
			default: 
				throw Error('Unexpected token: ' + this.#currToken.type + " at: " + this.#currToken.posFrom); 
				break;
		}
		
		return left;
	}

	// T_ -> '*' F T_ | '/' F T_ | .
	//multiplicative
	// Term continuation
	#parseT_(left){
		//console.log('parse T_');
		//let left;
		let operator;
		let right;
		let binExpr;
		
		switch(this.#currToken.type){
			case "OP_ADD": 
				//console.log('T_ -> .');
				break;
			case "OP_SUB": 
				//console.log('T_ -> .');
				break;
			case "OP_MUL": 
				//console.log('T_ -> * F T_');
				this.#remove("OP_MUL");
				right = this.#parseF();
				binExpr = new BinaryExpression("OP_MUL", left, right);
				
				return this.#parseT_(binExpr);
			case "OP_DIV": 
				//console.log('T_ -> / F T_');
				this.#remove("OP_DIV");
				right = this.#parseF();
				binExpr = new BinaryExpression("OP_DIV", left, right);
				
				return this.#parseT_(binExpr);
			case 'R_PAREN': 
				//console.log('T_ -> .'); 
				break;
			case 'EOF': 
				//console.log('eof: T_ -> .');
				break;
			default: 
				throw Error('Unexpected token: ' + this.#currToken.type + " at: " + this.#currToken.posFrom); 
				break;
		}
		
		return left;
	}

	// F -> '(' E ')' | NUMBER .
	// primary
	// Factor
	#parseF(){
		let literal;
		let binExpr;
		switch(this.#currToken.type){
			case "L_PAREN": 
				//console.log('F -> ( Expr )');
				this.#remove("L_PAREN");
				binExpr = this.#parseExpr();
				this.#remove("R_PAREN");

				return binExpr;
			case "NUMBER": 
				//console.log('F -> int');
				literal = this.#currToken;
				this.#remove("NUMBER");
				
				return new Literal(literal.value);
			default: 
				throw Error('Unexpected token: ' + this.#currToken.type + " at: " + this.#currToken.posFrom); 
				break;
		}
	}
}
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
		F -> '(' Expr ')' | int .
	*/
	
	parse(){
		this.#peek();
		this.#parseExpr();
		this.#remove('EOF');
	}

	// Expr -> T E_ .
	#parseExpr(){
		//console.log('parse E');
		switch(this.#currToken.type){
			case "NUMBER":
				//console.log('Expr -> T E_ .');
				this.#parseT();
				this.#parseE_();
				break;
			case "L_PAREN":
				//console.log('Expr -> T E_ .');
				this.#parseT();
				this.#parseE_();
				break;
			case 'OP_ADD':
				this.#remove("OP_ADD");
				this.#parseT();
				this.#parseE_();
				break;
			case 'OP_SUB':
				this.#remove("OP_SUB");
				this.#parseT();
				this.#parseE_();
				break;
			case 'EOF': 
				//console.log('eof: Expr -> .');
				break;
			default: 
				throw Error('Unexpected token ' + '"' +  this.#currToken.value + '" ' + ': ' + this.#currToken.type + " at: " + this.#currToken.posFrom);				
				break;
		}
	}

	// T -> F T_ .
	#parseT(){
		//console.log('parse T');
		// dodaj se ostalo... zaenkrat samo const
		switch(this.#currToken.type){
			case "L_PAREN": 
				//console.log('T -> F T_ .');
				this.#parseF();
				this.#parseT_();
				break;
			case "NUMBER":
				//console.log('T -> F T_ .');
				this.#parseF();
				this.#parseT_();
				break;
			case 'OP_ADD':
				this.#remove("OP_ADD");
				this.#parseF();
				this.#parseT_();
				break;
			case 'OP_SUB':
				this.#remove("OP_SUB");
				this.#parseF();
				this.#parseT_();
				break;
			default: 
				throw Error('Unexpected token: ' + this.#currToken.type + " at: " + this.#currToken.posFrom); 
				break;
		}
	}

	// E_ -> '+' T E_ | '-' T E_ | .
	#parseE_(){
		//console.log('parse E_');
		switch(this.#currToken.type){
			case "OP_ADD": 
				//console.log('E_ -> + T E_');
				this.#remove("OP_ADD");
				this.#parseT();
				this.#parseE_();
				break;
			case "OP_SUB": 
				//console.log('E_ -> - T E_');
				this.#remove("OP_SUB");
				this.#parseT();
				this.#parseE_();
				break;
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
	}

	// T_ -> '*' F T_ | '/' F T_ | .
	#parseT_(){
		//console.log('parse T_');
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
				this.#parseF();
				this.#parseT_();
				break;
			case "OP_DIV": 
				//console.log('T_ -> / F T_');
				this.#remove("OP_DIV");
				this.#parseF();
				this.#parseT_();
				break;
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
	}

	// F -> '(' E ')' | int .
	#parseF(){
		switch(this.#currToken.type){
			case "L_PAREN": 
				//console.log('F -> ( Expr )');
				this.#remove("L_PAREN");
				this.#parseExpr();
				this.#remove("R_PAREN");
				//console.log('removed R_PAREN');
				// this.#parseExpr();
				break;
			case "NUMBER": 
				//console.log('F -> int');
				this.#remove("NUMBER");
				break;
			default: 
				throw Error('Unexpected token: ' + this.#currToken.type + " at: " + this.#currToken.posFrom); 
				break;
		}
	}
}
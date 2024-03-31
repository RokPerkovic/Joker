//class tokenizer...
//hrani trenutno pozicijo v input string-undefined
//kreira token-e razlicnih vrst (num, decNum, op, ...)




class Tokenizer {
	
	constructor(input, inputLen, inputPos){
		this.input = input;
		this.inputLen = inputLen;
		this.inputPos = inputPos;
	}
	
	/*makeDecNum(){
		
		
	}*/
	
	makeNum(){
		var startPos = this.inputPos + 1;
		var endPos;
		var s_num = ''
		var decimal = false;
		
		while((this.input[this.inputPos] >= '0' && this.input[this.inputPos] <= '9') || this.input[this.inputPos] === '.'){
			
			if(this.input[this.inputPos] === '.'){
				//decimalna vrednost
				decimal = true;
			}
			
			s_num+=this.input[this.inputPos];
			this.inputPos++;
		}
	
		endPos = this.inputPos;
	
		s_num = parseFloat(s_num);
		
		return {s_value: s_num, s_type: typeof(s_num), n_from: startPos, n_to: endPos}
	}
	
	makeOperator(){
		
		switch(this.input[this.inputPos]){
			case '-': 
				this.inputPos++;
				return {s_value: '-', s_type: 'OP_SUB', n_from: this.inputPos, n_to: this.inputPos}; break;
			case '+': 
				this.inputPos++;
				return {s_value: '+', s_type: 'OP_ADD', n_from: this.inputPos, n_to: this.inputPos}; break;
			case '/': 
				this.inputPos++;
				return {s_value: '/', s_type: 'OP_DIV', n_from: this.inputPos, n_to: this.inputPos}; break;
			case '*': 
				this.inputPos++;
				return {s_value: '*', s_type: 'OP_MUL', n_from: this.inputPos, n_to: this.inputPos}; break;
			default:  
				const unknown_token = this.input[this.inputPos];
				this.inputPos++;
				return {s_value: unknown_token, s_type: 'UNKNOWN_TOKEN', n_from: this.inputPos, n_to: this.inputPos}; break;
		}
		
	}

	tokenizeInput(){
		var token = {};
		for (var i = this.inputPos; i < this.inputLen; i++) {
			if(this.input[i] >= '0' && this.input[i] <= '9'){
				
				token = this.makeNum();
				
				//nadaljuj od tam naprej, kjer je makeNum koncal
				//i = this.inputPos;//- 1;
				//this.inputPos--;
				//console.log(token);
				return token;
					
			}
			else if(this.input[i] === '(' || this.input[i] === ')'){
				this.inputPos++;
				switch(this.input[i]){
					case '(': 
						return {s_value: '(', s_type: 'L_PAREN', n_from: this.inputPos, n_to: this.inputPos}; break;
					case ')':
						return {s_value: ')', s_type: 'R_PAREN', n_from: this.inputPos, n_to: this.inputPos}; break;
				}
			}
			else{
				token = this.makeOperator();
				//console.log(token);
				return token;
			}
			
			//posodobi trenutno pozicijo v input-u
			this.inputPos++;
		}
		return {s_value: 'EOF', s_type: 'EOF', n_from: this.inputPos + 1, n_to: this.inputPos + 1};
	}
}

class Parser {
	#currToken = {};
	constructor(tokenizer/*, input*/){
		this.tokenizer = tokenizer;
		//this.input = input;
	}

	#peek(){
		// get the next token
		this.#currToken = this.tokenizer.tokenizeInput();
		return this.#currToken;
	}

	#remove(tokenType){
		//  advance the input
		console.log("to remove:" + tokenType);
		let t = this.#currToken;
		if (tokenType == this.#currToken.s_type){
			this.#peek();
		}
		else {
			throw Error('Expected ' + tokenType + ', got ' + this.#currToken.s_type);
		}
		return t;

	}

	/*
		- dodaj se prefix...

		E -> T E_ .
		E_ -> '+' T E_ | '-' T E_ | .
		T -> F T_ .
		T_ -> '*' F T_ | '/' F T_ | .
		F -> '(' E ')' | int .
	*/
	parse(){
		this.#peek();
		this.#parseExpr();
		
	}

	#parseExpr(){
		switch(this.#currToken.s_type){
			case "number":
				this.#parseT();
				this.#parseE_();
				break;
			case "L_PAREN":
				this.#parseT();
				this.#parseE_();
				break;
			case "OP_ADD": 
				this.#remove("OP_ADD");
				this.#parseExpr();
				break;
			case 'EOF': break;
			default: throw Error('Unexpected token: ' + this.#currToken.s_type + " at: " + this.#currToken.n_from); break;
		}
	}

	#parseT(){
		// dodaj se ostalo... zaenkrat samo const
		switch(this.#currToken.s_type){
			case "L_PAREN": 
				this.#parseF();
				this.#parseT_();
				break;
			case "number":
				this.#parseF();
				this.#parseT_();
				break;
			default: throw Error('Unexpected token: ' + this.#currToken.s_type + " at: " + this.#currToken.n_from); break;
		}
	}

	#parseE_(){
		switch(this.#currToken.s_type){
			case "OP_ADD": this.#remove("OP_ADD");
			this.#parseT();
			this.#parseE_();
			break;
			case "OP_SUB": this.#remove("OP_SUB");
			this.#parseT();
			this.#parseE_();
			break;
			case "R_PAREN": break;
			case "EOF": break;
			default: throw Error('Unexpected token: ' + this.#currToken.s_type + " at: " + this.#currToken.n_from); break;
		}
	}

	#parseT_(){
		switch(this.#currToken.s_type){
			case "OP_ADD": break;
			case "OP_SUB": break;
			case "OP_MUL": 
				this.#remove("OP_MUL");
				this.#parseF();
				this.#parseT_();
				break;
			case "OP_DIV": 
				this.#remove("OP_DIV");
				this.#parseF();
				this.#parseT_();
				break;
			case 'R_PAREN': break;
			case 'EOF': break;
			default: throw Error('Unexpected token: ' + this.#currToken.s_type + " at: " + this.#currToken.n_from); break;
			
		}
	}

	#parseF(){
		switch(this.#currToken.s_type){
			case "L_PAREN": 
				this.#remove("L_PAREN");
				this.#parseExpr();
				this.#remove("R_PAREN");
				break;
			case "number": 
				this.#remove("number");
				break;
			default: throw Error('Unexpected token: ' + this.#currToken.s_type + " at: " + this.#currToken.n_from); break;
		}
	}
}




/*
-cela stevila: 1, 12, 123, 0, -1, -100203, ...
-decimalna stevila: 10.5, 1.1, 0.5, -12.34, ...
-aritmeticni operatorji: +, -, /, *



*/
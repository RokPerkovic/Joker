class Token {
	
	//value;
	//type;
	//posFrom;
	//posTo;
	
	constructor(value, type, posFrom, posTo){
		this.value = value;
		this.type = type;
		this.posFrom = posFrom;
		this.posTo = posTo;	
	}
}



class LexAn {
	#input;
	#inputLen;
	#inputPos;
	
	constructor(input){
		this.#input = input;
		this.#inputLen = input.length;
		this.#inputPos = 0;
	}
	
	makeNumber(){
		let posFrom = this.#inputPos + 1;
		let posTo;
		let value = ''
		let type;
		
		while((this.#input[this.#inputPos] >= '0' && this.#input[this.#inputPos] <= '9') || (this.#input[this.#inputPos] === '.')){
			
			value+=this.#input[this.#inputPos];
			this.#inputPos++;
		}
		
		return new Token(value, 'NUMBER', posFrom, this.#inputPos);
	}
	
	makeOperator(){
		
		switch(this.#input[this.#inputPos]){
			case '-': 
				this.#inputPos++;
				return new Token('-', 'OP_SUB', this.#inputPos, this.#inputPos); break;
			case '+':                                                
				this.#inputPos++;                                     
				return new Token('+', 'OP_ADD', this.#inputPos, this.#inputPos); break;
			case '/':                                                
				this.#inputPos++;                                     
				return new Token('/', 'OP_DIV', this.#inputPos, this.#inputPos); break;
			case '*':                                                
				this.#inputPos++;                                     
				return new Token('*', 'OP_MUL', this.#inputPos, this.#inputPos); break;
			default:  
				const unknownToken = this.#input[this.#inputPos];
				this.#inputPos++;
				return new Token(unknownToken, 'UNKNOWN', this.#inputPos, this.#inputPos); break;
		}
	}

	tokenizeInput(){
		let token = {};
		
		for (let i = this.#inputPos; i < this.#inputLen; i++) {
			if (this.#input[i] >= '0' && this.#input[i] <= '9') {
				return this.makeNumber();	
			} else if (this.#input[i] === '(' || this.#input[i] === ')') {
				this.#inputPos++;
				switch (this.#input[i]){
					case '(': 
						return new Token('(', 'L_PAREN', this.#inputPos, this.#inputPos); break;
					case ')':
						return new Token(')', 'R_PAREN', this.#inputPos, this.#inputPos); break;
				}
			} else {
				return this.makeOperator();
			}
			
			//posodobi trenutno pozicijo v input-u
			this.#inputPos++;
		}
		return new Token('EOF', 'EOF', this.#inputPos + 1, this.#inputPos + 1);
	}
}
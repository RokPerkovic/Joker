//class tokenizer...
//hrani trenutno pozicijo v input string-undefined
//kreira token-e razlicnih vrst (num, decNum, op, ...)




class Tokenizer {
	
	constructor(input, inputLen, inputPos){
		this.input = input;
		this.inputLen = inputLen;
		this.inputPos = inputPos;
	}
	
	makeNum(){
		var startPos = this.inputPos + 1;
		var endPos;
		var s_num = ''
		
		while(this.input[this.inputPos] >= '0' && this.input[this.inputPos] <= '9'){
			s_num+=this.input[this.inputPos];
			this.inputPos++;
		}
	
		endPos = this.inputPos;
		
		s_num = parseInt(s_num)
		
		return {s_value: s_num, s_type: typeof(s_num)/*'INT_CONST'*/, n_from: startPos, n_to: endPos}
	}
	
	makeOperator(){
		
		switch(this.input[this.inputPos]){
			case '-': return {s_value: '-', s_type: 'OP_SUB', n_from: this.inputPos, n_to: this.inputPos}; break;
			case '+': return {s_value: '+', s_type: 'OP_ADD', n_from: this.inputPos, n_to: this.inputPos}; break;
			case '/': return {s_value: '/', s_type: 'OP_DIV', n_from: this.inputPos, n_to: this.inputPos}; break;
			case '*': return {s_value: '*', s_type: 'OP_MULL', n_from: this.inputPos, n_to: this.inputPos}; break;
			default:  return {s_value: '?', s_type: 'OP_UNKNOWN', n_from: this.inputPos, n_to: this.inputPos}; break;
		}
		
	}

	parseInput(input){
		var token = {};
		
		for (var i = 0; i < this.inputLen; i++) {
			if((this.input[i] >= '0' && this.input[i] <= '9')){
				
				token = this.makeNum();
				
				//nadaljuj od tam naprej, kjer je makeNum koncal
				i = this.inputPos - 1;
				this.inputPos--;
				console.log(token);	
			}
			else{
				token = this.makeOperator();
				console.log(token);
				if(token.s_value === '?'){
					return token;
				}
			}
			
			//posodobi trenutno pozicijo v input-u
			this.inputPos++;
		}
		return token;
	}
}




/*
-cela stevila: 1, 12, 123, 0, -1, -100203, ...
-decimalna stevila: 10.5, 1.1, 0.5, -12.34, ...
-aritmeticni operatorji: +, -, /, *



*/
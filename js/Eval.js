class Evaluator {
	
	constructor() {
	}
	
	evaluate(ast){
		let expr = ast;
		let operator;
		let left;
		let right;
		let result;
		if (expr instanceof BinaryExpression) {
			operator = expr.operator;
			
			switch(operator){
				case "OP_ADD":
					return this.evaluate(expr.left) + this.evaluate(expr.right);
				case "OP_SUB":
					return this.evaluate(expr.left) - this.evaluate(expr.right);
				case "OP_MUL":
					return this.evaluate(expr.left) * this.evaluate(expr.right);
				case "OP_DIV":
					return this.evaluate(expr.left) / this.evaluate(expr.right);
			} 
		} else if(expr instanceof UnaryExpression){
			//console.log("unary");
			operator = expr.operator;
			switch(operator) {
				case "OP_SUB":
					if (expr.operand instanceof Literal) {
						return -1 * parseFloat(expr.operand.value);	
					} else {
						// evaluate expression
						return -1 * this.evaluate(expr.operand);
					}
					
				case "OP_ADD":
					if (expr.operand instanceof Literal) {
						return parseFloat(expr.operand.value);	
					} else {
						// evaluate expression
						return this.evaluate(expr.operand);
					}	
			}
			
		} else if (expr instanceof Literal) {
			return parseFloat(expr.value);
		}
		//return result;
	}
}
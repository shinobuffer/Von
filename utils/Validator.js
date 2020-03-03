export default class Validator {
	validateResult = [];

	strategys = {
		notEmpty(value,errMsg){
			if(!value)
				return errMsg
		},
		notContains(value,target,errMsg){
			if (value.indexOf(target)>-1)
				return errMsg;
		},
		isEmail(value,errMsg){
			if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))
				return errMsg
		},
		isQQ(value,errMsg){
			if (!/^[1-9]\d{4,12}$/.test(value))
				return errMsg;
		},
		isLink(value,errMsg){
			if (!/^https?:\/\/(([0-9a-z-]+\.)+[0-9a-z]+(\/#)?)((\/[0-9a-z-_.~!*]+)*\/?)((\?[0-9a-z_&=]*)?)$/i.test(value))
				return errMsg;
		},
		isEn(value,errMsg){
			if (!/^\w+$/.test(value))
				return errMsg;
		},
		maxLen(value,len,errMsg){
			if (value.length>len)
				return errMsg;
		}
	};

	check(value,rules,optional=false){
		rules = (rules instanceof Array)?rules:[rules];
		if (optional&&!value)return;
		for (let rule of rules){
			let strategyArgs = rule.strategy.split(':');
			let errMsg = rule.errMsg;
			let strategy = strategyArgs.shift();
			strategyArgs.unshift(value);
			strategyArgs.push(errMsg);
			let result = this.strategys[strategy].apply(null,strategyArgs);
			result && this.validateResult.push(result)
		}
	}

	checkResult(){
		for (let item of this.validateResult)
			if (item)
				return item;
	}
}

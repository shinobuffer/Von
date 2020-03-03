export function debounce(fun, wait) {
	let timeout;
	return function () {
		let context = this;
		let args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			fun.apply(context,args)
		},wait);
	}
}

export function throttle(func, wait) {
	let context, args;
	let previous = 0;
	return function() {
		let now = +new Date();
		context = this;
		args = arguments;
		if (now - previous > wait) {
			func.apply(context, args);
			previous = now;
		}
	}
}

export function unique(arr) {
  let r = [];
  for (let i = 0; i < arr.length; i++){
    for(let j = i + 1; j < arr.length; j++)
      if (arr[i] === arr[j])i++;
    r.push(arr[i]);
  }
  return r;
}
export function fast_unique(arr) {
  let r = [];
  let obj = {};
  for(let i of arr){
    if(!obj[i]){
      r.push(i);
      obj[i] = 1;
    }
  }
  return r;
}

export function shuffle(arr) {
	for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
  }
  return arr;
}

export function randInt(s,e){
	return Math.floor(Math.random()*(e-s)+s);
}

export function copyText(text){
	let textarea = document.createElement('textarea');
	let currentFocus = document.activeElement;
	document.body.appendChild(textarea);
	textarea.value = text;
	textarea.focus();
	if (textarea.setSelectionRange)
		textarea.setSelectionRange(0,textarea.value.length);
	else
		textarea.select();
	let flag;
	try{
		flag = document.execCommand('copy');
	}catch (e) {
		flag = false;
	}
	document.body.removeChild(textarea);
	currentFocus.focus();
	return flag;
}

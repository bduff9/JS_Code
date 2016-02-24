function Mod10(num){
	var x = parseInt(num);
	if (isNaN(x) || num.length !== 6){
		//Not a valid number
		return false;
	} else {
		x = 0;
		x = parseInt(num.substring(1,2)) + parseInt(num.substring(3,4)) + parseInt(num.substring(5));
		y = (parseInt(num.substring(0,1))*2).toString();
		x = x + parseInt(y.substring(0,1));
		if (y.length === 2) x = x + parseInt(y.substring(1));
		y = (parseInt(num.substring(2,3))*2).toString();
		x = x + parseInt(y.substring(0,1));
		if (y.length === 2) x = x + parseInt(y.substring(1));
		y = (parseInt(num.substring(4,5))*2).toString();
		x = x + parseInt(y.substring(0,1));
		if (y.length === 2) x = x + parseInt(y.substring(1));
		if (x % 10 === 0) {
			alert('Correct');
		} else {
			alert('False');
		}
		return false;
	}
}
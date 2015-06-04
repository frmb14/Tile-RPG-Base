define(function(){
	
	return {
		
		init: function(){
			
			Array.prototype.getIndexBy = function (name, value) {
				for (var i = 0; i < this.length; i++) {
					if (this[i][name] == value) {
						return i;
					}
				}
			},
			
			Array.prototype.sortBy = function(field, reverse, primer){

				var key = primer ? 
				function(x) {return primer(x[field])} : 
				function(x) {return x[field]};

				reverse = !reverse ? 1 : -1;

				return function (a, b) {
					return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
				} 
			}
		}
	};
});
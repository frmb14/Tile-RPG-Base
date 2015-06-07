define(function(){
	
	return {
		
		init: function(){
			
			/**
			 * Function for getting the index of an array by name and value
			 */ 
			Array.prototype.getIndexBy = function (name, value) {
				for (var i = 0; i < this.length; i++) {
					if (this[i][name] == value) {
						return i;
					}
				}
			},
			
			/**
			 * Function for sorting an array based on field, direction and potential primer. This is to be used with Array.sort()
			 */ 
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
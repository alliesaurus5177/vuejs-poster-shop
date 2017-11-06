var PRICE = 9.99; //constant = caps 

new Vue({
	el: '#app',//where you want Vue to be anchored in DOM 
	data:{
		total: 0,
		items: [],
		cart: [],
		search: '',
		lastSearch: '',
		loading: false, 
	},
	methods:{
		onSubmit: function(){
			//console.log(this.$http);
			this.items = []; //empty out items while search loads
			this.loading = true; 
			this.$http
			.get('/search/'.concat(this.search))
			.then(function(res) {
				this.lastSearch = this.search;
				this.items = res.data;
				this.loading = false; 
			});
		},
		addItem: function(index) {
			this.total += 9.99;
			var item = this.items[index]; //reference item 
			var found = false; 
			for(var i = 0; i < this.cart.length; i++){
				if(this.cart[i].id == item.id){
					found = true; 
					this.cart[i].qty++;
					break;
				}
			}
			if (!found){
				this.cart.push({
					id: item.id, 
					title: item.title, 
					qty: 1, 
					price: PRICE,
				});				
			}
		}, //end function
		inc: function(item) { //adds number to cart item
			item.qty++;
			this.total += PRICE; 
		},//end inc
		dec: function(item){//removes item from cart 
			item.qty--;
			this.total -= PRICE;
			if (item.qty <= 0){
				for (var i = 0; i < this.cart.length; i++){
					if (this.cart[i].id == item.id) { //is this the item that was just given to dec
						this.cart.splice(i, 1); //if so, remove it from the cart array 
						break;
					}
				}
			}
		},//end dec
	},
	//filters go here 
	filters:{
		currency: function(price) {
			return '$'.concat(price.toFixed(2)); //tofixed rounds to given decimal
		}
	},
});
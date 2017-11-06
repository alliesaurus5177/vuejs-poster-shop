var PRICE = 9.99; //constant = caps 
var LOAD_NUM = 10; 

new Vue({
	el: '#app',//where you want Vue to be anchored in DOM 
	data:{
		total: 0,
		items: [],
		cart: [],
		results: [],
		newSearch: 'anime',
		lastSearch: '',
		loading: false, 
		price: PRICE,
	},
	methods:{
		appendItems: function() {
			//console.log('Append Items');
			if(this.items.length < this.results.length){
				var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
				this.items = this.items.concat(append);
			}
		},
		onSubmit: function(){
			//console.log(this.$http);
			this.items = []; //empty out items while search loads
			this.loading = true; 
			this.$http
			.get('/search/'.concat(this.newSearch))
			.then(function(res) {
				this.lastSearch = this.newSearch;
				this.results = res.data;
				this.appendItems();
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
	mounted: function() { //will get called as soon as Vue is mounted to DOM 
		this.onSubmit(); 

		var vueInstance = this;
		var elem = document.getElementById('product-list-bottom')
		var watcher = scrollMonitor.create(elem);
		watcher.enterViewport(function() {
			vueInstance.appendItems();
		});
	}
});


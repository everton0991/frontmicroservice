<template>
  <div id="app">

    <!-- New Product -->
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Add New Product</h3>
      </div>
      <div class="panel-body">
         <form id="form" class="form-inline" v-on:submit.stop.prevent="addProduct">
          <div class="form-group">
            <label for="_id">Code:</label>
            <input type="text" id="_id" class="form-control" v-model="newProduct._id">
          </div>
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" class="form-control" v-model="newProduct.name">
          </div>
          <div class="form-group">
            <label for="price">Price:</label>
            <input type="text" id="price" class="form-control" v-model="newProduct.price">
          </div>
          <input type="submit" class="btn btn-primary" value="Add">
        </form>
      </div>
    </div>

    <!-- List -->
    <div class="panel-body">
        <h1>{{ title }}</h1>
        <div class="well">
            <div class="row">
                <div class="col-lg-6 col-md-6">
                    <input type="text" class="form-control" placeholder="Filter by..." aria-label="Filter by..." v-model="filterTerm" />
                </div>
            </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th><a href="#" @click.stop.prevent="sort($event,'_id')">Code</a></th>
              <th><a href="#" @click.stop.prevent="sort($event,'name')">Name</a></th>
              <th><a href="#" @click.stop.prevent="sort($event,'price')">Price</a></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
              <tr v-for="product in orderedList">
                <th>{{ product._id }}</th>
                <th>{{ product.name }}</th>
                <th>{{ product.price }}</th>
                <th>
                    <!-- <a href="#" class="btn btn-primary">Edit</a> -->
                    <a href="#" class="btn btn-danger" v-on:click.stop.prevent="removeProduct(product)">Delete</a>
                </th>
              </tr>
          </tbody>
        </table>
        <div class="pagination hidden">
            <button class="btn btn-default" @click="fetchProducts(pagination.prev_page_url)"
                    :disabled="!pagination.prev_page_url">
                Previous
            </button>
            <span>Page {{pagination.current_page}} of {{pagination.last_page}}</span>
            <button class="btn btn-default" @click="fetchProducts(pagination.next_page_url)"
                    :disabled="!pagination.next_page_url">Next
            </button>
        </div>
    </div>
  </div>
</template>
<script>
    /* Import */
    import Firebase from 'firebase'
    import toastr from 'toastr'

    let config = {
      apiKey: "AIzaSyDEPjxPffZoNkHTCU1VK4d5hlxLNT37ap8",
      authDomain: "vuejs-firebase-1-c83df.firebaseapp.com",
      databaseURL: "https://vuejs-firebase-1-c83df.firebaseio.com",
      projectId: "vuejs-firebase-1-c83df",
      storageBucket: "vuejs-firebase-1-c83df.appspot.com",
      messagingSenderId: "416784597258"
    };

    let app = Firebase.initializeApp(config)
    let db = app.database()
    let prodsRef = db.ref('products')

    export default {
        name: 'List',
        firebase: {
          products: prodsRef
        },
        data() {
            return {
                title: 'Products',
                sortProperty: 'name',
                sortDirection: 'asc',
                filterTerm: '',
                pagination: [],
                newProduct: {
                    _id: '',
                    name: '',
                    price: ''
                }
            }
        },
        // mounted() {
        //     this.fetchProducts()
        // },
        methods: {
            addProduct: function () {
                prodsRef.push(this.newProduct);
                this.newProduct._id = '';
                this.newProduct.name = '';
                this.newProduct.price = '';
                toastr.success('New product created!')
            },
            removeProduct: function (product) {
                prodsRef.child(product['.key']).remove()
                toastr.success('Product removed successfully')
            },
            sort(ev, property) {
                this.sortProperty = property
                if(this.sortDirection == 'asc') {
                    this.sortDirection = 'desc'
                } else {
                    this.sortDirection = 'asc'
                }
            },
        //     fetchProducts: function (page_url) {
        //         let self = this;
        //         page_url = page_url || 'product'
        //         axios.get(page_url)
        //             .then(function (response) {
        //                 self.products = response.data.data
        //                 self.makePagination(response.data)
        //             })
        //     },
        //     makePagination: function(data){
        //        let pagination = {
        //            current_page: data.current_page,
        //            last_page: data.last_page,
        //            next_page_url: data.next_page_url,
        //            prev_page_url: data.prev_page_url
        //        }
        //        this.pagination = pagination
        //    }
        },
        computed: {
          orderedList: function () {
              let self = this
              let list = self.products
              list = list.filter(function (product) {
                  return product.name.indexOf(self.filterTerm) > -1
              })
              return _.orderBy(list, self.sortProperty, self.sortDirection)
          }
        },

    }
</script>

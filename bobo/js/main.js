
let eventBus = new Vue()

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
        </ul>
    `
})


Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
            
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            
            <div>
                <p>Would you recommend this product?</p>
                <label>
                    <input v-model="recommend" type="radio" name="recommend" value="yes">
                    Yes
                </label>
                <label>
                    <input v-model="recommend" type="radio" name="recommend" value="no">
                    No
                </label>
            </div>
            
            <p>
                <input type="submit" value="Submit"> 
            </p>
            
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
                </ul>
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []

            if (!this.name) this.errors.push("Name required.")
            if (!this.review) this.errors.push("Review required.")
            if (!this.rating) this.errors.push("Rating required.")
            if (!this.recommend) this.errors.push("Recommendation required.")

            if (this.errors.length === 0) {
                const productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            }
        }
    }
})


Vue.component('product-tabs', {
    props: {
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        },
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <ul>
                <span 
                    class="tab"
                    :class="{ activeTab: selectedTab === tab }"
                    v-for="(tab, index) in tabs"
                    :key="index"
                    @click="selectedTab = tab"
                >
                    {{ tab }}
                </span>
            </ul>
            
            <div v-show="selectedTab === 'Reviews'">
                <p v-if="reviews.length === 0">There are no reviews yet.</p>
                <ul v-else>
                    <li v-for="(review, index) in reviews" :key="index">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
            
            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>
            
            <div v-show="selectedTab === 'Shipping'">
                <p>Shipping: {{ shipping }}</p>
            </div>
            
            <div v-show="selectedTab === 'Details'">
                <product-details :details="details"></product-details>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    }
})


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image" :alt="altText"/>
            </div>
            
            <div class="product-info">
                <h1>{{ title }}</h1>
                
                
                <p>{{ description }}</p>
                
                
                <p>{{ sale }}</p>
                
                
                <p :style="inStock ? '' : 'text-decoration: line-through'">
                    {{ inStock ? 'In Stock' : 'Out of Stock' }}
                </p>
                
                
                <a :href="link">More products like this</a>
                
                
                <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)"
                ></div>
                
                
                <button 
                    @click="addToCart" 
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
                >
                    Add to cart
                </button>
                <button 
                    @click="removeFromCart" 
                    :disabled="cartCount === 0"
                >
                    Remove
                </button>
                
                
                <product-tabs 
                    :shipping="shipping" 
                    :reviews="reviews" 
                    :details="details"
                ></product-tabs>
            </div>
        </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            description: "A pair of warm, fuzzy socks", // Практическая работа №1
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks", // Практическая работа №2
            onSale: true, // Практическая работа №3
            details: ['80% cotton', '20% polyester', 'Gender-neutral'], // Практическая работа №4
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'], // Практическая работа №4
            reviews: [],
            cartCount: 0,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ]
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
            this.cartCount++
        },
        removeFromCart() {
            if (this.cartCount > 0) {
                this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
                this.cartCount--
            }
        },
        updateProduct(index) {
            this.selectedVariant = index
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0
        },

        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' on sale! 50% off!'
            }
            return ''
        },
        shipping() {
            return this.premium ? "Free" : "$2.99"
        }
    },
    mounted() {
        eventBus.$on('review-submitted', (productReview) => {
            this.reviews.push(productReview)
        })
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id) {
            const index = this.cart.indexOf(id);
            if (index > -1) {
                this.cart.splice(index, 1);
            }
        }
    }
});
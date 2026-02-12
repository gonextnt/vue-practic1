Vue.component('product-details', {
    props: {
        details: {
            required: true
        }
    },
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>`,
})
Vue.component('product', {
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image" :alt="altText"/>
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{description}}</p>
                <a v-bind:href="link">More products like this</a>
                 <p>Shipping: {{ shipping }}</p>
                <span v-if="onSale">On Sale</span>
                <p v-if="inStock">In Stock</p>
                <p v-else style="text-decoration: line-through">Out of Stock</p>
                <p>{{ sale }}</p>
                <product-details :details="details"></product-details>
                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>
                <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)"
                ></div>
            </div>
            
            <div class="cart">
                <p>Cart({{ cart }})</p>
            </div>
            
            <button
                v-on:click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
            >
                Add to cart
            </button>
            <button v-on:click="delToCart">Del to cart</button>
        </div>
    `,
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            description: "A pair of warm, fuzzy socks",
            altText: "A pair of socks",
            link:"https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
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
            this.cart += 1
        },
        delToCart() {
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale(){
            if (this.onSale === true)
                return this.brand + ' сдается в аренду ' + this.product + ' со скидкой 50%!';
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})
const jsonfile = require('jsonfile')
const {v4: uuidv4} = require('uuid')

const file = 'data.json'
let data = jsonfile.readFileSync(file)

const save = () => {
	jsonfile.writeFileSync(file, data, {
		replacer: true,
		spaces: '\t'
	})
}

const getAllStore = () => data.allStores

const getStore = (storeId) => {
	return data.allStores.find(store => store.storeId === storeId)
}

const getAllProductsOfStore = (storeId) => {
	return data.allProducts.filter(product => product.storeId === storeId)
}

const getAllProducts = () => {
	return data.allProducts
}

const getProduct = (productId) => {
	return data.allProducts.find(product => product.productId === productId)
}

module.exports = {
	getAllStore,
	getStore,
	getAllProducts,
	getAllProductsOfStore,
	getProduct
}

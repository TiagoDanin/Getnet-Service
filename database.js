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
	const store = data.allStores.find(store => store.storeId === storeId)
	store.webCount++ 
	
	save()
	return store
}

const getAllProductsOfStore = (storeId) => {
	const store = data.allStores.find(store => store.storeId === storeId)
	store.webCount++ 

	save()
	return data.allProducts.filter(product => product.storeId === storeId)
}

const getAllProducts = () => {
	return data.allProducts
}

const getProduct = (productId) => {
	return data.allProducts.find(product => product.productId === productId)
}

const getAllConversation = () => {
	return data.allConversation
}

const getConversation = (conversationId) => {
	return data.allConversation.find(conversation => conversation.conversationId === conversationId)
}

const addConversation = (text) => {
	const conversation = {
		conversationId: uuidv4(),
		messages: [{
			messageId: uuidv4(),
			isMe: true,
			text: text
		}]
	}

	data.allConversation.push(conversation)
	save()
	return conversation
}

const replyConversation = (conversationId, text) => {
	const conversation = getConversation(conversationId)
	const message = {
		messageId: uuidv4(),
		isMe: true,
		text: text
	}

	conversation.messages.push(message)
	save()
	return conversation
}

module.exports = {
	getAllStore,
	getStore,
	getAllProducts,
	getAllProductsOfStore,
	getProduct,
	getAllConversation,
	getConversation,
	addConversation,
	replyConversation
}

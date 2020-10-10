
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const database = require('./database')

const port = process.env.PORT

app.use(bodyParser.urlencoded({
	extended: false
}))

app.get('/', (request, responseExpress) => responseExpress.send('Hello World!'))

app.get('/api', (request, responseExpress) => responseExpress.json({isOk: true}))

app.get('/products/:storeId', (request, responseExpress) => {
	const { storeId } = request.params
	responseExpress.json({
		isOk: true,
		bannerImgUrl: database.getStore(storeId).bannerImgUrl, 
		allProducts: database.getAllProductsOfStore(storeId),
		allStores: database.getAllStore()
	})
})

app.get('/api', (request, responseExpress) => responseExpress.json({isOk: true}))

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))


const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const api = require('./api')
const database = require('./database')

const app = express()
const swaggerSpec = swaggerJSDoc({
	definition: {
		info: {
			title: 'API Doc',
			version: '1.0.1'
	  }
	},
	apis: ['./index.js']
})

const port = process.env.PORT

app.set('json spaces', 4)

app.use(bodyParser.json())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/', (request, responseExpress) => responseExpress.send('Hello World!'))

/**
 * @swagger
 *
 * /swagger.json:
 *   get:
 *     tags:
 *       - base
 *     summary: Ober OpenAPI especificação (Use para exportar em Postman ou Swagger UI)
 *     description: Ober OpenAPI especificação (Use para exportar em Postman ou Swagger UI)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: retorna OpenAPI especificação
 */
app.get('/swagger.json', (request, responseExpress) => responseExpress.json(swaggerSpec))

/**
 * @swagger
 *
 * /api:
 *   get:
 *     tags:
 *       - base
 *     summary: Ver se a API tá online
 *     description: Ver se a API tá online
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: status
 */
app.get('/api', (request, responseExpress) => responseExpress.json({isOk: true}))

/**
 * @swagger
 *
 * /store/all:
 *   get:
 *     tags:
 *       - store
 *     summary: Ver lista de todas as lojas
 *     description: Ver lista de todas as lojas
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: lista de lojas
 */
app.get('/store/all', (request, responseExpress) => {
	responseExpress.json({
		isOk: true,
		allStores: database.getAllStore()
	})
})

/**
 * @swagger
 *
 * /store/{storeId}/products:
 *   get:
 *     tags:
 *       - store
 *     summary: Ver lista de todos os produtos e um info da loja atual
 *     description: Ver lista de todos os produtos e um info da loja atual
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: storeId
 *         description: ID da loja.
 *         in: path
 *         required: true
 *         type: string
 *         example: 2264e4f3-7a72-4c27-900d-41ce47fbc1ba
 *     responses:
 *       200:
 *         description: lista informações e lista de produto de uma loja
 */
app.get('/store/:storeId/products', (request, responseExpress) => {
	const {storeId} = request.params
	responseExpress.json({
		isOk: true,
		bannerImgUrl: database.getStore(storeId).bannerImgUrl,
		allProducts: database.getAllProductsOfStore(storeId),
		allStores: database.getAllStore()
	})
})

/**
 * @swagger
 *
 * /store/{storeId}:
 *   get:
 *     tags:
 *       - store
 *     summary: Ver informações de uma loja
 *     description: Ver informações de uma loja
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: storeId
 *         description: ID da loja.
 *         in: path
 *         required: true
 *         type: string
 *         example: 2264e4f3-7a72-4c27-900d-41ce47fbc1ba
 *     responses:
 *       200:
 *         description: retorna informações de uma loja
 */
app.get('/store/:storeId', (request, responseExpress) => {
	const {storeId} = request.params
	responseExpress.json({
		isOk: true,
		...database.getStore(storeId)
	})
})

/**
 * @swagger
 *
 * /product/all:
 *   get:
 *     tags:
 *       - product
 *     summary: Ver lista de todos os produtos
 *     description: Ver lista de todos os produtos
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: lista de todos produtos
 */
app.get('/product/all', (request, responseExpress) => {
	responseExpress.json({
		isOk: true,
		allProducts: database.getAllProducts()
	})
})

/**
 * @swagger
 *
 * /product/{productId}:
 *   get:
 *     tags:
 *       - product
 *     summary: Ver informações de um produto
 *     description: Ver informações de um produto
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: productId
 *         description: ID do produto.
 *         in: path
 *         required: true
 *         type: string
 *         example: 68916dbf-e031-4a1d-9cdb-468210eab7e6
 *     responses:
 *       200:
 *         description: retorna informações de um produto
 */
app.get('/product/:productId', (request, responseExpress) => {
	const {productId} = request.params
	responseExpress.json({
		isOk: true,
		...database.getProduct(productId)
	})
})

/**
 * @swagger
 *
 * /conversation/all:
 *   get:
 *     tags:
 *       - conversation
 *     summary: Ver lista de todas as conversas
 *     description: Ver lista de todas as conversas
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: lista de todas as conversas
 */
app.get('/conversation/all', (request, responseExpress) => {
	responseExpress.json({
		isOk: true,
		allConversation: database.getAllConversation()
	})
})

/**
 * @swagger
 *
 * /conversation/create:
 *   post:
 *     tags:
 *       - conversation
 *     summary: Criar uma nova conversa
 *     description: Criar uma nova conversa
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Dados para criar a conversa
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - text
 *           properties:
 *             isMe:
 *               description: Sou eu?
 *               type: boolean
 *               example: true
 *             text:
 *               description: Texto da primeira mensagem da conversa
 *               type: string
 *               example: ola
 *     responses:
 *       200:
 *         description: retorna informações de uma conversa criada
 */
app.post('/conversation/create', (request, responseExpress) => {
	const {text, isMe} = request.body
	responseExpress.json({
		isOk: true,
		...database.addConversation(text, isMe)
	})
})

/**
 * @swagger
 *
 * /conversation/{conversationId}:
 *   get:
 *     tags:
 *       - conversation
 *     summary: Ver informações de uma conversa
 *     description: Ver informações de uma conversa
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: conversationId
 *         description: ID do conversa.
 *         in: path
 *         required: true
 *         type: string
 *         example: b65b7ddd-e84c-4eec-8d4b-e4b794db93b4
 *     responses:
 *       200:
 *         description: retorna informações de uma conversa
 */
app.get('/conversation/:conversationId', (request, responseExpress) => {
	const {conversationId} = request.params
	responseExpress.json({
		isOk: true,
		...database.getConversation(conversationId)
	})
})

/**
 * @swagger
 *
 * /conversation/{conversationId}:
 *   post:
 *     tags:
 *       - conversation
 *     summary: Responde uma mensagem de uma conversa
 *     description: Responde uma mensagem de uma conversa
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: conversationId
 *         description: ID do conversa.
 *         in: path
 *         required: true
 *         type: string
 *         example: b65b7ddd-e84c-4eec-8d4b-e4b794db93b4
 *       - in: body
 *         name: body
 *         description: Dados para criar a conversa
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - text
 *           properties:
 *             isMe:
 *               description: Sou eu?
 *               type: boolean
 *               example: true
 *             text:
 *               description: Texto da mensagem da conversa
 *               type: string
 *               example: ola
 *     responses:
 *       200:
 *         description: retorna informações de uma conversa com a nova mensagem
 */
app.post('/conversation/:conversationId', (request, responseExpress) => {
	const {conversationId} = request.params
	const {text, isMe} = request.body
	responseExpress.json({
		isOk: true,
		...database.replyConversation(conversationId, text, isMe)
	})
})

/**
 * @swagger
 *
 * /transaction/create:
 *   post:
 *     tags:
 *       - transaction
 *     summary: Cria uma transação
 *     description: Cria uma transação
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Dados para a transação
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - storeId
 *             - cardNumber
 *             - amount
 *             - name
 *             - expirationMonth
 *             - expirationYear
 *             - securityCode
 *           properties:
 *             storeId:
 *               description: ID da loja.
 *               type: string
 *               example: 2264e4f3-7a72-4c27-900d-41ce47fbc1ba
 *             cardNumber:
 *               description: Número do cartão.
 *               type: string
 *               example: "5155901222280001"
 *             amount:
 *               description: Valor.
 *               type: string
 *               example: "100"
 *             name:
 *               description: Nome da pessoal.
 *               type: string
 *               example: JOAO DA SILVA
 *             expirationMonth:
 *               description: Mês exp. do cartão.
 *               type: string
 *               example: "12"
 *             expirationYear:
 *               description: Ano exp. do cartão.
 *               type: string
 *               example: "21"
 *             securityCode:
 *               description: CVV do cartão.
 *               type: string
 *               example: "123"
 *     responses:
 *       200:
 *         description: retorna informações da transação
 */
app.post('/transaction/create', (request, responseExpress) => {
	const {
		cardNumber,
		amount,
		name,
		expirationMonth,
		expirationYear,
		securityCode
	} = request.body
	
	api.getToken()
		.then(responseToken => {
			api.getNumberCardToken({
				token: responseToken.data.access_token,
				cardNumber: cardNumber
			}).then(responseNumberCardToken => {
				api.getPayment({
					token: responseToken.data.access_token,
					numberToken: responseNumberCardToken.data.number_token,
					amount: amount,
					name: name,
					expirationMonth: expirationMonth,
					expirationYear: expirationYear,
					securityCode: securityCode
				}).then(responsePayment => {
					responseExpress.json({
						isOk: true,
						payment: responsePayment.data
					})
				}).catch(error => {
					console.error(error.response.data)
					responseExpress.json({
						isOk: false,
						error: error.response.data
					})
				})
			}).catch(error => {
				console.error(error.response.data)
				responseExpress.json({
					isOk: false,
					error: error.response.data
				})
			})
		}).catch(error => {
			console.error(error.response.data)
			responseExpress.json({
				isOk: false,
				error: error.response.data
			})
		})
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

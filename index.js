
const express = require('express')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc');

const app = express()
const swaggerSpec = swaggerJSDoc({
	definition: {
	  openapi: '3.0.0',
	  info: {
		title: 'API Doc',
		version: '1.0.0',
	  },
	},
	apis: ['./index.js'],
  });
const database = require('./database')

const port = process.env.PORT

app.set('json spaces', 4)

app.use(bodyParser.urlencoded({
	extended: false
}))

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/', (request, responseExpress) => responseExpress.send('Hello World!'))

/**
 * @swagger
 *
 * /swagger.json:
 *   get:
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
	const { storeId } = request.params
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
	const { storeId } = request.params
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
		allProducts: database.getAllProducts(),
	})
})

/**
 * @swagger
 *
 * /product/{productId}:
 *   get:
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
	const { productId } = request.params
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
 *     description: Criar uma nova conversa
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         description: Dados para criar a conversa
 *         in: body
 *         schema:
 *           type: object
 *           required:
 *             - text
 *           properties:
 *             text:
 *               description: Texto da primeira mensagem da conversa
 *               type: string
 *               example: ola
 *     responses:
 *       200:
 *         description: retorna informações de uma conversa criada
 */
app.post('/conversation/create', (request, responseExpress) => {
	const { text } = request.body
	responseExpress.json({
		isOk: true,
		...database.addConversation(text)
	})
})

/**
 * @swagger
 *
 * /conversation/{conversationId}:
 *   get:
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
	const { conversationId } = request.params
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
 *       - name: body
 *         description: Dados para criar a mensagem
 *         in: body
 *         schema:
 *           type: object
 *           required:
 *             - text
 *           properties:
 *             text:
 *               description: Texto da mensagem da conversa
 *               type: string
 *               example: ola
 *     responses:
 *       200:
 *         description: retorna informações de uma conversa com a nova mensagem
 */
app.post('/conversation/:conversationId', (request, responseExpress) => {
	const { conversationId } = request.params
	const { text } = request.body
	responseExpress.json({
		isOk: true,
		...database.replyConversation(conversationId, text)
	})
})

app.listen(port, () => console.log(`App listening at http://localhost:${port}`))

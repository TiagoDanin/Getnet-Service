const axios = require('axios')
const qs = require('qs')
const https = require('https')
const fs = require('fs')
const {v4: uuidv4} = require('uuid')

const timeout = 1000
const token = process.env.TOKEN
const urlBase = 'https://api-sandbox.getnet.com.br'
const client = config => axios.create({timeout})(config)

const log = config => {
	console.log('Request', config.url)
}

const getToken = () => {
	const data = qs.stringify({
		scope: 'oob',
		grant_type: 'client_credentials'
	})

	const config = {
		method: 'post',
		url: `${urlBase}/auth/oauth/v2/token`,
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${token}`
		},
		data
	}

	log(config)
	return client(config)
}

const getNumberCardToken = options => {
	const data = qs.stringify({
		card_number: options.cardNumber
	})

	const config = {
		method: 'post',
		url: `${urlBase}/v1/tokens/card`,
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Bearer ${options.token}`
		},
		data
	}

	log(config)
	return client(config)
}

const getPayment = options => {
	const data = JSON.stringify({
		seller_id: "ea8fc390-0818-42bf-a993-60c6f9b9728c",
		amount: options.amount,
		order: {
			order_id: '12345'
		},
		customer: {
		  customer_id: '12345',
		  billing_address: {}
		},
		device: {},
		shippings: [
			{
				address: {}
			}
		],
		credit: {
			delayed: false,
			save_card_data: false,
			transaction_type: 'FULL',
			number_installments: 1,
			card: {
				number_token: options.numberToken,
				cardholder_name: options.name,
				expiration_month: options.expirationMonth,
				expiration_year: options.expirationYear,
				security_code: options.securityCode
			}
		}
	})

	const config = {
		method: 'post',
		url: `${urlBase}/v1/payments/credit`,
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${options.token}`
		},
		data
	}

	log(config)
	return client(config)
}

module.exports = {
	getToken,
	getPayment,
	getNumberCardToken
}

const jsonfile = require('jsonfile')
const {v4: uuidv4} = require('uuid')

const file = 'data.json'
const bicos = jsonfile.readFileSync(file)

const save = () => {
	jsonfile.writeFileSync(file, bicos, {
		replacer: true,
		spaces: '\t'
	})
}

module.exports = {}

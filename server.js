const express = require('express');
const multer  = require('multer')
const csv = require('csvtojson');
const shortid = require('shortid');
const low = require('lowdb');
const lodashId = require('lodash-id');
const fs = require('fs');
const FileAsync = require('lowdb/adapters/FileAsync');
const bodyParser = require('body-parser');
const moment = require('moment')

const upload = multer({dest: 'uploads/'})
const app = express();
const port = process.env.PORT || 5000;
const dbPath = 'db.json';
let newDb = true;
const limit = 50

try {
	if(fs.existsSync(dbPath)) {
		// file exists
		newDb = false;
	}
} catch(err) {
	console.error(err);
}

app.use(bodyParser.json())

// open database and start server
const adapter = new FileAsync(dbPath);
low(adapter).then(db => {
	// add mixins
	db._.mixin(lodashId);


	// TRANSACTIONS
	// Get number of transactions
	// app.get('/pages', (req, res) => {
	// 	console.log("API: Fetch number of transactions")
	// 	const category = req.query.category
	// 	let transactions = db.get('transactions')
	// 	if (category) {
	// 		transactions = transactions.filter({category: category})
	// 	}
	// 	res.status(200).json(Math.ceil(transactions.value().length / limit))
	// });

	// const getDescendantCategories = (parent) => {
	// 	console.log("GET DESCENDANTS")
	// 	const children = db.get('categories').filter({parent: parent}).value().map(child => child.id)
	// 	console.log(children)
	// 	const descendants = children.flatMap(child => getDescendantCategories(child))
	// 	return children.concat(descendants)
	// }

	// create a GET route
	// app.get('/transactions', (req, res) => {
	// 	console.log("API: Fetch transactions")
	// 	const { category, page } = req.query
	//
	// 	let transactions = db.get('transactions')
	// 	let filteredTransactions
	// 	console.log("Category: " + category)
	// 	if (category) {
	// 		filteredTransactions = []
	// 		getDescendantCategories(category).forEach(c => filteredTransactions.concat(transactions.filter({category: c})))
	// 	} else {
	// 		filteredTransactions = transactions
	// 	}
	//
	// 	if (page) {
	// 		console.log("With pagination: " + page)
	// 		const start = (page - 1) * limit
	// 		const end = start + limit
	// 		filteredTransactions = filteredTransactions.slice(start, end)
	// 	}
	//
	// 	res.status(200).json(filteredTransactions.value())
	// });

	app.get('/transactions/amount', (req, res) => {
		console.log("API: get amounts")
		const categories = req.query.categories.split(',')
		const result = []
		console.log(categories)
		categories.forEach(category => result.push(amountByCategory(category)))

		res.status(200).json(result)
	})

	const amountByCategory = (category) => {
		const years = [2019, 2020]
		const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

		const result = {
			category,
			years: []
		}
		years.forEach(year => {
			const yResult = {
				year,
				months: []
			}
			result.years.push(yResult)
			months.forEach(month => {
				const mResult = {
					month,
					amount: amountByCategoryAndMonth(category, year, month)
				}
				yResult.months.push(mResult)
			})
		})

		return result
	}

	const amountByCategoryAndMonth = (category, year, month) => {
		const filteredTransactions = db.get('transactions').value().filter(transaction => {
			const date = moment(transaction.date, "YYYYMMDD")
			const validPeriod = date.year() === year && date.month() === month
			const validCategory = transaction.category === category
			return validPeriod && validCategory
		})

		const amountForMonth = filteredTransactions.map(transaction => {
			const factors = {
				"NL74INGB0654972370": 1,
				"NL62INGB0689027346": 0.5
			}
			const factor = factors[transaction.account]
			return parseFloat(transaction.amount.replace(',', '.')) * factor
		})
		const amount = amountForMonth.reduce((a, b) => a + b, 0.00).toFixed(2)
		return amount
	}

	// 	app.get('/categories', (req, res) => {
	// 	console.log("API: Fetch categories")
	// 	res.status(200).json(db.get('categories').value())
	// });

	// app.put('/set-category', (req, res) => {
	// 	console.log("API: Set category")
	// 	const {categoryId, transactionId} = req.body
	// 	if (transactionId) {
	// 		db.get('transactions').find({id: transactionId}).assign({
	// 			category: categoryId
	// 		}).write()
	// 		const updatedTransaction = db.get('transactions').find({id: transactionId}).value()
	// 		console.log(updatedTransaction)
	// 		res.status(200).json(updatedTransaction)
	// 	} else {
	// 		res.status(400).json({message: 'Request body should have a transaction id property'})
	// 	}
	// });

	// Receive a CSV file
	app.post('/upload-file', upload.single('transactionList'), (req, res, next) => {
		console.log("API: Upload file")
		csv({headers: ["date", "description", "account", "otherAccount", "code", "debitOrCredit", "amount", "mutation", "remarks"]})
			.fromFile(req.file.path)
			.then((json) => {
				if (json.length > 0) {
					const account = json[0].account
					const lastUpdated = db.get('accounts').find({iban: account}).value().updated
					let newLastUpdated = lastUpdated

					const existingTransactions = []
					const newTransactions = []
					json.forEach(transaction => {
						// Process fields
						if (transaction.debitOrCredit === "Af") {
							transaction.amount = "-" + transaction.amount
						}

						// Check if transaction exists
						const existingTransaction = db.get('transactions').find({
							date: transaction.date,
							description: transaction.description,
							account: transaction.account,
							otherAccount: transaction.otherAccount,
							code: transaction.code,
							debitOrCredit: transaction.debitOrCredit,
							amount: transaction.amount,
							mutation: transaction.mutation,
							remarks: transaction.remarks
						})

						if (existingTransaction) {	// Transaction already exists, so don't add again
							existingTransactions.push(existingTransaction.value())
						} else {										// Transaction doesn't exist yet, so add it
							// Set the last updated date of the account to the date of the newest transaction
							if (transaction.date > newLastUpdated) {
								newLastUpdated = transaction.date
							}

							// Generate id
							transaction.id = shortid.generate()

							// Apply rules
							const categories = applyRules(transaction)
							if (categories.length === 1) {
								transaction.category = categories[0]
							} else {
								transaction.category = "22ofrnfYO"	// Ongecategoriseerd
								if (categories.length > 0) {
									console.log("Transaction " + transaction.id + " has multiple categories: " + categories)
								}
							}

							newTransactions.push(transaction)
						}
					})
					db.get('transactions').push(...newTransactions).write()
					db.get('accounts').find({iban: account}).assign({updated: newLastUpdated + ""}).write()

					if (existingTransactions.length > 0) {
						console.log("Transactions already exist:")
						console.log(existingTransactions.map(t => t.id))
					}

					return new Promise((resolve, reject) => {
						res.status(200).json({ newTransactions, existingTransactions })
					})
				}
			})
	});

	const applyRules = (jsonTransaction) => {
		const rules = db.get('rules').value()
		const categories = []
		rules.forEach(rule => {
			let allRulesTrue = true
			rule.comparisons.forEach(comparison => {
				const {field, type, text} = comparison
				if (!jsonTransaction[field].toLowerCase().includes(text.toLowerCase())) {	// TODO: actually use'type' instead of hardcoded 'includes'
					allRulesTrue = false
				}
			})
			if (allRulesTrue && !categories.includes(rule.category)) {
				categories.push(rule.category)
			}
		})
		return categories
	}

	// CATEGORIES
	// The route for creating new inventory items
	// app.post('/categories', (req, res) => {
	// 	console.log("API: Add category")
	// 	const {name, paren} = req.body
	// 	if (name) {
	// 		const insertedCategory = {
	// 			id: shortid.generate(),
	// 			name: name,
	// 			parent: parent
	// 		}
	// 		db.get('categories').insert(insertedCategory).write()
	//
	// 		res.status(200).json(insertedCategory)
	// 	} else {
	// 		res.status(400).json({message: 'Request body should have a name property'})
	// 	}
	// })

	// The route for updating existing inventory items
	// app.put('/categories', (req, res) => {
	// 	console.log("API: Update category")
	// 	const {id, name, parent} = req.body
	// 	if (id && name) {
	// 		db.get('categories').find({id: id}).assign({
	// 			name: name,
	// 			parent: parent
	// 		}).write()
	//
	// 		const updatedCategory = db.get('categories').find({id:id}).value()
	// 		res.status(200).json(updatedCategory)
	// 	} else {
	// 		res.status(400).json({message: 'Request body should have a title property'})
	// 	}
	// })

	// RULES
	// create a GET route
	// app.get('/rules', (req, res) => {
	// 	console.log("API: Get rules")
	// 	res.status(200).json(db.get('rules').value())
	// });

	// The route for creating new rules
	app.post('/rules', (req, res) => {
		console.log("API: Add rule")
		const {description, comparisons, category} = req.body
		if (description && comparisons.length > 0 && category) {
			const insertedRule = {
				id: shortid.generate(),
				description,
				comparisons,
				category
			}
			db.get('rules').insert(insertedRule).write()

			res.status(200).json(insertedRule)
		} else {
			res.status(400).json({message: 'Request body should have a field, comparisons and category'})
		}
	})

	// The route for creating new rules
	app.put('/apply_rules', (req, res) => {
		console.log("API: Apply rules")
		const {uncategorizedOnly} = req.body

		const updatedTransactions = []
		const failedTransactions = []

		db.get('transactions').value().forEach(transaction => {
			if (!uncategorizedOnly || transaction.category === "22ofrnfYO") {
				const categories = applyRules(transaction)
				if (categories.length === 1) {
					transaction.category = categories[0]
					db.get('transaction').find({id: transaction.id}).assign(transaction).write()
					updatedTransactions.push(transaction)
				} else if (categories.length > 0) {
					console.log("Transaction " + transaction.id + " has multiple categories: " + categories)
					failedTransactions.push({
						"transaction": transaction.id,
						"categories": categories
					})
				}
			}
		})

		res.status(200).json({
			updatedTransactions,
			failedTransactions
		})
	})

	if (newDb) {
		// set some defaults (required if JSON file is empty)
		db.defaults({
			transactions: [],
			categories: [],
			rules: []
		}).write();
	}
	return db;
}).then(() => {
	const port = process.env.PORT || 5000
	app.listen(port, () => console.log(`Listening on port ${port}`));
})
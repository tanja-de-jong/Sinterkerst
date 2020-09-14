const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')
const {pool} = require('./config')

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const isProduction = process.env.NODE_ENV === 'production'
const origin = {
	origin: isProduction ? 'https://www.example.com' : '*',
}

app.use(cors(origin))
app.use(express.static('client'))

const limit = 20


// TRANSACTIONS
const getPages = (request, response) => {
	console.log("API: Get pages")
	const category = request.query.category
	let query = 'SELECT * FROM transactions'
	if (category) query += ' WHERE transactions.category = category'
	pool.query(query, (error, results) => {
		if (error) {
			throw error
		}

		const pages = Math.ceil(results.rows.length / limit)
		response.status(200).json(pages)
	})
}

const getTransactions = async (request, response) => {
	console.log("API: Get transactions")
	const { category, page } = request.query
	let query = 'SELECT * FROM transactions'

	if (category) {
		const descendants = await getDescendantCategories(category)
		let categoryAndChildren = '(' + category // TODO
		descendants.forEach(desc => categoryAndChildren += ', ' + desc)
		categoryAndChildren += ')'
		query += ' WHERE transactions.category in ' + categoryAndChildren
	}
	if (page) {
		const offset = (page - 1) * limit
		query += ' OFFSET ' + offset + ' ROWS FETCH NEXT ' + limit + ' ROWS ONLY'
	}

	pool.query(query, (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const setCategory = (request, response) => {
	console.log("API: Set category for transaction")
	const {categoryId, transactionId} = request.body
	pool.query(
		'UPDATE transactions SET category = $1 WHERE id = $2 RETURNING *',
		[categoryId, transactionId],
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).json(results.rows[0])
		})
}

const uploadFile = async (request, response) => {
	console.log("API: Upload file")
	csv({headers: ["date", "description", "account", "otheraccount", "code", "debitOrCredit", "amount", "mutation", "remarks"]})
		.fromFile(req.file.path)
		.then(async (json) => {
			if (json.length > 0) {
				const account = json[0].account
				// const lastUpdated = db.get('accounts').find({iban: account}).value().updated
				const lastUpdated = await pool.query('SELECT * FROM accounts WHERE iban = $1', [account])
				let newLastUpdated = lastUpdated

				const existingTransactions = []
				const newTransactions = []
				await json.forEach(transaction => {
					// Process fields
					if (transaction.debitOrCredit === "Af") {
						transaction.amount = "-" + transaction.amount
					}

					// Check if transaction exists
					pool.query(
						'SELECT id FROM transactions WHERE date = $1 AND description = $2 AND ' +
						'account = $3 AND otheraccount = $4 AND code = $5 AND amount = $6 AND mutation = $7 ' +
						'AND remarks = $8 LIMIT 1)', [
							transaction.date,
							transaction.description,
							transaction.account,
							transaction.otheraccount,
							transaction.code,
							transaction.amount,
							transaction.mutation,
							transaction.remarks
						], (error, results) => {
							if (error) {
								throw error
							}

							if (results.rows.length > 0) {	// Transaction already exists, so don't add again
								existingTransactions.push(results.rows[0].id)
							} else {										// Transaction doesn't exist yet, so add it
								// Set the last updated date of the account to the date of the newest transaction
								if (transaction.date > newLastUpdated) {
									newLastUpdated = transaction.date
								}

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
								pool.query('INSERT INTO transactions (date, description, account, otheraccount, code, amount, mutation, remarks, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
									[transaction.date, transaction.description, transaction.account, transaction.otheraccount, transaction.code, transaction.amount, transaction.mutation, transaction.remarks, transaction.category],
									(error, results) => {
										if (error) {
											throw error
										}

										newTransactions.push(results.rows[0])
									}
								)
							}
						})
				})

				pool.query(
					'UPDATE accounts SET updated = $1 WHERE iban = $2 RETURNING *',
					[newLastUpdated, account],
					(error, results) => {
						if (error) {
							console.log("Couldn't update 'last updated' for account " + account)
							throw error
						}
					})

				if (existingTransactions.length > 0) {
					console.log("Transactions already exist:")
					console.log(existingTransactions.map(t => t.id))
				}

				response.status(200).json(newTransactions)
			}
		})
});


// CATEGORIES
const getCategories = (request, response) => {
	console.log("API: Get categories")
	pool.query('SELECT * FROM categories', (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const updateCategory = (request, response) => {
	console.log("API: Update category")
	const {id, name, parent} = request.body
	if (id && name) {
		pool.query(
			'UPDATE categories SET name = $2, parent = $3 WHERE id = $1 RETURNING *',
			[id, name, parent],
			(error, results) => {
				if (error) {
					throw error
				}
				response.status(200).json(results.rows[0])
			})
	} else {
		response.status(400).json({message: 'Request body should have id and name properties'})
	}
}

const postCategory = (request, response) => {
	console.log("API: Post category")
	const {name, parent} = request.body
	if (name) {
		pool.query(
			'INSERT INTO categories (name, parent) VALUES ($1, $2) RETURNING *',
			[name, parent],
			(error, results) => {
				if (error) {
					throw error
				}
				response.status(200).json(results.rows[0])
			})
	} else {
		response.status(400).json({message: 'Request body should have a name property'})
	}
}


// RULES
const getRules = (request, response) => {
	console.log("API: Get rules")
	pool.query('SELECT * FROM rules', (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

// TODO: Also update comparisons
const updateRule = (request, response) => {
	console.log("API: Update rule")
	const {id, name, category} = request.body
	if (id) {
		pool.query(
			'UPDATE rules SET name = $2, category = $3 WHERE id = $1 RETURNING *',
			[id, name, category],
			(error, results) => {
				if (error) {
					throw error
				}
				response.status(200).json(results.rows[0])
			})
	} else {
		response.status(400).json({message: 'Request body should have an id property'})
	}
}

// TODO: Also update comparisons
const postRule = (request, response) => {
	console.log("API: Post rule")
	const {name, category} = request.body
	if (category) {
		pool.query(
			'INSERT INTO rules (name, category) VALUES ($1, $2) RETURNING *',
			[name, category],
			(error, results) => {
				if (error) {
					throw error
				}
				response.status(200).json(results.rows[0])
			})
	} else {
		response.status(400).json({message: 'Request body should have a category property'})
	}
}


// ACCOUNTS
const getAccounts = (request, response) => {
	console.log("API: Get accounts")
	pool.query('SELECT * FROM account', (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

app
	.route('/api/pages')
	.get(getPages)

app.route('/api/transactions')
	.get(getTransactions)

app.route('/api/transactions/set-category')
	.put(setCategory)

	// .route('/amounts')

app.route('/api/categories')
	.get(getCategories)
	.put(updateCategory)
	.post(postCategory)

app.route('/api/rules')
	.get(getRules)
	.put(updateRule)
	.post(postRule)

	// .route('/rules')
	// .route('/apply_rules')

app.route('/api/account')
	.get(getAccounts)


// Start server
app.listen(process.env.PORT || 5000, () => {
	console.log(`Server listening`)
})

// HELPERS
const getDescendantCategories = async (parent) => {
	let response
	try {
		response = await pool.query('SELECT * FROM categories WHERE parent = $1', [parent])
		const children = response.rows.map(result => result.id)
		let result = children
		for (let i = 0; i < children.length; i++) {
			result = result.concat(await getDescendantCategories(children[i]))
		}
		return result
	} catch (error) {
		// Do something
	}
}

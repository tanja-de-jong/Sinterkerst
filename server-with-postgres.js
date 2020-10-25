const express = require('express');
const path = require('path');
const multer  = require('multer')
const bodyParser = require('body-parser');
const cors = require('cors')
const {pool} = require('./config')
const csv = require('csvtojson');
const moment = require('moment');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const upload = multer({dest: 'uploads/'})
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

const jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: 'https://twilight-snowflake-4165.us.auth0.com/.well-known/jwks.json'
	}),
	audience: 'tanja-money-manager.heroku.com',
	issuer: 'https://twilight-snowflake-4165.us.auth0.com/',
	algorithms: ['RS256']
});
app.use(jwtCheck);

// TRANSACTIONS
const getNumberOfRows = async (request, response) => {
	console.log("API: Get rows")
	const { category, account } = request.query
	let query = 'SELECT * FROM transactions'
	if (category) {
		const descendants = await getDescendantCategories(category)
		let categoryAndChildren = '(' + category // TODO
		descendants.forEach(desc => categoryAndChildren += ', ' + desc)
		categoryAndChildren += ')'
		query += ' WHERE transactions.category in ' + categoryAndChildren
	}

	pool.query(query, (error, results) => {
		if (error) {
			throw error
		}

		response.status(200).json(results.rows.length)
	})
}

const getTotalAmountForCategory = async (request, response) => {
	console.log("API: Get total amount for category")
	const {category} = request.query
	let amount = 0

	const descendants = await getDescendantCategories(category)
	let categoryAndChildren = '(' + category // TODO
	descendants.forEach(desc => categoryAndChildren += ', ' + desc)
	categoryAndChildren += ')'

	let query = 'SELECT account, extract(month from date) as month, extract(year from date) as year, SUM(amount) FROM transactions WHERE transactions.category in ' + categoryAndChildren + " GROUP BY account, year, month ORDER BY account, year, month"
	pool.query(query, (error, results) => {
		if (error) {
			throw error
		}

		response.status(200).json(results.rows)
	})
}

// Deprecated
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
	let { category, page, limit, account } = request.query

	if (!limit) limit = 15
	let query = 'SELECT * FROM transactions'

	if (category && account) {
		const descendants = await getDescendantCategories(category)
		let categoryAndChildren = '(' + category // TODO
		descendants.forEach(desc => categoryAndChildren += ', ' + desc)
		categoryAndChildren += ')'
		query += ' WHERE transactions.category in ' + categoryAndChildren

		query += ' AND transactions.account = ' + account
	} else if (category) {
		const descendants = await getDescendantCategories(category)
		let categoryAndChildren = '(' + category // TODO
		descendants.forEach(desc => categoryAndChildren += ', ' + desc)
		categoryAndChildren += ')'
		query += ' WHERE transactions.category in ' + categoryAndChildren
	} else if (account) {
		query += ' WHERE transactions.account = ' + account
	}
	query += ' ORDER BY transactions.date DESC'
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

const getExpenses = (request, response) => {
	console.log("API: Get expenses")
	let { start, end } = request.query
	let query = 'SELECT account, sum(amount) FROM transactions'
	query += ' WHERE date >= \'' + start + '\' AND date <= \'' + end + '\' AND amount < 0 AND category != 71 AND category != 73 GROUP BY account'
	console.log(query)

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

const uploadFile = (request, response) => {
	console.log("API: Upload file")

	csv({headers: ["date", "description", "account", "otheraccount", "code", "debitOrCredit", "amount", "mutation", "remarks"]})
		.fromFile(request.file.path)
		.then(async (transactions) => {
			if (transactions.length > 0) {
				const account = await getAccountByIban(transactions[0].account)

				const transactionDates = transactions.map(transaction => parseInt(transaction.date))
				const firstDate = moment(Math.min(...transactionDates), "YYYYMMDD").toDate()

				if (firstDate > account.updated) {
					// Update account's 'last updated'
					const lastDate = moment(Math.max(...transactionDates), "YYYYMMDD").toDate()
					pool.query('UPDATE accounts SET updated = $1 WHERE id = $2', [lastDate, account.id],
						(error) => {
							if (error) console.log("Couldn't update 'last updated' for account " + account.iban)
						})

					// Insert transactions
					const newTransactions = []
					 for (let transaction of transactions) {
						transaction = processFields(transaction, account.id)
						 const rules = await pool.query('SELECT * FROM rules')
						 await applyRulesOnTransaction(rules, transaction)
						await pool.query('INSERT INTO transactions (date, description, account, otheraccount, code, amount, mutation, remarks, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
							[transaction.date, transaction.description, transaction.account, transaction.otheraccount, transaction.code, transaction.amount, transaction.mutation, transaction.remarks, transaction.category],
							(error, results) => {
								if (error) {
									throw error
								}

								newTransactions.push(results.rows[0])
								console.log("Inserted transaction " + results.rows[0].id)
							}
						)
					}
					response.status(200).json(newTransactions)
				}
			}
		})
}

const applyRules = async (request, response) => {
	console.log("API: Apply rules")
	const updatedTransactions = []
	const failedTransactions = []

	pool.query('SELECT * FROM transactions', [], async (error, result) => {
		if (error) throw error
		for (const transaction of result.rows) {
			const success = await applyRulesOnTransaction(transaction)
			if (success) { // TODO
				updatedTransactions.push(transaction)
			} else {
				failedTransactions.push(transaction)
			}
			pool.query('UPDATE transactions SET category = $1, typeofrule = $2 WHERE id = $3', [transaction.category, transaction.typeOfRule, transaction.id])
		}

		response.status(200).json({ updatedTransactions, failedTransactions })
	})
}

const getAmounts = async (request, response) => {
	console.log("API: get amounts")

	const accounts = request.query.accounts.split(',')
	const categories = request.query.categories.split(',')
	const result = []
	for (const account of accounts) {
		const amounts = []
		for (const category of categories) {
			const amount = await amountByCategory(account, category)
			amounts.push(amount)
		}
		result.push({
			account: parseInt(account),
			amounts
		})
	}

	response.status(200).json(result)
}

// CATEGORIES
const getCategories = (request, response) => {
	console.log("API: Get categories")
	pool.query('SELECT * FROM categories ORDER BY id ASC', (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const updateCategory = (request, response) => {
	console.log("API: Update category")
	const {id, name, parent, type, budget, budgetPeriod} = request.body
	if (id && name) {
		pool.query(
			'UPDATE categories SET name = $2, parent = $3, type=$4, budget = $5, budgetperiod = $6 WHERE id = $1 RETURNING *',
			[id, name, parent, type, budget, budgetPeriod],
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
	const {name, parent, type, budget, budgetPeriod} = request.body
	if (name) {
		pool.query(
			'INSERT INTO categories (name, parent, type, budget, budgetperiod) VALUES ($1, $2, $3, $4, $5) RETURNING *',
			[name, parent, type, budget, budgetPeriod],
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

const postRule = async (request, response) => {
	console.log("API: Post rule")
	const {name, category, comparisons} = request.body
	if (category) {
		pool.query(
			'INSERT INTO rules (name, category) VALUES ($1, $2)',
			[name, category],
			(error) => {
				if (error) {
					throw error
				}
				for (const comparison in comparisons) {
					pool.query(
						'INSERT INTO comparisons (field, type, text, rule) VALUES ($1, $2, $3, $4)',
						[comparison.field, comparison.type, comparison.text, comparison.rule]
					)
				}
				response.status(200)
			})
	} else {
		response.status(400).json({message: 'Request body should have a category property'})
	}
}


// ACCOUNTS
const getAccounts = (request, response) => {
	console.log("API: Get accounts")
	pool.query('SELECT * FROM accounts', (error, results) => {
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

app.route('/api/transactions/amount')
	.get(getTotalAmountForCategory)

app.route('/api/expenses')
	.get(getExpenses)

app.route('/api/transactions/rows')
	.get(getNumberOfRows)

app.route('/api/transactions/set-category')
	.put(setCategory)

app.route('/api/transactions/upload')
	.post(upload.single('transactionList'), uploadFile)

app.route('/api/apply_rules')
	.put(applyRules)

app.route('/api/transactions/amounts')
	.get(getAmounts)

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

app.route('/api/accounts')
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

const getAccountByIban = async (iban) => {
	let response
	try {
		response = await pool.query('SELECT * FROM accounts WHERE iban = $1 LIMIT 1', [iban])
		return response.rows[0]
	} catch (error) {
		console.log("ERROR: getting account for iban " + iban)
	}
}

const processFields = (transaction, accountId) => {
	transaction.account = accountId
	if (transaction.debitOrCredit === "Af") {
		transaction.amount = "-" + transaction.amount
	}
	transaction.amount = parseFloat(transaction.amount.replace(',', '.'))
	return transaction
}

const applyRulesOnTransactions = () => {} // TODO

const applyRulesOnTransaction = async (transaction) => {
	let appliedRule
	const rules = await pool.query('SELECT * FROM rules')
	const categories = []
	let comparisons
	for (const rule of rules.rows) {
		comparisons = await pool.query('SELECT * FROM comparisons WHERE rule = $1', [rule.id])
		const valid = ruleIsValid(transaction, comparisons.rows)
		if (valid && !categories.includes(rule.category)) {
			categories.push(rule.category)
			appliedRule = rule
		}
	}

	if (categories.length === 1) {
		transaction.category = categories[0]
		transaction.typeOfRule = appliedRule.type
	} else {
		if (!transaction.category) transaction.category = 72	// Ongecategoriseerd, do not overwrite if category is already set
		if (categories.length > 0) {
			return false
			console.log("Transaction " + transaction.id + " has multiple categories: " + categories)
		}
	}
	return true
}

const ruleIsValid = (transaction, comparisons) => {
	if (comparisons.length === 0) {
		console.log("No comparisons!")
		return false
	}
	let allComparisonsTrue = true
	comparisons.forEach(comparison => {
		const {field, type, text} = comparison
		if (!transaction[field].toString().toLowerCase().includes(text.toLowerCase())) {	// TODO: actually use'type' instead of hardcoded 'includes'
			allComparisonsTrue = false
		}
	})
	return allComparisonsTrue
}

const amountByCategory = async (account, category) => {
	const years = [2019, 2020]
	const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

	const result = {
		category: parseInt(category),
		years: []
	}

	for (let year of years) {
		const yResult = {
			year,
			months: []
		}
		result.years.push(yResult)
		for (let month of months) {
			const amount = await amountByCategoryAndMonth(account, category, year, month)
			const mResult = {
				month,
				amount: parseFloat(amount)
			}
			yResult.months.push(mResult)
		}
	}
	return result
}

const amountByCategoryAndMonth = async (account, category, year, month) => {
	const startDate = new Date(year, month, 1)
	const endDate = new Date(year, month + 1, 1)

	let response
	try {
		response = await pool.query('SELECT * FROM transactions t WHERE t.account = $1 AND t.category = $2 AND t.date >= $3 AND t.date < $4', [account, category, startDate, endDate])
		const amount = response.rows.map(transaction => transaction.amount).reduce((a, b) => a + b, 0.00).toFixed(2)
		return amount
	} catch (error) {
		console.log("ERROR: getting amount")
	}
}
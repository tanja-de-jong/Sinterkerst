const express = require('express');
const multer  = require('multer')
const csv = require('csvtojson');
const shortid = require('shortid');
const low = require('lowdb');
const lodashId = require('lodash-id');
const fs = require('fs');
const FileAsync = require('lowdb/adapters/FileAsync');
const bodyParser = require('body-parser');

const upload = multer({dest: 'uploads/'})
const app = express();
const port = process.env.PORT || 5000;
const dbPath = 'db.json';
let newDb = true;

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
	// create a GET route
	app.get('/transactions', (req, res) => {
		res.status(200).json(db.get('transactions').value())
	});

	app.get('/categories', (req, res) => {
		console.log("API: Fetch categories")
		res.status(200).json(db.get('categories').value())
	});

	app.put('/set-category', (req, res) => {
		console.log("API: Set category")
		const {categoryId, transactionId} = req.body
		if (transactionId) {
			db.get('transactions').find({id: transactionId}).assign({
				category: categoryId
			}).write()
			const updatedTransaction = db.get('transactions').find({id: transactionId}).value()
			console.log(updatedTransaction)
			res.status(200).json(updatedTransaction)
		} else {
			res.status(400).json({message: 'Request body should have a transaction id property'})
		}
	});

	// Receive a CSV file
	app.post('/upload-file', upload.single('transactionList'), (req, res, next) => {
		console.log("API: Upload file")
		csv({headers: ["date", "description", "account", "otherAccount", "code", "debitOrCredit", "amount", "mutation", "remarks"]})
			.fromFile(req.file.path)
			.then((json) => {
				return new Promise((resolve,reject) => {
					json.forEach(transaction => transaction.id = shortid.generate())
					db.get('transactions').push(...json).write()
					res.status(200).json(json)
				})
			})
	});

	// CATEGORIES
	// The route for creating new inventory items
	app.post('/categories', (req, res) => {
		console.log("API: Add category")

		const {name, parent, expenses} = req.body
		if (name) {
			const insertedCategory = {
				id: shortid.generate(),
				name: name,
				parent: parent
			}
			if (expenses) {
				db.get('categories').get('expenses').insert(insertedCategory).write()
			} else {
				db.get('categories').get('income').insert(insertedCategory).write()
			}
			res.status(200).json(insertedCategory)
		} else {
			res.status(400).json({message: 'Request body should have a name property'})
		}
	})

	// The route for updating existing inventory items
	app.put('/categories', (req, res) => {
		console.log("API: Update category")
		const {id, name, parent, expenses} = req.body
		if (id && name) {
			if (expenses) {
				db.get('categories').get('expenses').find({id: id}).assign({
					name: name,
					parent: parent
				}).write()
			} else {
				db.get('categories').get('income').find({id: id}).assign({
					name: name,
					parent: parent
				}).write()
			}

			const updatedCategory = db.get('categories').find({id:id}).value()
			res.status(200).json(updatedCategory)
		} else {
			res.status(400).json({message: 'Request body should have a title property'})
		}
	})

	if (newDb) {
		// set some defaults (required if JSON file is empty)
		db.defaults({
			transactions: [],
			categories: []
		}).write();
	}
	return db;
}).then(() => {
	const port = process.env.PORT || 5000
	app.listen(port, () => console.log(`Listening on port ${port}`));
})
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const {pool} = require('./config')
const moment = require('moment');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

// create server
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

// TODO
// const jwtCheck = jwt({
//   secret: jwks.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: 'https://twilight-snowflake-4165.us.auth0.com/.well-known/jwks.json'
//   }),
//   audience: 'tanja-money-manager.heroku.com',
//   issuer: 'https://twilight-snowflake-4165.us.auth0.com/',
//   algorithms: ['RS256']
// });
// app.use(jwtCheck);

const getUsers = (request, response) => {
  console.log("API: Get users")
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUser = (request, response) => {
  console.log("API: Get user")
  const { userId } = request.query
  pool.query('SELECT * FROM users WHERE id = $1 ORDER BY id ASC', [userId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows[0])
  })
}

const getItems = (request, response) => {
  console.log("API: get items")
  pool.query('SELECT * FROM items ORDER BY id DESC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getLogs = (request, response) => {
  console.log("API: get logs")
  pool.query('SELECT * FROM log ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateLog = async (request, response) => {
  console.log("API: Update log")
  const { userId } = request.body
  const maxLogId = await getMaxLogId()

  pool.query('UPDATE users SET log = $1 WHERE id = $2 RETURNING *', [maxLogId, userId], (error, res) => {
    if (error) {
      throw error
    }

    console.log(res.rows[0])

    response.status(200).json(res.rows[0])
  })
}

const postItem = (request, response) => {
  console.log("API: Post item")
  console.log(request.body)
  const { owner, name, url, description, createdBy } = request.body
  pool.query('INSERT INTO items (owner, name, url, description, createdBy, checked, checkedBy) VALUES ($1, $2, $3, $4, $5, false, -1) RETURNING *', [owner, name, url, description, createdBy], async (error, res) => {
    if (error) {
      throw error
    }

    const createdItem = res.rows[0]

    const newLog = await generateLogItem('CREATE_ITEM', createdItem.id, owner)
    response.status(200).json({ item: createdItem, log: newLog })
  })
}

const checkItem = async (request, response) => {
  console.log("API: Check item")
  const { item, buyerId } = request.body

  pool.query('SELECT * FROM items WHERE id = $1', [item.id], (error, results) => {
    if (error) {
      throw error
    }

    const existingItem = results.rows[0]
    const type = item.checked ? "UNCHECK_ITEM" : "CHECK_ITEM"
    const setChecked = !item.checked
    if (type === "CHECK_ITEM" && existingItem.checked) {
      response.status(409)
    } else {
      pool.query('UPDATE items SET checked = NOT checked, checkedBy = $1 WHERE id = $2 RETURNING *', [buyerId, item.id], async (error, res) => {
        if (error) {
          throw error
        }
        const updatedItem = res.rows[0]
        console.log(updatedItem)
        const newLog = await generateLogItem(type, updatedItem.id, buyerId)
        const result = { item: updatedItem, log: newLog }
        response.status(200).json(result)
      })
    }
  })
}

const getMaxLogId = async () => {
  const logId = await pool.query('SELECT coalesce(max(id), 0) FROM log')
  return logId.rows[0].coalesce
}

const generateLogItem = async (type, itemId, committerId) => {
  const maxLogId = await getMaxLogId()
  const newId = maxLogId + 1
  const createdLog = await pool.query('INSERT INTO log (id, type, item, committer, date) VALUES ($1, $2, $3, $4, $5) RETURNING *', [newId, type, itemId, committerId, new Date()])
  return createdLog.rows[0]
}

app.route('/api/users')
  .get(getUsers)

app.route('/api/user')
  .get(getUser)

app.route('/api/items')
  .get(getItems)
  .post(postItem)

app.route('/api/logs')
  .get(getLogs)

app.route('/api/update_log')
  .post(updateLog)

app.route('/api/check')
  .post(checkItem)

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening`)
})
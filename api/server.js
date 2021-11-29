// FIRST STEP: IMPORTS

const express = require('express')
const User = require('./users/model')

//SECOND STEP: INSTANCE OF EXPRESS APP
const server = express()


//THIRD STEP: GLOBAL MIDDLEWARE
server.use(express.json())



//FOURTH STEP: ENDPOINTS


// | GET    | /api/users/:id | Returns the user object with the specified `id`.                                                       |
// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                                 |
// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |

// {
//   id: "a_unique_id", // String, required
//   name: "Jane Doe",  // String, required
//   bio: "Having fun", // String, required
// }

// | POST   | /api/users     | Creates a user using the information sent inside the `request body`. `insert` Takes a new user `{ name, bio }` and resolves to the the newly created user `{ id, name, bio }`.
// When the client makes a `POST` request to `/api/users`:

// - If the request body is missing the `name` or `bio` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON response: `{ message: "Please provide name and bio for the user" }`.

// - If the information about the _user_ is valid:

//   - save the new _user_ the the database.
//   - respond with HTTP status code `201` (Created).
//   - return the newly created _user document_ including its id.

// - If there's an error while saving the _user_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON object: `{ message: "There was an error while saving the user to the database" }`.

server.post('/api/users',async (req,res) => {
  try {
    const { name, bio } = req.body
    // 2- assume stuff is bad, handle
    if (!name || !bio) {
      res.status(400).json({ message: 'Please provide name and bio for the user' })
    } else {
      // 3- hit the db and send the stuff
      const user = await User.insert({ name, bio })
      res.status(201).json(user)
    }
  } catch (error) {
    res.status(500).json({ message: `There was an error while saving the user to the database` })
  }
})






// | GET    | /api/users     | Returns an array users.   `find` Resolves to the list of users (or empty array).

server.get('api/users', async (req,res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({message: `The users information could not be retrieved`})
  }

})




// LAST STEP: EXPOSING THE SERVER TO OTHER MODULES
module.exports = server // EXPOSING THE SERVER TO OTHER MODULES

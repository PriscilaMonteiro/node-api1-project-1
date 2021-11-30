// FIRST STEP: IMPORTS
const express = require('express')
const cors = require('cors')
const User = require('./users/model')

//SECOND STEP: INSTANCE OF EXPRESS APP
const server = express()


//THIRD STEP: GLOBAL MIDDLEWARE
server.use(express.json())
server.use(cors())



//FOURTH STEP: ENDPOINTS
                



// | POST   | /api/users     

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



// | GET    | /api/users    

server.get('/api/users', async (req,res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({message: `The users information could not be retrieved`})
  }

})

// server.get('/api/users', (req,res) => {
//   User.find()
//     .then(users => {
//       res.json(users)
//     })
//     .catch(err => {
//       res.status(500).json({
//         message: 'The users information could not be retrieved'
//       })
//     })
// })


// | GET    | /api/users/:id | Returns the user object with the specified `id`.   

// server.get('/api/users/:id', async (req,res) => {
//   try {
//     const { id } = req.params
//     const user = await User.findById(id)
//     if (!user) {
//       res.status(404).json({message: `The user with the specified ID does not exist`})
//     } else {
//       res.status(200).json(user)
//     }
//   } catch (error) {
//     console.log(error.message)
//     res.status(500).json({message: `The user information could not be retrieved`})
//   }

// })

server.get('/api/users/:id', (req,res) => {
  const { id } = req.params
  User.findById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({message: `The user with the specified ID does not exist`})
      } else {
      res.json(user)
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'The users information could not be retrieved'
      })
    })
})


// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.        

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params
  User.remove(id)
    .then(deletedUser => {
      if (!deletedUser) {
        res.status(404).json({ message: 'The user with the specified ID does not exist' })
      } else {
        res.status(200).json(deletedUser)
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'The users information could not be retrieved' })
    })
})

// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |

server.put('/api/users/:id', async (req,res) => {
  try {
    const { id } = req.params
    const { name, bio } = req.body
    const possibleUser = await User.findById(req.params.id)
    if (!possibleUser) {
      res.status(404).json({message: 'The user with the specified ID does not exist'})
    } else {
      if (!name || !bio) {
        res.status(400).json({message: 'Please provide name and bio for the user'})
      } else {
        const updatedUser = await User.update(id, { name, bio })
        res.status(200).json(updatedUser)
      }
    }
  } catch (error) {
    res.status(500).json({message: `The users information could not be retrieved`})
  }
})


// LAST STEP: EXPOSING THE SERVER TO OTHER MODULES
module.exports = server 
const jwt = require('jsonwebtoken');
const app = require("../../util/configureApi");
const connectDB = require("../../util/db");
const Google = require("../../models/Google");
const config = require('../../config');

app.post("*", (req, res) => {
  let finalUser; 
  connectDB()
    .then(() => {
      // create the account if not on the db
      console.log('Google account created:', req.body);
      return Google.create(req.body);
    })
    .then(() => {
      // find the email on the db
      return Google.findOne({ email: req.body.user.email });
    })
    .then(user => {
      console.log('Test 2nd then:', user);
      finalUser = user;
    })
    .then(() => {
      // add token session to account
      return jwt.sign({ userId: finalUser._id }, config.JWT_SECRET, {
        expiresIn: "1m"
      });
    })
    .then(token => {
      console.log('Accepted response:', finalUser, 'TOKEN', token);
      // res.status(200).json({
      //   result: {
      //     firstName: '',
      //     lastName: '',
      //     email: '',
      //     token,
      //   },
      // })
    })
    .catch(e => {
      console.log('Something went wrong:', e);
    });
  }
);

module.exports = app;

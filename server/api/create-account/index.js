const app = require("../../util/configureApi");
const connectDB = require("../../util/db");
const User = require("../../models/User");

app.post("*", (req, res) => {
  connectDB()
    .then(() => {
      console.log('Created account:', req.body);
      return User.create(req.body);
    })
    .then((userItem) => {
      console.log('Accepted response:', userItem);
      res.status(200).json({
        result: userItem,
      })
    })
    .catch(e => {
      console.log('Something went wrong:', e);
    });
  }
);

module.exports = app;

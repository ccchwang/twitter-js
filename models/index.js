const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/twitterdb');

const Tweet = db.define('tweet', {
  content: {
    type: Sequelize.STRING
  }
})

const User = db.define('user', {
  name: {
    type: Sequelize.STRING
  }
})

Tweet.belongsTo(User)

module.exports = {
  db: db,
  User: User,
  Tweet: Tweet
}

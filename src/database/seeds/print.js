const getConnection = require('../connection');
const User = require('../entities/user.entity');

(async () => {
  await getConnection();
  const users = await User.find();

  console.log(users);
})();

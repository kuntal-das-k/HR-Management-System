const bcrypt = require('bcryptjs');

bcrypt.hash('Admin@123', 10).then(hash => {
  console.log('New Admin Hash:', hash);
});

bcrypt.hash('Emp@123', 10).then(hash => {
  console.log('New Employee Hash:', hash);
});

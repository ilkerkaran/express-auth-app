const users = [
  {
    id: 1,
    username: 'jd@gmail.com',
    password: 'pw123'
  },
  {
    id: 2,
    username: 'johndoe@gmail.com',
    password: 'very_secure_password'
  },
  {
    id: 3,
    username: 'jilldoe@gmail.com',
    password: 'very_secure_password!'
  },
  {
    id: 4,
    username: 'jimdoe@gmail.com',
    password: 'pw123'
  }
];

module.exports.findUser = (username, password) => {
  const err = null;
  const user = users.filter(
    u => u.username === username && u.password === password
  );
  if (!user || user.length !== 1) throw err;
  else return user[0];
};

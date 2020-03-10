let users = [];

const addUser = ({ id, username, room }) => {
  // clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // validate the data
  if (!username || !room) {
    return {
      error: "username and room are required"
    };
  }

  // check for existing user
  const existingUser = users.find(user => {
    return user.username === username && user.room === room;
  });

  // validate user
  if (existingUser) {
    return {
      erorr: "username is in use"
    };
  }

  // store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  // cach 1 dung filter
  // users = users.filter(x => {
  //   return x.id !== id;
  // });
  // cach 2 dung splice
  const index = users.findIndex(user => {
    return user.id === id;
  });
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => {
  // co the dung find
  // them [0] de tra ve object, neu khong no se tra ve array chua object
  return users.filter(user => {
    return user.id === id;
  })[0];
};

const getUserInRoom = room => {
  room = room.trim().toLowerCase();
  return users.filter(user => {
    return user.room === room;
  });
};

module.exports = {
  getUserInRoom,
  getUser,
  removeUser,
  addUser
};

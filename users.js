const users = [];

//add user
const addUser = ({ id, name, room }) => {
  //change user's data to a lowercase string without space
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //check if there is an existing user
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) return { error: "Username is taken." };

  //if no existing user, then create a new user
  const user = { id, name, room };
  users.push(user);

  //to know which user was pushed
  return { user };
};

//remover user
const removeUser = (id) => {
  //find user with that specific id

  const index = users.findIndex((user) => {
    user.id === id;
  });

  // if there is a matched index, use splice to remove the user and [0] is to return it that removed user
  if (index !== -1) return users.splice(index, 1)[0];
};

//get user
const getUser = (id) => users.find((user) => user.id === id);

//get users in room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };

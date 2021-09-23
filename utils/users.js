const users = [];

// Add user to chat
const addUser = (id, username, room) => {
    const user = { id, username, room };

    users.push(user);

    return user;
};

// Get current user by id
const getCurrentUser = (id) => {
    return users.find((user) => user.id === id);
};

// On user disconnect
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// Get all users in a room
const getAllUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
};

module.exports = {
    addUser,
    getCurrentUser,
    removeUser,
    getAllUsersInRoom,
};

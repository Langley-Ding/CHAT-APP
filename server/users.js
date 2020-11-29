const users = [];

const addUser = ({id,name,room}) => {
    //Javascript Mastery = javascriptmastery;

    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => {user.room === room && user.name === name});// 重名进入同一个房间

    if (existingUser) {
        return {error: 'Username is taken'};//报错！
    };

    const user = {id, name, room};

    users.push(user);

    return { user }// 便于我们知道，哪个user被push了
};

const removeUser = (id) => {
    const index = users.findIndex((user) => {user.id === id;});

    if (index !== -1) {
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    users.find((user) => user.id === id);// means the user exist!
}

const getUsersInRoom = (room) => {
    users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom};

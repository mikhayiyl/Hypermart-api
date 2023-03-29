const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
});


let onlineUsers = [];

//add user to onlineUsers array
const addUser = (userId, socketId) => {
    !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({ userId, socketId })
};

//remove disconnected user from onlineUsers array
const disconnectUser = socketId => {
    onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
};

// message recipient

const getRecipient = userId => {
    return onlineUsers.find(user => user.userId === userId);
}


io.on('connection', socket => {
    //on connection
    console.log('user connected');

    //get userId
    socket.on('ADD_USERID', userId => {
        addUser(userId, socket.id);
        io.emit('ONLINE_USERS', onlineUsers);
    });


    //send text
    socket.on('SEND_TEXT', ({ senderId, receiverId, text }) => {
        const recipient = getRecipient(receiverId);

        io.to(recipient?.socketId).emit('GET_TEXT', {
            senderId,
            text
        })

        //sent typing status
        socket.on('TYPING_STATUS', typingStatus => {

            io.to(recipient?.socketId).emit('status', {
                typingStatus
            })
        })



    })
    //sent friend request notification

    socket.on("FRIEND_REQUEST", ({ receiverId, currentuser }) => {
        const recipient = getRecipient(receiverId);
        console.log(recipient);
        io.to(recipient?.socketId).emit('friend_request', {
            currentuser
        })
    })


    //on disconection
    socket.on("disconnect", () => {
        console.log('user disconnected');
        disconnectUser(socket.id);
        io.emit('ONLINE_USERS', onlineUsers);
    })


})


const socket = io('/')

const userId = 12345

socket.emit('join-room', ROOM_ID, userId)

socket.on('user-connected', userId => {
  console.log('userId=', userId)
})
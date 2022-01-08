const socket = io('/')
const peer = new Peer()

peer.on('open', userId => {
  socket.emit('join-room', ROOM_ID, userId)
})

socket.on('user-connected', userId => {
  console.log('userId=', userId)
})
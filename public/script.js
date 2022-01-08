const socket = io('/')
const peer = new Peer()

const videoWrap = document.getElementById('video-wrap')
console.log(videoWrap)
const myVideo = document.createElement('video')
myVideo.muted = true

const peers = []
let myVideoStream;
const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  console.log(video)
  videoWrap.append(video)
}

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })
  peers[userId] = call
}

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: false
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)

  peer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    const userId = call.peer
    peers[userId] = call
  })
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  console.log('userId=', userId)
  if (peers[userId]) peers[userId].close()
})

peer.on('open', userId => {
  socket.emit('join-room', ROOM_ID, userId)
})

peer.on('disconnected', (userId) => {
  console.log('disconnected=', userId)
})

const muteUnmute = (e) => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled
  if (enabled) {
    e.classList.add('active')    
    myVideoStream.getAudioTracks()[0].enabled = false
  } else {
    e.classList.remove('active')    
    myVideoStream.getAudioTracks()[0].enabled = true
  }
}

const playStop = (e) => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled
  if (enabled) {
    e.classList.add('active')
    myVideoStream.getVideoTracks()[0].enabled = false
  } else {
    e.classList.remove('active')
    myVideoStream.getVideoTracks()[0].enabled = true
  }
}

const leaveVideo = (e) => {
  socket.disconnect()
  peer.disconnect()
  const videos = document.getElementsByTagName('video')
  for (let i = videos.length - 1; i >= 0; --i) {
    videos[i].remove()
  }
}
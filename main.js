const form = document.getElementById('send-container');  // it acquires full form
const messageInput = document.getElementById('messageInp');   // input field
const messageContainer = document.querySelector('.container');
var socket = io();    //starting socket   

var audio = new Audio('notification.mp3')

const append = (message, position) => {    // this function is creating dynamic divs for all operations
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

function onUserNameSubmit() {
    var userDiv = document.getElementsByClassName('userdiv')[0];
    var user = document.getElementsByClassName('username')[0].value;
    var chatDiv = document.getElementsByClassName('chat')[0];
    if(user.length > 0) {
        userDiv.classList.add('hide');   //class hiding
        chatDiv.classList.remove('hide');
        socket.emit('new-user-joined', user);
    } else {
        alert('Username Field cannot be empty');
    }
}

form.addEventListener('submit', (e) => {   // it targets submit button
    e.preventDefault();    // it prevents the page from going to default state
    const message = messageInput.value;
    append(`You: ${message}`, 'right'); 
    socket.emit('send', message);
    messageInput.value = '';
})

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left')
})

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
});

socket.on('left', name => {
    append(`${ name } left the chat`, 'left')
})

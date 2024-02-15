let url='http://localhost:8080'
const socket=io('http://localhost:8080/',{transports:['websocket']})
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
let receiver=""
console.log(`email is- ${email}`)
fetch(`${url}/users`,{
    method:'GET',
    headers:{
        'content-type':'application/json',
    authorization: `Bearer ${localStorage.getItem('token')}`
    }
})
.then(res=>res.json())
.then(data=>{
    display(data)
})
.catch(err=>console.log(err))

const display=(Alldata)=>{
    const box=document.getElementById('all-users')
    Alldata.forEach(data=>{
       if(data.email!==email)
       {
        const card=createCard(data)
        box.appendChild(card)
       }
    })
}

const createCard = (data) => {
    const card = document.createElement('div');
    card.id = 'card';

    let title = document.createElement('div');
    title.id = 'card-title';

    let img = document.createElement('img');
    img.id = 'card-img';
    const imagepath = data.avatar.replace(/\\/g, "/");
    img.src = `../../../backend/${imagepath}`;
    img.alt='upload avatar'

    let name = document.createElement('p');
    name.textContent = data.name;

    let btn = document.createElement('button');
    btn.textContent = 'message';
    btn.classList.add('btn-2');
    btn.addEventListener('click',()=>{
        message(data);
    })

    title.appendChild(img);
    title.appendChild(btn);
    card.appendChild(title);
    card.appendChild(name);

    return card;
}



///message

const message=(data)=>{
    receiver=data.email
    console.log(`other user is - ${receiver}`)
    document.getElementById('connected-user').textContent=`user- ${data.name}`
    document.getElementById('chat-area').style='block'
    document.getElementById('text-area').style='block'
}


///sockets
document.getElementById('send-msg').addEventListener('click',()=>{
    const text=document.getElementById('input-msg').value
    const obj={
        senderemail:email,
        receiveremail:receiver,
        msg:text
    }
    socket.emit('private_message',obj)
    displayMsg(obj)
    document.getElementById('input-msg').value=""
})
socket.on('receive_private_message',(obj)=>{
    displayMsg(obj)
})

const displayMsg=(obj)=>{
    const chatarea=document.getElementById('chat-area')
    const msg=document.createElement('div')
    let time=new Date()
    time=time.toString().slice(16, 24);
    msg.innerHTML=`<p>${obj.msg}</p><p style="position:absolute; right:0 ;opacity:0.7; margin-right:20px;">${time}</p>`
    if(obj.senderemail===email)
    {
        msg.classList.add('outgoing','message');
    }else{
        msg.classList.add('incoming','message');
    }
    chatarea.appendChild(msg);
    chatarea.scrollTop = chatarea.scrollHeight;
}

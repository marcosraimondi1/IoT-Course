const name_input = document.getElementById("name_input");
let content = name_input.value;
const message_input = document.getElementById("message_input");
const chat_window = document.getElementById("chat-window");

const clientId = "chat_client_"+ Math.random();

const options = {
  connectTimeout: 4000,

  //Authentication
  clientId: clientId, 
  keepalive: 60,
  clean: true,
}

       // WebSocket connect url
        const WebSocket_URL = 'ws://18.228.205.3:8083/mqtt';


        const client = mqtt.connect(WebSocket_URL, options);

        client.on('connect', () => {
            console.log('Connect success');

            client.subscribe('chat', (err)=>{
                if(!err){
                    console.log("Subscription - SUCCESS");
                }
            });
        })
 
       client.on('reconnect', (error) => {
            console.log('reconnecting:', error);
        });

        client.on('error', (error) => {
            console.log('Connect Error:', error);
        });


        client.on('message', (topic, message) => {
            console.log('The topic is ' + topic + ' and the message is ' + message.toString());
	  
	    const received = JSON.parse(message.toString());
	    console.log(received.message);
	    if(received.clientId === clientId){
	      chat_window.innerHTML = chat_window.innerHTML  + '<div style="color:blue"> <b>'+ received.message + '</b></div>';
	      console.log("MINE");
	    } else {
	     chat_window.innerHTML = chat_window.innerHTML+ '<div style="color:grey"> <i>'+ received.name + ': </i><b>'+ received.message + '</b></div>'; 
	    }
	  chat_window.scrollTop = chat_window.scrollHeight;
        })

message_input.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' || e.keyCode === 13){
    // name ?
    if (name_input.value === ""){
      chat_window.innerHTML = chat_window.innerHTML + '<div style="color:red"> <b> Your name is empty !!! </b> </div>';
      return;
  }
    const to_send = {
      name: name_input.value,
      message: message_input.value,
      clientId: clientId
    }
    
    client.publish('chat', JSON.stringify(to_send));

    message_input.value = "";

  }
})

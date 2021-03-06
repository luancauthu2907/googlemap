 const  Load = async (lati,longi)=>{
     let data;
   await  fetch("http://api.positionstack.com/v1/reverse?access_key=fa9022e4d287a38008d58090723eb12a&query="+lati+","+longi).then(response => response.json()).then (users =>{
       data=users;
       
    } );
    console.log(data);
   return data;

}
 function  geoFindMe() {
    
    
    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');
  
    mapLink.href = '';
    mapLink.textContent = '';
  
   async function  success (position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      status.textContent = '';
      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
   
       let data1=  await  Load(latitude,longitude);
      await   firebase.database().ref("Location/Local/").update({
        'SLT':Math.random(),
        "Nuoc": data1.data[0].country,
       "Quan": data1.data[0].county ,
       'City':data1.data[0].region});
      await  fetch("https://weatherbit-v1-mashape.p.rapidapi.com/current?lon=38.5&lat=-78.5", {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "d186b0ea4amsh6accb2de26f6e0dp13729cjsnbf9277f82cf9",
          "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com"
        }
      })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.error(err);
      });
    }
  
    function error() {
      status.textContent = 'Unable to retrieve your location';
    }
  
    if(!navigator.geolocation) {
      status.textContent = 'Geolocation is not supported by your browser';
    } else {
      status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
   
    document.getElementById("message").value= "";
  }
  
  document.querySelector('#find-me').addEventListener('click', geoFindMe);

  function Message1()
  
  {
      var Message=document.getElementById("message").value;
      firebase.database().ref("Sensor/data/").update({data2:parseInt(Message)})
      document.getElementById("message").value= "";
  
  }
  
  firebase.database().ref("Sensor").on("child_changed", function (snapshot) {
    var html = "";
    // give each message a unique ID
    if(true)
    {
        html += "<li id='message-" + snapshot.data + "' style='width:50%; background-color: rgb(0, 132, 255);color:white;border: 1px solid black; border-radius: 5px;'>";     
    }
    else
    {
    html += "<li id='message-" + snapshot.data + "' style='width:50%; background-color: #AFB3B9;color:white;border: 1px solid black; border-radius: 5px;'>";
    }
    // show delete button if message is sent by me
    html += snapshot.val().hour + "h : " + snapshot.val().minute+"m : "+snapshot.val().second;
    html += "</li>";
    html += "<br>"

    document.getElementById("messages").innerHTML = html;
  });

  firebase.database().ref("Location").on("child_changed", function(snapshot){
        let location = document.getElementById("location");
        location.innerHTML+=`<p>${snapshot.val().Quan} ,  ${snapshot.val().City} , ${snapshot.val().Nuoc} </p>`
    console.log("day ne"+snapshot.val().City);

  });

document.getElementById("createAcc").addEventListener("submit", async function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("password1").value;

    if (!email || !password || !username || !confirmPassword) {
        alert("Please fill all input fields");
        return;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Send a POST request to the server to register the user
    try {
        const response = await fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username,role, email, password }) // Send email and password to the server
        });

        if (!response.ok) {
            const errorMessage = await response.text(); // Get the error message from the server
            throw new Error(errorMessage || 'Failed to register user');
        }

        // Show confirmation message to the user
        alert('User registration successful! Please login to continue.');
        const id = await response.text();
        sessionStorage.setItem('new_id', id);
        window.location.href = './profile.html';
    } catch (error) {
        console.error('Error registering user:', error);
        alert('Failed to register user. Please try again.');
    }
});

async function profile() {
    const new_id = sessionStorage.getItem('new_id');
    const name = document.getElementById('name').value;
    const picInput = document.getElementById('pic');
    const locations = document.getElementById('locations').value;

    // Create FormData object
    const formData = new FormData();
    formData.append('new_id', new_id); // Include new_id in the request body
    formData.append('name', name);
    formData.append('locations', locations);
    formData.append('pic', picInput.files[0]); // Append file to FormData

    try {
        const response = await fetch('http://localhost:8080/profile', {
            method: 'POST',
            body: formData // Use FormData instead of JSON.stringify
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Failed to upload profile');
        }

        alert('Profile uploaded successfully!');
        window.location.href = './home.html';
    } catch (error) {
        console.error('Error uploading profile:', error);
        alert('Failed to upload profile. Please try again.');
    }
}



function generateRandomHex(length) {
    const characters = '0123456789abcdef';
    let result = '65'; // Start with '65'
    for (let i = 2; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}





async function login() {

    //This is the function for submitting the credentials in the login page
    // 
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;


    // If both username and password fields are empty
    // the window will alert that the user needs to fill in both fields
    if (!username || !password) {
        alert("Please fill missing input");
        return
    }

    // we will change the url of this once we get to deploy our API
    await fetch('http://localhost:8080/login1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({"username": username, "password": password})
    })
       .then(response => response.json())
       .then(response  => {
            // This is the expected response from the endpoint
            // This is how we know the user credentials is valid and active
            if (response.message == 'OK') {
                
               
                const name = response.fname + " " + response.lname;
                console.log(name);
                sessionStorage.setItem("admin_name", name);
                window.location.href = './home.html';
            } else {
                alert("Invalid Username or Password");
                return
            }

            /*
            if (response.message == 'OK') {
                sessionStorage.setItem("token", response.token);
            }
            */
       })
}


async function login1() {

    //This is the function for submitting the credentials in the login page
    // 
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;


    // If both username and password fields are empty
    // the window will alert that the user needs to fill in both fields
    if (!username || !password) {
        alert("Please fill missing input");
        return
    }

    // we will change the url of this once we get to deploy our API
    await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
       
        },
        body: JSON.stringify({username,password})
    })
       .then(response => response.json())
       .then(response  => {
            // This is the expected response from the endpoint
            // This is how we know the user credentials is valid and active
            if (response.message == 'OK') {
                
            const name = response.fname + " " + response.lname;
            console.log(name);
            sessionStorage.setItem("user_name", name);

                location.replace("./home.html");
            } else {
                alert("Invalid Username or Password");
                return
            }

            /*
            if (response.message == 'OK') {
                sessionStorage.setItem("token", response.token);
            }
            */
       })
}



async function getRooms(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8080/icons/convo/find/${id}`, {
            method: 'GET'
        }); 

       
        
        
        if (!response.ok) {
            throw new Error('Failed to fetch conversation data');
        }

        const data = await response.json();

        console.log(data);

        
        
        for (const convos of data) {
            if (convos.user1 === id || convos.user2 === id) {
                console.log("lol");
                const mainid = convos.user1 === id ? convos.user2 : convos.user1; // Determine which user ID to use
                const data1 = await getUsername(mainid);
            
                const encodedString = convos.convo; 
                const decodedString = atob(encodedString);

               
                // Split the decoded string into an array of chat messages
                const chatMessages = decodedString.split('\n');
                // Get the last chat message
                const lastChat = chatMessages[chatMessages.length - 1];

                var newDiv = document.createElement('div');

                // Set the innerHTML of the new div to your HTML structure
                newDiv.innerHTML = `
                    <div class="img">
                        <i class="fa fa-circle"></i>
                        <img src="images/default_profile.png">
                    </div>
                    <div class="desc">
                        <small class="time">05:30 am</small>
                        <h5>${data1.fullname}</h5>
                        <small> ${lastChat}</small>
                        <hr>
                    </div>
                `;

           

                // Add event listener to the new div
                newDiv.addEventListener('click', async function(event) {
                    document.getElementById('msgs').innerHTML = '';
                    document.querySelector('.right-section-bottom').innerHTML = '';
                   
                
                    // Your existing code to fetch and display conversation
                    console.log(convos.roomID);
                    const username = sessionStorage.getItem('user_name');
                    fetchConvo(convos.roomID, username);
                
                    // Create and append the new form
                    var newForm = document.createElement('div');
                    newForm.innerHTML = `
                        <div class="upload-btn">
                            <button type="button" class="btn"><i class="fa fa-photo"></i></button>
                            <input type="file" name="myfile" />
                        </div>
                        <input type="text" id="messageInput" name="message" placeholder="Type here...">
                        <button type="submit" class="btn-send"><i class="fa fa-send"></i></button>
                    `;
                    document.querySelector('.right-section-bottom').appendChild(newForm);
                });
                // Append the new div to your container 'convo_list'
                document.getElementsByClassName('chatList')[0].appendChild(newDiv);
                
                
            }

           
        }

        //document.getElementsByClassName('chatList')[0].innerHTML = convo_list; // Remove this line since we are appending individual divs now
    } catch (error) {
        console.error('Error fetching conversation data:', error.message);
    }
}


async function fetchConvo(id, username){
    try{
        const response = await fetch(`http://127.0.0.1:8080/icons/convo/findconvo/${id}`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log(data);
        console.log(username);

        const encodedString = data.convo; 
        const decodedString = atob(encodedString);
        console.log(decodedString);

        // Split the decoded string into individual messages
        const messages = decodedString.split('\n');

        // Loop through each message
        messages.forEach(message => {
            // Check if the message starts with the name of the user
            if (message.startsWith(username)) {
                // Append the message to the right side
                document.getElementById('msgs').innerHTML += `
                    <li class="msg-right">
                        <div class="msg-left-sub">
                            <img src="images/default_profile.png">
                            <div class="msg-desc">${message}</div>
                            <small>05:25 am</small>
                        </div>
                    </li>`;
            } else {
                // Append the message to the left side
                document.getElementById('msgs').innerHTML += `
                    <li class="msg-left">
                        <div class="msg-left-sub">
                            <img src="images/default_profile.png">
                            <div class="msg-desc">${message}</div>
                            <small>05:25 am</small>
                        </div>
                    </li>`;
            }
        });

        return decodedString;

    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return null; // Return null in case of error
    }
}


async function getUsername(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8080/icons/users/finduser/${id}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        console.log(data);

        return data; // Return the data variable
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return null; // Return null in case of error
    }
}





async function getActivities() {


    // This sets the activities content for the home.html 
    fetch("http://18.138.58.216:8080/icons/activities")
    .then((response) => response.json())
    .then((data) => {
        let activity_list = '';
        acts = document.getElementById('activities').innerHTML;
        let counter = 1;
        for (const activity of data) { 

            if (counter % 3 == 1) {
                activity_list += `<div class="row mt-4">`
            }
            activity_list += `<div class="col-md-4">
                            <div class="card" style="width: 100%;">
                            <img class="card-img-top" src="${activity.image_url}" alt="Card image cap">
                            <div class="card-body">
                            <h5 class="card-title">${activity.title}</h5>
                            <p class="card-text" style="text-align: justify;">${activity.text}</p>
                            </div>
                        </div></div>`

            if (counter % 3 == 0) {
                activity_list += `</div>`
            }
            counter++;
        }
        document.getElementById('activities').innerHTML = activity_list
    });
}



function appendMessage(message) {
    const username = sessionStorage.getItem('user_name');
    const chatContainer = document.getElementById('msgs');

    // Create a new list item element
    const listItem = document.createElement('li');
    
    // Add the class to the list item
    listItem.classList.add('msg-right');

    // Create the inner HTML for the message
    listItem.innerHTML = `
        <div class="msg-left-sub">
            <img src="images/default_profile.png">
            <div class="msg-desc">${username}: ${message}</div>
            <small>05:25 am</small>
        </div>
    `;

    // Append the list item to the chat container
    chatContainer.appendChild(listItem);
}


editActivities = []
async function editgetActivities() {

    // This sets the activities content for the home.html 
    fetch("http://18.138.58.216:8080/icons/activities")
    .then((response) => response.json())
    .then((data) => {
        editActivities = data;
        let activity_list = '';
        acts = document.getElementById('activities').innerHTML;
        let counter = 1;
        for (const activity of data) { 

            if (counter % 3 == 1) {
                activity_list += `<div class="row mt-4">`
            }
            activity_list += `<div class="col-md-4">
                            <div class="card" style="width: 100%;">
                            <img class="card-img-top" src="${activity.image_url}" alt="Card image cap">
                            <div class="card-body">
                            <h5 class="card-title">${activity.title}</h5>
                            <p class="card-text" style="text-align: justify;">${activity.text}</p>
                            <div></div>
                            <button class="edit_button" onclick="setBlogsModal('${activity._id}')"  data-bs-toggle="modal" data-bs-target="#myModal">EDIT</button>
                            <button class="delete_button" onclick="deleteActivity('${activity._id}')">DELETE</a>
                            </div>
                        </div></div>`

            if (counter % 3 == 0) {
                activity_list += `</div>`
            }
            counter++;
        }
        document.getElementById('activities').innerHTML = activity_list
    });
}


async function getObjectives() {

    // The endpoint /icons/objective returns the objectives text in the text attribute
    // that is why we access it using the data.text in line 80
    fetch("http://18.138.58.216:8080/icons/objectives")
    .then((response) => response.json())
    .then((data) => {
        document.getElementById('objectives_text').innerHTML = data.text
    });
}


async function createActivity() {

    // We get the inputs from the html fields in add.html
    // these are the three fields that we are collecting to create an activity
    image_url = document.getElementById('image_url').value;
    title = document.getElementById('title').value;
    text = document.getElementById('text').value;
    page_text = document.getElementById('page_text').value;

    const fileInput = document.getElementById('image_url');
    
    // Check if a file is selected
    if (fileInput.files.length > 0) {
        // Get the first selected file
        const file = fileInput.files[0];

        // Read the file as a data URL
        const reader = new FileReader();

        reader.onload = function(e) {
            // e.target.result contains the base64-encoded data URL
            const base64Image = e.target.result;

            console.log(base64Image);

            fetch('http://18.138.58.216:8080/icons/activities', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(
                    {
                        "image_url": image_url,
                        "title": title,
                        "text": text,
                        "page_text": page_text
                    }
                )
            })
               .then(response => response.json())
               .then(response => {
                    if (response.message == 'OK') {
                        alert('Successfully added a new activity')
                        location.reload();
                    }
               })



        };

        reader.readAsDataURL(file);


    }



 
}


async function deleteActivity(id) {

    // We delete the activity using this endpoint
    // with the DELETE method 

    await fetch(`http://18.138.58.216:8080/icons/activities/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
    })
       .then(response => response.json())
       .then(response => {
            if (response.message == 'OK') {
                alert('Deleted Successfully')
                editgetActivities();
            }
       })
}

async function deleteProgram(id) {

    // We delete the activity using this endpoint
    // with the DELETE method 

    await fetch(`http://18.138.58.216:8080/icons/programs/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
    })
       .then(response => response.json())
       .then(response => {
            if (response.message == 'OK') {
                alert('Deleted program successfully')
                adminGetPrograms();
            }
       })
}


async function deleteProgramContent(id) {

    // We delete the program content using this endpoint
    // with the DELETE method 

    await fetch(`http://18.138.58.216:8080/icons/programs/content/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
    })
       .then(response => response.json())
       .then(response => {
            if (response.message == 'OK') {
                alert('Deleted program content successfully')
                adminSetProgramContents();
            }
       })
}


let activities_array = []
async function setUserActivities() {

    // This is the function that sets the activities section content in activities.html

    fetch("http://18.138.58.216:8080/icons/activities")
    .then((response) => response.json())
    .then((data) => {
        let activity_list = '';
        let modals = '';
        acts = document.getElementById('activities').innerHTML;
        let counter = 1;
        activities_array = data;
        for (const activity of data) { 
            if (counter % 3 == 1) {
                activity_list += '<div class="articles">';
            }

            // Kindly change this to your preferred design
            // This is the initial design you had
            activity_list += `<div class="act">
                                <a onclick="getActivityPage('${activity._id}')">
                                <img src="${activity.image_url}"></a>
                                <h4 class="act-title">${activity.title}</h4>
                                <div class="line2"></div>
                                <p class="act-desc">${activity.text}</p>
                              </div>`
                      
            if (counter % 3 == 0) {
                activity_list += `</div>`
            }
            counter++;
        }
        document.getElementById('activities').innerHTML = activity_list
        //document.body.innerHTML += modals;
    });
}

async function getGallery() {
    fetch("http://18.138.58.216:8080/icons/activities")
    .then((response) => response.json())
    .then((data) => {
        let activity_list = `<div class="row">`;
        acts = document.getElementById('activities').innerHTML;
        let counter = 1;
        for (const activity of data) { 
            activity_list += `<div class="card" style="width: 18rem;">
                            <img class="card-img-top" src="${activity.image_url}" alt="Card image cap">
                            <div class="card-body">
                            <h5 class="card-title">${activity.title}</h5>
                            <p class="card-text">${activity.text}</p>
                            <button class="btn btn-primary">EDIT</button>
                            <button class="btn btn-danger" onclick="deleteActivity('${activity._id}')">DELETE</a>
                            </div>
                        </div>`
            
            if (counter % 3 == 0) {
                activity_list += `</div> <div class="row">`
            }
        }
        document.getElementById('activities').innerHTM
        L = activity_list
    });
}



// This is the needed functions for home.html
async function messageStartup() {
    let id = sessionStorage.getItem('id'); // Declare id using let
    console.log(id);
    await getRooms(id); // Await the result of the asynchronous function
}

// This is the needed functions for home.html
async function homeStartup() {
    getActivities();
    getObjectives();

    adminName = sessionStorage.getItem('admin_name');


    document.getElementById('admin_name').innerHTML = adminName;
    document.getElementById('admin_prefix').innerHTML = adminName['0'];
}

async function sendEmail() {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    // These are the values to get the inputs from the connect page

    if (!email || !name || !message) {
        alert('Please fill in all required fields')
        return 
    }

    const body = {
        'email': email,
        'subject': name,
        'message': message,
        'read': false
    }


    // This is the api call to send the email details to the api 
     await fetch('http://18.138.58.216:8080/icons/contact', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(body)
    })
       .then(response => response.json())
       .then(response => {
            if (response.message == 'OK') {
                alert('Successfully sent a message. Thank you')
                location.reload();
            }
    })
}

// This is the api call to set the objectives content
async function setObjectives() {
    fetch("http://18.138.58.216:8080/icons/objectives")
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('edit_objectives').value = data.text;
            document.getElementById('objectives_current').innerHTML = data.text;
            
    });
}

// This is the api call to update the objectives content
async function editObjectives() {
    const body = {
        'text': document.getElementById('edit_objectives').value
    }
    await fetch('http://18.138.58.216:8080/icons/objectives', {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(body)
    })
       .then(response => response.json())
       .then(response => {
            if (response.message == 'OK') {
                alert('Updated Succesfully')
                location.reload();
        }
    })
}

async function userGetGallery() {


    // This sets the gallery content for the activities.html 
    fetch("http://18.138.58.216:8080/icons/gallery")
    .then((response) => response.json())
    .then((data) => {
        let galleryText = '';
        for (const picture of data) { 
            galleryText += `<img src="${picture.image_url}" alt="img" draggable="false">`
        }
        document.getElementById('gallery').innerHTML = galleryText 
        
    });
}

async function blogsStartup() {
    setUserActivities();
    userGetGallery();
}

async function adminGalleryStartup() {
    getPictures();
}



async function getPictures() {


    // This gets the gallery content for the gallery.html 
    fetch("http://18.138.58.216:8080/icons/gallery")
    .then((response) => response.json())
    .then((data) => {
        let galleryText = '';
        let counter = 1;
        for (const picture of data) { 
            galleryText += `<div class="item text-center mt-5">
                                <h1>
                                    <strong>Picture ${counter}</strong>
                                    <button class="btn btn-danger btn-sm delete_button" onclick="deletePicture('${picture._id}')">DELETE</a>
                                </h1>
                                <img class="mx-auto img-fluid" style="height: 300px; width:600px;" src="${picture.image_url}" alt="">
                                
                            </div>`
            counter+=1;
        }

        document.getElementById('con').innerHTML = galleryText;
    });
}


async function deletePicture(id) {


    // We delete the picture using this endpoint
    // with the DELETE method 

    await fetch(`http://18.138.58.216:8080/icons/gallery/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
    })
        .then(response => response.json())
        .then(response => {
            if (response.message == 'OK') {
                alert('Picture has been deleted successfully')
                getPictures();
            }
        })
}

async function addPicture() {

    const fileInput = document.getElementById('image_url');
    
    // Check if a file is selected
    if (fileInput.files.length > 0) {
        // Get the first selected file
        const file = fileInput.files[0];

        // Read the file as a data URL
        const reader = new FileReader();

        reader.onload = function(e) {
            // e.target.result contains the base64-encoded data URL
            const base64Image = e.target.result;

            console.log(base64Image);

            fetch('http://18.138.58.216:8080/icons/gallery', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(
                    {
                        'image_url': base64Image,

                    }
                )
            })
               .then(response => response.json())
               .then(response => {
                    if (response.message == 'OK') {
                        alert('Successfully added a new activity')
                        location.reload();
                    }
               })



        };

        reader.readAsDataURL(file);


    }
    
}


let global_messages = []
async function getMessages() {

    // This gets the messages
    await fetch("http://18.138.58.216:8080/icons/contact")
    .then((response) => response.json())
    .then((data) => {
        let messageText = '';
        let counter = 1;
        let messages = data.reverse()
        global_messages = messages;
    });
}

show_unread_only = 0
async function toggleUnread() {
    show_unread_only += 1;
    if (show_unread_only == 3) {
        show_unread_only = 0;
    }

    toggle_button = document.getElementById('toggle_button');
    if (show_unread_only == 2) {
        await fetch("http://18.138.58.216:8080/icons/contact")
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            console.log('mga unread')
            let messages = data.reverse()
            messages = messages.filter(message => message.read == false);
            console.log(messages)
            global_messages = messages;
        });
        toggle_button.innerHTML = 'SHOW READ MESSAGES';
    } else if (show_unread_only == 1) {
        await fetch("http://18.138.58.216:8080/icons/contact")
        .then((response) => response.json())
        .then((data) => {
            let messages = data.reverse()
            global_messages = messages;
        });
        toggle_button.innerHTML = 'SHOW UNREAD MESSAGES';
    } else {
        await fetch("http://18.138.58.216:8080/icons/contact")
        .then((response) => response.json())
        .then((data) => {
            let messages = data.reverse()
            messages = messages.filter(message => message.read == true);
            global_messages = messages;
        });
        toggle_button.innerHTML = 'SHOW ALL MESSAGES';
    }
    if (show_unread_only == 3) {
        show_unread_only = 0;
    }
    changePage(current_page);
}


async function getUnreadMessages() {

    // This gets the Unread message content for the messages.html 
    fetch("http://18.138.58.216:8080/icons/contact")
    .then((response) => response.json())
    .then((data) => {
        let messageText = '';
        let counter = 1;
        let messages = data.reverse()
        messages = messages.filter(message => message.read == false);
        global_messages = messages;
        for (const message of messages) { 
            messageText += `<div class="card mt-4" style="font-weight: ${message.read ? 'normal': '700'};">
                                <div class="card-header">
                                ${message.read ? '': '<i class="bi bi-circle-fill" style="color: red"></i>'} ${message.created}
                                </div>
                                <div class="card-body">
                                <h5 class="card-title">${message.subject} - (${message.email})</h5>
                                <p class="card-text">${message.message}</p>
                                <a class="delete_button" onclick="deleteMessage('${message._id}')">Remove</a>
                                <a class="reply_button" target="_blank"
                                href='https://mail.google.com/mail/?view=cm&fs=1&to=${message.email}&su=${message.subject}&body=RE: ${message.message}'>
                                Reply</a>
                                <a class="read_button" onclick="updateMessage('${message._id}', ${message.read ? 'false)">Mark as Unread</a>' : 'true)">Mark as Read</a>'}
                                <a class="view_button" onclick="viewMessage('${message._id}')" data-bs-toggle="modal" data-bs-target="#messageModal"> View Full</a>
                                </div>
                            </div>`
            counter+=1;
        }

        document.getElementById('messages').innerHTML = '<a class="delete_button" style="margin: 0 auto;" onclick="getMessages()">Show All</a>' +  messageText;
    });
}

function viewMessage(message_id) {
    let result = global_messages.filter(message => message._id == message_id)[0];


    document.getElementById('message_author').innerHTML = result.email;
    document.getElementById('message_subject').innerHTML = result.subject;
    document.getElementById('message_content').innerHTML = result.message;
}

async function getActivityPage(id) {
    var filtered = activities_array.filter(function (el) {
        return el._id == id;
      })[0];
    sessionStorage.setItem('page_title', filtered.title);
    sessionStorage.setItem('page_image', filtered.image_url);
    sessionStorage.setItem('page_text', filtered.page_text);
    location.replace("./detail-page.html");
}

async function loadPageDetails() {
    document.getElementById('page_title').innerHTML = sessionStorage.getItem('page_title');
    document.getElementById('page_image').src = sessionStorage.getItem('page_image');
    document.getElementById('page_text').innerHTML = sessionStorage.getItem('page_text');
}


async function updateMessage(id, bool) {

    // We update the messages' status (read/unread) using this endpoint


    const body = {
        'read': bool
    }

    await fetch(`http://18.138.58.216:8080/icons/contact/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(response => {
            if (response.message == 'OK') {
                alert(`Message has been marked as ${bool ? 'Read' : 'Unread'}`)
                show_unread_only = !show_unread_only
                toggleUnread();
            }
        })
}

async function deleteMessage(id) {

    // We delete the message using this endpoint
    // with the DELETE method 

    await fetch(`http://18.138.58.216:8080/icons/contact/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        }
    })
        .then(response => response.json())
        .then(response => {
            if (response.message == 'OK') {
                alert('Message has been deleted successfully')
                show_unread_only = !show_unread_only
                toggleUnread();
            }
        })
}

function setBlogsModal(id) {
    var filtered = editActivities.filter(function (el) {
        return el._id == id;
      })[0];

      // This sets the content of the modal in blogs.html
      document.getElementById('blog_title_edit').value = filtered.title;
      document.getElementById('blog_desc_edit').value = filtered.text;
      document.getElementById('blog_url_edit').value = filtered.image_url;
      document.getElementById('blog_page_content_edit').value = filtered.page_text;

      document.getElementById('editActivitiesSaveButton').setAttribute('onclick',`saveNewActivity('${id}')`)
}

async function saveNewActivity(id) {
    const body = {
        'title': document.getElementById('blog_title_edit').value,
        'text': document.getElementById('blog_desc_edit').value,
        'image_url': document.getElementById('blog_url_edit').value,
        'page_text': document.getElementById('blog_page_content_edit').value
    }

    // This is the api call to update an activity
    await fetch(`http://18.138.58.216:8080/icons/activities/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(body)
    })
       .then(response => response.json())
       .then(response => {
            if (response.message == 'OK') {
                alert('Succesfully updated activity')
                location.reload();
        }
    })
    location.replace("./blogs.html")
}


var current_page = 1;
var records_per_page = 10;

function prevPage()
{
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}
    
async function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    var listing_table = document.getElementById("messages");
    var page_span = document.getElementById("page");
    var page_total = document.getElementById("page_total");
 
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = "";

    for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
        const message = global_messages[i];
        if (!message) {
            break;
        }
        listing_table.innerHTML += `<div class="card mt-4" style="font-weight: ${message.read ? 'normal': '700'};">
                                        <div class="card-header">
                                        ${message.read ? '': '<i class="bi bi-circle-fill" style="color: red"></i>'} ${message.created}
                                        </div>
                                        <div class="card-body">
                                        <h5 class="card-title">${message.subject} - (${message.email})</h5>
                                        <p class="card-text">${message.message}</p>
                                        <a class="delete_button" onclick="deleteMessage('${message._id}')">Remove</a>
                                        <a class="reply_button" target="_blank"
                                        href='https://mail.google.com/mail/?view=cm&fs=1&to=${message.email}&su=${message.subject}&body=RE: ${message.message}'>
                                        Reply</a>
                                        <a class="read_button" onclick="updateMessage('${message._id}', ${message.read ? 'false)">Mark as Unread</a>' : 'true)">Mark as Read</a>'}
                                        <a class="view_button" onclick="viewMessage('${message._id}')" data-bs-toggle="modal" data-bs-target="#messageModal"> View Full Message</a>
                                        </div>
                                    </div>`;
    }
    page_span.innerHTML = page;
    page_total.innerHTML = numPages();

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}

function numPages()
{
    return Math.ceil(global_messages.length / records_per_page);
}

programs = []
async function getPrograms() {

    // This sets the program content for the about.html 
    fetch("http://18.138.58.216:8080/icons/programs")
    .then((response) => response.json())
    .then((data) => {
        programs = data;
        let programsText = '';
        for (const program of data) { 
            programsText += `<div class="max-w-sm br-max overflow-hidden shadow-lg mt-8">
                                <a onclick="goToProgramContentPage('${program._id}')">
                                <img class="programCard" src="${program.image_url}" alt="${program.title}">
                                <div class="px-6 py-4">
                                    <div class="font-bold text-xl mb-2">${program.title}</div>
                                    <p class="text-gray-700 text-base">
                                    ${program.description}
                                    </p>
                                </div>
                                </a>
                            </div>`
        }
        document.getElementById('programs').innerHTML = programsText
    });
}

async function adminGetPrograms() {

    // This sets the program content for the about.html 
    fetch("http://18.138.58.216:8080/icons/programs")
    .then((response) => response.json())
    .then((data) => {
        programs = data;
        let programsText = '';
        for (const program of data) { 
            programsText += `<div class="col-md-4">
                                <div class="card" style="width: 100%;">
                                    <img class="card-img-top" src="${program.image_url}" alt="Card image cap">
                                    <div class="card-body">
                                        <h5 class="card-title">${program.title}</h5>
                                        <p class="card-text" style="text-align: justify;">${program.description}</p>
                                        <button class="edit_button" onclick="setProgramModal('${program._id}')" data-bs-toggle="modal" data-bs-target="#myModal">EDIT</button>
                                        <button class="manage_button" style="margin-right: 4px;" onclick="viewProgram('${program._id}')">MANAGE</a>
                                        <button class="add_button" style="margin-right: 4px;" onclick="goToAddContent('${program._id}')">ADD</a>
                                        <button class="delete_button" onclick="deleteProgram('${program._id}')">DELETE</a>
                                        
                                    </div>
                                </div>
                            </div>`
        }
        document.getElementById('programs').innerHTML = programsText
    });
}

async function viewProgram(id) {
    sessionStorage.setItem('program_id', id)
    location.replace("./view_program.html");
}
program_contents = []
async function adminSetProgramContents() {
    // This sets the program content for the about.html 
    
    fetch(`http://18.138.58.216:8080/icons/programs/${sessionStorage.getItem('program_id')}`)
    .then((response) => response.json())
    .then((data) => {
        programs = data;
        program_contents = data;
        let programsText = '';
        for (const program of data) { 
            programsText += `<div class="col-md-4">
                                <div class="card" style="width: 100%;">
                                    <img class="card-img-top" src="${program.image_url}" alt="Card image cap">
                                    <div class="card-body">
                                        <h5 class="card-title">${program.title}</h5>
                                        <p class="card-text" style="text-align: justify;">${program.description}</p>    
                                        
                                        <button class="edit_button" onclick="setProgramContentModal('${program._id}')" data-bs-toggle="modal" data-bs-target="#myModal">EDIT</button>
                                        <button class="delete_button" onclick="deleteProgramContent('${program._id}')">DELETE</a>
                                    </div>
                                </div>
                            </div>`
        }


       if (data.length == 0) {
           programsText = '<h1>There is current no available content for this program.</h1>'
           document.getElementById('program_content').classList.add("h-56")
       }


        document.getElementById('program_content').innerHTML = programsText

    });
}

async function aboutStartup(){
    await getObjectives();
    await getPrograms();
}

function setProgramContentModal(id) {
    var filtered = program_contents.filter(function (el) {
        return el._id == id;
      })[0];


      // This sets the content of the modal when editing a program content
    
      document.getElementById('blog_title_edit').value = filtered.title;
      document.getElementById('blog_desc_edit').value = filtered.description;
      document.getElementById('blog_url_edit').value = filtered.image_url;
      document.getElementById('blog_page_content_edit').value = filtered.page_content;

      document.getElementById('editActivitiesSaveButton').setAttribute('onclick',`saveNewProgramContent('${id}')`)
}


function setProgramModal(id) {
    var filtered = programs.filter(function (el) {
        return el._id == id;
      })[0];

      console.log(filtered)

      // This sets the content of the modal when editing a program
    
      document.getElementById('blog_title_edit').value = filtered.title;
      document.getElementById('blog_desc_edit').value = filtered.description;
      document.getElementById('blog_url_edit').value = filtered.image_url;

      document.getElementById('editActivitiesSaveButton').setAttribute('onclick',`saveNewProgram('${id}')`)
}

async function saveNewProgram(id) {
    const body = {
        'title': document.getElementById('blog_title_edit').value,
        'description': document.getElementById('blog_desc_edit').value,
        'image_url': document.getElementById('blog_url_edit').value,
    }

    await fetch(`http://18.138.58.216:8080/icons/programs/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(body)
    })
       .then(response => response.json())
       .then(response => {
            if (response.message == 'OK') {
                alert('Successfully updated program')
                location.reload();
        }
    })
    location.replace("./manage_programs.html")
}

async function saveNewProgramContent(id) {
    const body = {
        'title': document.getElementById('blog_title_edit').value,
        'description': document.getElementById('blog_desc_edit').value,
        'image_url': document.getElementById('blog_url_edit').value,
        'page_content': document.getElementById('blog_page_content_edit').value,
        'program_id': sessionStorage.getItem('program_id')
    }

    // This is the api call to update the newly edited program content
    await fetch(`http://18.138.58.216:8080/icons/programs/content/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(body)
    })
       .then(response => response.json())
       .then(response => {
            if (response.message == 'OK') {
                alert('Succesfully updated program content')
                location.reload();
        }
    })
    location.replace("./view_program.html")
}

async function getProgramPage(id) {
    var filtered = programs.filter(function (el) {
        return el._id == id;
      })[0];
    sessionStorage.setItem('page_title', filtered.title);
    sessionStorage.setItem('page_image', filtered.image_url);
    sessionStorage.setItem('page_text', filtered.page_content);
    location.replace("./program-page.html");
}


function goToProgramContentPage(id) {
    sessionStorage.setItem('program_id', id)
    location.replace("./programs.html");
}

function goToAddContent(id) {
    sessionStorage.setItem('program_id', id)
    location.replace("./add_program_content.html");
}

async function getProgramContents() {
     // This sets the program content for the about.html 
     
     fetch(`http://18.138.58.216:8080/icons/programs/${sessionStorage.getItem('program_id')}`)
     .then((response) => response.json())
     .then((data) => {
         programs = data;
         let programsText = '';
         for (const program of data) { 
             programsText += `<div class="max-w-sm rounded overflow-hidden shadow-lg mt-8">
                                 <a onclick="getProgramPage('${program._id}')">
                                 <img class="w-full" src="${program.image_url}" alt="${program.title}">
                                 <div class="px-6 py-4">
                                     <div class="font-bold text-xl mb-2">${program.title}</div>
                                     <p class="text-gray-700 text-base">
                                     ${program.description}
                                     </p>
                                 </div>
                                 </a>
                             </div>`
         }


        if (data.length == 0) {
            programsText = '<h1>There is current no available content for this program.</h1>'
            document.getElementById('program_content').classList.add("h-56")
        }


         document.getElementById('program_content').innerHTML = programsText

     });
}


async function createProgram() {

    // We get the inputs from the html fields in add.html
    // these are the three fields that we are collecting to create a program
    image_url = document.getElementById('image_url').value;
    title = document.getElementById('title').value;
    text = document.getElementById('text').value;

    const fileInput = document.getElementById('image_url');
    
    // Check if a file is selected
    if (fileInput.files.length > 0) {
        // Get the first selected file
        const file = fileInput.files[0];

        // Read the file as a data URL
        const reader = new FileReader();

        reader.onload = function(e) {
            // e.target.result contains the base64-encoded data URL
            const base64Image = e.target.result;

            console.log(base64Image);

            fetch('http://18.138.58.216:8080/icons/programs', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(
                    {
                        "image_url": base64Image,
                        "title": title,
                        "description": text,
                    }
                )
            })
               .then(response => response.json())
               .then(response => {
                    if (response.message == 'OK') {
                        alert('Successfully added a new program')
                        location.reload();
                    }
               })



        };

        reader.readAsDataURL(file);


    }
}

async function createProgramContent()  {

    // We get the inputs from the html fields in add.html
    // these are the four fields that we are collecting to create a program content
  
    title = document.getElementById('title').value;
    text = document.getElementById('text').value;
    page_text = document.getElementById('page_text').value;

    const fileInput = document.getElementById('image_url');
    
    // Check if a file is selected
    if (fileInput.files.length > 0) {
        // Get the first selected file
        const file = fileInput.files[0];

        // Read the file as a data URL
        const reader = new FileReader();

        reader.onload = function(e) {
            // e.target.result contains the base64-encoded data URL
            const base64Image = e.target.result;

            console.log(base64Image);

            fetch('http://18.138.58.216:8080/icons/programs/content', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(
                    {
                        'image_url': base64Image,
                        "title": title,
                        "description": text,
                        "page_content": page_text,
                        "program_id": sessionStorage.getItem('program_id')

                    }
                )
            })
               .then(response => response.json())
               .then(response => {
                    if (response.message == 'OK') {
                        alert('Successfully added a new activity')
                        location.reload();
                    }
               })



        };

        reader.readAsDataURL(file);


    }
}


// Function to preview the selected image
function previewImage() {
    const fileInput = document.getElementById('image_url');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    // Remove any existing preview
    imagePreviewContainer.innerHTML = '';

    // Check if a file is selected
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Read the file as a data URL
        const reader = new FileReader();

        reader.onload = function (e) {
            const image = document.createElement('img');
            image.src = e.target.result;
            image.alt = 'Image Preview';
            image.style.maxWidth = '100%';
            image.style.maxHeight = '100%'; // Update to 100% for full-screen view

            // Add a click event listener to toggle full-screen mode
            image.addEventListener('click', toggleFullScreen);

            // Append the image to the preview container
            imagePreviewContainer.appendChild(image);

            // Show the remove button
            document.getElementById('removeButton').style.display = 'block';
        };

        // Read the file as a data URL
        reader.readAsDataURL(file);
    }
}

// Function to show the remove button
function showRemoveButton() {
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'btn btn-danger mt-2';
    removeButton.onclick = removeImage;

    // Append the remove button to the imageInputContainer
    document.getElementById('imageInputContainer').appendChild(removeButton);
}

// Function to remove the image and reset the input field
function removeImage() {
    const fileInput = document.getElementById('image_url');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    // Remove the image preview
    imagePreviewContainer.innerHTML = '';

    // Reset the file input
    fileInput.value = '';

    // Hide the remove button
    document.getElementById('removeButton').style.display = 'none';
}

// Function to toggle full-screen mode when the image is clicked
function toggleFullScreen() {
    const image = document.querySelector('#imagePreviewContainer img');

    if (image.requestFullscreen) {
        image.requestFullscreen();
    } else if (image.mozRequestFullScreen) { // Firefox
        image.mozRequestFullScreen();
    } else if (image.webkitRequestFullscreen) { // Chrome, Safari and Opera
        image.webkitRequestFullscreen();
    } else if (image.msRequestFullscreen) { // IE/Edge
        image.msRequestFullscreen();
    }
}
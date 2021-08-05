const feelingsContainer = document.getElementById("myUL");
const db = firebase.firestore();
const solutionsContainer = document.getElementById("solutionsContainer");
const feelingsTab = document.getElementById("feelingsTab");
const solutionTab = document.getElementById("solutionTab");
const homeScreen = document.getElementById("home-screen");
const messagingScreen = document.getElementById("messaging-screen");
const messageContainer = document.getElementById("message-container")
const switchOne = document.getElementById("switchOne");
const switchTwo = document.getElementById("switchTwo");
const message = document.getElementById("message");
const messageBoard = document.getElementById("message-board")
var user, displayName, email, photoURL, emailVerified, uid;
const body = document.querySelector("body");
const messagesDoc = []


retrieveItems();
function retrieveItems(){
    db.collection("test").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            returnRetrievedItems(doc)
        })
    })
}
function returnRetrievedItems(doc) {
    var feeling = doc.data().feeling;
    var solutions = doc.data().solutions;
    feelingsContainer.innerHTML += 
    `
    <li onclick="showSolutionConainer('solution-container-${doc.id}')" class="feeling border-black border-solid border-2 border-t-0 w-full p-2 text-center placeholder-black hover:bg-gray-200" id="${doc.id}"><p>Suggestion: ${feeling}</p></li>
    `;
    solutionTab.innerHTML += 
    `
    <div class="hidden m-10" id="solution-container-${doc.id}">
        <h3 class="mt-24 bg-black text-white text-lg font-semibold p-4 text-center rounded-3xl">Feeling: ${feeling}</h3>
        <h3 class="mt-10  text-lg font-semibold">Solutions:</h3>
        <div class=""grid grid-cols-1 divide-y divide-yellow-500" id="solution-${doc.id}">
        </div>
    </div>
    `;
    for (let index = 0; index < solutions.length; index++) {
        document.getElementById(`solution-${doc.id}`).innerHTML += `
        <div>${index + 1}) ${solutions[index]}</div>
        `
        console.log(solutions[index])
    }
}

function searchForSuggestions() {
    var ul, li, p, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        p = li[i].getElementsByTagName("p")[0];
        txtValue = p.textContent || p.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function showSolutionConainer(currentElementId) {
    const hideSolutionBtn = document.getElementById("hideSolutionBtn");
    feelingsTab.style.display = "none";
    var currentElement = document.getElementById(currentElementId);
    currentElement.style.display = "block";
    hideSolutionBtn.style.display = "block";
    switchOne.style.display = "none";
}

function hideSolutionTab() {
    for (let index = 0; index < solutionTab.children.length; index++) {
        solutionTab.children[index].style.display = "none"
    }
    feelingsTab.style.display = ""
    switchOne.style.display = "flex";
}
function switchToMsgScreen() {
    homeScreen.style.display = "none";
    switchOne.style.display = "none";
    switchTwo.style.display = "flex";
    messagingScreen.style.display = "block";
    body.className = "bg-black";
}

function switchToHomeScreen() {
    homeScreen.style.display = "block";
    switchOne.style.display = "flex";
    switchTwo.style.display = "none";
    messagingScreen.style.display = "none";
    body.className = "bg-white";

}
var uiConfig = {
    callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {

        return afterSignIn(authResult);
        },
    },
    signInFlow: 'redirect',
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', uiConfig)

function afterSignIn() {
    switchToMsgScreen()
    user = firebase.auth().currentUser;
    if (user !== null) {
            displayName = user.displayName;
            email = user.email;
            photoURL = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;
            messageContainer.style.display = "block"
        console.log(displayName)
        console.log(email)
        retriveMessages()
    }
}

function submitButtonClick(event) {
    event.preventDefault();
    console.log(message.value)
    db.collection("messages").add({
        userName: displayName,
        message: message.value,
        sentDate: firebase.firestore.FieldValue.serverTimestamp()
    })
    message.value = '';
}

function retriveMessages() {
    db.collection("messages").orderBy("sentDate")
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (messagesDoc.includes(doc.id) == false) {
                returnRetrievedMessages(doc)         
                messagesDoc.push(doc.id)
            }
        });
        console.log(messagesDoc)
    });
}
function returnRetrievedMessages(doc) {
    var userName = doc.data().userName;
    var message = doc.data().message;

    messageBoard.innerHTML += 
    `
    <div>
        <br>
        <h4 class="font-bold text-lg">${userName}</h4>
        <p>${message}</p>
        <br>
    </div>
    `;
}

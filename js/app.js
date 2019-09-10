function makeUser() {
    const makeEmail = document.querySelector('.email').value;
    const makePassword = document.querySelector('.password').value;
    const makeUsername = document.querySelector('.username').value;

    fetch('http://thesi.generalassemb.ly:8080/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: makeEmail,
            password: makePassword,
            username: makeUsername
        })
    })

    // CHECK IF USER EXISTS? IF YES, POST ERROR
    // ALSO REFRESH TO LANDING PAGE
        .then((res) =>{
            return res.json();
        })
        .then((res) => {
            localStorage.setItem('user', res.token);
            if (res.token) { // DO I GET A RESPONSE? IF YES:
                window.location.href = "landing.html";
            }
            // makePost();
        })
        .catch((error) => {
            console.log(error);
        })
}
function loginUser() {
    // LOGIN USER USING THE CREDENTIALS
    const userEmail = document.querySelector('.loginEmail').value;
    const userPassword = document.querySelector('.loginPassword').value;

    fetch('http://thesi.generalassemb.ly:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: userEmail,
            password: userPassword
        })
    })

    // CHECK IF USER EXISTS? IF NO, POST ERROR
    // ALSO REFRESH TO LANDING PAGE        
        .then((res) => {
            return res.json();
        })
        .then((res) =>{
            localStorage.setItem('user', res.token);
            if (res.token) { // DO I GET A RESPONSE? IF YES:
                window.location.href = "landing.html";
            }
        })
        .catch((error) =>{
            console.log(error);
        })
}
if(window.location.pathname == "/regLogin.html") {
    document.querySelector('.submit').addEventListener("click", makeUser);
    document.querySelector('.loginSubmit').addEventListener("click", loginUser);
}



// function makePost();
// TAKES USER INPUT
// PUTS IT IN THE DOM (LANDING.HTML)
// SUBMIT BUTTON FROM /LANDING.HTML TAKEN
function makePost(event) {
    event.preventDefault();

    const title = document.querySelector('.postTitle').value;
    const post = document.querySelector('.postField').value;

    fetch("http://thesi.generalassemb.ly:8080/post", {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('user'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            description: post
        })
    })
        .then((res) => {
            postToLanding(res);
        })
        .catch((error) => {
            console.log(error);
        })

}
// function postWithLanding() { // Posts our post to landing lol
//     fetch('')
// }


if (window.location.path == "/landing.html") {
    document.querySelector('.postSubmit').addEventListener("click", makePost);
}
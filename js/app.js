// MY TOKEN: "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJpcWJhbEBhbndhci5jb20iLCJleHAiOjE1NjgwNzEwNjMsImlhdCI6MTU2ODA1MzA2M30.cm19HinmEzC22YeBU_nV8Kvm5VGWNR6mzqTTOfrpgfan4GRceNIGUP-iTxaSb2aJ3hN6dI9RCGPlE-7Fixpvog"

let userToken = "";

function makeUser(e) {
    e.preventDefault();
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
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
        })
}
const newUser = document.querySelector('.submit').addEventListener("click", makeUser);



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
            console.log(res);
            userToken = res.token;
            return userToken;
        })
        .catch((error) =>{
            console.log(error);
        })
}
const login = document.querySelector('.loginSubmit').addEventListener("click", loginUser);

// function refreshToLanding() {

// }
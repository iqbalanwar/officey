// MY TOKEN: "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJpcWJhbEBhbndhci5jb20iLCJleHAiOjE1NjgwNzEwNjMsImlhdCI6MTU2ODA1MzA2M30.cm19HinmEzC22YeBU_nV8Kvm5VGWNR6mzqTTOfrpgfan4GRceNIGUP-iTxaSb2aJ3hN6dI9RCGPlE-7Fixpvog"

function getUserData() {
    fetch('http://thesi.generalassemb.ly:8080/posts')
        .then((res) =>{
            return res.json();
        })
        .then((res) => {
            console.log(res);
            return res;
        })
        .catch((err) =>{
            console.log(error);
        })
}

function makeUser() {
    fetch('http://thesi.generalassemb.ly:8080/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: "BLAHa@BLAH.COM",
            password: "12345678",
            username: "bloo"
        })
    })
    // USER CREATED MESSAGE
}
function loginUser() {
    fetch('http://thesi.generalassemb.ly:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: "BLAHa@BLAH.COM",
            password: "12345678"
        })
    })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{
            console.log(res);
        })
        .catch((error) =>{
            console.log(error);
        })
}


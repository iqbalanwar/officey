function getUserData() {
    fetch('http://thesi.generalassemb.ly:8080/login')
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
            email: "BLAH@BLAH.COM",
            password: "12345678",
            username: "BLAH_BLAH"
        })
    })
}

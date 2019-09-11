function makeUser() {
    const makeEmail = document.querySelector('.email').value;
    const makePassword = document.querySelector('.password').value;
    const makeUsername = document.querySelector('.username').value;
    localStorage.setItem('username',makeUsername.value);

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




function makeAndShowPosts() {
    // TAKES USER INPUT
    // CALLS A FUNCTION TO POST IT IN THE DOM (postToLanding())
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
                //console.log(window.location);
            })
            .catch((error) => {
                console.log(error);
            })

    }
    // TAKES USER INPUT
    // PUTS USER INPUT INTO A LIST ITEM
    // APPENDS LIST ITEM TO LANDING.HTML
    // Posts our post to landing lol
    function postToLanding() {
        fetch("http://thesi.generalassemb.ly:8080/user/post", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('user')
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                const list = document.querySelector('.allPosts');

                for (let i = 0; i < res.length; i++) {
                    const item = document.createElement('li');
                    const title = document.createElement('h3');
                    const post = document.createElement('p');

                    item.appendChild(title);
                    item.appendChild(post);
                    title.innerText = res[i].title;
                    post.innerText = res[i].description;

                    list.appendChild(item);
                }

                // for (let j = 0; j < (res.length-1); j++) {
                //     document.getElementsByTagName("li")[j].innerHTML = "";
                // }

                // const childs = Array.from(list.childNodes).reverse();
                // /* ul_list.innerHTML = ""; */
                // childs.forEach(item => {
                //     ul_list.appendChild(item);
                // });

            })
            .catch((error) => {
                console.log(error);
            })
    }
    // document.querySelector('.postSubmit').addEventListener("click", makePost);
    if (window.location.path == "/landing.html") {
        document.querySelector('.postSubmit').addEventListener("click", makePost);
    }
}
makeAndShowPosts();



// GET USER POSTS WHICH IS AN ARRAY
// TAKE USER CHOICE (input) OF WHICH ITEM THEY WANT TO DELETE
// GO THROUGH THE ARRAY TO GET TO THAT INDEX ITEM OF THE USER CHOICE (store the id)
// Separate function: DELETE THAT ID WHICH WAS STORED
function getPostId() {
    fetch("http://thesi.generalassemb.ly:8080/user/post", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('user')
        }
    })
        // .then((res) => {
        //     return res.json();
        // })
        .then((res) => { // Returns null. Wonderful.
            console.log(res);
        })
}





/*
OUR PROBLEMS RIGHT NOW:
- The post submit should only be functional in the landing page, and not run globally

- The list of all posts should show up by default
    - Right now, the workaround is that we can see all the posts only when we post
- The list of all posts should be reversed, so the newest content in on top
- DELETE EVERYTHING (repeats) SHOWN IN THE DOM USING .remove()

- Show the user that their registration already exists/login does not exist
- When the user is logged in, don't allow them to access the login page

- DELETE POSTS
- MAKE COMMENTS
- DELETE COMMENTS
- UPDATE PROFILE (which is just the mobile #)

BONUS:
- Make profile page that shows the user's info
- Show the users posts in their profile
*/

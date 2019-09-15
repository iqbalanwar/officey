function checkLogin() {
    if (localStorage.getItem('user') != 'undefined') {
        // Edit navbar a loginstatus
        // Say welcome!
        const aTag = document.querySelector("nav").lastElementChild;
        // console.log(aTag);
        aTag.style.display = "none";
    }
}

/*============================= REGISTRATION AND LOGIN =============================*/
if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) == "regLogin.html") {
    console.log("You're in the regLogin!");
    document.querySelector('.submit').addEventListener("click", makeUser);
    document.querySelector('.loginSubmit').addEventListener("click", loginUser);
}

function makeUser() {
    const makeEmail = document.querySelector('.email').value;
    const makePassword = document.querySelector('.password').value;
    const makeUsername = document.querySelector('.username').value;
    localStorage.setItem('username',makeUsername);

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
    localStorage.setItem('username', userEmail);

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


/*============================= POSTS AND COMMENTS ON LANDING PAGE =============================*/

if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) == "landing.html") {
    checkLogin();
    document.querySelector('.postSubmit').addEventListener("click", makePost);
    postToLanding();
}

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
        .then((res)=>{
            return res.json();
        })
        .then((res) => {
            window.location.reload(false);
        })
        .then((res) => {
            postToLanding(res);
        })
        .catch((error) => {
            console.log(error);
        })

}
// PUTS USER INPUT INTO A LIST ITEM
// CREATES A FORM FIELD FOR COMMENTS INTO THE LIST ITEM
// GET THE COMMENTS FOR THE POST
// Posts our post to landing lol
function postToLanding() {

    fetch("http://thesi.generalassemb.ly:8080/post/list", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('user')
        }
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            const list = document.querySelector('.allPosts');
            
            for (let i = (res.length -1); i > (res.length - 11); i--) {
                // CREATE AN ITEM, WITH H3 AND P TAGS
                const item = document.createElement('li');
                item.classList.add("post");
                item.id = `${res[i].id}`;
                const title = document.createElement('h3');
                title.classList.add("postTitle");
                const postingUser = document.createElement('h3');
                postingUser.classList.add("username");
                const post = document.createElement('p');
                post.classList.add("postText");
                title.innerText = `Title: ${res[i].title}`;
                post.innerText = res[i].description;
                postingUser.innerText = `Post by: ${res[i].user.username}`;



                seeComments(res[i].id);




                // CREATE A COMMENT FORM, WITH A TEXT AREA, SUBMIT AND DELETE BUTTONS
                //const commentForm = document.createElement('form');
                const commentField = document.createElement('textarea');
                commentField.classList.add("commentField");
                const submitComment = document.createElement('button');
                submitComment.classList.add("submitComment");
                submitComment.innerText = "Comment"; 
                submitComment.addEventListener('click', function () {
                    event.preventDefault();
                    createComment(event.target.parentNode.getAttribute('id'));
                });

                // ITEM TAKES TITLE, POST, COMMENTFIELD, AND SUBMITCOMMENT
                item.append(title, postingUser, post, commentField, submitComment);
                list.append(item);
            }
        })
        .catch((error) => {
            console.log(error);
        })
}

function createComment(id) {
    // WHEN SUBMIT COMMENT IS CLICKED, GET THE PARENT NODE'S ID
    // PARENT NODE IS THE POST
    // THEN CALL CREATE COMMENT
    // CREATE COMMENT WILL POST THE COMMENT
    let commentFieldInput = document.getElementById(`${id}`).querySelector('.commentField').value;

    fetch(`http://thesi.generalassemb.ly:8080/comment/${id}`, {
        method: 'POST',
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('user'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: commentFieldInput
        })
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            location.reload(false);
        })
        .then((error) => {
            console.log(error);
        })
        // FIGURE OUT TO REFRESH THE PAGE ONLY AFTER THE POST WAS FINISHED
    // window.location.reload(false);
}
// VIEW COMMENTS ON A POST
// GET REQUEST RETURNS AN ARRAY OF COMMENTS OF THAT POST
function seeComments(postId) {
    fetch(`http://thesi.generalassemb.ly:8080/post/${postId}/comment`, {
        headers: {
            "Content-Type":"application.json"
        }
    })
        .then((res) => {
            //console.log(res);
            return res.json();
        })
        .then((res) => {

            const listOfComments = document.createElement('ul');
            listOfComments.classList.add("listOfComments");
            listOfComments.id = `listComments_${postId}`;
            const post = document.getElementById(`${postId}`);

            for (let i = 0; i < res.length; i++) {
                const commentItem = document.createElement('li');
                commentItem.classList.add("comment");

                commentItem.id = `comment_${res[i].id}`;
                // commentId = res[i].id;
                
                const commenter = document.createElement('p');
                commenter.classList.add("commenter");
                commenter.style.fontWeight = "bold";
                commenter.innerText = `${res[i].user.username}: `;
                const commentText = document.createElement('p');
                commentText.classList.add("commentText");
                commentText.innerText = res[i].text;

                // commentItem.append(commentText);
                

                // EVERYTHING HAS A DELETE BUTTON
                // BUT SEND AN ERROR IF USER TRIES TO DELETE SOMETHING THAT'S NOT THEIRS
                const deleteComment = document.createElement('button');
                deleteComment.classList.add("deleteComment");
                deleteComment.innerText = "Delete Comment";
                commentItem.append(commenter, commentText, deleteComment);

                listOfComments.append(commentItem);
                // SO, THIS FUNCTION IS WORKING. YOU CAN DELETE
                // HOWEVER, YOU STILL GET AN ASYNC ERROR
                deleteComment.addEventListener("click", function () {
                    fetch((`http://thesi.generalassemb.ly:8080/comment/${res[i].id}`), {
                        method: 'DELETE',
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem('user'),
                            "Content-Type": "application/json"
                        }
                    })
                        // .then((res) => {
                        //     return res.json()
                        // })
                        .then((res) => {
                            // WHY IS IT NOT TAKING POST ID?
                            if (res.status === 200) {
                                updateComments(listOfComments.id, commentItem.id);
                            } else {
                                alert("Please delete only your own comments.");
                            }
                        })
                        .then((error) => {
                            console.log(error);
                        })
                })
            }
            
            post.append(listOfComments);
        })
        .then((error) => {
            console.log(error);
        })
}
function updateComments(listOfComments, commentId) {
    const listComments = document.getElementById(`${listOfComments}`);
    const comment = document.querySelector(`#${commentId}`);
    listComments.removeChild(comment);
    // console.log(comment);
}


/*============================= POSTS AND COMMENTS ON PROFILE PAGE =============================*/

if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) == "profile.html") {
    postOnProfile();
}
function postOnProfile() {
    fetch("http://thesi.generalassemb.ly:8080/user/post", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem('user')
        }
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            const list = document.querySelector('userPosts').querySelector('.allPosts');
            console.log(list);

            for (let i = (res.length - 1); i > (res.length - 11); i--) {
                // CREATE AN ITEM, WITH H3 AND P TAGS
                const item = document.createElement('li');
                item.classList.add("post");
                item.id = `${res[i].id}`;
                const title = document.createElement('h3');
                title.classList.add("postTitle");
                const post = document.createElement('p');
                post.classList.add("postText");
                title.innerText = res[i].title;
                post.innerText = res[i].description;

                seeComments(res[i].id);

                // CREATE A COMMENT FORM, WITH A TEXT AREA, SUBMIT AND DELETE BUTTONS
                //const commentForm = document.createElement('form');
                const commentField = document.createElement('textarea');
                commentField.classList.add("commentField");
                const submitComment = document.createElement('button');
                submitComment.classList.add("submitComment");
                submitComment.innerText = "Comment";
                submitComment.addEventListener('click', function () {
                    event.preventDefault();
                    createComment(event.target.parentNode.getAttribute('id'));
                });

                // ITEM TAKES TITLE, POST, COMMENTFIELD, AND SUBMITCOMMENT
                item.append(title, post, commentField, submitComment);
                list.append(item);
            }
        })
        .catch((error) => {
            console.log(error);
        })
}










/*
OUR PROBLEMS RIGHT NOW:

- Show the user that their registration already exists/login does not exist
- When the user is logged in, don't allow them to access the login page (Welcome user!)

- DELETE POSTS
- UPDATE PROFILE (which is just the mobile #)

BONUS:
- Make profile page that shows the user's info
- Show the users posts in their profile
*/
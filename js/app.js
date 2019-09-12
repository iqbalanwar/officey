/*============================= REGISTRATION AND LOGIN =============================*/
if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) == "regLogin.html") {
    console.log("You're in your regLogin!");
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
            // window.location.reload(false);
            // if (window.location.href.indexOf('reload') == -1) {
            //     window.location.replace(window.location.href + '?reload');
            // }
            
            for (let i = 0; i < res.length; i++) {
                // CREATE AN ITEM, WITH H3 AND P TAGS
                const item = document.createElement('li');
                item.classList.add("post");
                item.id = `${res[i].id}`;
                const title = document.createElement('h3');
                title.classList.add("postTitle");
                const post = document.createElement('p');
                post.classList.add("postText");
                // const deletePost = document.createElement('button');
                // deletePost.classList.add("deletePost");
                // deletePost.innerText = "Delete Post";
                // deletePost.addEventListener('click', deletePost);
                title.innerText = res[i].title;
                post.innerText = res[i].description;



                seeComments(item.id);




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

                // COMMENT FORM TAKES FIELD, SUBMIT BTN, DELETE BTN
                // commentForm.append(commentField, submitComment, deleteComment);

                // ITEM TAKES TITLE, POST, AND COMMENT FORM
                item.append(title, post, commentField, submitComment);
                list.append(item);
            }
        })
        .catch((error) => {
            console.log(error);
        })
}

if (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1) == "landing.html") {
    document.querySelector('.postSubmit').addEventListener("click", makePost); 
    postToLanding();
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
        .then((error) => {
            console.log(error);
        })
        // FIGURE OUT TO REFRESH THE PAGE ONLY AFTER THE POST WAS FINISHED
    // window.location.reload(false);
}
// VIEW COMMENTS ON A POST
// GET REQUEST RETURNS AN ARRAY OF COMMENTS OF THAT POST
function seeComments(id) {
    fetch(`http://thesi.generalassemb.ly:8080/post/${id}/comment`, {
        headers: {
            "Content-Type":"application.json"
        }
    })
        .then((res) => {
            return res.json();
        })
        .then((res) => {

            const listOfComments = document.createElement('ul');
            listOfComments.classList.add("listOfComments");
            const post = document.getElementById(`${id}`);

            for (let i = 0; i < res.length; i++) {
                const commentItem = document.createElement('li');
                commentItem.classList.add("comment");
                commentItem.id = `${res[i].id}`;
                commentId = res[i].id;
                const commentText = document.createElement('p');
                commentText.classList.add("commentText");
                commentText.innerText = res[i].text;

                commentItem.append(commentText);
                listOfComments.append(commentItem);

                // COMPARE LOCALSTORAGE(USERNAME) TO USER.USERNAME
                // ONLY MAKE BUTTONS FOR THOSE
                if (localStorage.getItem('username') == res[i].user.username) {
                    const deleteComment = document.createElement('button');
                    deleteComment.classList.add("deleteComment");
                    deleteComment.innerText = "Delete Comment";
                    commentItem.append(deleteComment);
                    deleteComment.addEventListener("click", function(commentId){})
                }
            }
            
            post.append(listOfComments);
        })
        .then((error) => {
            console.log(error);
        })
}







// GET USER POSTS
// STORE ALL IDS IN ARRAY
// TAKES USER INPUT FOR WHAT THEY WANT TO DELETE
// CHECK FOR THAT ID IN THE ARRAY
// DELETE? COMMENT?
// function commentToPost() {
//     fetch(`http://thesi.generalassemb.ly:8080/comment/${postId}`)
// }

// WHEN POSTING FULL LIST OF POSTS, ONLY ALLOW DELETE FOR YOUR POSTS
// - Post to landing?
// - ONLY ALLOW DELETE BUTTON ON MY POSTS
// function getPostId() {
//     fetch("http://thesi.generalassemb.ly:8080/user/post", {
//         headers: {
//             "Authorization": "Bearer " + localStorage.getItem('user')
//         }
//     })
//         .then((res) => {
//             return res.json();
//         })
//         .then((res) => {
//             console.log(res[0].id);
//             const postId = res[0].id;
//             return postId;
//             // console.log(res[0]); 
//         })
// }





























// GET USER POSTS WHICH IS AN ARRAY
// TAKE USER CHOICE (input) OF WHICH ITEM THEY WANT TO DELETE
// GO THROUGH THE ARRAY TO GET TO THAT INDEX ITEM OF THE USER CHOICE (store the id)
// Separate function: DELETE THAT ID WHICH WAS STORED
// function getPostId() {
//     fetch("http://thesi.generalassemb.ly:8080/user/post", {
//         headers: {
//             "Authorization": "Bearer " + localStorage.getItem('user')
//         }
//     })
//         // .then((res) => {
//         //     return res.json();
//         // })
//         .then((res) => { // Returns null. Wonderful.
//             console.log(res);
//         })
// }
// getPostId();





/*
OUR PROBLEMS RIGHT NOW:
 
- The list of all posts should show up by default (TECHNICALLY FIXED)
    - Right now, the workaround is that we can see all the posts only when we post

- Show the user that their registration already exists/login does not exist
- When the user is logged in, don't allow them to access the login page

- DELETE POSTS
- DELETE COMMENTS
- UPDATE PROFILE (which is just the mobile #)

BONUS:
- Make profile page that shows the user's info
- Show the users posts in their profile
*/
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("view engine", "ejs"); // express can read the ejs files by this engine - MUST
app.use(express.static("public")); // styling files activate, all styling files will be relative to this folder - MUST
app.use(bodyParser.urlencoded({ extended: true })); // post data parsing - MUST

let allPosts  = [];

const generateId = () => {
    return allPosts.length ? allPosts[allPosts.length - 1].id + 1 : 1; // Increment ID based on last post
  };


app.get("/", (req, res) => {
  res.render("index.ejs", { allPosts });
});


app.get("/edit/:id", (req, res) => {
    const postId = Number(req.params.id); // it is string in the route 
    const postToEdit = allPosts.find((post) => post.id === postId); // checking the postId coming from the route with the id in allPosts
    res.render("edit.ejs", {post: postToEdit}); // sending the corresponding post for editing to the edit.ejs
    
  });

  // Handle edit post submission
app.post("/edit/:id", (req, res) => {
    const postId = Number(req.params.id);
    const postIndex = allPosts.findIndex((post) => post.id === postId);

        // Date Handling
        const date = new Date();
        const d = date.getDate();
        const m = date.getMonth() + 1; // Months are zero-based
        const y = date.getFullYear();
        const formattedDate = `${m} ${d}, ${y}`;
    
    if (postIndex !== -1) {
        // Update the post
        allPosts[postIndex].writerName = req.body.writerName;
        allPosts[postIndex].postTitle = req.body.postTitle;
        allPosts[postIndex].postContent = req.body.postContent;
        allPosts[postIndex].postDate = formattedDate;
        allPosts[postIndex].id = postId;


        res.redirect("/"); // Redirect to home after editing
    } else {
        res.status(404).send("Post not found");
    }
});

// Handle delete post
app.post("/delete/:id", (req, res) => {
    const postId = Number(req.params.id);
    allPosts = allPosts.filter((post) => post.id !== postId); // Remove the post
    res.redirect("/"); // Redirect to home after deletion
});
  
app.post("/submit", (req, res) => {

    let post = req.body;
    

    // Call the generateId function to assign an ID
    post.id = generateId(); 
    
    // Date Handling
    const date = new Date();
    const d = date.getDate();
    const m = date.getMonth() + 1; // Months are zero-based
    const y = date.getFullYear();
    const formattedDate = `${m} ${d}, ${y}`;

    // adding date to the post object
    post.postDate = formattedDate;
    console.log(post);
    allPosts.push(post);
    res.render("index.ejs", {allPosts});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
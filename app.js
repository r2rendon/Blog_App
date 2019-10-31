const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    sanitizer = require('express-sanitizer')

//App config
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(sanitizer())
app.use(methodOverride('_method'))

//Mongoose model config
var BlogSchema = new mongoose.Schema({
    blogTitle: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now()
    }
});

var Blog = mongoose.model('Blog', BlogSchema);

//RESTful Routes

app.get('/', (req, res) => {
    res.redirect("/blogs");
});

//Index route
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) console.log("Error finding the blogs");
        else res.render("index", {
            blogs: blogs
        });
    });
});

//NEW Route
app.get('/blogs/new', (req, res) => {
    res.render("new");
});

//CREATE Route
app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) res.render("new");
        else res.redirect("/blogs");
    });
});

//SHOW Route
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, fBlog) => {
        if (err) res.redirect('/blogs');
        else res.render('show', {
            blog: fBlog
        });
    });
});

//EDIT Route
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, fBlog) => {
        if (err) res.redirect('/blogs');
        else res.render('edit', {
            blog: fBlog
        });
    });
});

//UPDATE Route
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, fBlog) => {
        if (err) res.redirect('/blogs');
        else res.redirect('/blogs/' + req.params.id);
    });
});

//DESTROY Route
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err) => {
        if (err)
            res.redirect('/blogs')
        else
            res.redirect('/blogs')
    })
})

app.listen(3000, () => {
    console.log('Server is running on port 3000!')
})
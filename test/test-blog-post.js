const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *should* style syntax in our tests
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
chai.use(chaiHttp);


describe('BlogPosts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list all blog posts on GET', function() {
    return chai.request(app)
      .get('/blog-post')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys('id', 'title', 'content', 'author');
        });
      });
  });


  it('should add a blog post on POST', function() {
    const newPost = {
      title: 'New blog postsssss',
      content: 'Ipsum bizz foo',
      author: 'Theodore Conrad'};
    const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));

    return chai.request(app)
      .post('/blog-post')
      .send(newPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys(expectedKeys);
        res.body.title.should.equal(blogPosts.title);
        res.body.content.should.equal(newPost.content);
        res.body.author.should.equal(newPost.author)
      });
  });


  it('should update blog posts on PUT', function() {

    return chai.request(app)
      .get('/blog-post')
      .then(function(res) {
        const updatedPost = Object.assign(res.body[0], {
          title: 'this is the PUT request title',
          content: 'and this is where allll the content goes'
        });

        return chai.request(app)
          .put(`/blog-post/${res.body[0].id}`)
          .send(updatedPost)
          .then(function(res) {
            res.should.have.status(204);
      });
  });


  it('should delete blog post on DELETE', function() {
    return chai.request(app)
      .get('/blog-post')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-post/${res.body[0].id}`)
          .then(function(res) {
            res.should.have.status(204);
      });
  });
});

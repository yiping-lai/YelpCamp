# YelpCamp

## Introduction

This is a website managing information about campsite services.
1) Display all campgrounds and search for campgrounds. 
2) Register and sign up as a member.
3) Create, edit, and delete campgrounds or comments associated with the campgrounds.


## Installation Guide

0) Install node v10.16 or later
1) Install all packages defined in packages.json
```bash
npm install
```

2) Setup MongoDB URL in app.js
3) To run the server, execute
```bash
node app.js
```

## About the Stack

Backend: Node with Express framework, MongoDB.

Frontend: HTML, CSS, Javascript, Boostrap.

### Main Files: Project Structure

  ```sh
  ├── README.md
  ├── app.py: the main driver of the app and Database URLs.
  ├── packages.json: Package dependencies
  ├── views: all ejs files
  │   ├── campgrounds
  │   ├── comments
  │   ├── partials: headers and footers
  │   └── users
  ├── public
  │   └── stylesheets
  ├── routes: routes related to campgrounds, comments, or index	  
  ├── models: MongoDB schema
  └── middleware
  ```


### Reference
Udemy The Web Developer Bootcamp
https://www.udemy.com/course/the-web-developer-bootcamp/
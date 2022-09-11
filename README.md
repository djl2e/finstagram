# Finstagram
> An Instagram-inspired social media website created as a portfolio project

![](name-of-giphy.gif)

[Link to Deployed Project](https://stormy-stream-02714.herokuapp.com/)

```js
// Sample Account
Username: dlee
Password: 123456
```

## Features

### Users
- Sign up / Log in / Log out
- Edit profile (description, profile picture, password)
- Search user
- User suggestions
- Follow or unfollow

### Posts
- Create with an image and a caption
- Edit caption
- Like / Unlike
- Comments

### View
- Sign up / Log in page
- Home page (posts from users followed)
- User profile page (display profile information and posts from user)
- List pop ups (for followers, following, likes)

## Getting Started

### Clone repository
```js
git clone git@github.com:djl2e/finstagram.git
cd finstagram
```

### Set up environment variables
```js
DATABASE_URL = <MongoDB URL>
SECRET_KEY = <JWT Strategy Secret Key>
AWS_SECRET_KEY = <AWS S3 Secret Ke>
AWS_KEY_ID = <AWS S3 Access Key Id>
AWS_BUCKET = <AWS S3 Bucket Name>
REACT_APP_AWS_BUCKET = <AWS S3 Bucket Name>
```

### Install packages and start client
```js
// from root directory
npm i // install npm dependencies
cd client && npm run build // build bundle with webpack
cd .. && npm start // start the server - listens on localhost:3000
```

## Deployment (Heroku)
- [Create a Heroku Account](https://id.heroku.com/login)
- [Install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- In the terminal, from the root directory, run the following command lines:

```js
heroku create
git push heroku main
```

## Built With
- Express
- React
- MongoDB
- Amazon S3 Bucket
- Passport
- JSON Web Tokens
- Sharp
- Multer
- React Lazy Load Image Component

## Authors
- [Daniel Joseph Lee](https://github.com/djl2e)

## Image and Icons from:
- icons from [flaticon](https://www.flaticon.com)
- [Stephanie Edwards on Pixabay](https://pixabay.com/users/wanderercreative-855399/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=973460)

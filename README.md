# Finstagram
> An Instagram-inspired social media website created as a portfolio project

[Link to Deployed Project](https://stormy-stream-02714.herokuapp.com/)

** Sample Account **
Username: dlee
Password: 123456

## Getting Started

### Clone repository
```
git clone git@github.com:djl2e/finstagram.git
cd finstagram
```

### Set up environment variables
```
DATABASE_URL = <MongoDB URL>
SECRET_KEY = <JWT Strategy Secret Key>
AWS_SECRET_KEY = <AWS S3 Secret Ke>
AWS_KEY_ID = <AWS S3 Access Key Id>
AWS_BUCKET = <AWS S3 Bucket Name>
REACT_APP_AWS_BUCKET = <AWS S3 Bucket Name>
```

### Install packages and start client
```
// from root directory
npm i // install npm dependencies
cd client && npm run build // build bundle with webpack
cd .. && npm start // start the server - listens on localhost:3000
```

## Deployment (Heroku)
- [Create a Heroku Account](https://id.heroku.com/login)
- [Install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- In the terminal, from the root directory run the following command lines:

```
heroku create
git push heroku main
```

## Image and icon creds
- icons from [flaticon](https://www.flaticon.com)
- [Stephanie Edwards on Pixabay](https://pixabay.com/users/wanderercreative-855399/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=973460)

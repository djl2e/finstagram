const { body, validationResult } = require('express-validator');

const User = require('../models/user');
const Post = require('../models/post');

exports.create_post = [
  body('form-caption').trim().escape(),

];

// exports.signup_post = [
//   body('form-name').trim().isLength({ min: 1 }).escape(),
//   body('form-username').trim().isLength({ min: 1 }).escape(),
//   body('form-password', 'Minimum password length is 6').trim().isLength({ min: 6 }).escape(),
//   body('form-confirm').trim().escape(),
//   body('form-description').trim().escape(),
//   (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) return res.json({ errors: errors.array() });

//     const name = req.body['form-name'];
//     const username = req.body['form-username'];
//     const password = req.body['form-password'];
//     const confirm = req.body['form-confirm'];
//     const description = req.body['form-description'];

//     if (password !== confirm) {
//       return res.status(401).json({
//         error: 'Password confirmation different from password',
//       });
//     }

//     // hash password and save user if not exists
//     bcrypt.hash(password, 10, (err, hash) => {
//       if (err) return res.json(err);

//       User.findOne({ username })
//         .exec((err, result) => {
//           if (err) return res.json(err);
//           if (result) {
//             return res.status(409).json({
//               error: 'Username already exists',
//             });
//           }
//           const user = new User({
//             name,
//             username,
//             password: hash,
//             description,
//             followers: [],
//             following: [],
//           });
//           user.save((err) => {
//             if (err) return res.json(err);
//             res.status(200).json({
//               message: `Signup successful! Welcome ${username}`,
//             });
//           });
//         });
//     });
//   },
// ];

exports.update_post = (req, res, next) => {
  res.send('submit form for updating post');
};

exports.delete_post = (req, res, next) => {
  res.send('submit form for deleting post');
};

exports.post_get = (req, res, next) => {
  res.send('individual post page');
};

exports.like = (req, res, next) => {
  res.send('not implemented');
};

exports.dislike = (req, res, next) => {
  res.send('not implemented');
};

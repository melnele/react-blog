var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'UserName field is required'],
    unqiue: [true, 'Username Already Exists'],
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
  }
});

var postSchema = mongoose.Schema({
  text: {
    type: String
  },
  user: {
    username: {
      type: String,
      required: [true, 'UserName field is required'],
      trim: true,
      lowercase: true
    },
    _id: {
      type: String,
      required: true,
      trim: true,
    }
  }
});

if (!userSchema.options.toObject) {
  userSchema.options.toObject = {};
}

userSchema.options.toObject.transform = (document, transformedDocument) => {
  delete transformedDocument.password;
  return transformedDocument;
};

mongoose.model('User', userSchema);
mongoose.model('Post', postSchema);
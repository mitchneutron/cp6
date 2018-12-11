var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var UserSchema = new Schema({
    username: { type: String, unique: true },
    email: String,
    hashed_password: String,
    note: String
});
mongoose.model('User', UserSchema);
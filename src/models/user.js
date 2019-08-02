import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new Schema({
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      maxlength: 60,
    },
    exams: {
      type: Array,
      of: String,  
    },
    examSolutions: {
      type: Map,
      of: Object,
    },
    examReports: {
      type: Array,
      of: String,
    },
    group: {
      type: Array,
      of: mongoose.Schema.Types.ObjectId,
     ref: 'Group',  
    },
    picture: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
  });

  userSchema.statics.findByLogin = async function(login) {
    let user = await this.findOne({
      username: login,
    });
  
    if (!user) {
      user = await this.findOne({ email: login });
    }
  
    return user;
  };
/*
  userSchema.pre('remove', function(next) {
    this.model('Message').deleteMany({ userId: this._id }, next);
  });
*/
  
  userSchema.pre('save', async function(next) {
    let user = this;
    
    if (!user.isModified('password')) {
      console.log('password not modified');
      return next();
  }
    this.password = await this.generatePasswordHash();
  });
  
  userSchema.methods.generatePasswordHash = async function() {
    const saltRounds = 10;    
    return await bcrypt.hash(this.password, saltRounds);
  };
  
  userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

const User = mongoose.model('User', userSchema);
export default User;
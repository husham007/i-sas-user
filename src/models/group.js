import mongoose from 'mongoose';


const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    members: {
        type: Array,
        of: mongoose.Schema.Types.ObjectId,
       ref: 'User', 
    },    
},
    {
        timestamps: true,
    }); 
   
    const Group = mongoose.model('Group', groupSchema);

    export default Group;
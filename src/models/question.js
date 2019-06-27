import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const questionSchema = new mongoose.Schema({
    statement: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        of: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    book: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
    }); 
    questionSchema.plugin(uniqueValidator, {message: 'Question Statement already Exist'});
    const Question = mongoose.model('Question', questionSchema);

    export default Question;
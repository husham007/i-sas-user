import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const questionBookSchema = new mongoose.Schema({
    book: {
        type: String,
        required: true,
        unique: true,
       
    },
    categories: {
        type: Array,
        of: String,
        required: true,
    },
    types: {
        type: Array,
        of: String,
        required: true,
    },
    levels: {
        type: Array,
        of: String,
        required: true,
    }
   
},
    {
        timestamps: true,
    }); 
    //questionSchema.plugin(uniqueValidator, {message: 'Question Statement already Exist'});
    const QuestionBook = mongoose.model('QuestionBook', questionBookSchema);

    export default QuestionBook;
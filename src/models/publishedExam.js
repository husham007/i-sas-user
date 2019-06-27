import mongoose from 'mongoose';


const publishedExamSchema = new mongoose.Schema({
    examId: {
        type: String,        
    },
    examDate: {
        type: Date,    
    },    
    examStartTime: {
        type: String,
    },
    group: {
        type: String,
    }
},
    {
        timestamps: true,
    }); 
   
    const PublishedExam = mongoose.model('Exam', publishedExamSchema);

    export default PublishedExam;
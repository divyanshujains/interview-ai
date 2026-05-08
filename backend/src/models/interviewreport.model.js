import mongoose from "mongoose";


const technicalquestionSchema = new mongoose.Schema({   
    question: {
        type: String,
        required: [true , "Question is required"] 

    },
    intention: {
        type: String,
        required: [true , "Intention is required"] 

    },
    answer: {
        type: String,
        required: [true , "Answer is required"] 

    },

},{
    _id : false
})



const behevioralquestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  }
);


const skillgapschema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true , "Skill is required"] 

    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: [true , "Gap description is required"] 

    },
},{
    _id : false
})


  const preprationplanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true , "Action is required"] 

    },
    focus: {
        type: String,
        required: [true , "Timeline is required"] 

    },
    task:{
        type: String,
        required: [true , "Task is required"] 
    }
},{
_id : false
}
)

const interviewReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
  },
  selfDescription: {
    type: String,
  },

  matchscore: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalquestions: [technicalquestionSchema],
  behavioralquestions: [behevioralquestionSchema],
  skillgaps: [skillgapschema],
  preparationplan: [preprationplanSchema],
});


const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema);

export default InterviewReport;
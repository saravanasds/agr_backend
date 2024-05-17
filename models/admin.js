import mongoose from "mongoose"

const Admin = mongoose.model("Admin", {
    name: {
        type: String,
        require : true,
    },
    email : {
        type: String,
        require : true,
        unique : true,
        trim : true
    },
    password: {
        type : String,
        require : true
    },
    role: {
    type: String,
    default: "admin"
  }
})

export {Admin}
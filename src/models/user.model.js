import { model, Schema } from "mongoose"

const userSchema = new Schema(
  {
    name:{
      type:String,
      required: true
    },
    username:{
      type:String,
      required: true
    },
    email:{
      type:String,
      required: true
    },
    password:{
      type:String,
      required: true
    },
    token:{
      type:String
    }
  }
)

const userModel = model("user", userSchema)
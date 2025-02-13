const mongoose = require("../conexion");

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 10,
    required: [true, "number is required"],
    validate: {
      validator: function (number) {
        return /\d{2}-\d{1}-\d{8}/.test(number);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("PhoneBook", phoneBookSchema);

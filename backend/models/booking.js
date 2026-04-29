import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  room: String,
  checkIn: String,
  checkOut: String,
  guests: String,
  message: String,
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function UpdateBooking(req, res) {
  try {
    const { id, status, start_datetime, complete_datetime } = req.body;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Valid booking ID is required" });
    }

    const validStatuses = ["Ongoing", "Completed", "Cancelled"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const db = await connectDB();
    const updateFields = { updated_at: new Date() };
    if (status) updateFields.status = status;
    if (start_datetime) updateFields.start_datetime = new Date(start_datetime);
    if (complete_datetime) updateFields.complete_datetime = new Date(complete_datetime);

    const result = await db.collection("bookings").updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    return res.status(200).json({ success: true, message: "Booking updated successfully" });
  } catch (error) {
    console.error("UpdateBooking.js: ", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = { UpdateBooking };

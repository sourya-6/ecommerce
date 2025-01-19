import mongoose from "mongoose";

const snapXMembershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["monthly","quaterly","yearly"], required: true },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    paymentId: { type: String, required: true },
    renewalDate: { type: Date },
    discountHistory: { type: String },
  },
  { timestamps: true }
);

const SnapXMembership = mongoose.model("SnapXMembership", snapXMembershipSchema);
export default SnapXMembership;

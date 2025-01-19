import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      // e.g., "update", "delete"
      type: String,
      required: true,
    },
    user: {
      // Admin who performed the action
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetTable: {
      // Table name where action was performed
      type: String,
      required: true,
      enum: [
        "User",
        "Product",
        "Order",
        "Payment",
        "Coupon",
        "Category",
        "Transaction",
      ], // Allowed tables
    },
    targetId: {
      // Affected record ID
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetTable", // Dynamic reference to the corresponding table
    },
    oldValue: {
      // Stores the previous value before update
      type: mongoose.Schema.Types.Mixed, // Can store different types (String, Number, Object)
    },
    newValue: {
      // Stores the new updated value
      type: mongoose.Schema.Types.Mixed,
    },
    actualPrice: {
      // Original price before discount
      type: Number,
    },
    discountedPrice: {
      // Final price after discount
      type: Number,
    },
    discountPercentage: {
      // Percentage discount applied
      type: Number,
    },
    details: {
      // Optional description of the action
      type: String,
    },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export { AuditLog };

import mongoose from "mongoose";

const productSchema = mongoose.Schema({
 title: String,
}, { timestamps: true });

export default mongoose.model('product', productSchema);
import mongoose from 'mongoose';

const accessRecordSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  result: { type: String, enum: ['success', 'failure'], required: true }
});

const AccessRecord = mongoose.model('AccessRecord', accessRecordSchema);

export default AccessRecord;

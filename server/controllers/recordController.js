import Record from '../models/recordModel.js';

const createRecord = async (req, res) => {
  try {
    const newRecord = new Record(req.body);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
};

const getAllRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', errors: err.errors });
    } else {
      res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
};

const deleteRecord = async (req, res) => {
  try {
    const result = await Record.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export { createRecord, getAllRecords, getRecordById, updateRecord, deleteRecord };

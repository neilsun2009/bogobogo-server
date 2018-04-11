const Byte = require('../models/byte'),
  ROLE = require('../../config').ROLE;

// get byte by id
exports.getByteById = (_id) => {
  return Byte.findByte(Object.assign({}, { _id }));
};

// get byte by date
exports.getByteByDate = (date) => {
  return Byte.findByte(Object.assign({}, { date }));
};

// get bytes
exports.getBytes = (offset, limit, after) => {
  return Byte.findBytes(+offset, +limit, after, {});
};

// delete byte
exports.deleteByte = (_id) => {
  return Byte.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
};

// add byte
exports.addByte = (byte) => {
  return new Byte(byte).save();
};

// update byte
exports.updateByte = (_byte) => {
  return Byte.findByIdAndUpdate(_byte._id, _byte, { new: true });
};
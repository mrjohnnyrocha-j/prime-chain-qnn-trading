// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @title UserSchema
 * @dev Mongoose schema for User model, including password hashing and role assignments.
 */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  publicKey: { type: String, required: true }, // Public key for Prime Chain Indexing
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'App' }],
  tokenBalance: { type: Number, default: 0 },
  roles: { type: [String], default: ['USER'] }, // Roles can include 'ADMIN', 'SHARDER', etc.
  dateJoined: { type: Date, default: Date.now },
});

// Password hashing middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Password verification method
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Role management methods
UserSchema.methods.hasRole = function (role) {
  return this.roles.includes(role);
};

UserSchema.methods.addRole = function (role) {
  if (!this.hasRole(role)) {
    this.roles.push(role);
    return this.save();
  }
};

UserSchema.methods.removeRole = function (role) {
  if (this.hasRole(role)) {
    this.roles = this.roles.filter((r) => r !== role);
    return this.save();
  }
};

module.exports = mongoose.model('User', UserSchema);

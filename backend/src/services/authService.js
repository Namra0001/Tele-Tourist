const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { validateRegister } = require('../utils/validators');

exports.register = async (name, email, password) => {
  validateRegister(name, email, password);
  
  const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
  if (existingUser) throw new ApiError(400, 'Email already exists');
  
  const password_hash = await bcrypt.hash(password, 10);
  const { data: newUser, error } = await supabase.from('users').insert([{ name, email, password_hash }]).select().single();
  if (error) throw new ApiError(500, 'Error creating user: ' + JSON.stringify(error));
  
  const token = jwt.sign({ id: newUser.id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  const user = { id: newUser.id, name: newUser.name, email: newUser.email, avatar_url: newUser.avatar_url };
  return { token, user };
};

exports.login = async (email, password) => {
  if (!email || !password) throw new ApiError(400, 'Email and password required');
  
  const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user) throw new ApiError(401, 'Invalid credentials');
  
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new ApiError(401, 'Invalid credentials');
  
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  const userData = { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url };
  return { token, user: userData };
};

exports.getUserById = async (id) => {
  const { data: user, error } = await supabase.from('users').select('id, name, email, bio, avatar_url').eq('id', id).single();
  if (error || !user) throw new ApiError(404, 'User not found');
  return user;
};

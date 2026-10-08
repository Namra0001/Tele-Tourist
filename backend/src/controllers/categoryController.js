const supabase = require('../config/supabase');

exports.getCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) { next(error); }
};

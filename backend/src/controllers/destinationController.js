const destinationService = require('../services/destinationService');

exports.getDestinations = async (req, res, next) => {
  try {
    const destinations = await destinationService.getDestinations(req.query);
    res.json(destinations);
  } catch (error) { next(error); }
};

exports.getDestinationStories = async (req, res, next) => {
  try {
    const stories = await destinationService.getDestinationStories(req.params.location);
    res.json(stories);
  } catch (error) { next(error); }
};
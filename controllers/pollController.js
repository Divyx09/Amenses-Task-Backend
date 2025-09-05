const Poll = require('../models/Poll');
const Event = require('../models/Event');

exports.createPoll = async (req, res) => {
  try {
    const { eventId, question, options } = req.body;
    const poll = new Poll({ question, options, event: eventId });
    await poll.save();
    // Add poll to event
    await Event.findByIdAndUpdate(eventId, { $push: { polls: poll._id } });
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.vote = async (req, res) => {
  try {
    const { pollId, optionIndex } = req.body;
    const userId = req.user.userId;
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    // Prevent double voting
    if (poll.options[optionIndex].votes.includes(userId)) {
      return res.status(400).json({ message: 'User already voted for this option' });
    }
    poll.options[optionIndex].votes.push(userId);
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPollsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const polls = await Poll.find({ event: eventId });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

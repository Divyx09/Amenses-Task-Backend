const Event = require('../models/Event');


exports.createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const createdBy = req.user.userId;
    const event = new Event({ title, description, date, createdBy, participants: [createdBy] });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email').populate('participants', 'name email');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.joinEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.userId;
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Convert ObjectIds to string for comparison
    const alreadyJoined = event.participants.some(
      (participant) => participant.toString() === userId
    );
    
    if (alreadyJoined) {
      return res.status(400).json({ 
        message: 'User already joined this event',
        event: event 
      });
    }
    
    event.participants.push(userId);
    await event.save();
    
    res.json({ 
      message: 'Successfully joined event',
      event: event 
    });
  } catch (err) {
    console.error('Join event error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getJoinedEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const events = await Event.find({ participants: userId })
      .populate('createdBy', 'name email')
      .populate('participants', 'name email');
    res.json(events);
  } catch (err) {
    console.error('Get joined events error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

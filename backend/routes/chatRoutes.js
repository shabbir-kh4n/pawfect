const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const AdoptionRequest = require('../models/AdoptionRequest');

// @route   GET /api/chats
// @desc    Get all chats for the current user
// @access  Protected
router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ petOwner: req.user.id }, { adopter: req.user.id }],
      isActive: true,
    })
      .populate('pet', 'petName species photos')
      .populate('petOwner', 'name email')
      .populate('adopter', 'name email')
      .populate('adoptionRequest', 'status adoptionCompleted')
      .sort({ lastMessageTime: -1 });

    res.status(200).json({
      message: 'Chats retrieved successfully',
      count: chats.length,
      chats,
    });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error while fetching chats' });
  }
});

// @route   DELETE /api/chats/:chatId
// @desc    Delete a chat and all its messages
// @access  Protected
router.delete('/:chatId', protect, async (req, res) => {
  try {
    const { chatId } = req.params;

    // Verify user is part of this chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (
      chat.petOwner.toString() !== req.user.id &&
      chat.adopter.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete all messages in this chat
    await Message.deleteMany({ chat: chatId });

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({
      message: 'Chat deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Server error while deleting chat' });
  }
});

// @route   GET /api/chats/:chatId/messages
// @desc    Get all messages for a specific chat
// @access  Protected
router.get('/:chatId/messages', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is part of this chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (
      chat.petOwner.toString() !== req.user.id &&
      chat.adopter.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      { chat: chatId, sender: { $ne: req.user.id }, isRead: false },
      { isRead: true }
    );

    const total = await Message.countDocuments({ chat: chatId });

    res.status(200).json({
      message: 'Messages retrieved successfully',
      messages: messages.reverse(), // Reverse to show oldest first
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
});

// @route   POST /api/chats/:chatId/messages
// @desc    Send a message in a chat
// @access  Protected
router.post('/:chatId/messages', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Verify user is part of this chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (
      chat.petOwner.toString() !== req.user.id &&
      chat.adopter.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create message
    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      content: content.trim(),
    });

    // Update chat with last message
    chat.lastMessage = content.trim();
    chat.lastMessageTime = Date.now();
    await chat.save();

    // Populate sender info
    await message.populate('sender', 'name email');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

// @route   GET /api/chats/request/:requestId
// @desc    Get or create chat for an adoption request
// @access  Protected
router.get('/request/:requestId', protect, async (req, res) => {
  try {
    const { requestId } = req.params;

    const adoptionRequest = await AdoptionRequest.findById(requestId)
      .populate('pet', 'petName species photos')
      .populate('petOwner', 'name email')
      .populate('requester', 'name email');

    if (!adoptionRequest) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    // Verify user is part of this adoption request
    if (
      adoptionRequest.petOwner._id.toString() !== req.user.id &&
      adoptionRequest.requester._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({ adoptionRequest: requestId })
      .populate('pet', 'petName species photos')
      .populate('petOwner', 'name email')
      .populate('adopter', 'name email')
      .populate('adoptionRequest', 'adoptionCompleted completedByOwner completedByAdopter status');

    // If no chat exists, create one
    if (!chat) {
      chat = await Chat.create({
        adoptionRequest: requestId,
        pet: adoptionRequest.pet._id,
        petOwner: adoptionRequest.petOwner._id,
        adopter: adoptionRequest.requester._id,
      });

      // Update adoption request with chat reference
      adoptionRequest.chat = chat._id;
      await adoptionRequest.save();

      // Create the initial message if the chat is new
      if (adoptionRequest.message) {
        await Message.create({
          chat: chat._id,
          sender: chat.adopter, // adopter is the requester
          content: adoptionRequest.message,
        });
      }

      // Populate the new chat
      await chat.populate('pet', 'petName species photos');
      await chat.populate('petOwner', 'name email');
      await chat.populate('adopter', 'name email');
      await chat.populate('adoptionRequest', 'adoptionCompleted completedByOwner completedByAdopter status');
    }

    res.status(200).json({
      message: 'Chat retrieved successfully',
      chat,
    });
  } catch (error) {
    console.error('Error getting chat:', error);
    res.status(500).json({ message: 'Server error while getting chat' });
  }
});

module.exports = router;

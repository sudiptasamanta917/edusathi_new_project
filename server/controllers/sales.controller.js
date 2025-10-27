import Content from '../models/Content.js';
import Order from '../models/Order.js';
import Revenue from '../models/Revenue.js';
import mongoose from 'mongoose';

export const getMySales = async (req, res) => {
  try {
    const contents = await Content.find({
      creatorId: req.user?._id,
      isActive: true,
    });

    const contentIds = contents.map((content) => content._id);

    const salesData = await Order.aggregate([
      { $match: { status: 'paid' } },
      // Distribute earnings across items
      { $addFields: { itemsCount: { $size: '$items' } } },
      { $unwind: '$items' },
      { $match: { 'items.contentId': { $in: contentIds } } },
      { $addFields: { amountPerItem: { $cond: [{ $gt: ['$itemsCount', 0] }, { $divide: ['$amount', '$itemsCount'] }, '$amount'] } } },
      { $group: { _id: '$items.contentId', totalSales: { $sum: 1 }, totalEarnings: { $sum: '$amountPerItem' } } },
      { $lookup: { from: 'contents', localField: '_id', foreignField: '_id', as: 'content' } },
      { $unwind: '$content' },
      { $lookup: { from: 'businesses', localField: 'content.businessId', foreignField: '_id', as: 'business' } },
      { $project: { contentId: '$_id', contentTitle: '$content.title', contentType: '$content.type', contentPrice: '$content.price', businessName: { $arrayElemAt: ['$business.name', 0] }, totalSales: 1, totalEarnings: 1 } },
      { $sort: { totalEarnings: -1 } },
    ]);

    const overallStats = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $addFields: { itemsCount: { $size: '$items' } } },
      { $unwind: '$items' },
      { $match: { 'items.contentId': { $in: contentIds } } },
      { $addFields: { amountPerItem: { $cond: [{ $gt: ['$itemsCount', 0] }, { $divide: ['$amount', '$itemsCount'] }, '$amount'] } } },
      { $group: { _id: null, totalSales: { $sum: 1 }, totalEarnings: { $sum: '$amountPerItem' } } },
    ]);

    const stats = overallStats[0] || { totalSales: 0, totalEarnings: 0 };

    res.json({
      salesData,
      overallStats: {
        totalSales: stats.totalSales,
        totalEarnings: stats.totalEarnings,
        totalContents: contents.length,
      },
    });
  } catch (error) {
    console.error('Get my sales error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getContentSales = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await Content.findOne({
      _id: contentId,
      creatorId: req.user?._id,
      isActive: true,
    }).populate('businessId', 'name');

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const orders = await Order.find({ 'items.contentId': contentId, status: 'paid' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const stats = await Order.aggregate([
      { $match: { status: 'paid' } },
      { $addFields: { itemsCount: { $size: '$items' } } },
      { $unwind: '$items' },
      { $match: { 'items.contentId': new mongoose.Types.ObjectId(contentId) } },
      { $addFields: { amountPerItem: { $cond: [{ $gt: ['$itemsCount', 0] }, { $divide: ['$amount', '$itemsCount'] }, '$amount'] } } },
      { $group: { _id: null, totalSales: { $sum: 1 }, totalEarnings: { $sum: '$amountPerItem' } } },
    ]);

    const salesStats = stats[0] || { totalSales: 0, totalEarnings: 0 };

    res.json({
      content: {
        id: content._id,
        title: content.title,
        type: content.type,
        price: content.price,
        businessName: (content.businessId && content.businessId.name) || null,
      },
      stats: salesStats,
      orders,
    });
  } catch (error) {
    console.error('Get content sales error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateRevenue = async (contentId, amount) => {
  try {
    const content = await Content.findById(contentId);
    if (!content) return;

    let revenue = await Revenue.findOne({ contentId });
    if (!revenue) {
      revenue = new Revenue({
        creatorId: content.creatorId,
        contentId: contentId,
        businessId: content.businessId,
        totalSales: 1,
        totalEarnings: amount,
      });
    } else {
      revenue.totalSales += 1;
      revenue.totalEarnings += amount;
    }

    await revenue.save();
  } catch (error) {
    console.error('Update revenue error:', error);
  }
};

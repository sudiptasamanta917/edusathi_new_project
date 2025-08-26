import Content from '../models/Content.js';
import Business from '../models/Business.js';
import { getFileUrl } from '../middleware/upload.js';
import { z } from 'zod';

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['pdf', 'video', 'live']),
  price: z.number().min(0, 'Price must be non-negative'),
  liveLink: z.string().url().optional(),
  businessId: z.string().optional()
});

const updateContentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  liveLink: z.string().url().optional(),
  businessId: z.string().optional()
});

export const createContent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const validatedData = contentSchema.parse({
      ...req.body,
      price: parseFloat(req.body.price)
    });

    let fileUrl = '';
    let thumbnailUrl = '';
    const files = req.files;
    const uploadedMain = req.file || (files && files.file && files.file[0]);
    const uploadedThumb = files && files.thumbnail && files.thumbnail[0];

    if (uploadedMain && (validatedData.type === 'pdf' || validatedData.type === 'video')) {
      fileUrl = getFileUrl(uploadedMain.filename);
    }

    if (uploadedThumb) {
      thumbnailUrl = getFileUrl(uploadedThumb.filename);
    }

    if (validatedData.businessId) {
      const business = await Business.findById(validatedData.businessId);
      if (!business) {
        return res.status(400).json({ error: 'Business not found' });
      }
    }

    const content = new Content({
      title: validatedData.title,
      description: validatedData.description,
      type: validatedData.type,
      price: validatedData.price,
      fileUrl: fileUrl,
      thumbnailUrl: thumbnailUrl,
      liveLink: validatedData.liveLink || '',
      creatorId: req.user._id,
      businessId: validatedData.businessId || null
    });

    await content.save();

    res.status(201).json({
      message: 'Content created successfully',
      content
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Create content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const content = await Content.findOne({
      _id: id,
      creatorId: req.user._id,
      isActive: true,
    }).populate('businessId', 'name');

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({ content });
  } catch (error) {
    console.error('Get content by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyContents = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const contents = await Content.find({
      creatorId: req.user._id,
      isActive: true,
    })
      .populate('businessId', 'name')
      .sort({ createdAt: -1 });

    res.json({ contents });
  } catch (error) {
    console.error('Get my contents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const validatedData = updateContentSchema.parse({
      ...req.body,
      price: req.body.price ? parseFloat(req.body.price) : undefined,
    });

    const content = await Content.findOne({
      _id: id,
      creatorId: req.user._id,
      isActive: true,
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (validatedData.businessId) {
      const business = await Business.findById(validatedData.businessId);
      if (!business) {
        return res.status(400).json({ error: 'Business not found' });
      }
    }

    Object.assign(content, validatedData);
    await content.save();

    res.json({
      message: 'Content updated successfully',
      content,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const content = await Content.findOne({
      _id: id,
      creatorId: req.user._id,
      isActive: true,
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    content.isActive = false;
    await content.save();

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const assignToBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { businessId } = req.body;
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!businessId) {
      return res.status(400).json({ error: 'Business ID is required' });
    }

    const content = await Content.findOne({
      _id: id,
      creatorId: req.user._id,
      isActive: true,
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(400).json({ error: 'Business not found' });
    }

    content.businessId = businessId;
    await content.save();

    res.json({
      message: 'Content assigned to business successfully',
      content,
    });
  } catch (error) {
    console.error('Assign to business error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBusinesses = async (_req, res) => {
  try {
    const businesses = await Business.find({ isActive: true })
      .select('_id name description')
      .sort({ name: 1 });

    res.json({ businesses });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

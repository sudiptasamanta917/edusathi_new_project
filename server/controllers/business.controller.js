import Business from '../models/Business.js';
import { z } from 'zod';

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required').optional(),
  description: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

export const createBusiness = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.user.role !== 'business') {
      return res.status(403).json({ error: 'Only business accounts can update their profile' });
    }

    const validatedData = businessSchema.parse(req.body || {});

    const business = await Business.findById(req.user._id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // If updating email, check for duplicates
    if (validatedData.email && validatedData.email.toLowerCase() !== business.email) {
      const dup = await Business.findOne({ email: validatedData.email.toLowerCase() });
      if (dup) return res.status(400).json({ error: 'Email already in use' });
    }

    Object.assign(business, validatedData);
    await business.save();

    res.status(200).json({ message: 'Business profile updated', business });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Create business error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBusinesses = async (_req, res) => {
  try {
    const businesses = await Business.find({ isActive: true })
      .select('_id name description email')
      .sort({ name: 1 });

    res.json({ businesses });
  } catch (error) {
    console.error('Get businesses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

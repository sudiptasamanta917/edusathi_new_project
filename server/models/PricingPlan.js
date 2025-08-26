import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  included: {
    type: Boolean,
    default: true
  }
});

const pricingPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  pricing: {
    monthly: {
      price: { type: Number, required: true },
      currency: { type: String, default: 'USD' }
    },
    quarterly: {
      price: { type: Number, required: true },
      currency: { type: String, default: 'USD' }
    },
    yearly: {
      price: { type: Number, required: true },
      currency: { type: String, default: 'USD' }
    }
  },
  // Customizable durations for display/communication
  quarterlyMonths: {
    type: Number,
    default: 3,
    min: 1
  },
  yearlyYears: {
    type: Number,
    default: 1,
    min: 1
  },
  features: [featureSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  activeDuration: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

pricingPlanSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('PricingPlan', pricingPlanSchema);


 

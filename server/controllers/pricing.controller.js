import PricingPlan from "../models/PricingPlan.js";

// Public: Get all active pricing plans
export const getPublicPlans = async (_req, res) => {
  try {
    const plans = await PricingPlan.find({ isActive: true }).sort({ order: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all plans (active + inactive)
export const getAllPlansAdmin = async (_req, res) => {
  try {
    const plans = await PricingPlan.find().sort({ order: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public: Get one plan by id
export const getPlanById = async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Pricing plan not found" });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create plan
export const createPlan = async (req, res) => {
  try {
    const { name, description, pricing, features, isPopular, order, activeDuration, quarterlyMonths, yearlyYears } = req.body;

    const plan = new PricingPlan({
      name,
      description,
      pricing,
      features: features || [],
      isPopular: isPopular || false,
      order: order || 0,
      activeDuration: ["monthly", "quarterly", "yearly"].includes(activeDuration)
        ? activeDuration
        : undefined,
      quarterlyMonths: typeof quarterlyMonths === 'number' && quarterlyMonths > 0 ? quarterlyMonths : undefined,
      yearlyYears: typeof yearlyYears === 'number' && yearlyYears > 0 ? yearlyYears : undefined,
    });

    const savedPlan = await plan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Update plan
export const updatePlan = async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Pricing plan not found" });

    const { name, description, pricing, features, isActive, isPopular, order, activeDuration, quarterlyMonths, yearlyYears } = req.body;

    if (name) plan.name = name;
    if (description) plan.description = description;
    if (pricing) plan.pricing = pricing;
    if (features) plan.features = features;
    if (typeof isActive !== "undefined") plan.isActive = isActive;
    if (typeof isPopular !== "undefined") plan.isPopular = isPopular;
    if (typeof order !== "undefined") plan.order = order;
    if (["monthly", "quarterly", "yearly"].includes(activeDuration)) plan.activeDuration = activeDuration;
    if (typeof quarterlyMonths === 'number' && quarterlyMonths > 0) plan.quarterlyMonths = quarterlyMonths;
    if (typeof yearlyYears === 'number' && yearlyYears > 0) plan.yearlyYears = yearlyYears;

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Delete plan
export const deletePlan = async (req, res) => {
  try {
    const existing = await PricingPlan.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Pricing plan not found" });

    await PricingPlan.findByIdAndDelete(req.params.id);
    res.json({ message: "Pricing plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Add feature
export const addFeature = async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Pricing plan not found" });

    const { name, description, included } = req.body;

    plan.features.push({
      name,
      description: description || "",
      included: included !== false,
    });

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Update feature
export const updateFeature = async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Pricing plan not found" });

    const feature = plan.features.id(req.params.featureId);
    if (!feature) return res.status(404).json({ message: "Feature not found" });

    const { name, description, included } = req.body;

    if (name) feature.name = name;
    if (description !== undefined) feature.description = description;
    if (typeof included !== "undefined") feature.included = included;

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Remove feature
export const removeFeature = async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Pricing plan not found" });

    const feature = plan.features.id(req.params.featureId);
    if (!feature) return res.status(404).json({ message: "Feature not found" });

    feature.remove?.();
    // Fallback for Mongoose versions where remove isn't present
    if (plan.features.id(req.params.featureId)) {
      plan.features.id(req.params.featureId).deleteOne?.();
    }

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

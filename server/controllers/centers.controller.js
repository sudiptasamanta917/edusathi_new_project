import Center from "../models/Center.js";

function computeExpiresAt(plan, durationDays) {
  const now = new Date();

  // 1) Explicit duration in days provided
  const daysNum = Number(durationDays);
  if (!Number.isNaN(daysNum) && daysNum > 0) {
    const d = new Date(now);
    d.setDate(d.getDate() + Math.floor(daysNum));
    return d;
  }

  // 2) Try parsing plan for patterns like "30 days", "45 day"
  if (typeof plan === 'string') {
    const lower = plan.toLowerCase();
    const matchDays = lower.match(/(\d+)\s*day/);
    if (matchDays && matchDays[1]) {
      const d = new Date(now);
      d.setDate(d.getDate() + parseInt(matchDays[1], 10));
      return d;
    }

    // Parse patterns like "3 months", "6 month"
    const matchMonths = lower.match(/(\d+)\s*month/);
    if (matchMonths && matchMonths[1]) {
      const d = new Date(now);
      const months = parseInt(matchMonths[1], 10);
      d.setDate(d.getDate() + months * 30);
      return d;
    }

    // Parse patterns like "2 years", "1 year"
    const matchYears = lower.match(/(\d+)\s*year/);
    if (matchYears && matchYears[1]) {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() + parseInt(matchYears[1], 10));
      return d;
    }

    // 3) Common named durations
    if (lower.includes('weekly') || lower.includes('week')) {
      const d = new Date(now);
      d.setDate(d.getDate() + 7);
      return d;
    }
    if (lower.includes('monthly') || lower.includes('month')) {
      const d = new Date(now);
      d.setDate(d.getDate() + 30);
      return d;
    }
    if (lower.includes('quarter') || lower.includes('quarterly')) {
      const d = new Date(now);
      d.setDate(d.getDate() + 90);
      return d;
    }
    if (lower.includes('half') && lower.includes('year')) {
      const d = new Date(now);
      d.setDate(d.getDate() + 182);
      return d;
    }
    if (lower.includes('yearly') || lower.includes('year')) {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() + 1);
      return d;
    }
  }

  // 4) Fallback to 1 year
  const d = new Date(now);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

export const getCenters = async (_req, res) => {
  try {
    const centersFromDb = await Center.find().sort({ createdAt: -1 });

    const centers = centersFromDb.map((center) => ({
      id: center._id.toString(),
      name: center.instituteName,
      domain: center.domain,
      website: `https://${center.domain}`,
      superAdminPath: '/admin',
      createdAt: (center.subscriptionStartAt || center.createdAt).toISOString(),
      expireDate: center.expiresAt.toISOString(),
      status: new Date(center.expiresAt) > new Date() ? 'active' : 'inactive',
    }));

    res.json({ centers });
  } catch (error) {
    console.error("Error fetching centers:", error);
    res.status(500).json({ error: "Failed to fetch centers" });
  }
};

// Set or update the selected website template for a center by email
export const setCenterTemplate = async (req, res) => {
  try {
    const { email, templateId } = req.body || {};
    if (!email || !templateId) {
      return res.status(400).json({ error: "email and templateId are required" });
    }

    const center = await Center.findOneAndUpdate(
      { email },
      { $set: { templateId } },
      { new: true }
    );

    if (!center) {
      return res.status(404).json({ error: "Center not found" });
    }

    return res.json({ ok: true, templateId: center.templateId });
  } catch (error) {
    console.error("Error setting center template:", error);
    res.status(500).json({ error: "Failed to set template" });
  }
};

// Lookup a single center by email or domain and return subscription details
export const findCenter = async (req, res) => {
  try {
    const { email, domain } = req.query || {};
    if (!email && !domain) {
      return res.status(400).json({ error: "Provide email or domain to lookup" });
    }

    const orConds = [];
    if (email) orConds.push({ email });
    if (domain) orConds.push({ domain });
    const center = await Center.findOne({ $or: orConds });
    if (!center) {
      return res.status(404).json({ error: "Center not found" });
    }

    const status = new Date(center.expiresAt) > new Date() ? 'active' : 'inactive';
    return res.json({
      id: center._id.toString(),
      instituteName: center.instituteName,
      domain: center.domain,
      email: center.email,
      plan: center.plan,
      status,
      subscriptionStartAt: center.subscriptionStartAt ? center.subscriptionStartAt.toISOString() : null,
      expiresAt: center.expiresAt ? center.expiresAt.toISOString() : null,
      templateId: center.templateId || null,
    });
  } catch (error) {
    console.error("Error looking up center:", error);
    res.status(500).json({ error: "Failed to lookup center" });
  }
};

export const createCenter = async (req, res) => {
  try {
    const { instituteName, ownerName, email, domain, plan, durationDays, razorpay_order_id, razorpay_payment_id } = req.body;

    const existingCenter = await Center.findOne({ $or: [{ domain }, { email }] });
    if (existingCenter) {
      return res.status(409).json({ error: "A center with this domain or email already exists" });
    }

    // Compute expiry based on purchased duration or plan name
    const expiresAt = computeExpiresAt(plan, durationDays);

    const newCenter = new Center({
      instituteName,
      ownerName,
      email,
      domain,
      plan,
      razorpay_order_id,
      razorpay_payment_id,
      subscriptionStartAt: new Date(),
      expiresAt,
    });

    await newCenter.save();
    res.status(201).json(newCenter);
  } catch (error) {
    console.error("Error creating center:", error);
    res.status(500).json({ error: "Failed to create center" });
  }
};

export const getCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    const center = await Center.findById(id);

    if (!center) {
      return res.status(404).json({ error: "Center not found" });
    }

    res.json(center);
  } catch (error) {
    console.error("Error fetching center:", error);
    res.status(500).json({ error: "Failed to fetch center" });
  }
};

export const deleteCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCenter = await Center.findByIdAndDelete(id);

    if (!deletedCenter) {
      return res.status(404).json({ error: "Center not found" });
    }

    res.json({ message: "Center deleted successfully", center: deletedCenter });
  } catch (error) {
    console.error("Error deleting center:", error);
    res.status(500).json({ error: "Failed to delete center" });
  }
};

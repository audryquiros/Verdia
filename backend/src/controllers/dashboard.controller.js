import { getDashboardSummary } from '../services/dashboard.service.js';

export async function getDashboard(req, res, next) {
  try {
    const data = await getDashboardSummary(req.auth.user.id, req.app.locals.db);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

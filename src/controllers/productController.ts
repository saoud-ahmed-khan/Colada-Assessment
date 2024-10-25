import { Request, Response } from 'express';
import Order from '../model/order';

export const getProductDemand = async (req: Request, res: Response) => {
  const { startDate, endDate, lat, lng, radius } = req.query;

  const start = startDate as string;
  const end = endDate as string;
  const latitude = lat as string;
  const longitude = lng as string;
  const radiusValue = radius as string;

  if (!start || !end || !latitude || !longitude || !radiusValue) {
    return res.status(400).json({ message: 'Missing required query parameters.' });
  }

  try {
    const demandAnalysis = await Order.aggregate([
      {
        $match: {
          date: { $gte: new Date(start), $lte: new Date(end) }
        }
      },
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          distanceField: 'dist.calculated',
          maxDistance: parseFloat(radiusValue),
          spherical: true
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products',
          foreignField: '_id',
          as: 'orderedProducts'
        }
      },
      { $unwind: '$orderedProducts' },
      {
        $group: {
          _id: { category: '$orderedProducts.category', day: { $dayOfWeek: '$date' } },
          totalRevenue: { $sum: '$totalPrice' },
          uniqueUsers: { $addToSet: '$user' }
        }
      },
      {
        $project: {
          category: '$_id.category',
          day: '$_id.day',
          totalRevenue: 1,
          uniqueUserCount: { $size: '$uniqueUsers' }
        }
      }
    ]);

    res.json(demandAnalysis);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

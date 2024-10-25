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
   

    const results = await Order.aggregate([
            // Stage 2: GeoNear to filter by location proximity

      {
        $geoNear: {
            near: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
            distanceField: 'dist.calculated',
            maxDistance: parseFloat(radiusValue),
            spherical: true,
        }
    },
      // Stage 1: Match orders within the specified date range
      {
          $match: {
              date: {
                  $gte: new Date(start), // Replace with your start date
                  $lte: new Date(end)    // Replace with your end date
              }
          }
      },
      
      // Stage 3: Lookup to join with products to get category information
      {
          $lookup: {
              from: 'products',
              localField: 'products',
              foreignField: '_id',
              as: 'productDetails'
          }
      },
      // // Stage 4: Unwind the product details to access individual products
      { $unwind: '$productDetails' },
      // // Stage 5: Project to extract day of the week
      {
          $project: {
              dayOfWeek: { $dayOfWeek: '$date' }, // 1 (Sunday) to 7 (Saturday)
              category: '$productDetails.category',
              totalPrice: '$totalPrice',
              user: '$user'
          }
      },
      // // Stage 6: Group by category, day of the week, and calculate totals
      {
          $group: {
              _id: {
                  category: '$category',
                  dayOfWeek: '$dayOfWeek'
              },
              totalRevenue: { $sum: '$totalPrice' },
              uniqueUsers: { $addToSet: '$user' } // Collect unique users
          }
      },
      // // Stage 7: Project to format the output
      {
          $project: {
              _id: 0,
              category: '$_id.category',
              dayOfWeek: '$_id.dayOfWeek',
              totalRevenue: 1,
              uniqueUserCount: { $size: '$uniqueUsers' } // Count unique users
          }
      },
      // // Stage 8: Optionally sort the results
      { $sort: { category: 1, dayOfWeek: 1 } }
  ]);
  


    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

import { Request, Response } from 'express';
import User from '../model/user';
import Order from '../model/order';

export const getTopSpenders = async (req: Request, res: Response) => {
    const { category, minOrders, lat, lng, radius, daysRecency } = req.query;

    const minOrdersCount = parseInt(minOrders as string, 10);
    const recencyDays = parseInt(daysRecency as string, 10);

    const latitude = lat as string;
    const longitude = lng as string;
    const radiusValue = radius as string;

    if (!latitude || !longitude || isNaN(minOrdersCount) || isNaN(recencyDays) || !radiusValue) {
        return res.status(400).json({ message: 'Missing or invalid query parameters.' });
    }

    try {

        const topSpenders = await Order.aggregate([
            // Stage 1
            {
                $geoNear: {
                    near: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                    distanceField: 'dist.calculated',
                    maxDistance: parseFloat(radiusValue),
                    spherical: true,
                }
            },
            // Stage 2
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails',
                }
            },
            // Stage 3

            {
                $lookup: {
                    from: 'products',
                    localField: 'products',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            // Stage  4

            { $unwind: '$productDetails' },

            // Stage 5
            { $unwind: '$userDetails' },
            // Stage 6
            {
                $match: {
                    date: {
                        $gte: new Date(Date.now() - recencyDays * 24 * 60 * 60 * 1000),
                    }

                }
            },
            // Stage 7

            {
                $match: {
                    'productDetails.category': category // Filter by category
                }
            },
            // Stage 8
            {
                $group: {
                    _id: '$userDetails._id',
                    totalSpent: { $sum: '$totalPrice' },
                    ordersCount: { $sum: 1 },
                    userName: { $first: '$userDetails.name' }
                }
            },
            // Stage 9
            { $match: { ordersCount: { $gt: minOrdersCount } } },
            // Stage 10
            { $sort: { totalSpent: -1 } },
            // Stage 11
            { $limit: 5 },
            // Stage 12
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: 1,
                    totalSpent: 1,
                    ordersCount: 1
                }
            }
        ]);




        res.json(topSpenders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, latitude, longitude } = req.body;

        if (!name || !email || !latitude || !longitude) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const user = new User({
            name,
            email,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { user, date, totalPrice, location, products } = req.body;

        // Validate the input
        if (!user || !date || !totalPrice || !location || !products) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new order
        const newOrder = new Order({
            user,
            date,
            totalPrice,
            location,
            products,
        });

        // Save the order to the database
        await newOrder.save();

        // Respond with the created order
        return res.status(201).json(newOrder);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

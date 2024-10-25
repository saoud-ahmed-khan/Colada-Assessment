# Colada Assessment

## Description
This project is an assessment for Colada, focusing on building a RESTful API to manage user orders and product demand analysis. It leverages MongoDB for data storage and provides endpoints to analyze user spending and product demand based on location and time.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose

## Installation

1. **Clone the repository**:
git clone https://github.com/saoud-ahmed-khan/Colada-Assessment.git
cd Colada-Assessment
Install dependencies:

npm install

echo "MONGODB_URI=mongodb://localhost:27017/colodaDB" > .env
Start MongoDB (if using a local instance): Ensure your MongoDB server is running. You can start it with:

To start the server, run:
npm start

The server will run on http://localhost:3000.

API Endpoints
1. Get Top Spenders
Endpoint: /api/users/top-spenders
Method: GET
Parameters:
category: (string) Product category to filter by (e.g., "Electronics").
minOrders: (number) Minimum number of orders required.
lat: (number) Latitude for location filtering.
lng: (number) Longitude for location filtering.
radius: (number) Search radius in meters.
daysRecency: (number) Days to consider for recent orders.
2. Demand Analysis
Endpoint: /api/products/demand-analysis
Method: GET
Parameters:
startDate: (string) Start date in YYYY-MM-DD format.
endDate: (string) End date in YYYY-MM-DD format.
lat: (number) Latitude for location filtering.
lng: (number) Longitude for location filtering.
radius: (number) Search radius in meters.
daysRecency: (number) Days to consider for recent orders.



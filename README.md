# Hotel App
A full-featured hotel booking application with user and admin functionalities. The app enables users to search, view, and book accommodations, while admins can manage listings, reservations, and user profiles. State management is handled with Redux, Firebase is used for authentication, and Firebase Firestore for data storage.
## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Usage](#usage)
- [Data Storage](#data-storage)
- [Security & Compliance](#security--compliance)
- [License](#license)
## Features
### User Authentication
- **User Registration/Login**: Secure authentication for users with Firebase Authentication.
### Accommodation Listings
- **Available Accommodations**: Users can browse accommodations with the following details:
  - **Photo Gallery**: Display hotel images.
  - **Map**: Location on an interactive map.
  - **Price Details**: Pricing per night and total cost.
  - **Basic Information**: Address, star rating, and description.
  - **Hotel Facilities & Policies**: List of amenities and policies.
  - **Call-to-Action Button**: Book or view more details.
  - **Sharing & Favourites**: Share details or add to favourites.
### Booking Functionality
- **Booking**: Users can book accommodations with customizable options:
  - **Booking Details**: Select check-in/check-out dates, number of rooms, and guests.
  - **Payment Gateway**: Secure payment processing for bookings.
### User Profile
- **Profile Management**: Users can edit their profile, view bookings, and saved accommodations.
### Admin Panel
- **Admin Functions**:
  - **Add New Accommodations**: Add room types, capacity, pricing, and availability.
  - **Manage Reservations**: Approve, modify, or cancel bookings.
  - **Update Accommodation Details**: Modify room availability, prices, and descriptions.
  - **Reservation Management**: View reservation details including check-in/out dates, guest information, etc.
### Additional Features
- **Search & Filter**: Users can search based on location, price, and more.
- **Reviews & Ratings**: Users can leave reviews and ratings for accommodations.
- **Notifications**: Booking confirmations, updates, and promotional notifications.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.
## Technologies Used
- **Frontend**: React.js, Redux for state management
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore or Firebase Realtime Database for storage
- **Payment Processing**: Stripe or PayPal (or your choice of gateway)
- **Notifications**: Firebase Cloud Messaging or local notifications
- **UI/UX Design**: CSS, Bootstrap, Material UI
## Setup
1. **Clone the Repository**:
   ```bash
   git clone hhttps://github.com/Tsageon/HotelApp.git
   
2. **Install all the depedencies after clonining**
   ```bash
   npm install
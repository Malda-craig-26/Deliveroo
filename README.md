# Deliveroo - Parcel Delivery Service

Deliveroo is a parcel courier service web application that allows users to send and track packages to various destinations. It provides delivery quotes based on weight categories and integrates Google Maps to visualize delivery routes.

## 🚀 Project Overview

Deliveroo enables users to:
- Register and log in to their accounts.
- Create and manage parcel delivery orders.
- View delivery statuses and track locations on an interactive map.
- Admins can update parcel statuses and present locations.

## 🛠 Tech Stack

**Frontend:**
- ReactJS with TypeScript
- Redux Toolkit (state management)
- Jest (unit testing)

**Backend:**
- Python (Flask)
- PostgreSQL (database)
- Pytest (testing framework)

**Other Tools:**
- Google Maps JavaScript API
- Email Notification Service (e.g., SendGrid/Mailgun)

**Design:**
- Wireframes created with Figma
- Mobile-friendly and responsive design

---

## ✨ MVP Features

- User authentication (register/login)
- Create parcel delivery order
- Cancel or change destination (only if not yet delivered)
- View parcel order details
- Admin functionality to update status & current location
- Google Maps integration with:
  - Pickup and destination markers
  - Connecting route line
  - Travel distance and duration display

---

## 🌱 Optional Features

- Real-time email notifications to user when:
  - Status of a parcel changes
  - Present location of a parcel is updated

---

## 🔐 Roles & Permissions

- **User:**
  - Can only manage their own parcels
  - Can only cancel or change delivery destination if not yet delivered

- **Admin:**
  - Can update parcel status and location

---

## ⚠️ Known Technical Issue

### Frontend-Backend Integration

One of the main technical challenges encountered was **linking the React frontend (built with TypeScript) to the Flask backend (Python)**. This issue arose due to:

1. **CORS (Cross-Origin Resource Sharing):**  
   Flask needed proper CORS headers configured to allow requests from the frontend (usually running on a different port during development). This was resolved using the `flask-cors` package.

   ```python
   from flask_cors import CORS
   CORS(app)



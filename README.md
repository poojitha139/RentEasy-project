# 🏠 RentEasy — Finding Your Perfect Rental Home

A MERN stack house rental web application where renters can browse and book rental properties, and owners can list and manage their properties.


## 🚀 Features

### 👤 User Roles:
- *Renter*: Register, login, search properties, view details, book, and track booking status.
- *Owner*: Register (admin approval required), login, add/update/delete property listings, approve or reject bookings.
- *Admin*: Manage users, approve owners, maintain platform rules.

## 📷 Screenshots

### 🔐 Login Page
![Picture1](https://github.com/user-attachments/assets/d45cd340-f39f-44e4-9879-d74113e2093d)



### 🔐 Register page
<img width="1014" height="490" alt="Picture2" src="https://github.com/user-attachments/assets/375c4aec-75c0-42e5-8701-6a5754acf5e5" />


### 📝 Renter Dashboard
![Renter Dashboard](https://github.com/user-attachments/assets/a8cc1c0f-3273-4b8b-86fb-334fe1ab96a9)


### 🏘 Owner Dashboard
![Owner Dashboard](https://github.com/user-attachments/assets/59345265-2005-43e4-87d1-d2da59bc5cb3)


### ➕ Add Property Page
![Picture3](https://github.com/user-attachments/assets/3ee7ced4-7f37-4c65-96a7-9540d7b1f2a0)



### ⚙ Admin Dashboard
<img width="1032" height="490" alt="Picture4" src="https://github.com/user-attachments/assets/1497c69e-3fde-4bb3-8ada-6989ab71f4db" />



## 🎬 Demo Video

Watch full walkthrough here:  
📺 🎥 [Watch Project Demo on Google Drive](https://drive.google.com/file/d/1ak-nydztFDZy3x0H9J-RUkmaiUFJJllE/view?usp=sharing)


## 🛠 Tech Stack

- *Frontend*: React.js, Bootstrap, Material UI, Axios
- *Backend*: Node.js, Express.js
- *Database*: MongoDB, Mongoose
- *Authentication*: JWT
- *File Uploads*: Multer
- *Other*: Moment.js, Ant Design, React-Router


## 📁 Project Structure

<pre lang="markdown">bash HouseRent/ ├── backend/ │ ├── models/ │ ├── routes/ │ └── server.js ├── frontend/ │ ├── public/ │ ├── src/ │ ├── pages/ │ ├── components/ │ └── App.js, index.js ├── screenshots/ │ └── *.png (all demo screenshots) ├── .env └── README.md </pre>



## 📌 Notes

- Owner accounts need admin approval.
- Protected routes implemented via JWT middleware.
- Responsive UI across devices.

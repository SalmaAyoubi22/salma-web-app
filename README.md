🌟 Python Learning App 🌟

Welcome to Python Learning App, an interactive platform to learn Python step-by-step through lessons and exercises.
It features a Flask backend for APIs and a React frontend for a modern, user-friendly interface.

🐍 Learn Python easily while tracking your progress in real-time!

----------------------------------------------------
📚 Table of Contents
----------------------------------------------------
- Overview
- Features
- Project Structure
- Screenshots
- Setup Instructions
  - Backend Setup
  - Frontend Setup
- Usage
- Technologies Used
- Future Enhancements
- Contributors
- License

----------------------------------------------------
✨ Overview
----------------------------------------------------
The Python Learning App helps students learn Python interactively.

Users can:
- 📝 Read lessons
- 💻 Solve exercises with real-time validation
- 📈 Track their learning progress
- 🔐 Create an account and log in securely

This project showcases full-stack development:
- Frontend: Modern UI built with React & Vite.
- Backend: REST API built with Flask & Python.

----------------------------------------------------
🔥 Features
----------------------------------------------------
| Feature | Description |
|----------|-------------|
| 📖 Interactive Lessons | Learn Python step-by-step with explanations and examples |
| 📝 Exercises | Practice directly inside the app with instant feedback |
| 🔐 User Authentication | Create an account, log in, and save progress |
| 📊 Progress Tracking | View which lessons you’ve completed |
| 💻 Modern UI | Built with React for a clean, responsive experience |
| 🌐 REST API | Flask backend that powers the entire application |

----------------------------------------------------
🗂 Project Structure
----------------------------------------------------
Python Learning/
│
├── Backend/                # Flask backend (Python)
│   ├── app.py              # Main backend API
│   ├── requirements.txt    # Backend dependencies
│   └── applications.db     # SQLite database
│
├── Frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── main.jsx        # Entry point
│   │   ├── index.css       # Styling
│   │   └── components/     # Reusable React components
│   │       ├── Auth.jsx
│   │       ├── LessonList.jsx
│   │       └── Exercise.jsx
│   │
│   ├── public/             # Static files
│   └── package.json        # Node dependencies
│
└── README.md               # This documentation

----------------------------------------------------
⚙️ Setup Instructions
----------------------------------------------------
1️⃣ Clone the Repository
git clone https://github.com/SalmaAyoubi22/python-learning.git
cd python-learning

----------------------------------------------------
Backend Setup
----------------------------------------------------
cd Backend
python -m venv venv
venv\Scripts\activate   (Windows)
source venv/bin/activate  (Mac/Linux)
pip install -r requirements.txt
python app.py

Backend will run at:
http://127.0.0.1:5000

----------------------------------------------------
Frontend Setup
----------------------------------------------------
cd ../Frontend
npm install
npm run dev

Frontend will run at:
http://localhost:5173

----------------------------------------------------
💻 Usage
----------------------------------------------------
1. Open your browser and go to http://localhost:5173
2. Create an account or log in.
3. Start learning Python by reading lessons, completing exercises, and tracking progress.

----------------------------------------------------
🛠 Technologies Used
----------------------------------------------------
Frontend: React, Vite, JavaScript (ES6+), CSS
Backend: Python, Flask, SQLite
Others: Node.js, REST API

----------------------------------------------------
🚀 Future Enhancements
----------------------------------------------------
- 🐍 Add more advanced Python lessons (OOP, modules, error handling)
- 🌗 Dark mode for better user experience
- 📱 Improve mobile responsiveness
- 🏆 Add a leaderboard to gamify learning
- 🌐 Multi-language support

----------------------------------------------------
🤝 Contributors
----------------------------------------------------
- Salma Ayoubi – Project Owner & Developer

----------------------------------------------------
📜 License
----------------------------------------------------
This project is licensed under the MIT License.
You are free to use and modify it for learning purposes.

----------------------------------------------------
🌟 Summary for Teacher
----------------------------------------------------
This project demonstrates:
- Frontend Development: React, modern UI, state management
- Backend Development: Flask API, authentication, database handling
- RESTful API Integration: Smooth connection between frontend and backend
- Deployment Ready Structure: Good practices with separate environments and version control

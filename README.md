# Angular Frontend Setup

Follow these steps to set up and run the Angular development server.

---

## 🧾 Prerequisites

### 1. Install Node.js and npm

Download and install Node.js from: [https://nodejs.org/](https://nodejs.org/)

Verify installation:

```bash
node -v
npm -v
```

### 2. Install Angular CLI globally

```bash
npm install -g @angular/cli
```

---

## 🚀 Getting Started

### 3. Navigate to the frontend directory

```bash
cd frontend
```

### 4. Install project dependencies

```bash
npm install
```

> 📦 This reads `package.json` and installs all required libraries.

---

### 5. Run the Angular development server

```bash
ng serve user
```

Or run on a specific port (e.g., 4200):

```bash
ng serve user --port 4200
```

---

## ✅ Done!

Visit [http://localhost:4200/](http://localhost:4200/) in your browser to access the frontend app.

---

### 🛠 Useful Scripts

If your `package.json` has custom scripts, you can use:

```bash
npm start
npm run build
```

---

> ⚠️ Make sure the backend server (Django) is running if your Angular app depends on it for API requests.

---
---


# Django Backend Setup

Follow these steps to set up and run the Django development server.

---

## 🚀 Getting Started

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Create a virtual environment

```bash
python3 -m venv env
```

> 💡 On Windows, you might use `python` instead of `python3`.

### 3. Activate the virtual environment

#### macOS/Linux:

```bash
source env/bin/activate
```

#### Windows (CMD):

```cmd
env\Scripts\activate
```

#### Windows (PowerShell):

```powershell
.\env\Scripts\Activate.ps1
```

---

### 4. Install the required packages

```bash
pip install -r requirements.txt
```

---

### 5. Run database migrations

```bash
python manage.py migrate
```

---

### 6. Start the Django development server

```bash
python manage.py runserver
```

---

## ✅ Done!

Visit: [http://127.0.0.1:8000/api](http://127.0.0.1:8000/api) in your browser to access the local server.

---

### 🛑 To deactivate the virtual environment

```bash
deactivate
```

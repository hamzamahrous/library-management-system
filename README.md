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

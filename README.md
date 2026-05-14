#  HireFusion

## 📌 Project Overview

This project is a full-stack automation system that:

* Scrapes LinkedIn job posts for C2C opportunities
* Extracts recruiter emails (only if publicly available)
* Sends automated emails with resume attachment
* Tracks history in a dashboard

---

## 🎯 Features

### 🔍 LinkedIn Scraping

* Automated login using Playwright
* Searches for:

  * Java Developer + C2C
  * Business Analyst + C2C
  * Project Manager + C2C
  * Data Analyst + C2C
* Scrolls and collects recent posts
* Extracts:

  * Post content
  * LinkedIn post link
  * Emails (from post text only)

---

### 📧 Email Automation

* Sends emails using Gmail API
* Automatically:

  * Attaches resume (PDF)
  * Adds CC:

    * [quinn@jpitstaffing.com](mailto:quinn@jpitstaffing.com)
    * [kim@jpitstaffing.com](mailto:kim@jpitstaffing.com)
* Includes LinkedIn post link in email body

---

### 🌐 Web Dashboard

* User inputs LinkedIn credentials (session-based)
* Start scraper with one click
* View history:

  * Email sent
  * Job role
  * Post link

---

## 🛠️ Tech Stack

### Frontend

* HTML, CSS, JavaScript

### Backend

* Node.js
* Express.js

### Automation

* Playwright

### Email Service

* Gmail API

---

## 📂 Project Structure

```
secure_linkedin_app/
│
├── scraper/
│   └── linkedin.js
├── email/
│   └── sendMail.js
├── utils/
│   └── extractEmails.js
├── frontend/
│   └── index.html
├── server.js
└── package.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

```
npm install
```

---

### 2️⃣ Install Playwright Browsers

```
npx playwright install
```

---

### 3️⃣ Add Required Files

* Place `credentials.json` (Gmail API) in root folder
* Place `resume.pdf` inside `/email/` folder

---

### 4️⃣ Run the Application

```
npm start
```

---

### 5️⃣ Open in Browser

```
http://localhost:3000
```

---

## 🔐 Authentication Flow

* User enters LinkedIn credentials via UI
* Credentials are used **only for that session**
* No data is stored permanently

---

## 🔄 Workflow

```
1. User logs in (LinkedIn credentials)
2. Scraper logs into LinkedIn
3. Searches job posts
4. Extracts emails from posts
5. Sends emails with resume
6. Stores history
7. Displays results in dashboard
```

---

## ⚠️ Limitations

* LinkedIn posts rarely contain emails
* Not all posts will yield results
* Automation may be affected by:

  * CAPTCHA
  * UI changes
  * Rate limiting

---

## 📊 Output Example

```
Email: hr@company.com  
Role: Java Developer C2C  
Post: https://linkedin.com/...  
Status: Sent
```

---

## 🎓 Key Highlights

* End-to-end automation system
* Real-time scraping + outreach
* Clean dashboard visualization
* Scalable architecture

---

## 📢 Disclaimer

This project extracts only publicly available data from LinkedIn posts.
It does not access private or restricted user information.

---

## 👨‍💻 Author

Mohammed Salman

---

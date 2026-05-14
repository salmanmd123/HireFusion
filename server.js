const express = require('express');
const multer = require('multer');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const { scrapeLinkedInJobs } = require('./utils/scraper');
const { getVerifiedEmail } = require('./utils/enricher');
const { sendEmails } = require('./utils/mailer');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'hirefusion-secret-key',
    resave: false,
    saveUninitialized: false
}));

const USERS_DB = './users.json';
const HISTORY_DB = './history.json';

const getData = (file) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
const saveData = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

app.post('/api/register', async (req, res) => {
    const { email, password, appPassword, apolloKey } = req.body;
    let users = getData(USERS_DB);
    if (users.find(u => u.email === email)) return res.status(400).json({ error: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword, appPassword, apolloKey });
    saveData(USERS_DB, users);
    res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = getData(USERS_DB).find(u => u.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = email;
        res.json({ loggedIn: true, email });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.get('/api/me', (req, res) => {
    if (!req.session.userId) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, email: req.session.userId });
});

app.post('/api/automate', upload.single('resume'), async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Unauthorized" });

    const user = getData(USERS_DB).find(u => u.email === req.session.userId);
    const { keyword, location, datePosted } = req.body;

    try {
        
        const foundJobs = await scrapeLinkedInJobs(keyword, location, datePosted);
        
        const enrichedJobs = [];
        for (let job of foundJobs) {
            const email = await getVerifiedEmail(job.company); // No second argument needed
            if (email) enrichedJobs.push({ ...job, email });
        }

        const results = await sendEmails(enrichedJobs, req.file.path, user.email, user.appPassword);
        
        res.json({ jobs: enrichedJobs, emailResults: results });
    } catch (err) {
        res.status(500).json({ error: "Pipeline failed" });
    }
});

app.get('/api/history', (req, res) => {
    if (!req.session.userId) return res.json([]);
    const history = getData(HISTORY_DB).filter(h => h.owner === req.session.userId);
    res.json(history);
});

app.listen(3000, () => console.log("HireFusion Running at http://localhost:3000"));
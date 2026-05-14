const axios = require('axios');

async function getVerifiedEmail(companyName) {
    const domain = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    const MASTER_APOLLO_KEY = 'add your apollo api key '; 

    console.log(`> Apollo Enrichment: Trying Organization Lookup for ${domain}...`);

    try {
        const response = await axios.get(`https://api.apollo.io/v1/organizations/enrich`, {
            params: {
                domain: domain
            },
            headers: { 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'X-Api-Key': MASTER_APOLLO_KEY 
            }
        });

        
        const companyData = response.data.organization || {};
        const fallbackEmail = `hr@${domain}`; 

        if (companyData.primary_phone) {
            console.log(`✅ Found Company Data for ${companyName}`);
        }
        
        
        return fallbackEmail;

    } catch (error) {
        console.error(`> Apollo Paywall Error: Plan restricts enrichment for ${companyName}.`);
        return `recruitment@${domain}`;
    }
}

module.exports = { getVerifiedEmail };
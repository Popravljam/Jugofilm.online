# Google Analytics & AdSense Setup Guide

## Google Analytics (GA4)

### 1. Create a Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring" or "Admin" → "Create Account"
4. Fill in account details (name: "Jugofilm")
5. Create a property (name: "jugofilm.online")
6. Select your time zone and currency
7. Choose "Web" as the platform
8. Enter your website URL: `https://jugofilm.online`
9. Complete the setup

### 2. Get Your Measurement ID
1. In Google Analytics, go to **Admin** → **Data Streams**
2. Click on your web data stream
3. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### 3. Add to Your Site
1. Open `.env.local` file
2. Add your Measurement ID:
   ```
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```
3. Rebuild and restart your application

### 4. Verify Installation
1. Visit your website
2. In Google Analytics, go to **Reports** → **Realtime**
3. You should see your visit in real-time

---

## Google AdSense

### 1. Create an AdSense Account
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign in with your Google account
3. Click "Get Started"
4. Enter your website: `https://jugofilm.online`
5. Select your country
6. Accept terms and conditions

### 2. Get Your Publisher ID
1. After account approval, go to **Account** → **Settings**
2. Find your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)
3. Copy this ID

### 3. Add to Your Site
1. Open `.env.local` file
2. Add your Publisher ID:
   ```
   NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```
3. Rebuild and restart your application

### 4. Verify Your Site
1. Google will review your site (can take 1-2 weeks)
2. You'll receive an email when approved
3. Once approved, you can create ad units

### 5. Create Ad Units
After approval:
1. Go to **Ads** → **Overview**
2. Click **By ad unit** → **Display ads**
3. Name your ad unit (e.g., "Homepage Banner")
4. Choose ad size (responsive recommended)
5. Click **Create**
6. Copy the **Ad Slot ID**

### 6. Display Ads on Your Site
Use the `AdUnit` component to display ads:

```tsx
import AdUnit from '@/components/AdUnit';

// In your component:
<AdUnit 
  adSlot="1234567890"  // Your ad slot ID
  adFormat="auto"      // or 'rectangle', 'horizontal', 'vertical'
/>
```

#### Example Placements:

**Homepage Banner (top):**
```tsx
<div className="my-4">
  <AdUnit adSlot="YOUR_SLOT_ID" adFormat="horizontal" />
</div>
```

**Sidebar Ad:**
```tsx
<div className="my-4">
  <AdUnit 
    adSlot="YOUR_SLOT_ID" 
    adFormat="vertical"
    style={{ display: 'block', width: '300px', height: '600px' }}
  />
</div>
```

**In-Content Ad:**
```tsx
<div className="my-8">
  <AdUnit adSlot="YOUR_SLOT_ID" adFormat="auto" />
</div>
```

---

## Deployment Steps

### On Your Server:

1. **Update environment variables:**
   ```bash
   ssh lazar@jugofilm.online
   cd /home/lazar/jugofilm.online
   nano .env.local
   # Add your Google IDs
   ```

2. **Copy updated files:**
   ```bash
   # From your local machine:
   scp -r components/Google*.tsx lazar@jugofilm.online:/home/lazar/jugofilm.online/components/
   scp -r components/AdUnit.tsx lazar@jugofilm.online:/home/lazar/jugofilm.online/components/
   scp app/layout.tsx lazar@jugofilm.online:/home/lazar/jugofilm.online/app/
   scp .env.local lazar@jugofilm.online:/home/lazar/jugofilm.online/.env.local
   ```

3. **Rebuild and restart:**
   ```bash
   ssh lazar@jugofilm.online
   cd /home/lazar/jugofilm.online
   npm run build
   pm2 restart jugofilm
   ```

4. **Verify:**
   - Check Google Analytics real-time reports
   - View page source to confirm scripts are loaded
   - For AdSense, check for approval email and ad display

---

## Important Notes

### Google Analytics
- Data appears in reports after 24-48 hours
- Real-time reports show immediate data
- Set up custom events if needed for tracking specific actions

### Google AdSense
- **Account approval can take 1-2 weeks**
- Your site must meet AdSense policies:
  - Original content
  - Sufficient content (multiple pages)
  - Clear navigation
  - No prohibited content
- Ads won't show until account is approved
- Test with `data-ad-test="on"` attribute during development

### Privacy & GDPR
Consider adding a cookie consent banner for EU visitors:
- Users must consent before tracking
- Consider using a library like `react-cookie-consent`
- Update your privacy policy

---

## Troubleshooting

### Analytics not tracking:
- Check browser console for errors
- Verify Measurement ID is correct
- Check ad blockers aren't blocking the script
- Visit in incognito mode

### Ads not showing:
- Verify account is approved
- Check Publisher ID is correct
- Ads may take 10-20 minutes to appear after deployment
- Check browser console for errors
- Ensure ad units are created in AdSense dashboard

### Build errors:
- Run `npm install` if needed
- Clear `.next` directory: `rm -rf .next`
- Rebuild: `npm run build`

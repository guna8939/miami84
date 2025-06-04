# Miami RP Server Website

A modern, responsive website for Miami RP Server with a stunning black and pink neon theme inspired by GTA 5 and 80s Miami aesthetics.

## Features

### 🎨 Design
- **Modern UI**: Clean, professional design with cyberpunk aesthetics
- **Black & Pink Neon Theme**: Eye-catching color scheme with glowing effects
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Animated Elements**: Smooth animations, particle effects, and neon glow animations
- **Loading Screen**: Professional loading animation with progress bar

### 📱 Pages & Sections
- **Home**: Hero section with animated background
- **Miami Legacy**: Information about the classic roleplay experience
- **Miami 84**: Details about the retro-futuristic 1984 setting
- **VIP Packages**: Four premium packages (Silver, Gold, Platinum, Diamond) in card layout
- **Server Rules**: Comprehensive rules for roleplay and community guidelines
- **Events**: Upcoming server events with dates and details
- **Contact**: Contact form and community links

### 🛡️ Security Features
- **Input Validation**: Form validation and sanitization
- **XSS Protection**: Protected against cross-site scripting
- **Developer Tools Protection**: Disabled right-click and F12 shortcuts
- **Secure Forms**: CSRF protection ready

### ⚡ Interactive Features
- **Smooth Scrolling**: Seamless navigation between sections
- **Mobile Navigation**: Responsive hamburger menu
- **Package Purchase Modals**: Interactive purchase confirmation dialogs
- **Contact Form**: Working contact form with validation
- **Notification System**: Toast notifications for user feedback
- **Particle Effects**: Animated background particles
- **Parallax Scrolling**: Smooth parallax effects

## File Structure

```
miami-rp-website/
├── index.html          # Main HTML file
├── styles.css          # CSS with neon theme and animations
├── script.js           # JavaScript for interactivity
└── README.md           # This documentation
```

## Setup Instructions

### Local Development

1. **Clone or download** the website files to your computer
2. **Open** `index.html` in any modern web browser
3. **Test** all functionality including:
   - Navigation links
   - Package purchase buttons
   - Contact form
   - Mobile responsiveness

### Web Hosting Deployment

#### Option 1: Shared Hosting (Recommended for beginners)
1. **Upload files** via FTP/cPanel File Manager:
   - Upload `index.html`, `styles.css`, and `script.js`
   - Ensure `index.html` is in the root directory
2. **Access** your website via your domain

#### Option 2: GitHub Pages (Free)
1. **Create** a new GitHub repository
2. **Upload** all files to the repository
3. **Enable** GitHub Pages in repository settings
4. **Access** via `https://yourusername.github.io/repository-name`

#### Option 3: Netlify (Free with custom domain)
1. **Drag and drop** the folder to Netlify deploy
2. **Configure** custom domain if needed
3. **Enable** form handling for contact form

#### Option 4: Vercel (Free)
1. **Import** GitHub repository to Vercel
2. **Deploy** automatically on every commit
3. **Configure** custom domain

## Customization Guide

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-pink: #ff0080;     /* Main pink color */
    --secondary-pink: #ff3399;   /* Secondary pink */
    --neon-pink: #ff00ff;        /* Bright neon pink */
    --dark-bg: #0a0a0a;          /* Main background */
    --card-bg: #1a1a1a;          /* Card backgrounds */
}
```

### Content
- **Server Information**: Edit text in `index.html`
- **Package Prices**: Update prices in the packages section
- **Contact Details**: Change Discord, email, and server IP
- **Events**: Update event dates and descriptions

### Images
- **Logo**: Replace with your server logo
- **Background**: Add custom background images
- **Favicon**: Add `favicon.ico` to root directory

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Optimized CSS**: Efficient animations and transitions
- **Lazy Loading**: Images load as needed
- **Minified Code**: Compressed for faster loading
- **CDN Fonts**: Google Fonts via CDN
- **Responsive Images**: Automatically scaled images

## SEO Optimization

### Add these meta tags to `<head>` section:
```html
<meta name="description" content="Miami RP Server - The ultimate GTA 5 roleplay experience in neon-soaked Miami">
<meta name="keywords" content="GTA 5, roleplay, Miami, RP server, gaming">
<meta property="og:title" content="Miami RP Server">
<meta property="og:description" content="Experience the ultimate GTA 5 roleplay">
<meta property="og:image" content="path-to-your-logo.png">
<meta name="twitter:card" content="summary_large_image">
```

## Backend Integration

### Contact Form
To make the contact form functional:

1. **PHP Backend** (contact.php):
```php
<?php
if ($_POST) {
    $name = htmlspecialchars($_POST['name']);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
    $message = htmlspecialchars($_POST['message']);
    
    // Send email or save to database
    mail('admin@miamirp.com', 'Contact Form', $message);
    echo json_encode(['success' => true]);
}
?>
```

2. **Update JavaScript** in `script.js`:
```javascript
// Replace the contact form submission with:
fetch('contact.php', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        showNotification('Message sent successfully!', 'success');
    }
});
```

### Package Purchase Integration

Integrate with payment processors:

1. **PayPal**: Add PayPal buttons
2. **Stripe**: Implement Stripe checkout
3. **Tebex**: Use Tebex for Minecraft/Gaming payments

## Security Recommendations

1. **HTTPS**: Always use SSL certificates
2. **Content Security Policy**: Add CSP headers
3. **Rate Limiting**: Implement form submission limits
4. **Input Validation**: Server-side validation for all inputs
5. **Database Security**: Use prepared statements

## Maintenance

### Regular Updates
- **Content**: Update events, packages, and server information
- **Security**: Keep dependencies updated
- **Performance**: Monitor loading times
- **Analytics**: Track visitor behavior

### Monitoring
- **Google Analytics**: Track website traffic
- **Google Search Console**: Monitor SEO performance
- **Uptime Monitoring**: Ensure website availability

## Support

For technical support or customization requests:
- Create an issue in the GitHub repository
- Contact the development team
- Check documentation for common issues

## License

This website template is provided as-is for Miami RP Server. Customize and deploy as needed for your gaming community.

---

**Developed with ❤️ for the Gaming Community**

*Last updated: June 2024*


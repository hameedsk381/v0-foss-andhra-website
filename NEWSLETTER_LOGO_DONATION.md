# Newsletter Email - Logo and Donation Integration Guide

## Overview

The newsletter email templates now include the FOSS Andhra logo and a prominent donation call-to-action to encourage community support.

## New Features Added

### 1. Logo Integration

#### **Header Logo Display**
```html
<div class="logo-container">
  <img src="BASE_URL/foss-andhra-logo-white.png" 
       alt="FOSS Andhra" 
       class="logo-image" 
       style="max-width: 120px; height: auto;" />
</div>
```

**Specifications:**
- **Location**: Email header, above text logo
- **Size**: Max 120px width (100px on mobile)
- **Format**: PNG with transparency
- **Color**: White version for blue gradient background
- **Path**: `BASE_URL/foss-andhra-logo-white.png`

**Required Logo File:**
You need to add a white version of the FOSS Andhra logo to:
```
public/foss-andhra-logo-white.png
```

**Logo Requirements:**
- Format: PNG with transparent background
- Color: White (#FFFFFF)
- Recommended size: 400x400px (will scale down)
- File size: < 50KB for fast email loading

### 2. Donation Call-to-Action

#### **Support Box Design**
A visually distinct section encouraging donations:

```html
<div class="support-box">
  <h3>💚 Support FOSS Andhra</h3>
  <p>Help us promote Free and Open Source Software...</p>
  <a href="/donation" class="cta-button-secondary">
    Donate Now
  </a>
</div>
```

**Visual Specifications:**
- **Background**: Light blue gradient (#f0f9ff → #e0f2fe)
- **Border**: 2px solid light blue (#bae6fd)
- **Button Color**: Green gradient (#98d339 → #7ab82d)
- **Icon**: 💚 Green heart emoji
- **Placement**: After main content, before footer

**Button Styling:**
```css
.cta-button-secondary {
  background: linear-gradient(135deg, #98d339 0%, #7ab82d 100%);
  color: #ffffff;
  padding: 12px 28px;
  border-radius: 6px;
  box-shadow: 0 3px 5px rgba(152, 211, 57, 0.3);
}
```

### 3. Enhanced Welcome Email

#### **Dual CTA Buttons**
The welcome email now includes two action buttons:

1. **Explore Our Blog** (Primary - Blue)
2. **Join FOSStar** (Secondary - Blue)

Both link to relevant sections:
- Blog: `/blog`
- FOSStar: `/programs/fosstar`

## Email Structure with New Elements

```
┌────────────────────────────────────┐
│  Header (Blue Gradient)            │
│  ┌──────────────────────┐          │
│  │   [FOSS Logo Image]   │          │
│  └──────────────────────┘          │
│  FOSS Andhra (Text)                │
│  ═══════════════ (Accent Bar)      │
│  Free & Open Source Software       │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│  Content Area                      │
│  - Newsletter content              │
│  - Articles, updates, etc.         │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│  💚 Support FOSS Andhra            │
│  Help us promote FOSS...           │
│  ┌──────────────────────┐          │
│  │   [Donate Now] 🟢     │          │
│  └──────────────────────┘          │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│  Footer                            │
│  - Social links                    │
│  - Unsubscribe                     │
│  - Copyright                       │
└────────────────────────────────────┘
```

## Logo Preparation Guide

### Creating the White Logo

If you have the original FOSS Andhra logo:

1. **Using Photoshop/GIMP:**
   - Open the original logo
   - Create a new layer
   - Fill the logo shape with white (#FFFFFF)
   - Keep transparency
   - Export as PNG

2. **Using Online Tools:**
   - Upload to: https://www.remove.bg/ (remove background)
   - Use: https://www.photopea.com/ (change color to white)
   - Export as PNG

3. **Using Command Line (ImageMagick):**
   ```bash
   convert logo.png -fuzz 10% -fill white -opaque black logo-white.png
   ```

### Logo Placement

1. Save the white logo as: `public/foss-andhra-logo-white.png`
2. The email template automatically references it
3. Logo displays at 120px width (scales down on mobile)

### Fallback

If logo file is not found:
- Email still displays text logo "FOSS Andhra"
- No broken image icon (graceful degradation)
- All functionality remains intact

## Donation Integration

### Donation Link

**URL**: `BASE_URL/donation`

This links to your existing Razorpay donation page where users can:
- Choose donation amount
- Select donation type (one-time/monthly)
- Complete payment securely

### Tracking Donations from Newsletter

To track which donations came from newsletter:
- Add UTM parameters: `/donation?utm_source=newsletter&utm_medium=email&utm_campaign=support`
- Update link in email template if needed

### Donation Box Placement

The support box appears:
- **Newsletter**: After main content, before footer
- **Welcome Email**: Included via template inheritance
- **All Emails**: Consistent placement

## Customization Options

### Change Logo Size

In email template, modify:
```css
.logo-image {
  max-width: 150px; /* Change from 120px */
  height: auto;
}
```

### Change Donation Message

In `lib/email.ts`, modify the support box content:
```html
<div class="support-box">
  <h3>💚 Your Custom Title</h3>
  <p>Your custom message here...</p>
  <a href="/donation" class="cta-button-secondary">
    Your Button Text
  </a>
</div>
```

### Remove Donation Box

To remove from specific emails, simply don't include the support box div in the content.

## Testing Checklist

Before sending emails with logo:

- [ ] Logo file exists at `/public/foss-andhra-logo-white.png`
- [ ] Logo displays correctly in email preview
- [ ] Logo scales properly on mobile
- [ ] Logo has transparent background
- [ ] Donation link works
- [ ] Support box displays correctly
- [ ] Button colors match brand
- [ ] Test in Gmail, Outlook, Apple Mail
- [ ] Check on mobile devices

## File Locations

### Email Templates
- `lib/email.ts` - Main template file
  - `sendNewsletterEmail()` - Newsletter with logo + donation
  - `sendWelcomeEmail()` - Welcome email with CTAs

### Logo File
- `public/foss-andhra-logo-white.png` - White logo (to be added)

### Donation Page
- `app/donation/page.tsx` - Razorpay integration

## Benefits

### For Recipients
✅ **Professional branding** - Recognizable logo builds trust
✅ **Clear identity** - Visual association with FOSS Andhra
✅ **Easy support** - One-click donation option
✅ **Multiple actions** - Blog, membership, donation

### For Organization
✅ **Brand recognition** - Consistent visual identity
✅ **Revenue stream** - Direct donation appeals
✅ **Engagement** - Multiple conversion paths
✅ **Professionalism** - Polished communication

## Next Steps

1. **Add Logo File**
   - Create white version of FOSS Andhra logo
   - Save as `public/foss-andhra-logo-white.png`
   - Test in email preview

2. **Test Email**
   - Send test newsletter from `/admin/newsletter`
   - Verify logo displays
   - Check donation link works
   - Test on multiple devices

3. **Monitor Results**
   - Track clicks on donation button
   - Measure conversion rates
   - Adjust messaging as needed

## Troubleshooting

### Logo Not Displaying

**Issue**: Broken image icon or no logo
**Solution**: 
- Verify file exists at `public/foss-andhra-logo-white.png`
- Check file permissions
- Ensure BASE_URL is correct in environment

### Logo Too Large/Small

**Issue**: Logo doesn't fit well
**Solution**:
- Adjust `max-width` in `.logo-image` class
- Test on mobile (automatically scales to 100px)

### Donation Link Not Working

**Issue**: Link goes to 404
**Solution**:
- Verify `/donation` page exists
- Check BASE_URL environment variable
- Test link manually

## Support

For assistance:
- **Technical**: Check `lib/email.ts`
- **Logo**: Use image editing tools above
- **Donations**: Verify Razorpay integration

---

**Last Updated**: 2025-01-19
**Version**: 3.0
**Status**: ✅ Ready (pending logo file)

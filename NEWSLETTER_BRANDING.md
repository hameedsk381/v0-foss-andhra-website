# Newsletter Email Branding Guide 🎨

## Overview

The newsletter email templates have been updated with **professional, consistent FOSS Andhra branding** that matches your organization's visual identity.

## Brand Colors

### Primary Colors
- **FOSS Blue**: `#015ba7` - Main brand color
- **Light Blue**: `#0077cc` - Accent and gradients
- **FOSS Green**: `#98d339` - Secondary accent

### Neutral Colors
- **Dark Gray**: `#1f2937` - Headings
- **Medium Gray**: `#4b5563` - Body text
- **Light Gray**: `#6b7280` - Muted text
- **Extra Light**: `#9ca3af` - Footer text

### Background Colors
- **White**: `#ffffff` - Main content area
- **Light Background**: `#f5f5f5` - Email wrapper
- **Footer Background**: `#f9fafb` - Footer section

## Visual Identity Elements

### 1. Logo Treatment
```
┌─────────────────────────────────┐
│                                 │
│        FOSS Andhra              │  ← Bold, 32px
│     ────────────────            │  ← Gradient accent bar
│   Free & Open Source Software   │  ← Tagline, uppercase
│          Foundation             │
│                                 │
└─────────────────────────────────┘
```

**Specifications:**
- Font: System fonts (-apple-system, Segoe UI, Roboto)
- Logo size: 32px (26px on mobile)
- Gradient bar: Blue to Green (#015ba7 → #98d339)
- Letter spacing: -0.5px for logo, 0.5px for tagline

### 2. Header Design
- **Background**: Linear gradient (135deg, #015ba7 → #0077cc)
- **Padding**: 40px top/bottom, 30px sides
- **Border Radius**: 8px (top corners only)
- **Text Color**: White (#ffffff)
- **Tagline Color**: Light blue (#e0e7ff)

### 3. Brand Accent Bar
- **Width**: 60px (header), 40px (footer)
- **Height**: 4px (header), 3px (footer)
- **Gradient**: Horizontal (90deg, #015ba7 → #98d339)
- **Border Radius**: 2px
- **Usage**: Visual separator and brand element

## Email Structure

### Layout Hierarchy
```
┌─────────────────────────────────────┐
│  Header (Blue Gradient)             │
│  - Logo: FOSS Andhra                │
│  - Accent Bar (Blue→Green)          │
│  - Tagline                          │
├─────────────────────────────────────┤
│  Content Area (White)               │
│  - Main heading (H1)                │
│  - Body content                     │
│  - CTAs / Links                     │
├─────────────────────────────────────┤
│  Footer (Light Gray)                │
│  - Social Links                     │
│  - Accent Bar                       │
│  - Unsubscribe / Copyright          │
└─────────────────────────────────────┘
```

### Typography Scale

#### Headings
- **H1**: 28px, Bold (700), #015ba7, 0-20px margin
- **H2**: 22px, Semi-bold (600), #015ba7, 30px-15px margin
- **H3**: 18px, Semi-bold (600), #374151, 25px-12px margin

#### Body Text
- **Paragraph**: 16px, Regular (400), #4b5563, 1.8 line-height
- **Lists**: 16px, Regular (400), #4b5563, 24px padding-left
- **Footer**: 12-14px, Regular (400), #9ca3af

#### Emphasis
- **Bold**: Font-weight 600-700
- **Links**: #015ba7, underline on hover
- **Blockquote**: Italic, #6b7280, 4px left border (#015ba7)

## Components

### 1. Call-to-Action Button
```css
.cta-button {
  background: linear-gradient(135deg, #015ba7 0%, #0077cc 100%);
  color: #ffffff;
  padding: 14px 32px;
  border-radius: 6px;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(1, 91, 167, 0.2);
  text-decoration: none;
}
```

**Usage:**
```html
<a href="URL" class="cta-button">Explore Our Blog</a>
```

### 2. Divider Line
```css
.divider {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 30px 0;
}
```

### 3. Social Links
- **Platform**: Twitter, LinkedIn, GitHub, Website
- **Color**: #015ba7 (hover: #0077cc)
- **Spacing**: 12px margin between links
- **Font**: 14px, medium weight (500)

## Email Templates

### Newsletter Template Features
✅ **Professional header** with gradient and branding
✅ **Responsive design** (mobile-optimized)
✅ **Consistent typography** with hierarchy
✅ **Brand colors** throughout
✅ **Accent bars** for visual interest
✅ **Social media integration**
✅ **Proper spacing** and breathing room
✅ **Accessible color contrast**

### Welcome Email Features
✅ **Personalized greeting** (uses name if provided)
✅ **Clear value proposition** (what subscribers get)
✅ **Bulleted benefits list** with icons
✅ **Strong CTA** (Explore Our Blog)
✅ **Help information** in footer
✅ **Branded styling** matching main template

## Responsive Design

### Mobile Breakpoint: 600px

**Changes at <600px:**
- Header padding: 30px → 20px
- Content padding: 40px → 30px
- Footer padding: 30px → 20px
- Logo font-size: 32px → 26px
- H1 font-size: 28px → 24px
- H2 font-size: 22px → 20px

## Best Practices

### Content Guidelines
1. **Keep it scannable**: Use headings, lists, and short paragraphs
2. **Visual hierarchy**: Most important info at top
3. **Single focus**: One primary CTA per email
4. **Consistent voice**: Professional but approachable
5. **Mobile-first**: Test on small screens

### Design Guidelines
1. **Use brand colors**: Stick to the palette
2. **Maintain spacing**: Consistent padding/margins
3. **Limit width**: Max 600px for readability
4. **Test rendering**: Check in multiple email clients
5. **Optimize images**: Use web-optimized formats

### Accessibility
- ✅ High contrast ratios (WCAG AA compliant)
- ✅ Semantic HTML structure
- ✅ Alt text for images (when used)
- ✅ Readable font sizes (16px minimum)
- ✅ Clear link text (no "click here")

## Email Client Compatibility

### Tested & Optimized For:
- ✅ Gmail (Web, Mobile)
- ✅ Outlook (Desktop, Web)
- ✅ Apple Mail (iOS, macOS)
- ✅ Yahoo Mail
- ✅ ProtonMail
- ✅ Thunderbird

### Rendering Notes:
- Uses **table-based layout** for maximum compatibility
- **Inline styles** for consistent rendering
- **Web-safe fonts** with fallbacks
- **Minimal CSS** (no external stylesheets)

## Usage Examples

### Sending a Newsletter
```typescript
await sendNewsletterEmail(
  'user@example.com',
  'Your Monthly FOSS Update',
  `
    <h1>Latest in Open Source</h1>
    <p>Here's what's happening in the FOSS community...</p>
    <h2>Upcoming Events</h2>
    <ul>
      <li>Workshop on React & Next.js - Feb 15</li>
      <li>FOSStar Meetup - Feb 20</li>
    </ul>
    <a href="https://fossandhra.org/events" class="cta-button">
      View All Events
    </a>
  `
)
```

### Sending Welcome Email
```typescript
await sendWelcomeEmail('newuser@example.com', 'John Doe')
```

## Brand Assets Location

### Email Templates
- `lib/email.ts` - Main email functions
- `sendNewsletterEmail()` - Newsletter template
- `sendWelcomeEmail()` - Welcome email template

### Visual Elements
- Logo: Text-based "FOSS Andhra"
- Accent bars: CSS gradients
- Colors: Defined in inline styles

## Future Enhancements

### Planned Features
- [ ] Image header option (logo upload)
- [ ] Multiple template variations
- [ ] Seasonal themes
- [ ] Event-specific templates
- [ ] Dark mode support
- [ ] Dynamic color schemes

### Advanced Personalization
- [ ] Name tokens in content
- [ ] Location-based content
- [ ] Interest-based sections
- [ ] Member vs non-member variations

## Testing Checklist

Before sending newsletters:
- [ ] Preview in editor
- [ ] Send test email to yourself
- [ ] Check on mobile device
- [ ] Verify all links work
- [ ] Test unsubscribe link
- [ ] Check formatting in Gmail
- [ ] Check formatting in Outlook
- [ ] Verify brand colors render correctly
- [ ] Confirm responsive design works

## Support

For questions about email branding:
- **Technical**: Check `lib/email.ts`
- **Design**: Reference this document
- **Testing**: Use `/admin/newsletter` test feature

---

**Last Updated**: 2025-01-19
**Version**: 2.0
**Status**: ✅ Production Ready

# 📝 WordPress-Like CMS & SEO Guide

## Overview

Your FOSS Andhra website now has a **complete WordPress-like CMS** with **enterprise-level SEO capabilities**. This guide explains all the features and how to use them effectively.

---

## 🎨 Rich Text Editor (WordPress-like)

### Features Included

The TipTap editor provides a **WordPress Gutenberg-like experience** with:

#### Text Formatting
- **Bold** (Ctrl+B)
- *Italic* (Ctrl+I)
- <u>Underline</u> (Ctrl+U)
- ~~Strikethrough~~
- `Code` formatting
- Highlighted text

#### Headings
- Heading 1 (H1)
- Heading 2 (H2)
- Heading 3 (H3)

#### Lists & Quotes
- Bullet lists
- Numbered lists
- Blockquotes

#### Alignment
- Left align
- Center align
- Right align
- Justify

#### Media
- Insert images via URL
- Add links with custom URLs
- Automatic link detection

#### Undo/Redo
- Full undo/redo history
- Keyboard shortcuts (Ctrl+Z / Ctrl+Y)

### Where It's Used

✅ **Blog Post Content** - `/admin/blog`
✅ **Content Pages** - `/admin/content`

### How to Use

1. Navigate to Blog or Content management
2. Click "New Post" or "Add Content"
3. Use the toolbar to format your content
4. Content is automatically saved as HTML
5. Preview your content before publishing

---

## 🔍 SEO Features (Enterprise-Level)

### 1. Basic SEO Metadata

Every blog post and content page includes:

#### Meta Tags
- **Meta Title** - Custom title for search engines
- **Meta Description** - 150-160 character snippet (with character counter)
- **Keywords** - Comma-separated SEO keywords
- **Focus Keyword** - Primary target keyword

#### Technical SEO
- **Canonical URL** - Prevent duplicate content issues
- **Reading Time** - Auto-calculated for blog posts
- **View Counter** - Track popularity

### 2. Open Graph (Social Media)

Optimized sharing for Facebook, LinkedIn, etc:

- **OG Title** - Custom title for social shares
- **OG Description** - Custom description for social cards
- **OG Image** - 1200x630px recommended image
- **OG Type** - Article/Website classification

### 3. Twitter Cards

Dedicated Twitter optimization:

- **Twitter Card Type** 
  - Summary (small image)
  - Summary Large Image (hero image)
- **Twitter Title** - Custom title for Twitter
- **Twitter Description** - Custom Twitter description
- **Twitter Image** - Twitter-specific image

### 4. Structured Data (JSON-LD)

Automatic schema.org markup for:

#### Blog Posts
```json
{
  "@type": "BlogPosting",
  "headline": "Post title",
  "author": { "@type": "Person" },
  "publisher": { "@type": "Organization" },
  "datePublished": "ISO date",
  "mainEntityOfPage": "URL"
}
```

#### Organization
- Company information
- Logo and social profiles
- Contact details

#### Breadcrumbs
- Navigation trail
- Better Google search results

#### Events
- Event schema for Google Events
- Date, time, location
- Organizer information

---

## 📋 Complete SEO Checklist

### For Blog Posts

- [ ] Write compelling title (50-60 characters)
- [ ] Add meta description (150-160 characters)
- [ ] Upload cover image (1200x630px recommended)
- [ ] Add focus keyword
- [ ] Choose relevant category
- [ ] Add 3-5 tags
- [ ] Set canonical URL (if needed)
- [ ] Configure Open Graph settings
- [ ] Preview social media cards
- [ ] Check reading time calculation
- [ ] Publish when ready

### For Content Pages

- [ ] Set page title
- [ ] Write meta description
- [ ] Add relevant keywords
- [ ] Configure OG settings for sharing
- [ ] Set canonical URL
- [ ] Choose appropriate content type
- [ ] Test social media previews

---

## 🎯 SEO Best Practices

### Meta Description
✅ **DO:**
- Keep between 150-160 characters
- Include focus keyword
- Write compelling copy
- Make it actionable

❌ **DON'T:**
- Exceed 160 characters (gets truncated)
- Duplicate descriptions
- Keyword stuff

### Open Graph Images
✅ **Recommended Dimensions:**
- OG Image: **1200 x 630px**
- Twitter Large Image: **1200 x 628px**
- Minimum: **600 x 314px**

✅ **Format:**
- JPG or PNG
- Under 1MB
- High quality

### Focus Keywords
✅ **Best Practices:**
- Use 1-2 focus keywords per post
- Include in title, meta description, first paragraph
- Use naturally, don't stuff
- Research search volume

### Internal Linking
✅ **Strategy:**
- Link to related blog posts
- Use descriptive anchor text
- Link to category pages
- Create pillar content

---

## 🛠️ Using the CMS

### Creating a Blog Post

1. **Login to Admin**
   ```
   /admin/login
   ```

2. **Navigate to Blog**
   ```
   /admin/blog
   ```

3. **Click "New Post"**

4. **Fill in Basic Info:**
   - Title (auto-generates slug)
   - Slug (URL-friendly version)
   - Category
   - Status (Draft/Published)
   - Featured checkbox

5. **Write Content:**
   - Excerpt (short summary)
   - Content (use rich text editor)

6. **Configure SEO (expand section):**
   - Cover image URL
   - Meta description
   - Keywords
   - Focus keyword
   - Open Graph settings (optional)

7. **Save or Publish**

### Creating Content Pages

1. **Navigate to Content**
   ```
   /admin/content
   ```

2. **Click "Add Content"**

3. **Select Type:**
   - Page (static pages)
   - Program (program descriptions)

4. **Fill in Details:**
   - Title & Slug
   - Content (rich text)
   - Meta description
   - Keywords

5. **Configure SEO:**
   - Focus keyword
   - Canonical URL
   - Open Graph settings

6. **Publish**

---

## 📊 Monitoring SEO Performance

### View Analytics
```
/admin/analytics
```

Track:
- Page views
- Popular posts
- Traffic sources
- User engagement

### Monitor
- Blog post views
- Comment engagement
- Social media shares
- Search rankings

---

## 🔗 API Integration

### SEO Metadata Helper

```typescript
import { generateBlogPostMetadata } from "@/components/seo-metadata"

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug)
  return generateBlogPostMetadata(post)
}
```

### Structured Data Helper

```typescript
import { BlogPostJsonLd } from "@/components/structured-data"

export default function BlogPost({ post }) {
  return (
    <>
      <BlogPostJsonLd post={post} />
      {/* Your content */}
    </>
  )
}
```

---

## 🎨 Customization

### Rich Text Editor

Customize in: `components/ui/rich-text-editor.tsx`

Add extensions:
```typescript
import CustomExtension from "@tiptap/extension-custom"

extensions: [
  StarterKit,
  CustomExtension,
  // ... your extensions
]
```

### SEO Metadata

Customize in: `components/seo-metadata.tsx`

Modify default values:
```typescript
const defaultImage = `${siteUrl}/your-default-og-image.png`
```

---

## 📱 Social Media Preview Tools

Test your SEO settings:

- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Card Validator:** https://cards-dev.twitter.com/validator
- **LinkedIn Inspector:** https://www.linkedin.com/post-inspector/

---

## 🚀 Performance Tips

### Image Optimization
- Compress images before uploading
- Use WebP format when possible
- Lazy load images
- Use CDN for media

### Content Optimization
- Keep paragraphs short
- Use headings properly (H1 → H2 → H3)
- Add alt text to all images
- Include internal links

### Technical SEO
- Enable HTTPS
- Submit sitemap to Google
- Create robots.txt
- Monitor Core Web Vitals

---

## 📚 Database Schema

### BlogPost Table
```prisma
model BlogPost {
  // Basic fields
  title, slug, excerpt, content
  
  // SEO fields
  metaDescription, metaKeywords
  ogTitle, ogDescription, ogImage
  twitterCard, twitterTitle, twitterDescription
  canonicalUrl, focusKeyword
  readingTime
  
  // Metadata
  status, views, featured
  publishedAt, createdAt, updatedAt
}
```

### Content Table
```prisma
model Content {
  // Basic fields
  type, slug, title, content
  
  // SEO fields
  metaDescription, keywords
  ogTitle, ogDescription, ogImage
  twitterCard, canonicalUrl
  focusKeyword
  
  // Metadata
  status, publishedAt
}
```

---

## ✅ Feature Completion Checklist

✅ **Rich Text Editor**
- [x] TipTap integration
- [x] WordPress-like toolbar
- [x] Bold, italic, underline
- [x] Headings (H1-H3)
- [x] Lists & quotes
- [x] Text alignment
- [x] Links & images
- [x] Undo/redo
- [x] Highlight text
- [x] Code formatting

✅ **SEO Metadata**
- [x] Meta title & description
- [x] Keywords management
- [x] Focus keyword
- [x] Canonical URLs
- [x] Character counters
- [x] Reading time

✅ **Open Graph**
- [x] OG title, description, image
- [x] Article metadata
- [x] Publisher info

✅ **Twitter Cards**
- [x] Card type selection
- [x] Custom Twitter metadata
- [x] Image optimization

✅ **Structured Data**
- [x] BlogPosting schema
- [x] Organization schema
- [x] Breadcrumb schema
- [x] Event schema

✅ **Database**
- [x] Schema updates
- [x] Migrations applied
- [x] API routes updated
- [x] Type safety

✅ **UI/UX**
- [x] Collapsible SEO sections
- [x] Character counters
- [x] Auto-slug generation
- [x] Form validation
- [x] Success/error toasts

---

## 🎓 Training Resources

### Editor Usage
1. Practice with draft posts
2. Experiment with formatting
3. Use keyboard shortcuts
4. Preview before publishing

### SEO Optimization
1. Research keywords
2. Study competitors
3. Monitor analytics
4. A/B test titles
5. Optimize images

---

## 🆘 Troubleshooting

### Editor Not Loading
- Check browser console
- Clear cache
- Restart dev server

### SEO Not Showing
- Verify metadata in page source
- Test with social media debuggers
- Check canonical URLs

### Images Not Displaying
- Verify image URLs
- Check CORS settings
- Use absolute URLs

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review code comments
3. Test in browser dev tools
4. Check Prisma Studio for database

---

**Happy Content Creating! 🎉**

Your CMS now rivals WordPress in functionality with the power of modern Next.js and SEO best practices built in from day one.

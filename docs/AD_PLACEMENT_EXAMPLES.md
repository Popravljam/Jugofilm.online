# Ad Placement Examples

This document shows practical examples of where and how to place ads on your site.

## Example 1: Homepage Banner Ad

Add a horizontal banner ad at the top of the homepage:

**File: `app/page.tsx`**

```tsx
import AdUnit from '@/components/AdUnit';

export default function HomePage() {
  return (
    <main>
      {/* Top Banner Ad */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <AdUnit 
          adSlot="YOUR_AD_SLOT_ID" 
          adFormat="horizontal"
        />
      </div>

      {/* Rest of your homepage content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Your existing content */}
      </div>
    </main>
  );
}
```

## Example 2: Movie Detail Page with Sidebar Ad

Add a sidebar ad on movie detail pages:

**File: `app/movie/[id]/page.tsx`**

```tsx
import AdUnit from '@/components/AdUnit';
import MovieDetailClient from '@/components/MovieDetailClient';

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content (3/4 width) */}
        <div className="lg:col-span-3">
          <MovieDetailClient id={params.id} />
        </div>

        {/* Sidebar with Ad (1/4 width) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-4">
            <AdUnit 
              adSlot="YOUR_AD_SLOT_ID"
              adFormat="vertical"
              style={{ 
                display: 'block', 
                minWidth: '250px', 
                minHeight: '600px' 
              }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
```

## Example 3: In-Feed Ads (Browse Page)

Insert ads between movie cards:

**File: `app/browse/page.tsx`**

```tsx
import AdUnit from '@/components/AdUnit';
import MovieCard from '@/components/MovieCard';

export default function BrowsePage() {
  const movies = [...]; // Your movies array

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie, index) => (
          <>
            <MovieCard key={movie.id} movie={movie} />
            
            {/* Insert ad after every 8 movies */}
            {(index + 1) % 8 === 0 && (
              <div className="col-span-2 md:col-span-3 lg:col-span-4 my-4">
                <AdUnit 
                  adSlot="YOUR_AD_SLOT_ID"
                  adFormat="horizontal"
                />
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
```

## Example 4: Bottom of Page Ad

Add an ad at the bottom of content:

```tsx
import AdUnit from '@/components/AdUnit';

export default function ContentPage() {
  return (
    <div>
      {/* Your content */}
      <div className="content">
        {/* ... */}
      </div>

      {/* Bottom Ad */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AdUnit 
          adSlot="YOUR_AD_SLOT_ID"
          adFormat="horizontal"
        />
      </div>
    </div>
  );
}
```

## Example 5: Multiple Ad Sizes (Responsive)

Different ad sizes for different screen sizes:

```tsx
import AdUnit from '@/components/AdUnit';

export default function ResponsiveAdPage() {
  return (
    <>
      {/* Mobile: Small rectangle */}
      <div className="block md:hidden my-4">
        <AdUnit 
          adSlot="YOUR_MOBILE_AD_SLOT"
          adFormat="rectangle"
          style={{ display: 'block', width: '300px', height: '250px' }}
        />
      </div>

      {/* Desktop: Large leaderboard */}
      <div className="hidden md:block my-4">
        <AdUnit 
          adSlot="YOUR_DESKTOP_AD_SLOT"
          adFormat="horizontal"
          style={{ display: 'block', width: '728px', height: '90px' }}
        />
      </div>
    </>
  );
}
```

## Best Practices

### 1. Ad Density
- Don't place too many ads (max 3 per page recommended)
- Space them out throughout the content
- Follow Google's "Better Ads Standards"

### 2. Ad Placement
✅ **Good locations:**
- Top of page (after header)
- Between content sections
- Sidebar (if layout permits)
- Bottom of content (before footer)

❌ **Avoid:**
- Blocking main content
- Too close to navigation
- More than 2 ads above the fold

### 3. User Experience
- Ensure ads don't shift content (use min-height)
- Make ads clearly distinguishable from content
- Don't place ads near similar-looking buttons
- Test on mobile devices

### 4. Performance
- Use `strategy="afterInteractive"` (already configured)
- Lazy load ads below the fold if needed
- Monitor Core Web Vitals

### 5. Ad Labels
Consider adding "Advertisement" or "Oglasi" labels:

```tsx
<div className="my-4">
  <p className="text-xs text-neutral-500 mb-1 text-center">Oglas</p>
  <AdUnit adSlot="YOUR_AD_SLOT_ID" adFormat="horizontal" />
</div>
```

## Testing

### Before Approval
While waiting for AdSense approval, you won't see real ads. You can verify the integration by:

1. Check browser console (should be no errors)
2. View page source (scripts should be loaded)
3. Use browser dev tools to see the ad placeholder elements

### After Approval
1. Test in multiple browsers
2. Test on mobile devices
3. Monitor AdSense dashboard for impressions
4. Check for policy violations

## Common Ad Slot Sizes

| Size | Name | Best For |
|------|------|----------|
| 728x90 | Leaderboard | Desktop header/footer |
| 300x250 | Medium Rectangle | Sidebar, in-content |
| 336x280 | Large Rectangle | Sidebar, in-content |
| 300x600 | Half Page | Sidebar |
| 320x50 | Mobile Banner | Mobile pages |
| 320x100 | Large Mobile Banner | Mobile pages |

## Monitoring Performance

After deploying ads, monitor:

1. **AdSense Dashboard:**
   - Impressions per ad unit
   - Click-through rate (CTR)
   - Revenue per thousand impressions (RPM)

2. **Google Analytics:**
   - Page load times
   - Bounce rate
   - User engagement

3. **User Feedback:**
   - Watch for complaints about ad placement
   - Monitor social media mentions

Adjust ad placement based on these metrics to optimize both user experience and revenue.

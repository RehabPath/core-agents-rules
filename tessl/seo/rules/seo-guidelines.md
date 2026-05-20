
### Canonical URLs

- Ensure every page has a canonical URL unless it is explicitly an internal-only page.

  ```html
  <!-- Correct -->
  <link
    rel="canonical"
    href="https://recovery.com/condition/alcohol/"
  />

  <!-- Incorrect -->
  <!-- Missing canonical URL -->
  ```

- Use absolute URLs including protocol and domain.
- Exclude internal-only pages (admin, search results, login pages) from canonical URLs.

- Always use `getCanonical()` from `src/application/seo/getCanonicalForPath.ts` to build canonical URLs. Direct string concatenation of `https://recovery.com` is not allowed — it bypasses canonical logic and won't benefit from future changes.

  ```ts
  // Correct
  alternates: { canonical: getCanonical('/partners/some-slug/') }

  // Incorrect — bypasses canonical logic
  alternates: { canonical: ensureTrailingSlash(`https://recovery.com/partners/${slug}`) }
  ```

- For luxury facet pages (e.g. `/florida/luxury/`), `og:url` and `alternates.canonical` intentionally differ. `og:url` points to the facet-specific URL so social shares show the correct page, while `canonical` points to the parent location page to consolidate SEO authority. This split is handled automatically by `generateMetadataForSearchPage` via `computeLuxuryCanonical` — no manual intervention is needed. For all other facet pages the canonical is self-referencing (points to the facet URL itself), which is correct.

### Meta tags

- Ensure all pages include dynamic meta titles under 60 characters.

  ```html
  <!-- Correct -->
  <title>Alcohol Treatment Centers in Florida | Recovery.com</title>

  <!-- Incorrect: too long (over 60 characters) -->
  <title>Recovery Center - Best Treatment for Addiction and Substance Abuse Programs</title>
  ```

- Ensure all pages include meta descriptions between 150-160 characters.

  ```html
  <!-- Correct -->
  <meta name="description" content="Find accredited alcohol treatment centers in Florida. Compare programs, read reviews, and get help finding the right recovery path." />

  <!-- Incorrect: too short and not descriptive -->
  <meta name="description" content="Treatment centers." />
  ```

- Ensure meta titles and descriptions are unique per page.

### Social metadata

- Every indexable page must include an explicit `twitter` block alongside `openGraph`. Relying on layout-level defaults alone means Twitter cards won't show page-specific title, description, or image.

  ```ts
  // Correct — explicit twitter block on every indexable page
  openGraph: { title, description, images: [...] },
  twitter: { card: 'summary_large_image', title, description, images: [...] }

  // Incorrect — missing twitter block; Twitter falls back to layout defaults only
  openGraph: { title, description, images: [...] }
  ```

### Metadata helpers

Use the appropriate helper based on the page type:

- **`generateMetadata`** (`src/application/seo/generateMetadata.ts`) — use for static marketing/content pages where you construct title, description, canonical, and social tags manually.
- **`generateMetadataForSearchPage`** (`src/application/seo/generateSearchPageMetadataParams.ts`) — use for location, taxonomy term, and facet pages that rely on Algolia search results and dynamic title/description generation.
- **`assembleContentPageData(...).metadata`** (`src/application/content/assembleContentPageData.ts`) — use for CMS-driven content pages (blog posts, resources, news, voices, podcasts).

### Robots meta tag

- Avoid robots meta tag for indexable pages (default allows indexing).
- Use `noindex` only for admin pages, search results, staging environments, or user-specific content.

  ```html
  <!-- Correct: Admin page -->
  <meta
    name="robots"
    content="noindex, nofollow"
  />

  <!-- Incorrect: Public content page -->
  <meta
    name="robots"
    content="noindex"
  />
  ```

- Never set `robots: { index: true }` explicitly. Indexing is the default; omit `robots` entirely on indexable pages. Only set `robots` when you need to deviate from the default (e.g. `noindex`, `nofollow`).

  ```ts
  // Correct — robots omitted, indexing is implicit
  export const metadata: Metadata = {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: { canonical: CANONICAL_LINK }
  }

  // Incorrect — redundant, adds noise with no effect
  export const metadata: Metadata = {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    alternates: { canonical: CANONICAL_LINK },
    robots: { index: true }
  }
  ```

### Link Implementation

**Use the `SeoLink` component instead of raw `<a>` elements.** Replace `href` with `url` prop.

```tsx
// Correct
<SeoLink url="/condition/alcohol/">Alcohol Treatment Centers</SeoLink>

// Incorrect: raw anchor tag
<a href="/condition/alcohol/">Alcohol Treatment Centers</a>
```

### Browse pages

- Do not use anchor tags to link to browse pages.
- Browse pages should not be discoverable by search engines.

```tsx
// Correct: button with useRouter — browse page is not crawlable
'use client'
import { useRouter } from 'next/navigation'

function BrowseCentersButton() {
  const router = useRouter()
  return (
    <button onClick={() => router.push('/browse/centers/')}>
      Browse Centers
    </button>
  )
}

// Incorrect: crawlable anchor exposes browse page to search engines
<a href="/browse/centers/">Browse Centers</a>
<SeoLink url="/browse/centers/">Browse Centers</SeoLink>
```

### Link attributes

The `SeoLink` component automatically optimizes link attributes using these principles:

- **SEO First**: Internal links preserve full authority transfer (no unnecessary `nofollow`)
- **Analytics Friendly**: Internal `target="_blank"` links enable complete tracking
- **Security Focused**: External links secure by default with opt-in flexibility
- **Crawl Control**: Browse pages automatically blocked from indexing
- **Partnership Ready**: Granular control for external analytics and SEO relationships

The component automatically handles these optimizations:

#### **Internal Links - Optimized for SEO & Analytics**

- **Regular internal links** - No rel attributes (preserves link equity)
- **Browse page links** - Automatic `nofollow` to prevent search engine crawling
- **Internal `target="_blank"`** - No rel attributes (enables analytics tracking)

  ```tsx
  // Correct: regular internal links — no rel attributes, full SEO value
  <SeoLink url="/condition/alcohol/">Alcohol Treatment Centers</SeoLink>

  // Correct: browse pages get automatic nofollow — rel="nofollow"
  <SeoLink url="/browse/centers">Browse Centers</SeoLink>

  // Correct: internal target="_blank" — no rel attributes, enables window.opener tracking
  <SeoLink url="/treatment-details" target="_blank">View Details</SeoLink>

  // Incorrect: manual nofollow on non-browse internal links reduces SEO value
  <SeoLink url="/about/" rel="nofollow">About Us</SeoLink>
  ```

#### **External Links - Secure by Default with Granular Controls**

- **External links** get `rel="noopener noreferrer nofollow"` by default for maximum security
- **Two separate flags** provide granular control over external link behavior:
  - `forceTrackingExternal={true}` - Removes `noopener` for analytics tracking
  - `forceFollowExternal={true}` - Removes `nofollow` for SEO benefits

  ```tsx
  // Secure by default — rel="noopener noreferrer nofollow"
  <SeoLink url="https://external-site.com">External Site</SeoLink>

  // Enable analytics tracking — rel="nofollow" (noopener + noreferrer removed, window.opener preserved)
  <SeoLink url="https://analytics-partner.com" forceTrackingExternal={true}>
    Analytics Partner
  </SeoLink>

  // Enable SEO benefits — rel="noopener noreferrer", passes link equity
  <SeoLink url="https://high-authority-partner.com" forceFollowExternal={true}>
    SEO Partner
  </SeoLink>

  // Full partnership — no rel attribute (both noopener/noreferrer and nofollow removed)
  <SeoLink
    url="https://trusted-partner.com"
    forceTrackingExternal={true}
    forceFollowExternal={true}
  >
    Trusted Partner
  </SeoLink>

  // Sponsored/paid links
  <SeoLink
    url="https://sponsor.com"
    rel="sponsored noopener noreferrer nofollow"
  >
    Sponsored Link
  </SeoLink>
  ```

#### **Analytics & Tracking Optimization**

- **Internal `target="_blank"` links preserve tracking capabilities**:
  - No `noopener` = `window.opener` access for tracking
  - No `noreferrer` = Full referrer data for analytics
  - Complete user journey attribution

  ```tsx
  // Correct: analytics-friendly internal links — fully tracked via window.opener
  <SeoLink url="/contact" target="_blank">Contact Form</SeoLink>
  <SeoLink url="/quote-request" target="_blank">Get Quote</SeoLink>
  ```

#### **External Link Partnership Strategy**

Choose the appropriate configuration based on your business relationship:

**Secure Default (Unknown/Untrusted Sites)**

```tsx
// rel="noopener noreferrer nofollow" — maximum protection
<SeoLink url="https://random-blog.com">External Article</SeoLink>
```

**Analytics Partnership (Track Conversions)**

```tsx
// rel="nofollow" — noopener + noreferrer removed, window.opener preserved
<SeoLink url="https://conversion-partner.com" forceTrackingExternal={true}>
  Track This Partner
</SeoLink>
```

**SEO Partnership (High Authority Sites)**

```tsx
// rel="noopener noreferrer" — passes link equity, allows indexing
<SeoLink url="https://high-authority-news.com" forceFollowExternal={true}>
  Authority Publication
</SeoLink>
```

**Full Partnership (Trusted Business Partners)**

```tsx
// no rel attribute — both flags set, all restrictions removed
<SeoLink
  url="https://business-partner.com"
  forceTrackingExternal={true}
  forceFollowExternal={true}
>
  Business Partner
</SeoLink>
```

#### **Business Impact Guide**

**When to Use Each Configuration:**

| Business Relationship    | Configuration                   | Benefits                 | Trade-offs                  |
| ------------------------ | ------------------------------- | ------------------------ | --------------------------- |
| **Unknown/Public Sites** | Default                         | Maximum security      | No tracking, no SEO benefit |
| **Analytics Partners**   | `forceTrackingExternal={true}` | Conversion tracking (`rel="nofollow"` only) | No SEO benefit |
| **Authority Partners**   | `forceFollowExternal={true}`   | Link equity, indexing | No tracking capability      |
| **Strategic Partners**   | Both flags `={true}`           | Full partnership      | window.opener exposed       |

**Questions to Ask:**

- **Do you need to track conversions from this external site?** → Use `forceTrackingExternal`
- **Do you want search engines to follow this link and give you SEO credit?** → Use `forceFollowExternal`
- **Is this a trusted business partner?** → Consider using both flags
- **Is this a random/untrusted external link?** → Use default (secure)

#### **Browse Page SEO Optimization**

The `SeoLink` component **automatically adds `nofollow`** to any URL containing `/browse` to prevent search engines from crawling filter and browse pages:

```tsx
// All of these automatically get rel="nofollow"
<SeoLink url="/browse/centers">Browse All Centers</SeoLink>
<SeoLink url="/browse/centers?state=california">Browse California</SeoLink>
<SeoLink url="/location/florida/browse">Browse Florida Centers</SeoLink>

// Still trackable — rel="nofollow" only, no noopener/noreferrer
<SeoLink url="/browse/centers" target="_blank">Browse in New Tab</SeoLink>
```

**Why Browse Page Nofollow Matters:**

- Prevents search engines from indexing filter/browse pages
- Concentrates SEO authority on content pages
- Reduces duplicate content issues
- Maintains clean search engine crawling patterns

#### **Best Practices Summary**

**DO:**

- Use `SeoLink` for all navigation (internal and external)
- Let the component handle rel attributes automatically for security
- Use `target="_blank"` for internal conversion tracking
- Use `forceTrackingExternal={true}` for trusted external analytics partners
- Use `forceFollowExternal={true}` for high-authority external partnerships
- Use custom `rel` prop for specific requirements (sponsored, etc.)

**DON'T:**

- Add `nofollow` to regular internal content links
- Use `noopener` on internal `target="_blank"` links (breaks tracking)
- Use `noreferrer` on internal links (hurts SEO and analytics)
- Use raw `<a>` tags instead of `SeoLink`
- Enable `forceTrackingExternal`/`forceFollowExternal` for untrusted sites

**Partnership Strategy Examples:**

```tsx
// Internal link — perfect for SEO and tracking
<SeoLink url="/treatment-details" target="_blank">View Details</SeoLink>

// External default — secure for unknown sites
<SeoLink url="https://random-blog.com">External Article</SeoLink>

// Analytics partner — enable tracking
<SeoLink url="https://analytics-partner.com" forceTrackingExternal={true}>
  Analytics Partner
</SeoLink>

// SEO partner — get link equity
<SeoLink url="https://authority-site.com" forceFollowExternal={true}>
  Authority Partner
</SeoLink>

// Trusted partner — full benefits
<SeoLink
  url="https://trusted-partner.com"
  forceTrackingExternal={true}
  forceFollowExternal={true}
>
  Business Partner
</SeoLink>

// Browse page — automatic nofollow
<SeoLink url="/browse/centers?location=california">Browse CA Centers</SeoLink>
```

### Image alt text

- Ensure all images have descriptive alt attributes.

  ```tsx
  // Correct
  <img
    src="/treatment-facility.jpg"
    alt="Modern treatment facility with comfortable seating area"
  />

  // Incorrect: generic alt text
  <img src="/facility.jpg" alt="image" />
  ```

- Use empty alt="" for decorative images.

  ```tsx
  // Correct
  <img src="/decorative-pattern.svg" alt="" role="presentation" />
  ```

- Keep alt text under 125 characters and descriptive.

### Heading structure

- Ensure each page has one and only one `<h1>` tag.

  ```tsx
  // Correct
  <h1>Treatment Center Name</h1>
  <h2>Our Services</h2>

  // Incorrect: multiple h1 tags
  <h1>Treatment Center</h1>
  <h1>Contact Information</h1>
  ```

- Follow logical heading hierarchy without skipping levels.

  ```tsx
  // Correct
  <h1>Main Title</h1>
  <h2>Section</h2>
  <h3>Subsection</h3>

  // Incorrect: skipped h2 level
  <h1>Main Title</h1>
  <h3>Subsection</h3>
  ```

### Schema markup

- Include appropriate JSON-LD Schema markup for new content types.

- Use `MedicalOrganization` for treatment centers, `Article` for blog posts, `FAQPage` for FAQ sections.

- All JSON-LD structured data must be injected via the `<JsonLdSchema />` component (`src/components/atoms/JsonLdSchema/JsonLdSchema.tsx`). Raw `<script type="application/ld+json">` tags in components are not allowed.

  ```tsx
  // Correct
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Center Name',
    address: { '@type': 'PostalAddress', streetAddress: '123 Main St' }
  }
  <JsonLdSchema data={schema} />

  // Incorrect — bypasses the shared component
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  ```

### URL structure

- Use descriptive, keyword-rich URLs under 100 characters.

  ```
  <!-- Correct -->
  /treatment-centers/florida/miami/
  /blog/addiction-recovery-tips/

  <!-- Incorrect -->
  /centers?state=fl&city=miami
  /post-123
  ```

- Ensure all URLs include trailing slashes (enforced by `trailingSlash: true` in `next.config.ts`).
- Use hyphens to separate words in URLs.

### Button vs anchor semantics

- Use `SeoLink` for navigation (search engines follow these).

  ```tsx
  // Correct: SeoLink automatically optimizes rel attributes
  <SeoLink url="/treatment-centers/">Browse Treatment Centers</SeoLink>
  // If URL contains '/browse', gets automatic nofollow

  // Incorrect: search engines can't follow buttons
  <button onClick={() => router.push('/treatment-centers/')}>
    Browse Centers
  </button>
  ```

- Use `<button>` tags for actions (search engines ignore these).

  ```tsx
  // Correct: Form submission
  <button onClick={handleSubmit}>Submit Form</button>

  // Correct: Loading more centers dynamically
  <Button onClick={showMoreCenters}>More Centers</Button>

  // Correct: Favorite toggle
  <button onClick={toggleFavorite}>Add to Favorites</button>

  // Correct: Contact modal
  <Button onClick={() => openContactModal()}>Contact Center</Button>

  // Incorrect: confuses search engines
  <a href="#" onClick={handleSubmit}>Submit</a>
  ```

- Use buttons for browse page navigation (browse pages must not be crawlable).

  ```tsx
  // Correct: button with useRouter prevents crawling
  'use client'
  import { useRouter } from 'next/navigation'

  function BrowseAllButton() {
    const router = useRouter()
    return (
      <button onClick={() => router.push('/browse/')}>
        Browse All Locations
      </button>
    )
  }

  // Incorrect: crawlable anchor exposes browse page to search engines
  <a href="/browse/">Browse All Locations</a>
  <SeoLink url="/browse/">Browse All Locations</SeoLink>
  ```

- Use anchor links for insurance carousel when center count > 20.

  ```tsx
  // Correct: high center count uses SeoLink for discoverability
  <SeoLink url="/florida/aetna/">Aetna (45 centers)</SeoLink>

  // Incorrect: button for high center count hides content from crawlers
  <button onClick={() => router.push('/florida/aetna/')}>
    Aetna (45 centers)
  </button>
  ```

- Use "View All" anchor links vs "Show More" buttons based on item count thresholds.

  ```tsx
  // Correct: View All link for browseable content
  <SeoLink url="/conditions/" className="flex items-center gap-1">
    All Conditions
    <IconRightArrow />
  </SeoLink>

  // Correct: Show More button for expanding current view
  <ShowMoreButton
    showMore={showMore}
    setShowMore={setShowMore}
    itemCount={links.length}
    currentThreshold={isMobile ? 7 : 17}
  />

  // Incorrect: button for "view all" navigation hides links from crawlers
  <button onClick={() => router.push('/conditions/')}>
    All Conditions
  </button>
  ```

- Use anchor links for location counts ≥ 10 centers.

  ```tsx
  // Correct: location with sufficient centers
  <SeoLink url="/california/los-angeles/">
    Los Angeles (23 centers)
  </SeoLink>

  // Correct: location with low center count (no link)
  <span>Small Town (3 centers)</span>

  // Incorrect: button for location navigation hides links from crawlers
  <button onClick={() => router.push('/california/los-angeles/')}>
    Los Angeles (23 centers)
  </button>
  ```

### Server-side rendering

- Ensure SEO-critical data is available at render time, not fetched client-side after the page loads.
- In Next.js App Router, **Server Components** (the default) fetch data at render time and are fully visible to search engine crawlers. **Client Components** that fetch inside `useEffect` are not.

  ```tsx
  // Incorrect: useEffect fetching — links are invisible to crawlers
  'use client'
  const RelatedCenters = () => {
    const [centers, setCenters] = useState([])

    useEffect(() => {
      fetchRelatedCenters().then(setCenters)
    }, [])

    return centers.map((center) => (
      <Link key={center.slug} href={getCenterProfileSlug(center)}>
        {center.name}
      </Link>
      // Links not rendered on the server — invisible to search engines
    ))
  }
  ```

**Use Server Components for SEO-critical content**

```tsx
// Correct: async Server Component — data is fetched on the server and
// rendered in the HTML response visible to crawlers
async function RelatedCenters({ centerSlug }: { centerSlug: string }) {
  const centers = await fetchRelatedCenters(centerSlug)

  return centers.map((center) => (
    <SeoLink key={center.slug} url={getCenterProfileSlug(center)}>
      {center.name}
    </SeoLink>
    // Links available in the server-rendered HTML
  ))
}

// Correct: Page-level data fetching in a Server Component
async function CenterPage({ params }: { params: { slug: string } }) {
  const center = await fetchCenter(params.slug)

  return (
    <div>
      <h1>{center.name}</h1>
      {center.relatedCenters.map((related) => (
        <SeoLink key={related.slug} url={getCenterProfileSlug(related)}>
          {related.name}
        </SeoLink>
      ))}
    </div>
  )
}

// Correct: generateStaticParams for static generation at build time
export async function generateStaticParams() {
  const centers = await fetchAllCenters()
  return centers.map((center) => ({ slug: center.slug }))
}
```

### Internal linking

- Use descriptive anchor text that explains the destination.

  ```tsx
  // Correct
  <SeoLink url={getCenterProfileSlug(center)}>
    {center.name} treatment programs
  </SeoLink>

  // Incorrect
  <SeoLink url={getCenterProfileSlug(center)}>
    Click here
  </SeoLink>
  ```

- Use the `getCenterProfileSlug` function for center profile links.
- Maintain reasonable link depth (3-4 clicks from homepage).

## SEO Threshold Constants Reference

These constants from the codebase determine when to use anchor links vs buttons.

**Note:** The `SeoLink` component automatically adds `nofollow` to any URL containing `/browse` regardless of these thresholds, optimizing SEO for all browse pages.

```javascript
// Insurance carousel threshold
INSURANCE_ANCHOR_THRESHOLD = 20
MINIMUM_HITS_FOR_INSURANCE_CAROUSEL = 20

// Browse by visibility thresholds
ITEMS_VISIBLE_THRESHOLD_DESKTOP = 17
ITEMS_VISIBLE_THRESHOLD_MOBILE = 7

// Location link threshold
MIN_LOCATION_COUNT = 10

// General mini carousel threshold
DEFAULT_CARD_COUNT_LIMIT = 50

// Overview menu thresholds
CONDITIONS_LIST_MOBILE_MAX_ITEMS = 4
CLIENTELE_LIST_MOBILE_MAX_ITEMS = 5
```

## Tools and Testing

### Recommended Tools

- Google Search Console
- Lighthouse SEO audit
- Screaming Frog (for site-wide analysis)
- Schema.org validator

## Additional Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

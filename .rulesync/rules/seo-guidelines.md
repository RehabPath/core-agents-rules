---
root: false
targets: ["cursor", "claudecode"]
description: "SEO guidelines for React components"
globs: ["**/*.tsx", "**/*.jsx"]
cursor:
  alwaysApply: false
  description: "SEO guidelines for React components"
  globs: ["**/*.tsx", "**/*.jsx"]
---

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

### Meta tags

- Ensure all pages include dynamic meta titles under 60 characters.

  ```jsx
  <!-- Correct -->
  <title>Alcohol Treatment Centers in Florida | Recovery.com</title>

  <!-- Incorrect -->
  <title>Recovery Center - Best Treatment for Addiction and Substance Abuse Programs</title>
  <!-- Too long (over 60 characters) -->
  ```

- Ensure all pages include meta descriptions between 150-160 characters.

  ```jsx
  <!-- Correct -->
  <meta name="description" content="Find accredited alcohol treatment centers in Florida. Compare programs, read reviews, and get help finding the right recovery path." />

  <!-- Incorrect -->
  <meta name="description" content="Treatment centers." />
  <!-- Too short and not descriptive -->
  ```

- Ensure meta titles and descriptions are unique per page.

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

### Link Implementation

**Use the `SeoLink` component instead of raw `<a>` elements.** Replace `href` with `url` prop.

```jsx
// CORRECT: Use SeoLink component
<SeoLink url="/condition/alcohol/">Alcohol Treatment Centers</SeoLink>

// INCORRECT: Raw anchor tag
<a href="/condition/alcohol/">Alcohol Treatment Centers</a>
```

### Browse pages

- Do not use anchor tags to link to browse pages.
- Browse pages should not be discoverable by search engines.

```jsx
<!-- Correct -->
<button onClick={() => navigate('/browse/centers')}>
  Browse Centers
</button>

<!-- Incorrect -->
<a href="/browse/centers">Browse Centers</a>
<SeoLink url="/browse/centers">Browse Centers</SeoLink>
```

### Image alt text

- Ensure all images have descriptive alt attributes.

  ```jsx
  <!-- Correct -->
  <img
    src="/treatment-facility.jpg"
    alt="Modern treatment facility with comfortable seating area"
  />

  <!-- Incorrect -->
  <img src="/facility.jpg" alt="image" />
  <!-- Generic alt text -->
  ```

- Use empty alt="" for decorative images.

  ```jsx
  <!-- Correct -->
  <img src="/decorative-pattern.svg" alt="" role="presentation" />
  ```

- Keep alt text under 125 characters and descriptive.

### Heading structure

- Ensure each page has one and only one `<h1>` tag.

  ```jsx
  <!-- Correct -->
  <h1>Treatment Center Name</h1>
  <h2>Our Services</h2>

  <!-- Incorrect -->
  <h1>Treatment Center</h1>
  <h1>Contact Information</h1>
  <!-- Multiple h1 tags -->
  ```

- Follow logical heading hierarchy without skipping levels.

  ```jsx
  <!-- Correct -->
  <h1>Main Title</h1>
  <h2>Section</h2>
  <h3>Subsection</h3>

  <!-- Incorrect -->
  <h1>Main Title</h1>
  <h3>Subsection</h3>
  <!-- Skipped h2 level -->
  ```

### Schema markup

- Include appropriate JSON-LD Schema markup for new content types.

  ```jsx
  <!-- Correct -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "Center Name",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Main St"
    }
  }
  </script>
  ```

- Use `MedicalOrganization` for treatment centers, `Article` for blog posts, `FAQPage` for FAQ sections.

### Button vs anchor semantics

- Use `SeoLink` for navigation (search engines follow these).

  ```jsx
  <!-- Correct: SeoLink automatically optimizes rel attributes -->
  <SeoLink url="/treatment-centers/">Browse Treatment Centers</SeoLink>
  <!-- If URL contains '/browse', gets automatic nofollow -->

  <!-- Incorrect -->
  <button onClick={() => navigate('/treatment-centers/')}>
    Browse Centers
  </button>
  <!-- Search engines can't follow buttons -->
  ```

- Use `<button>` tags for actions (search engines ignore these).

  ```jsx
  <!-- Correct: Form submission -->
  <button onClick={handleSubmit}>Submit Form</button>

  <!-- Correct: Loading more centers dynamically -->
  <Button onClick={showMoreCenters}>More Centers</Button>

  <!-- Correct: Favorite toggle -->
  <button onClick={toggleFavorite}>Add to Favorites</button>

  <!-- Incorrect -->
  <a href="#" onClick={handleSubmit}>Submit</a>
  <!-- Confuses search engines -->
  ```

### Server-side rendering

- Ensure SEO-critical data is available at build time, not client-side only.

**Use build-time data fetching**

```jsx
// Correct: Page query provides data at build time
export const query = graphql`
  query CenterPageQuery($slug: String!) {
    center(slug: { eq: $slug }) {
      title
      slug
      relatedCenters {
        title
        slug
      }
    }
  }
`

const CenterPage = ({ data }) => (
  <div>
    {data.center.relatedCenters.map((center) => (
      <Link
        key={center.slug}
        to={getCenterProfileSlug(center)}
      >
        {center.name}
      </Link>
      // Links available during SSR
    ))}
  </div>
)
```

### Internal linking

- Use descriptive anchor text that explains the destination.

  ```jsx
  <!-- Correct -->
  <Link to={getCenterProfileSlug(center)}>
    {center.name} treatment programs
  </Link>

  <!-- Incorrect -->
  <Link to={getCenterProfileSlug(center)}>
    Click here
  </Link>
  ```

- Use the `getCenterProfileSlug` function for center profile links.
- Maintain reasonable link depth (3-4 clicks from homepage).

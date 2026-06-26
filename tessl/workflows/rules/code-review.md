## Code Quality Standards

1. **Linking to Center Profiles**: When creating a link to a center profile, use the getCenterProfileSlug function in "/src/domain/center/center.ts"
2. **Ghost API**: Never expose the Ghost API key in the frontend; use the backend to fetch data
3. **File Naming**: Component files and directories use PascalCase, all other files and directories use camelCase

## Testing Requirements

1. **Test Coverage**: New features should include appropriate tests
2. **Test File Naming**: Test files should end with .test.ts
3. **Test Quality**: Tests should be meaningful and cover edge cases

## Security & Performance

1. **Security**: No hardcoded secrets, proper input validation
2. **Performance**: No obvious performance regressions
3. **Dependencies**: New dependencies should be justified and secure

## React/Frontend Specific

1. **Component Structure**: Prefer functional components over class components
2. **CSS Classes**: Use Tailwind with proper classname order
3. **State Management**: Proper use of React hooks and state management

## Search Engine Optimization (SEO)

See the `seo-guidelines` rule in `recovery/seo` for full SEO conventions.

1. **Canonical URLs**: Every public-facing page should have a canonical URL to prevent duplicate content issues. Always use an absolute URL that includes the protocol and domain (e.g., https://example.com/page/). Internal-only pages, like admin or login pages, should not have a canonical URL.
2. **Meta Tags**: All new pages or templates should include dynamic and descriptive meta titles and descriptions. The meta title should be under 60 characters, and the meta description should be between 150-160 characters.
3. **Robots Meta Tag**: The <meta name="robots" content="..."> tag should be carefully considered. It should not be used with a noindex or nofollow value unless there is an explicit reason (e.g., a login page, search results page, or staging environment).
4. **Internal Links**: Don't use the nofollow attribute on internal links, as this prevents search engines from crawling your site effectively.
5. **External Links**: When linking to an external site with target="\_blank", include rel="noopener noreferrer nofollow" for security and to avoid passing link equity. Use rel="sponsored" for paid or advertising links.
6. **Image Alt Text**: All images should have a descriptive alt attribute that accurately describes the image's content. This is crucial for accessibility and image search ranking.
7. **Heading Structure**: Use a logical heading hierarchy to structure content. Each page should have one and only one <h1> tag, followed by <h2>, <h3>, and so on. Never skip a heading level.
8. **Schema Markup**: New content types (e.g., articles, products, events) should include appropriate JSON-LD Schema markup to provide context to search engines. For example, use MedicalOrganization for treatment centers, Article for blog posts, or FAQPage for FAQ sections. Properties like url and image should use fully qualified URLs (absolute URLs) to be most effective.
9. **Server-Side Rendering (SSR)**: Ensure that all SEO-critical content, especially links, is available at render time, not fetched on the client-side after the page loads. This means avoiding data fetching within useEffect hooks. Instead, use Server Components for data fetching that happens on the server, making the content visible to search engine crawlers.
10. **Button vs. Anchor Semantics**: Use the `SeoLink` component for navigation, as search engines can follow these links. Use <button> tags for actions, such as submitting a form or opening a modal. Search engines cannot follow buttons. For links with dynamic content, use a link if the total number of items is above a certain threshold (e.g., 20 insurance centers, 10 locations). If below this threshold, a <span> or a button is acceptable.


### Keyboard navigation & focus

- Ensure all interactive elements use semantic HTML (`<button>`, `<a href>`, `<input>`), not `<div>` or `<span>`.

  ```html
  <!-- Correct -->
  <button onclick="handleClick()">Click me</button>

  <!-- Incorrect -->
  <div onclick="handleClick()">Click me</div>
  <!-- Missing role="button" and tabindex="0" -->
  ```

- Verify tabindex is only used when necessary and not set to a positive number (tabindex="1" is an anti-pattern).
  ```html
  <!-- Incorrect -->
  <button tabindex="5">Bad Example</button>
  <!-- Avoid positive tabindex -->
  ```
- Ensure elements that should not receive focus do not have tabindex="0".
- Check that focus indicators are not removed via `outline: none;` without an alternative.

  ```css
  /* Incorrect */
  button {
    outline: none;
  }

  /* Correct */
  button:focus {
    outline: 2px solid blue;
  }
  ```

### Semantic HTML & ARIA

- Ensure `<button>` is used instead of `<div>` with onClick.

  ```html
  <!-- Correct -->
  <button>Submit</button>

  <!-- Incorrect -->
  <div onclick="handleClick()">Submit</div>
  ```

- Ensure every image has an alt attribute (or `alt=""` if decorative).

  ```html
  <!-- Correct -->
  <img
    src="chart.png"
    alt="Sales growth chart from 2020 to 2023"
  />

  <!-- Incorrect -->
  <img src="chart.png" />
  ```

- Ensure `<h1>`–`<h6>` headings are used in a logical order and not skipped.
  ```html
  <!-- Incorrect: Skipping levels -->
  <h1>Main Heading</h1>
  <h3>Subheading</h3>
  <!-- Should be <h2> -->
  ```
- Verify elements with interactivity (e.g., `<div>` or `<span>` with onClick) have appropriate ARIA roles or are replaced with semantic elements.
- Check that `aria-hidden="true"` is not used on interactive elements.
  ```html
  <!-- Incorrect -->
  <button aria-hidden="true">Submit</button>
  <!-- Will be ignored by screen readers -->
  ```

### Color & contrast

- Verify interactive elements have distinct hover and focus styles beyond just color.
- Ensure that color is not the sole indicator of meaning—check for text labels or icon alternatives.

  ```html
  <!-- Incorrect -->
  <p style="color: red;">Error</p>

  <!-- Correct -->
  <p><strong>Error:</strong> Invalid input</p>
  ```

### Forms & inputs

- Check that every `<input>` has a corresponding `<label>` with a `for` attribute or is wrapped in `<label>`.

  ```html
  <!-- Correct -->
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
  />

  <!-- Incorrect -->
  <input
    type="email"
    placeholder="Email"
  />
  ```

- Ensure required fields have `aria-required="true"` or the `required` attribute.
- Verify error messages use `aria-live="assertive"` or `aria-describedby`.
  ```html
  <span
    id="error-message"
    aria-live="assertive"
    >Invalid email</span
  >
  <input
    type="email"
    aria-describedby="error-message"
  />
  ```
- Ensure placeholder text is not the only label for an input.

### Responsive & scalable text

- Ensure rem or em units are used for font sizes instead of fixed px values.

  ```css
  /* Correct */
  body {
    font-size: 1rem;
  }

  /* Incorrect */
  body {
    font-size: 14px;
  }
  ```

- Check that max-width and flex-wrap prevent content from breaking at different screen sizes.
- Verify that elements do not rely on absolute positioning (position: absolute) in a way that breaks layouts when zoomed.

### Motion & animations

- Ensure animations can be disabled using `@media (prefers-reduced-motion: reduce)`.
  ```css
  @media (prefers-reduced-motion: reduce) {
    .animated {
      animation: none;
    }
  }
  ```
- Check that animations do not flash more than three times per second.
- Ensure auto-playing content (videos, carousels) provides a pause/stop button.
  ```html
  <button onclick="pauseVideo()">Pause</button>
  ```

### Screen reader & assistive tech support

- Ensure live content updates use `aria-live="polite"` or `aria-live="assertive"`.
  ```html
  <div
    id="status-message"
    aria-live="polite"
  >
    Loading...
  </div>
  ```
- Check that all icon-only buttons have an accessible label (`aria-label`, `aria-labelledby`, or hidden text).

  ```html
  <!-- Incorrect -->
  <button><img src="icon.png" /></button>

  <!-- Correct -->
  <button aria-label="Search">
    <img
      src="search-icon.png"
      alt=""
    />
  </button>
  ```

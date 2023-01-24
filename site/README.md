# Spectrum CSS Site

The site is built using [11ty](https://11ty.dev).

## Structure

```bash
site/
├── getting-started.md - instructions on getting started
├── index.md - main homepage
├── includes
│   ├── partials
│   │   ├── logo.njk
│   │   ├── meta-info.njk
│   │   ├── sidenav.njk - the navigation (within the sidebar)
│   └── ...various nunjucks templates for rendering
├── resources
│   ├── css
│   │   ├── docs.css - CSS related specifically to markup examples and component documentation
│   │   └── site.css - CSS common to the entire site
│   ├── img
│   └── js
│       ├── SpectrumSwitcher.js - A class that supports switching colorstops
│       ├── enhancement.js - Enhancements that make examples interactive
│       ├── site.js - The actual site navigation code
│       └── typekit.js - Typekit that knows how to choose large/small kits based on the language attribute
└── templates
    ├── individualComponent.pug - template to build individual component packages
    └── siteComponent.pug - template to build docs for components in bundles
```

## Architecture

The site build process generates separate `.html` files for each of the `*.md` files in the `site/` folder, as well as `.html` pages for each of the component examples within each package (`metadata.yml` and `metadata/*.yml`). The navigation on the left is generated from the list of examples + the hardcoded pages in the menu, and is injected at build time. All of the generated `.html` files are standalone documents with the same navigation and common dependencies, with component example pages adding only the additional dependencies that are required to render its examples.

When clicking an item in the nav or using the browser history, instead of simply navigating to the new page, the page is requested with `XMLHTTPRequest`, parsed, and the content is extracted and injected. Additionally, the dependencies included on the page (any `link` tag with the `data-dependency="$NAME"`) are diffed with the existing dependencies on the page, and the new dependencies are asynchronously loaded before the page content so as to prevent FOUC (flash of unstyled content). Finally, the corresponding item in the side nav is selected.

Because the dependencies included in the component example pages are sorted in topological order with [`dependency-solver`](https://www.npmjs.com/package/dependency-solver), it is not possible for dependencies to be loaded out of order, even if navigating between pages in a different order -- only the new dependencies will be added to the end of the list of dependencies, so precedence will be preserved.

## Viewing the site

1. Run `yarn dev` at the top level of the project and the site will build and open up in your browser.

## Editing content

1. Run `yarn dev` at the top level of the project.
2. Edit the `*.md` files in this folder as well as `_includes/*.njk` and the site will live reload with your changes.

## Adding a new page

1. Run `yarn dev` at the top level of the project.
2. Create the template file for the page in this folder by copying an existing page:

  ```shell
  cp getting-started.md new-page.md
  ```

3. Your new page will appear in the navigation. You can continue to edit it and it will live reload.

## Adding a one-off example page

Follow the instructions for adding a new page, but do not add it to the navigation. You can link to it from another document using markdown:

```markdown
See the [internationalized typography example page](typography-i18n.html) for Japanese, Han, and Arabic examples.
```

## Adding and editing resources

You can add and edit site resources to the `resources/` folder. These are copied directly into the root of the site and can be included as necessary. Editing existing resources while `yarn dev` is running will inject the new resources.

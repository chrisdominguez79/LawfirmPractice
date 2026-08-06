# Castlerod Law Group PLLC

Website for Castlerod Law Group PLLC, a criminal defense firm in Houston, Texas.
Plain HTML, CSS and JavaScript with no build step, published with GitHub Pages.

Live site: https://chrisdominguez79.github.io/LawfirmPractice/

## Layout

```
index.html                          English homepage
our-team.html                       attorney profiles
faq.html                            frequently asked questions
contactUs.html                      contact form (posts to Formspree)

dwi-defense.html                    the eight practice area pages
assault-family-violence.html
drug-charges.html
theft-charges.html
sex-offense-allegations.html
probation-violations.html
occupational-drivers-license.html
expunctions-nondisclosures.html

es/                                 Spanish versions of all of the above

lawfirm.css                         site stylesheet, shared by both languages
lawfirm.js                          menu, accordion and button behaviour
contactUs.css                       styles for the contact form page only
site.webmanifest                    Android home screen icon and name
es/site.webmanifest                 the same, pointing at the Spanish homepage
```

The Spanish pages under `es/` load the stylesheet, script, logo, video and
photographs from the repository root using `../`, so the browser caches one
copy of each for the whole site rather than one copy per language.

## Working on the site

There is nothing to install and nothing to build. Open a page directly in a
browser, or serve the folder to test it the way a phone would see it:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000/index.html

## Icons

| File                    | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| `Castlerod.png`         | Logo used in the header and footer                     |
| `favicon-16.png`        | Browser tab                                            |
| `favicon-32.png`        | Browser tab                                            |
| `apple-touch-icon.png`  | iPhone and iPad home screen (iOS ignores the manifest) |
| `icon-192.png`          | Android home screen, listed in the manifest            |
| `icon-512.png`          | Android home screen, listed in the manifest            |
| `icon-512-maskable.png` | Android, when the launcher crops icons to a shape      |

All of them are generated from `Castlerod.png`. If the logo ever changes,
regenerate them at the same sizes so the home screen icon stays in step.

## Deployment

Pushing to `main` publishes the site through the GitHub Actions workflow in
`.github/workflows/`.

## Third-party assets

See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

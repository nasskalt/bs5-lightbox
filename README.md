# Lightbox for Bootstrap 5 🌠

A pure JavaScript Bootstrap 5 lightbox that supports images, video, galleries, YouTube, Vimeo, and Instagram—built
around Bootstrap's Modal and Carousel plugins.

See the official documentation: https://trvswgnr.github.io/bs5-lightbox/

Many parts do not work now. Updated Docs down below at [How to use it](#How-to-use-it).

Please use my [Issues Tab](https://github.com/nasskalt/bs5-lightbox/issues). I will take responsibility if
there are any issues since I rewrote and changed many bits.

Feel free to email me at [benjamin@nasskalt.com](mailto:benjamin@nasskalt.com).

---

### Contents:

1. [Installation](#Installation)
2. [How to use it](#How-to-use-it)
    1. [Importing](#Importing)
    2. [New Bits](#New-Bits)
        1. [Sizing](#sizing)
3. [Contributing](#Contributing)
4. [Copyright and license](#Copyright-and-license)

---

## Installation

```html

<script src="dist/index.bundle.min.js"></script>
```

See the [release tab](https://github.com/nasskalt/bs5-lightbox/releases)
for [download](https://github.com/nasskalt/bs5-lightbox/releases/download/V1.0/index.bundle.min.js)

Lightbox for Bootstrap 5 will automatically initialize on import.

Currently, I do __not__ offer a CDN for this project. Can be discussed for the future.

---

## How to use it

### Importing

By default, it will target elements with the `data-toggle="lightbox"` attribute.
If you want to target a different element, import the `Lightbox` class and instantiate it:

```js
for (const el of document.querySelectorAll('.my-lightbox-toggle')) {
    el.addEventListener('click', Lightbox.initialize)
}
```

### New Bits

#### Sizing

You can now size it to yourself with this css class.

Without it defaults to the default bootstrap modal size.

```css
.modal-override-size {
    max-width: 90vw;
}
```

## Contributing

Special thanks to the original author [trvswgnr](https://github.com/trvswgnr/bs5-lightbox)!!!

Modify the src/index.js file, run `npm run build` and create a pull request.

You can help him make this project even better and keep it up to date by making a small contribution! See
his [Repo](https://github.com/trvswgnr/bs5-lightbox)

## Copyright and license

Code released
under [the MIT license by the original Author](https://github.com/trvswgnr/bs5-lightbox/blob/main/LICENSE).

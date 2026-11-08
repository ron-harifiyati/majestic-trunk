# Photography sources and publication status

Updated 30 October 2026. The authoritative per-image record is
[`src/data/media.json`](../src/data/media.json). It includes the exact downloaded
URL, source page, credit, licence or permission status, transformations and sizes.

The current preview uses official venue photographs, five compressed legacy
preview assets and the owner-supplied homepage photograph. Downloads were checked visually; logo candidates were
replaced with property photographs. The site does not hotlink these images.
Responsive JPEG variants are served locally with dimensions and `srcset`.

## Previously used destination photography (excluded from the current build)

- **VictoriaFalls2018l.jpg**, Doc James, [source](https://commons.wikimedia.org/wiki/File:VictoriaFalls2018l.jpg),
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Centre-cropped,
  resized and JPEG-compressed for the split hero and Falls guide. Adapted image
  files retain CC BY-SA 4.0.
- **Sunset over Zambezi upstream Vic-Falls 2.jpg**, Peter in s,
  [source](https://commons.wikimedia.org/wiki/File:Sunset_over_Zambezi_upstream_Vic-Falls_2.jpg),
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Resized and
  JPEG-compressed. Layout may crop the photograph.

The public credits UI and page were removed at the owner’s request. Both Creative
Commons photographs above are excluded from the current build. The owner-supplied
Falls image replaces the destination photograph; the sunset-cruise card is text-led.
The image manifest remains an internal provenance record.

## Official venue photography

Images were taken from the specific property, restaurant or operator websites,
including their own image CDNs. These are accurate local design-preview assets,
not a claim that the business has permission to publish them. Written permission,
a media/agency licence, or replacement photography is required before public
launch. Attribution alone does not grant publication rights.

The manifest distinguishes these from the openly licensed photographs. It also
keeps official venue photographs separate from older project images whose origin
is still unverified. Confirm any photographer credit with each venue when seeking
permission. Do not reuse a venue photograph to illustrate a different property.

## Legacy assets

Five existing activity photos are retained as preview assets with source and
permission uncertainty recorded. The build does **not** copy the old watermarked
`elephant.jpg`, stock-preview `zambezi-aerial.jpg`, wrong-location
`elephant-encounter.jpg`, or any other unreferenced image to deployment output.
The logo remains a separate existing brand asset.

Follow-up: [photography issue](https://github.com/ron-harifiyati/majestic-trunk/issues/1).

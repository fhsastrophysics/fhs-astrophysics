Söhne font files go here.

styles.css @font-face rules expect these exact filenames (WOFF2):

  soehne-buch.woff2            → Söhne Buch (regular / 400, body text)
  soehne-halbfett.woff2        → Söhne Halbfett (semibold / 600, bold spans)
  soehne-mono-halbfett.woff2   → Söhne Mono Halbfett (bold / 700, all-caps labels)

Söhne is a licensed typeface from Klim Type Foundry (https://klim.co.nz/retail-fonts/soehne/).
Buy the webfont licence, export WOFF2, rename to the names above, and drop them in this folder.

Until these files are present the site falls back cleanly to:
  - "Helvetica Neue" / Arial for body + bold
  - a system monospace for labels
No code change is needed — just add the files.

Headlines use Instrument Serif, which loads from Google Fonts (no local file required).

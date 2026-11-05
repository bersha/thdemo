#!/bin/sh
# assemble.sh — builds stardust/prototypes/index-proposed.html from the work fragments
W=stardust/replica/work; O=stardust/prototypes/index-proposed.html
abs() { sed -E 's#href="/#href="https://www.trygghansa.se/#g'; }
{
cat <<'H'
<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Trygg-Hansa - Trygghet för livet</title>
<meta name="description" content="Våra försäkringar ger trygghet åt privatpersoner och företag. Vi har sett, hört och löst det mesta. Teckna nu och få upp till 20 % i samlingsrabatt.">
<link rel="preload" href="assets/fonts/Lato-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="canon.css">
<link rel="stylesheet" href="landing.css">
</head>
<body>
<a class="sr-skip-to-content th-button-primary-brand th-button-small" href="#content">Till innehållet</a>
H
sed -e 's#<img class="th-icon th-header__logo-icon th-header__logo-icon--mobile"#<img class="th-icon th-header__logo-icon th-header__logo-icon--mobile" src="assets/img/trygg-hansa-logo-rgb-black.svg"#' \
    -e 's#<img class="th-icon th-header__logo-icon th-header__logo-icon--desktop"#<img class="th-icon th-header__logo-icon th-header__logo-icon--desktop" src="assets/img/trygg-hansa_logo_rgb_neg.svg"#' \
    -e 's#<button class="th-header__nav-button " type="button">#<button class="th-header__nav-button" type="button" aria-expanded="false">#' \
    -e 's#<button class="th-collapse__header th-header__subnavigation-icon-container"#<button class="th-collapse__header th-header__subnavigation-icon-container" type="button" aria-expanded="false"#' \
    $W/header.frag.html | abs
cat $W/main.frag.html
sed -e 's#<img class="th-footer__logo-icon"#<img class="th-footer__logo-icon" src="assets/img/trygg-hansa_logo_rgb_neg.svg"#' \
    -e 's#<button class="th-collapse__header">#<button class="th-collapse__header" type="button" aria-expanded="false">#' \
    $W/footer.frag.html | abs
cat $W/behavior.js.html
printf '</body>\n</html>\n'
} > $O
python3 stardust/replica/work/titles.py $O
echo "wrote $O ($(wc -c < $O) bytes)"

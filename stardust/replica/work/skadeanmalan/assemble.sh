#!/bin/sh
# assemble.sh — builds stardust/prototypes/skadeanmalan-proposed.html from this dir's fragments
# (header/footer/behaviour copied from the landing archetype; header marks "Anmäl skada" active as live does)
W=stardust/replica/work/skadeanmalan; O=stardust/prototypes/skadeanmalan-proposed.html
abs() { sed -E 's#href="/#href="https://www.trygghansa.se/#g'; }
{
cat <<'H'
<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Skadeanmälan - Anmäl förlust, stöld eller skada</title>
<meta name="description" content="Här anmäler du enkelt om någonting har hänt. Gör din skadeanmälan direkt på webben när det passar dig.">
<link rel="preload" href="assets/fonts/Lato-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="canon.css">
<link rel="stylesheet" href="static.css">
</head>
<body>
<a class="sr-skip-to-content th-button-primary-brand th-button-small" href="#content">Till innehållet</a>
H
sed -e 's#<img class="th-icon th-header__logo-icon th-header__logo-icon--mobile"#<img class="th-icon th-header__logo-icon th-header__logo-icon--mobile" src="assets/img/trygg-hansa-logo-rgb-black.svg"#' \
    -e 's#<img class="th-icon th-header__logo-icon th-header__logo-icon--desktop"#<img class="th-icon th-header__logo-icon th-header__logo-icon--desktop" src="assets/img/trygg-hansa_logo_rgb_neg.svg"#' \
    -e 's#<button class="th-header__nav-button " type="button">#<button class="th-header__nav-button" type="button" aria-expanded="false">#' \
    -e 's#<button class="th-collapse__header th-header__subnavigation-icon-container"#<button class="th-collapse__header th-header__subnavigation-icon-container" type="button" aria-expanded="false"#' \
    $W/header.frag.html | abs
abs < $W/main.frag.html
sed -e 's#<img class="th-footer__logo-icon"#<img class="th-footer__logo-icon" src="assets/img/trygg-hansa_logo_rgb_neg.svg"#' \
    -e 's#<button class="th-collapse__header">#<button class="th-collapse__header" type="button" aria-expanded="false">#' \
    $W/footer.frag.html | abs
cat $W/behavior.js.html
printf '</body>\n</html>\n'
} > $O
python3 $W/titles.py $O
echo "wrote $O ($(wc -c < $O) bytes)"

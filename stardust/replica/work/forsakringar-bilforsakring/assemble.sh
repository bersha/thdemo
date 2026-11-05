#!/bin/sh
# assemble.sh — builds stardust/prototypes/forsakringar-bilforsakring-proposed.html (program archetype)
# from this dir's fragments: header/footer (copied from the home archetype; header carries this page's
# active nav state), hero.frag.html (hand-authored hero + quick-quote), content.frag.html (clean-main.py
# output: campaign banner, breadcrumbs, CMS sections), behavior.js.html (home behaviours + modals + qq).
W=stardust/replica/work/forsakringar-bilforsakring; O=stardust/prototypes/forsakringar-bilforsakring-proposed.html
abs() { sed -E 's#href="/#href="https://www.trygghansa.se/#g'; }
{
cat <<'H'
<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bilförsäkring - 4,8 av 5 i betyg - Se pris på 15 sekunder</title>
<meta name="description" content="Topprankad bilförsäkring med 4,8 av 5 i betyg enligt Konsumenternas. Hitta rätt försäkring för dig och din bil – se pris direkt och teckna här.">
<link rel="preload" href="assets/fonts/Lato-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="canon.css">
<link rel="stylesheet" href="program.css">
</head>
<body>
<a class="sr-skip-to-content th-button-primary-brand th-button-small" href="#content">Till innehållet</a>
H
sed -e 's#<img class="th-icon th-header__logo-icon th-header__logo-icon--mobile"#<img class="th-icon th-header__logo-icon th-header__logo-icon--mobile" src="assets/img/trygg-hansa-logo-rgb-black.svg"#' \
    -e 's#<img class="th-icon th-header__logo-icon th-header__logo-icon--desktop"#<img class="th-icon th-header__logo-icon th-header__logo-icon--desktop" src="assets/img/trygg-hansa_logo_rgb_neg.svg"#' \
    -e 's#<button class="th-collapse__header th-header__subnavigation-icon-container"#<button class="th-collapse__header th-header__subnavigation-icon-container" type="button" aria-expanded="false"#' \
    $W/header.frag.html | abs
cat $W/hero.frag.html $W/content.frag.html
printf '</main>\n'
sed -e 's#<img class="th-footer__logo-icon"#<img class="th-footer__logo-icon" src="assets/img/trygg-hansa_logo_rgb_neg.svg"#' \
    -e 's#<button class="th-collapse__header">#<button class="th-collapse__header" type="button" aria-expanded="false">#' \
    $W/footer.frag.html | abs
cat $W/behavior.js.html
printf '</body>\n</html>\n'
} > $O
python3 stardust/replica/work/titles.py $O
echo "wrote $O ($(wc -c < $O) bytes)"

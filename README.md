# PCC PMD
<img src="https://img.shields.io/badge/version-beta%20-informational?style=plastic"> <br>
### PCC Multijoueur pour Paris Metro Driver <br>
<a href="https://github.com/lapatatedouce59/pcc_pmd/commits/master"><img src="https://img.shields.io/github/last-commit/lapatatedouce59/pcc_pmd?style=plastic"></a> <a href="https://github.com/lapatatedouce59/pcc_pmd/issues"><img src="https://img.shields.io/github/issues-raw/lapatatedouce59/pcc_pmd?style=plastic"></a> <a href="https://github.com/lapatatedouce59/pcc_pmd/pulls"><img src="https://img.shields.io/github/issues-pr-raw/lapatatedouce59/pcc_pmd?style=plastic"></a> <br>

Développement du Poste de Contrôles Centralisés de Paris Metro Driver, 2ème génération. <br>
Pour des raisons de confidentialité, uniquement certaines ressources sont dévoilées.<br>
Une [Page de test publique](https://pmdapp.fr/tools/pccBeta) est disponible pour les utilisateurs éligibles.

# Instalation et utilisation

Installez [NodeJS](https://nodejs.org/en) et lancez le serveur (`ws.js`) en mode debug avec la commande suivante:
```js
npm run test
```
Pour accéder aux DevTools du serveur, ouvrez un DevTools Chrome de base, et cherchez le logo NodeJS en haut à gauche, puis cliquez dessus. Patientez quelques seconde que la connexion puisse se faire.

Lancez l' `index.html` avec un **serveur web** basique, soit avec *[WAMP](https://www.wampserver.com)* (ou *XAMP*...) ou avec l'extension *Live Server* dans VSCode. <br>

Pour vous autoriser l'accès au PCC (localement), rendez vous dans `ws.js`, cherchez l'array `whitelist`, puis ajoutez-y votre identifiant Discord ([Comment le trouver?](https://support.discord.com/hc/fr/articles/206346498-Où-trouver-l-ID-de-mon-compte-utilisateur-serveur-message-)) Si la connexion ne fonctionne pas tout suite, naviguez sur `verify.html` dans votre navigateur et suivez les étapes. <br>

Le fichier de contrôle du serveur (fichier commun) est `com.js` ([Documentation](https://github.com/lapatatedouce59/pcc_pmd/wiki)), c'est le fichier principal à utiliser pour communiquer. <br>

En cas de bug, considérez la création d'une [issue](https://github.com/lapatatedouce59/pcc_pmd/issues). <br>

Pour stopper le serveur, pressez `CTRL + C` dans la console.

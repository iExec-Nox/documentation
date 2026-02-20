# TODO - Relecture doc protocol (Feb 2026)

> Source: relecture de https://documentation-yi1w.vercel.app/protocol/protocol-vision

---

## Protocol Vision

- [x] **"every single point of trust"** : trop fort comme promesse ? Pas sûr qu'on y arrive sous 1 an
- [x] **"Multiple chain"** apporte plus d'ambition que le scaling horizontal, revoir la hiérarchie des points
- [ ] Ajouter une **intro des composants** avant de les mentionner (ils sont nommés sans avoir été présentés)
- [ ] Section **"Privacy by convergence"** : les composants sont cités sans intro, ça fait bizarre
- [ ] Section **"No single Key"** : faire relire par Fred, ainsi que la doc du KMS
- [ ] **Shamir / Lagrange** : trop bas niveau pour la page vision. Déplacer ce niveau de détail sur la page KMS, garder ici uniquement le graph et l'intro
- [ ] **"genuine hardware enclave"** : le terme "enclave" n'est pas forcément clair pour tout le monde
- [ ] **Intel TDX enclave** : ajouter un lien externe (doc Intel ou page PoCo qui explique les TEE)
- [x] Section **"each component must:"** : problème de syntaxe, la phrase ne devrait pas se terminer par "must"
- [ ] **gRPC** : pas sûr qu'il faille le mentionner sur la page vision du protocole. dStack va peut-être changer le runtime "auth"
- [ ] Section **"Proof of Cloud"** : faire relire par Aghiles
- [ ] Section **"Open and Permissionless"** (stake RLC + earn fee) : on est sûr de ce business model à ce stade ?
- [ ] Recentrer la vision sur la **V1** plutôt que sur du très long terme
- [ ] Section **"Scale Out, Not Up"** : premier endroit où on parle de l'état actuel VS futur, à rendre plus explicite
- [ ] Section **"Private Tokens Meet Public DeFi"** : c'est du **produit** (confidential token, smart contracts de wrap/unwrap), pas du protocole. Les smart contracts sont "du sucre" ajouté sur le protocole, pas Nox en soi
- [ ] Ajouter une mention de la **librairie Solidity** (absente de la vision protocole)
- [ ] Mieux mettre en avant la **possibilité de construire autre chose** que du confidential token
- [ ] Envisager d'ajouter des **status sur les composants** (Done / WIP / Roadmap)

---

## Global Architecture Overview

- [x] **Ordre dans le menu** : mettre cette page en premier, avec un lien rapide vers la page Vision (ou en faire l'intro de la Vision)
- [ ] **Zoom sur les graphes** : permettre un zoom/fullscreen au clic sur les diagrammes
- [ ] **Premier schéma** : trop "joli", pris pour une image décorative. Attention au "1" qui traîne et au seul texte horizontal
- [ ] **Préciser** le passage à la "current architecture" (le lecteur ne sait pas qu'on change de contexte)
- [ ] Section **"A confidential computation in Nox"** : proposer un schéma simplifié en premier, avec un lien vers le schéma détaillé

---

## KMS

- [ ] Faire relire la page par Fred (mentionné dans la section Vision)

---

## Runner

- [x] **NATS** : ajouter un lien vers le projet NATS
- [x] Préciser/rappeler que la **queue NATS est remplie par l'Ingestor** avec tous les events on-chain (texte et/ou graph)

---

## Computation Primitives

- [ ] Re-préciser que chaque primitive est **exposée par une librairie Solidity** à disposition des builders, mais traitée **off-chain en asynchrone** par un Runner
- [ ] Ajouter un **warning** : le builder de smart contract est responsable de la bonne utilisation des primitives et de la gestion des règles métier / erreurs
- [ ] **Graphe non lisible** : améliorer la lisibilité du diagramme
- [ ] Clarifier : retourne-t-on **0 si pas de résultat** ? (résultat à `false` ?)
- [ ] Clarifier : `result = false` seulement sur **overflow/underflow**, ou aussi sur **type de data invalide** ?
- [ ] Page trop longue : **mettre les advanced functions moins en avant** pour ne pas les perdre à mesure qu'on ajoute des méthodes
- [ ] Ajouter un **warning sur les types Solidity supportés** côté off-chain

---

## Ingestor

- [ ] **Ordre dans le menu** : envisager de mettre l'Ingestor avant les Runners
- [ ] Incohérence : cette page parle de **NATS JetStream**, la page Runner parle de **NATS queue** — harmoniser le vocabulaire
- [ ] **Message Format** : re-préciser que c'est le message émis on-chain et capturé off-chain. Bizarre d'avoir le format du message sans avoir le format du `TransactionEvent`
- [ ] **Optimistic processing** : préciser ce qu'il se passe si on a traité un event qui était un fork
  - Le client pourrait retrouver un résultat et croire que l'opération a abouti, alors que la transaction n'a jamais été resoumise ou traitée avec un timestamp différent
- [ ] Clarifier : faut-il **n'update le cipher d'un handle que lorsque le block est confirmé** ?
  - Risque que le Runner définisse 2 fois la même valeur pour le ciphertext. L'API Gateway ou Runner doit gérer ce cas (si et seulement si même valeur)

---

## Nox Smart Contracts

- [x] **Ordre dans le menu** : mettre cette page plus tôt
- [x] Préciser **"and emits events"** pour le calcul off-chain
- [ ] **How it works** : l'emit event (au lieu de boucler sur lui-même) peut aller directement sur l'Ingestor. Préciser ici que l'Ingestor est off-chain
- [ ] Ajouter une section expliquant que pour faire **handle A + 2**, si on connaît le handle A, il faut d'abord transformer `2` (en clair) en handle B
- [ ] Expliquer pourquoi le **NoxCompute ne donne qu'un ACL transient** (et pas permanent) au handle
- [ ] Préciser qu'il faut que le dev de smart contract **file un ACL permanent** pour pouvoir récupérer le handle plus tard
- [ ] Rappeler qu'on travaille sur des **pointeurs calculés en asynchrone**

---

## TEEPrimitives Library

- [x] Remettre un **lien vers la page Computation Primitives** pour voir les calculs attendus

---

## Divers

- [ ] Préciser quelque part que les **primitives sont asynchrones** mais que l'**ordre des transactions et les vérifications d'erreur sont respectés**
- [ ] Prévoir une **page d'aide aux développeurs** : points d'attention, "how to write smart contracts", do & don'ts
- [x] Rassurer quelque part sur la **gestion d'une rotation de clé privée** du protocole

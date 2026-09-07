/* Haute Couture Live — graphe social territorial Nîmes v1.
   Réseau invisible entre personnages : introductions, collaborations, tensions légères et mémoire d'origine des rencontres.
*/
(function(){
'use strict';
if(window.HCNimesSocialGraphV1)return;
const EDGES=[
 ['nimes-yannis-roux','eloise-martin','acquaintance','Yannis connaît Éloïse comme cliente régulière du quartier.'],
 ['nimes-yannis-roux','nimes-noe-carriere','regular','Noé passe régulièrement au Café des Croquis.'],
 ['nimes-yannis-roux','nimes-maya-fabre','professional','Yannis connaît Maya par plusieurs clientes locales.'],
 ['nimes-yannis-roux','nimes-salma-cherif','regular','Salma travaille parfois au café entre deux rendez-vous.'],
 ['nimes-yannis-roux','nimes-aurelie-perrin','acquaintance','Aurélie utilise le café comme lieu de rendez-vous.'],
 ['nimes-yannis-roux','nimes-hugo-vernet','acquaintance','Hugo connaît Yannis depuis plusieurs années.'],
 ['nimes-brocante-anais-ravel','nimes-soraya-meyer','regular','Soraya chine régulièrement des détails et pièces anciennes chez Anaïs.'],
 ['nimes-brocante-anais-ravel','nimes-tom-lacoste','acquaintance','Tom et Anaïs échangent parfois des pistes sur des archives et provenances.'],
 ['nimes-brocante-anais-ravel','nimes-julie-mas','professional','Julie a déjà demandé à Anaïs de documenter une pièce ancienne.'],
 ['nimes-claire-vidal','nimes-ines-barrot','professional','Claire et Inès se connaissent par les métiers textiles locaux.'],
 ['nimes-claire-vidal','nimes-adel-benali','mutual-respect','Claire respecte la précision technique d’Adel.'],
 ['nimes-claire-vidal','nimes-soraya-meyer','mentor-distance','Soraya connaît le travail de Claire mais n’est pas encore proche d’elle.'],
 ['nimes-clara-sorel','nimes-adel-benali','professional','Adel se fournit régulièrement à la mercerie.'],
 ['nimes-clara-sorel','nimes-ines-barrot','professional','Clara connaît Inès par ses essais de teinture et commandes de fournitures.'],
 ['nimes-clara-sorel','nimes-soraya-meyer','regular','Soraya est une cliente créative régulière de la mercerie.'],
 ['nimes-lila-bresson','nimes-noe-carriere','professional','Noé a déjà assisté Lila sur plusieurs shootings.'],
 ['nimes-lila-bresson','nimes-salma-cherif','professional','Salma a déjà publié un portrait du travail de Lila.'],
 ['nimes-lila-bresson','nimes-pauline-rey','professional','Pauline a déjà sollicité Lila pour une série éditoriale.'],
 ['nimes-lila-bresson','nimes-victor-meunier','creative-tension','Ils s’apprécient mais n’ont pas la même manière de photographier la ville.'],
 ['nimes-sacha-maurel','nimes-lea-ortiz','professional','Ils travaillent parfois autour de la médiation archéologique.'],
 ['nimes-sacha-maurel','nimes-manon-vial','professional','Sacha connaît Manon par les chantiers patrimoniaux.'],
 ['nimes-lea-ortiz','nimes-julie-mas','academic','Léa et Julie se connaissent par des rencontres de recherche.'],
 ['nimes-manon-vial','nimes-nassim-garcia','creative-contact','Nassim a déjà demandé conseil à Manon sur la lecture de surfaces anciennes.'],
 ['nimes-gaspard-rouviere','nimes-nassim-garcia','professional','Ils ont déjà travaillé sur un élément d’accessoire de scène.'],
 ['nimes-romeo-blanc','nimes-nora-blanc','professional','Roméo recommande parfois Nora sur les questions d’image de scène.'],
 ['nimes-romeo-blanc','nimes-nassim-garcia','professional','Ils se croisent sur les productions événementielles.'],
 ['nimes-pauline-rey','nimes-julie-mas','professional','Pauline consulte parfois Julie pour contextualiser une exposition.'],
 ['nimes-tom-lacoste','nimes-julie-mas','professional','Tom met de côté des ouvrages et catalogues pour Julie.'],
 ['nimes-aurelie-perrin','eloise-martin','acquaintance','Aurélie connaît Éloïse par un événement privé.'],
 ['nimes-aurelie-perrin','nimes-hugo-vernet','professional','Ils partagent parfois des clientes cérémonie.'],
 ['nimes-hugo-vernet','nimes-maya-fabre','creative-tension','Ils ont des visions assez différentes du conseil en image.'],
 ['nimes-soraya-meyer','nimes-ines-barrot','professional','Soraya connaît le travail couleur d’Inès.']
];
const MAP={};EDGES.forEach(([a,b,type,note])=>{(MAP[a]||(MAP[a]=[])).push({id:b,type,note});(MAP[b]||(MAP[b]=[])).push({id:a,type,note})});
function links(id){return MAP[id]||[]}
function relation(a,b){return links(a).find(x=>x.id===b)||null}
function introducers(targetId,knownIds=[]){const known=new Set(knownIds);return links(targetId).filter(x=>known.has(x.id)&&!['creative-tension'].includes(x.type))}
function canIntroduce(fromId,toId){const r=relation(fromId,toId);return !!r&&!['creative-tension'].includes(r.type)}
window.HCNimesSocialGraphV1={version:1,edges:EDGES,links,relation,introducers,canIntroduce};
})();

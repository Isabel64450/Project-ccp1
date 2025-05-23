const conteneur = document.getElementById("listeEvenements");
const template = document.getElementById("templateEvenement");
const modale = document.getElementById("modale");
const modaleTitre = document.getElementById("modaleTitre");
const modaleDate = document.getElementById("modaleDate");
const modaleLieu = document.getElementById("modaleLieu");
const modaleDescription = document.getElementById("modaleDescription");
const modaleUrl = document.getElementById("modaleUrl");
const boutonFermer = document.getElementById("fermer");
const planningContainer = document.getElementById("planning");

function nettoyerHTML(html) {
  return html.replace(/<[^>]+>/g, "").trim();
}

function afficherErreur(message) {
  const erreurDiv = document.getElementById("messageErreur");
  erreurDiv.textContent = message;
  erreurDiv.style.display = "block";
  setTimeout(() => {
    erreurDiv.style.display = "none";
  }, 3000);
}

function afficherDetailsDansModale(titre, date, lieu, description, url) {
  modaleTitre.textContent = titre;
  modaleDate.textContent = date;
  modaleLieu.textContent = lieu;
  modaleDescription.textContent = nettoyerHTML(description);
  modaleUrl.href = url;
  modaleUrl.textContent = url;
  modale.style.display = "flex";
}

function getPlanning() {
  return JSON.parse(localStorage.getItem("mesEvenements")) || [];
}

function savePlanning(planning) {
  localStorage.setItem("mesEvenements", JSON.stringify(planning));
}

function afficherEvenementDansPlanning(event) {
  const clone = template.content.cloneNode(true);
  clone.querySelector(".titre").textContent = event.titre;
  clone.querySelector(".date").textContent = event.date;
  clone.querySelector(".lieu").textContent = event.lieu;
  clone.querySelector(".description").textContent = "";

  clone.querySelector(".voir").addEventListener("click", () => {
    afficherDetailsDansModale(
      event.titre,
      event.date,
      event.lieu,
      "Aucune description enregistrée.",
      event.url
    );
  });

  const btnRetirer = document.createElement("button");
  btnRetirer.textContent = "Retirer du planning";
  btnRetirer.classList.add("ajouter");

  const cloneContainer = document.createElement("div");
  cloneContainer.appendChild(clone);

  btnRetirer.addEventListener("click", () => {
    planningContainer.removeChild(cloneContainer);
    const nouveauPlanning = getPlanning().filter((e) => e.id !== event.id);
    savePlanning(nouveauPlanning);
  });

  cloneContainer.querySelector(".ajouter").replaceWith(btnRetirer);
  planningContainer.appendChild(cloneContainer);
}

function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";")[0];
  return null;
}

function appliquerTheme(theme) {
  document.body.classList.remove("clair", "obscure");
  document.body.classList.add(theme);
  document.getElementById("theme").value = theme;
}

window.addEventListener("DOMContentLoaded", () => {
  const selectTheme = document.getElementById("theme");
  const themeSauvegarde = getCookie("theme") || "clair";

  appliquerTheme(themeSauvegarde);

  selectTheme.addEventListener("change", () => {
    const nouveauTheme = selectTheme.value;
    appliquerTheme(nouveauTheme);
    setCookie("theme", nouveauTheme, 365);
  });
});

boutonFermer.addEventListener("click", () => {
  modale.style.display = "none";
});

window.addEventListener("DOMContentLoaded", async () => {
  getPlanning().forEach(afficherEvenementDansPlanning);

  try {
    const response = await fetch(
      "https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events"
    );
    const data = await response.json();
    const evenements = data.events;

    evenements.forEach((event) => {
      const titre = event.title;
      const date = event.start_date;
      const description = event.description;
      const lieu = event.venue?.venue || "Lieu non spécifié";
      const url = event.url;

      const clone = template.content.cloneNode(true);
      clone.querySelector(".titre").textContent = titre;
      clone.querySelector(".lieu").textContent = lieu;
      clone.querySelector(".date").textContent = date;

      clone.querySelector(".voir").addEventListener("click", () => {
        afficherDetailsDansModale(titre, date, lieu, description, url);
      });

      clone.querySelector(".ajouter").addEventListener("click", () => {
        const planning = getPlanning();
        if (!planning.find((e) => e.id === event.id)) {
          const newEvent = {
            id: event.id,
            titre: titre,
            date: date,
            lieu: lieu,
            url: url,
          };
          planning.push(newEvent);
          savePlanning(planning);
          afficherEvenementDansPlanning(newEvent);
          afficherErreur("Événement ajouté au planning !");
        } else {
          afficherErreur("Événement déjà présent dans le planning.");
        }
      });

      conteneur.appendChild(clone);
    });
  } catch (error) {
    afficherErreur("Erreur lors de la récupération des données.");
  }
});

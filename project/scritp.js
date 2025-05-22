const conteneur = document.getElementById("listeEvenements");
const template = document.getElementById("templateEvenement");
const modale = document.getElementById("modale");
const modaleTitre = document.getElementById("modaleTitre");
const modaleDate = document.getElementById("modaleDate");
const modaleLieu = document.getElementById("modaleLieu");
const modaleDescription = document.getElementById("modaleDescription");
const modaleUrl = document.getElementById("modaleUrl");
const boutonFermer = document.getElementById("fermer");
function nettoyerHTML(html) {
  return html.replace(/<[^>]+>/g, "").trim();
}
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch(
      "https://demo.theeventscalendar.com/wp-json/tribe/events/v1/events"
    );
    if (!response.ok) throw new Error("Erreur de requête");

    const data = await response.json();
    console.log(data);
    const evenements = data.events;

    evenements.forEach((event) => {
      const titre = event.title;
      console.log(titre);
      const date = event.start_date;
      const description = event.description;
      const lieu = event.venue?.venue || "Lieu non spécifié";
      const url = event.url;
      console.log(url);
      const clone = template.content.cloneNode(true);
      clone.querySelector(".titre").textContent = titre;
      clone.querySelector(".lieu").textContent = lieu;
      clone.querySelector(".date").textContent = date;
      clone.querySelector(".voir").addEventListener("click", () => {
        modaleTitre.textContent = titre;
        modaleDate.textContent = date;
        modaleLieu.textContent = lieu;
        modaleDescription.textContent = nettoyerHTML(description);
        modaleUrl.href = event.url;
        modaleUrl.textContent = event.url;
        modale.style.display = "flex"; // Affiche la modale
      });
      boutonFermer.addEventListener("click", () => {
        modale.style.display = "none";
      });
      clone.querySelector(".ajouter").addEventListener("click", () => {
        alert("Événement ajouté !");
      });

      conteneur.appendChild(clone);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
});

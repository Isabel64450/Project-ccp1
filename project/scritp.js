const conteneur = document.getElementById("listeEvenements");
const template = document.getElementById("templateEvenement");
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
      const clone = template.content.cloneNode(true);

      // Exemples de données fictives
      clone.querySelector(".titre").textContent = titre;
      clone.querySelector(".lieu").textContent = lieu;
      clone.querySelector(".date").textContent = date;
      clone.querySelector(".description").textContent =
        "Une soirée musicale inoubliable avec des artistes internationaux.";

      // Boutons
      clone.querySelector(".voir").addEventListener("click", () => {
        alert("Détail de l'événement : Concert Jazz à Théâtre de la Ville.");
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

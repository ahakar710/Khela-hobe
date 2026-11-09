document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");

  try {
    const ui = await import("./ui.js");

    if (typeof ui.renderApp === "function") {
      ui.renderApp();
    } else if (typeof ui.renderLobby === "function") {
      ui.renderLobby();
    } else if (typeof ui.default === "function") {
      ui.default();
    } else {
      throw new Error("UI entry point not found");
    }
  } catch (error) {
    console.error("Khela Hobe startup error:", error);

    if (app) {
      app.textContent =
        "Khela Hobe is ready for the next setup step.";
    }
  }
});

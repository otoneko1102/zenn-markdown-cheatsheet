if (!window.zennCheatsheetLoaded) {
  window.zennCheatsheetLoaded = true;

  let lastUrl = location.href;

  const applyCheatsheet = () => {
    if (document.getElementById("zenn-cheatsheet-container")) return;

    const pollEditor = setInterval(() => {
      const titleTextarea = document.querySelector(
        'textarea[placeholder="Title"]'
      );
      if (titleTextarea) {
        clearInterval(pollEditor);
        const editorContainer = titleTextarea.closest(
          'div[class*="Container_default"]'
        );
        if (editorContainer) {
          editorContainer.style.setProperty("margin-left", "2rem", "important");
          editorContainer.style.setProperty(
            "margin-right",
            "auto",
            "important"
          );
          editorContainer.style.setProperty(
            "transition",
            "margin 0.3s ease-in-out"
          );
        }
      }
    }, 100);

    fetch("https://zenn.dev/zenn/articles/markdown-guide")
      .then((response) => response.text())
      .then((html) => {
//        const path = window.location.pathname.replace(/[#?].*/g, "");
//        if (
//          path.endsWith("/scraps") ||
//          path.includes("/books") ||
//          (!path.endsWith("/edit") && !path.startsWith("/new/article"))
//        )
//          return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const content = doc.querySelector(".znc");
        const toc = doc.querySelector('div[class*="ArticleToc_toc__"]');

        if (content && toc) {
          const container = document.createElement("div");
          container.id = "zenn-cheatsheet-container";
          Object.assign(container.style, {
            position: "fixed",
            top: "78px",
            right: "20px",
            width: "450px",
            maxHeight: "calc(100vh - 98px)",
            zIndex: "1000",
            backgroundColor: "var(--c-bg-base-inner)",
            border: "1px solid var(--c-neutral-border)",
            borderRadius: "var(--rounded-md)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.3s ease-in-out",
            transform: "translateX(0)",
          });

          const toggleButton = document.createElement("button");
          toggleButton.textContent = "▶";
          Object.assign(toggleButton.style, {
            position: "absolute",
            top: "50%",
            left: "-31px",
            transform: "translateY(-50%)",
            width: "30px",
            height: "60px",
            backgroundColor: "var(--c-bg-base-inner)",
            border: "1px solid var(--c-neutral-border)",
            borderRight: "none",
            borderRadius: "8px 0 0 8px",
            cursor: "pointer",
            zIndex: "1001",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--c-text-body)",
            fontSize: "16px",
            padding: "0",
          });

          let isVisible = true;
          toggleButton.addEventListener("click", () => {
            isVisible = !isVisible;
            if (isVisible) {
              container.style.transform = "translateX(0)";
              toggleButton.textContent = "▶";
            } else {
              container.style.transform = `translateX(calc(100% + 2px))`;
              toggleButton.textContent = "◀";
            }
          });

          container.appendChild(toggleButton);

          const tocWrapper = document.createElement("div");
          Object.assign(tocWrapper.style, {
            maxHeight: "35vh",
            overflowY: "auto",
            borderBottom: "1px solid var(--c-neutral-border)",
            flexShrink: "0",
          });
          const tocDetails = document.createElement("details");
          tocDetails.open = true;
          const tocSummary = document.createElement("summary");
          tocSummary.textContent = "目次";
          Object.assign(tocSummary.style, {
            position: "sticky",
            top: "0",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: "var(--c-bg-base-inner)",
            padding: "12px 16px",
            borderBottom: "1px solid var(--c-neutral-border-lighter)",
            zIndex: "1",
          });
          toc.style.padding = "16px";
          tocDetails.appendChild(tocSummary);
          tocDetails.appendChild(toc);
          tocWrapper.appendChild(tocDetails);

          const cheatsheetWrapper = document.createElement("div");
          Object.assign(cheatsheetWrapper.style, {
            overflowY: "auto",
            flexGrow: "1",
          });
          const cheatsheetDetails = document.createElement("details");
          cheatsheetDetails.open = true;
          const cheatsheetSummary = document.createElement("summary");
          cheatsheetSummary.textContent = "Markdown記法チートシート";
          Object.assign(cheatsheetSummary.style, {
            position: "sticky",
            top: "0",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: "var(--c-bg-base-inner)",
            padding: "12px 16px",
            borderBottom: "1px solid var(--c-neutral-border-lighter)",
            zIndex: "1",
          });
          content.style.padding = "16px";
          cheatsheetDetails.appendChild(cheatsheetSummary);
          cheatsheetDetails.appendChild(content);
          cheatsheetWrapper.appendChild(cheatsheetDetails);

          container.appendChild(tocWrapper);
          container.appendChild(cheatsheetWrapper);
          document.body.appendChild(container);
        }
      })
      .catch((error) =>
        console.error("Error fetching Zenn markdown guide:", error)
      );
  };

  const removeCheatsheet = () => {
    const cheatsheet = document.getElementById("zenn-cheatsheet-container");
    if (cheatsheet) cheatsheet.remove();
    const editorContainer = document.querySelector(
      'div[class*="Container_default"]'
    );
    if (editorContainer) {
      editorContainer.style.removeProperty("margin-left");
      editorContainer.style.removeProperty("margin-right");
      editorContainer.style.removeProperty("transition");
    }
  };

  const runCheck = () => {
    const path = window.location.pathname.replace(/[#?].*/g, "");
    if (
      !path.includes("/books") &&
      ((!path.endsWith("/scraps") && path.includes("/scraps")) ||
        path.endsWith("/edit") ||
        path.startsWith("/new/article"))
    ) {
      applyCheatsheet();
    } else {
      removeCheatsheet();
    }
  };

  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      runCheck();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  runCheck();
}

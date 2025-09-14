console.log("email writer extension started");

function getEmailContent() {
  const selectors = [
    ".h7",
    "div.a3s.aiL",
    ".gmail_quote",
    '[role="presentation"]',
  ];
  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      console.log("Email content found with selector:", selector);
      return content.innerText.trim();
    }
  }
  console.log("No email content found");
  return "";
}

function injectButton() {
  const existingButton = document.querySelector(".ai-reply-button");
  if (existingButton) {
    existingButton.remove();
  }
}

function findComposeToolbar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];
  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      console.log("Toolbar found with selector:", selector);
      return toolbar;
    }
  }
  console.log("No toolbar found");
  return null;
}

function createAIButton() {
  const button = document.createElement("div");
  button.className = "ai-reply-button";
  button.innerText = "AI Reply";
  button.setAttribute("role", "button");
  button.setAttribute("data-tooltip", "Generate AI Reply");
  button.style.marginRight = "8px";
  button.style.padding = "6px 12px";
  button.style.backgroundColor = "#4285f4";
  button.style.color = "#fff";
  button.style.borderRadius = "4px";
  button.style.cursor = "pointer";
  button.style.fontSize = "14px";
  button.style.userSelect = "none";
  return button;
}

function addButton() {
  const toolbar = findComposeToolbar();
  if (!toolbar) {
    return;
  }
  if (toolbar.querySelector(".ai-reply-button")) {
    return;
  }
  const button = createAIButton();
  toolbar.insertBefore(button, toolbar.firstChild);
  console.log("AI Reply button added");

  button.addEventListener("click", async () => {
    try {
      button.innerText = "Generating...";
      button.style.pointerEvents = "none";

      const emailContent = getEmailContent();

      const response = await fetch("http://localhost:8081/api/email/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailContent: emailContent,
          tone: "professional",
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed with status " + response.status);
      }

      const generatedReply = await response.text();

      const composeBox = document.querySelector(
        '[role="textbox"][g_editable="true"]'
      );
      if (composeBox) {
        composeBox.focus();
        document.execCommand("insertText", false, generatedReply);
        console.log("Reply inserted");
      } else {
        console.log("Compose box not found");
      }
    } catch (error) {
      console.error("Error in generating reply:", error);
    } finally {
      button.innerText = "AI Reply";
      button.style.pointerEvents = "auto";
    }
  });
}

// Repeatedly attempt to add the button until Gmail fully loads
const interval = setInterval(() => {
  addButton();
}, 2000);

// Watch for DOM changes to dynamically add the button when a new compose box opens
const observer = new MutationObserver(() => {
  addButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Optionally stop the interval after some time
setTimeout(() => clearInterval(interval), 60000);

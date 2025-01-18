function saveConversation() {
  let messages = [];
  let platform = "";

  // Detect platform and extract messages
  if (window.location.hostname.includes("chatgpt.com")) {
    platform = "ChatGPT";
    const threads = document.querySelectorAll("[data-message-author-role]");
    threads.forEach((thread) => {
      messages.push({
        role: thread.getAttribute("data-message-author-role"),
        content: thread.querySelector(".markdown")?.textContent || "",
        timestamp: new Date().toISOString(),
      });
    });
  } else if (window.location.hostname.includes("claude.ai")) {
    platform = "Claude";
    const threads = document.querySelectorAll(".prose"); // Adjust selector based on Claude's DOM
    threads.forEach((thread) => {
      messages.push({
        role: thread.closest('[role="user"]') ? "user" : "assistant",
        content: thread.textContent || "",
        timestamp: new Date().toISOString(),
      });
    });
  } else if (window.location.hostname.includes("perplexity.ai")) {
    platform = "Perplexity";
    const threads = document.querySelectorAll(".prose"); // Adjust selector based on Perplexity's DOM
    threads.forEach((thread) => {
      messages.push({
        role: thread.closest('[role="user"]') ? "user" : "assistant",
        content: thread.textContent || "",
        timestamp: new Date().toISOString(),
      });
    });
  } else if (window.location.hostname.includes("v0.dev")) {
    platform = "V0 by Vercel";
    const threads = document.querySelectorAll(".prose"); // Adjust selector based on V0's DOM
    threads.forEach((thread) => {
      messages.push({
        role: thread.closest('[role="user"]') ? "user" : "assistant",
        content: thread.textContent || "",
        timestamp: new Date().toISOString(),
      });
    });
  } else if (window.location.hostname.includes("gemini.google.com")) {
    platform = "Gemini";
    const threads = document.querySelectorAll(".prose"); // Adjust selector based on Gemini's DOM
    threads.forEach((thread) => {
      messages.push({
        role: thread.closest('[role="user"]') ? "user" : "assistant",
        content: thread.textContent || "",
        timestamp: new Date().toISOString(),
      });
    });
  }

  // Add similar conditions for other AI platforms

  const conversation = {
    id: Date.now(),
    platform,
    title: document.title,
    messages,
    url: window.location.href,
    savedAt: new Date().toISOString(),
  };

  chrome.storage.local.get(["conversations"], function (result) {
    const conversations = result.conversations || [];

    // Check if conversation already exists
    const isDuplicate = conversations.some(
      (existingConv) =>
        existingConv.url === conversation.url &&
        existingConv.messages.length === conversation.messages.length
    );

    if (isDuplicate) {
      showNotification("Conversation already saved!", "#f97316"); // Orange color for warning
    } else {
      conversations.unshift(conversation);
      chrome.storage.local.set({ conversations }, () => {
        showNotification("Conversation saved!", "#10a37f"); // Green color for success
      });
    }
  });
}

function showNotification(message, backgroundColor = "#10a37f") {
  const notification = document.createElement("div");

  // Create icon based on message type
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("width", "20");
  icon.setAttribute("height", "20");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "2");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");

  // Different icons for success and warning
  if (backgroundColor === "#10a37f") {
    // Success
    icon.innerHTML = `
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        `;
  } else {
    // Warning/Already exists
    icon.innerHTML = `
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        `;
  }

  // Create notification content wrapper
  const contentWrapper = document.createElement("div");
  contentWrapper.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
    `;

  contentWrapper.appendChild(icon);
  const messageSpan = document.createElement("span");
  messageSpan.textContent = message;
  contentWrapper.appendChild(messageSpan);

  notification.appendChild(contentWrapper);
  notification.style.cssText = `
        position: fixed;
        top: -100px;
        right: 20px;
        padding: 12px 24px;
        background: ${backgroundColor};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        font-family: system-ui;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease forwards, fadeOut 0.3s ease 2.7s forwards;
        transform-origin: top right;
    `;

  // Add keyframes for notifications
  const keyframes = document.createElement("style");
  keyframes.textContent = `
        @keyframes slideIn {
            from { top: -100px; opacity: 0; }
            to { top: 20px; opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.8); }
        }
    `;

  document.head.appendChild(keyframes);
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Create save button with text and icon
const saveButton = document.createElement("button");
const buttonText = document.createElement("span");
buttonText.textContent = "";
saveButton.appendChild(buttonText);

// Create and append SVG element
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", "24");
svg.setAttribute("height", "24");
svg.setAttribute("viewBox", "0 0 24 24");
svg.setAttribute("fill", "none");
svg.setAttribute("stroke", "currentColor");
svg.setAttribute("stroke-width", "2");
svg.setAttribute("stroke-linecap", "round");
svg.setAttribute("stroke-linejoin", "round");
svg.setAttribute("class", "lucide lucide-circle-fading-plus");

const paths = [
  "M12 2a10 10 0 0 1 7.38 16.75",
  "M12 8v8",
  "M16 12H8",
  "M2.5 8.875a10 10 0 0 0-.5 3",
  "M2.83 16a10 10 0 0 0 2.43 3.4",
  "M4.636 5.235a10 10 0 0 1 .891-.857",
  "M8.644 21.42a10 10 0 0 0 7.631-.38",
];

paths.forEach((d) => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  svg.appendChild(path);
});

saveButton.appendChild(svg);

// Create drag handle
const dragHandle = document.createElement("div");
dragHandle.innerHTML = "⋮"; // Vertical dots as drag indicator
dragHandle.style.cssText = `
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    user-select: none;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  `;

// Update button styles to accommodate handle
saveButton.style.cssText = `
    position: fixed;
    padding: 8px 16px 8px 28px; /* Increased left padding for handle */
    background: #31363F;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer; /* Changed to pointer since drag is handle-only */
    z-index: 9999;
    font-family: system-ui;
    font-weight: 500;
    transition: background 0.2s;
  `;

saveButton.appendChild(dragHandle);

// Update drag event listeners to only work on handle
dragHandle.addEventListener("mousedown", (e) => {
  e.stopPropagation(); // Prevent event from bubbling to the button
  dragStart(e);
});
// Remove mousedown from saveButton

// Get stored position or use default
chrome.storage.local.get(
  [`buttonPosition_${window.location.hostname}`],
  function (result) {
    const position = result[`buttonPosition_${window.location.hostname}`] || {
      top: "20px",
      left: "20px",
    };
    saveButton.style.top = position.top;
    saveButton.style.left = position.left;
  }
);

// Add drag functionality
let isDragging = false;
let dragStartTime = 0; // Add this to track when drag started
let currentX;
let currentY;
let initialX;
let initialY;

function dragStart(e) {
  dragStartTime = Date.now(); // Record when dragging started
  initialX = e.clientX - saveButton.offsetLeft;
  initialY = e.clientY - saveButton.offsetTop;
  isDragging = true;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", dragEnd);
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;

    // Ensure button stays within viewport
    currentX = Math.min(
      Math.max(0, currentX),
      window.innerWidth - saveButton.offsetWidth
    );
    currentY = Math.min(
      Math.max(0, currentY),
      window.innerHeight - saveButton.offsetHeight
    );

    saveButton.style.left = currentX + "px";
    saveButton.style.top = currentY + "px";
  }
}

function dragEnd(e) {
  const dragDuration = Date.now() - dragStartTime;
  const wasDragging = isDragging && dragDuration > 200; // Consider it a drag if held for more than 200ms

  isDragging = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", dragEnd);

  if (wasDragging) {
    // Save position for this domain
    const position = {
      top: saveButton.style.top,
      left: saveButton.style.left,
    };
    chrome.storage.local.set({
      [`buttonPosition_${window.location.hostname}`]: position,
    });
  }
}

saveButton.addEventListener("mouseover", () => {
  saveButton.style.background = "#222831";
});
saveButton.addEventListener("mouseout", () => {
  saveButton.style.background = "#31363F";
});
saveButton.addEventListener("click", (e) => {
  // Only save if the click wasn't on the drag handle
  if (!e.target.isSameNode(dragHandle)) {
    saveConversation();
  }
});
document.body.appendChild(saveButton);

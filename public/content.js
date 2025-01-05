function saveConversation() {
    let messages = [];
    let platform = '';
    
    // Detect platform and extract messages
    if (window.location.hostname.includes('chatgpt.com')) {
      platform = 'ChatGPT';
      const threads = document.querySelectorAll('[data-message-author-role]');
      threads.forEach(thread => {
        messages.push({
          role: thread.getAttribute('data-message-author-role'),
          content: thread.querySelector('.markdown')?.textContent || '',
          timestamp: new Date().toISOString()
        });
      });
    } else if (window.location.hostname.includes('claude.ai')) {
      platform = 'Claude';
      const threads = document.querySelectorAll('.prose'); // Adjust selector based on Claude's DOM
      threads.forEach(thread => {
        messages.push({
          role: thread.closest('[role="user"]') ? 'user' : 'assistant',
          content: thread.textContent || '',
          timestamp: new Date().toISOString()
        });
      });
    }
    else if (window.location.hostname.includes('perplexity.ai')) {
      platform = 'Perplexity';
      const threads = document.querySelectorAll('.prose'); // Adjust selector based on Perplexity's DOM
      threads.forEach(thread => {
        messages.push({
          role: thread.closest('[role="user"]') ? 'user' : 'assistant',
          content: thread.textContent || '',
          timestamp: new Date().toISOString()
        });
      });
    }
    else if (window.location.hostname.includes('v0.dev')) {
      platform = 'V0 by Vercel';
      const threads = document.querySelectorAll('.prose'); // Adjust selector based on V0's DOM
      threads.forEach(thread => {
        messages.push({
          role: thread.closest('[role="user"]') ? 'user' : 'assistant',
          content: thread.textContent || '',
          timestamp: new Date().toISOString()
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
      savedAt: new Date().toISOString()
    };
  
    chrome.storage.local.get(['conversations'], function(result) {
      const conversations = result.conversations || [];
      
      // Check if conversation already exists
      const isDuplicate = conversations.some(existingConv => 
        existingConv.url === conversation.url && 
        existingConv.messages.length === conversation.messages.length
      );

      if (isDuplicate) {
        showNotification('Conversation already saved!', '#f97316'); // Orange color for warning
      } else {
        conversations.unshift(conversation);
        chrome.storage.local.set({ conversations }, () => {
          showNotification('Conversation saved!', '#10a37f'); // Green color for success
        });
      }
    });
  }
  
  function showNotification(message, backgroundColor = '#10a37f') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background: ${backgroundColor};
      color: white;
      border-radius: 8px;
      z-index: 10000;
      font-family: system-ui;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
  
  // Add save button
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save Chat';
  saveButton.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 8px 16px;
    background: #10a37f;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    z-index: 9999;
    font-family: system-ui;
    font-weight: 500;
    transition: background 0.2s;
  `;
  saveButton.addEventListener('mouseover', () => {
    saveButton.style.background = '#0c8969';
  });
  saveButton.addEventListener('mouseout', () => {
    saveButton.style.background = '#10a37f';
  });
  saveButton.addEventListener('click', saveConversation);
  document.body.appendChild(saveButton);
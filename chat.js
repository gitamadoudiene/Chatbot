/* ===========================================
   KHADIJA CHATBOT - LOGIQUE JAVASCRIPT
   Workshop : Création d'un chatbot avec IA
   =========================================== */

// Configuration de l'API Groq
const apiKey = "VOTRE_API_KEY_ICI"; // Remplacez par votre clé API Groq
const endpoint = "https://api.groq.com/openai/v1/chat/completions";

// URL de l'avatar de Khadija
const KHADIJA_AVATAR = "https://us.123rf.com/450wm/elvie15veronika/elvie15veronika2005/elvie15veronika200500047/147252381-social-media-avatar-profile-a-woman-african-woman-in-glasses-office-worker-vector-trendy-minimal.jpg";

/**
 * Fonction pour créer une bulle de message
 */
function createMessageBubble(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (isUser) {
        avatar.className += ' user-avatar';
        avatar.textContent = 'U'; // ou vous pouvez mettre une vraie image
    } else {
        const img = document.createElement('img');
        img.src = KHADIJA_AVATAR;
        img.alt = "Avatar de Khadija";
        img.className = 'message-avatar';
        avatar.appendChild(img);
    }
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = content;
    
    if (isUser) {
        messageDiv.appendChild(bubble);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
    }
    
    return messageDiv;
}

/**
 * Fonction pour afficher l'indicateur de frappe
 */
function showTypingIndicator() {
    const messagesDiv = document.getElementById("messages");
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingDiv.appendChild(dot);
    }
    
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * Fonction pour supprimer l'indicateur de frappe
 */
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

/**
 * Fonction principale d'envoi de message
 */
async function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const messagesDiv = document.getElementById("messages");
    
    if (!userInput.trim()) {
        alert("💬 Veuillez saisir un message pour Khadija !");
        return;
    }
    
    // Ajouter le message utilisateur avec bulle
    const userMessage = createMessageBubble(userInput, true);
    messagesDiv.appendChild(userMessage);
    
    // Nettoyer l'input et faire défiler
    document.getElementById("userInput").value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // Afficher l'indicateur de frappe
    showTypingIndicator();
    
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    { 
                        role: "system", 
                        content: "Tu es Khadija, un assistant virtuel féminin bienveillant, intelligent et amical. Tu réponds toujours en français avec empathie et professionnalisme. Tu aimes aider les gens et tu es toujours positive." 
                    },
                    { 
                        role: "user", 
                        content: userInput 
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        const botMessage = data.choices?.[0]?.message?.content || "Désolée, je n'ai pas pu générer de réponse. 😔";

        // Supprimer l'indicateur de frappe
        hideTypingIndicator();
        
        // Ajouter la réponse de Khadija avec bulle
        const khadijaMessage = createMessageBubble(botMessage, false);
        messagesDiv.appendChild(khadijaMessage);

    } catch (error) {
        console.error("❌ Erreur lors de l'appel à l'API :", error);
        
        hideTypingIndicator();
        
        const errorMessage = createMessageBubble("Oh non ! Une erreur s'est produite. 😞 Pouvez-vous réessayer ?", false);
        messagesDiv.appendChild(errorMessage);
    }
    
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * Fonction pour gérer la touche Entrée
 */
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const messagesDiv = document.getElementById("messages");
    
    // Effacer le contenu existant
    messagesDiv.innerHTML = '';
    
    // Message de bienvenue avec bulle
    const welcomeMessage = createMessageBubble("Bonjour ! Je suis Khadija, votre assistante virtuelle. Je suis là pour vous aider ! Comment allez-vous aujourd'hui ? ✨", false);
    messagesDiv.appendChild(welcomeMessage);
    
    const inputField = document.getElementById("userInput");
    if (inputField) {
        inputField.addEventListener("keypress", handleKeyPress);
        inputField.focus();
    }
});

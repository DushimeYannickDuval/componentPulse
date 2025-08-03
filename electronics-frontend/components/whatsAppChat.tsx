import React from "react";

const WhatsAppChat: React.FC = () => {
  const phoneNumber: string = "+256 790 270 840"; 
  const message: string = "Hello! I'm interested in your products.";

  return (
    <div style={styles.chatButtonContainer}>
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        rel="noopener noreferrer"
        style={styles.chatButton}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="Chat on WhatsApp"
          style={styles.icon}
        />
        <span style={styles.label}>Chat with us</span>
      </a>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chatButtonContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  chatButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#25D366",
    color: "white",
    padding: "10px 16px",
    borderRadius: "50px",
    textDecoration: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  icon: {
    width: "24px",
    height: "24px",
    marginRight: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default WhatsAppChat;

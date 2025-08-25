import { useState } from "react";

export default function DomainCopy() {
  const [copied, setCopied] = useState(false);

  const domain = window.location.hostname;

  const handleCopy = () => {
    navigator.clipboard.writeText(domain)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2 sec
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <a href="/" style={{ textDecoration: "none", color: "blue" }}>
        {domain}
      </a>
      <button onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}


import'./F.css'
import{Mail,HelpCircle,Linkedin,Github,Server,}from 'lucide-react'
export const Footer = ()=>{


    return (<footer className="footer">
    {/* About Section */}
    <div className='footer-top'>
      <div className="footer-section">
        <h4>About</h4>
        <p>Secret Whisper is a secure platform for sending anonymous messages that automatically disappear, ensuring your privacy and the recipient's curiosity remain protected.</p>
        
        {/* Privacy Features */}
        <div className="privacy-badges" style={{margin:'auto'}}>
          <span className="badge">🔒 End-to-End Privacy</span>
          <span className="badge">⏰ Auto-Delete</span>
        </div>
      </div>

      {/* Contact Section */}
      <div className="footer-section">
        <h4>Contact Us</h4>
        <div className="contact-links" style={{margin:'auto'}}>
          <a href="mailto:ranajitbangal01@gmail.com"><Mail size={15}/> ranajitbangal01@gmail.com</a>
        </div>
        
        {/* Social Links */}
        <div className="social-links footer-section">
          <h5>Follow Us</h5>

          <div className="social-icons"  style={{margin:'auto'}} >
            <a href="www.linkedin.com/in/ranajitbangal" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <Linkedin size={18}/>
            </a>
            <a href="https://github.com/ranajit001" target="_blank" rel="noopener noreferrer" title="Github">
              <Github size={18}/>
            </a>
          </div>
          
        </div>
      </div>

      {/* Source Code & Resources Section */}
      <div className="footer-section">
        <h4>Resources</h4>
        <div className="github-links"  style={{margin:'auto'}}>
          <a href="https://github.com/yourusername/secret-whisper-frontend" target="_blank" rel="noopener noreferrer">
            <Github size={15}/> Frontend Repository
          </a>
          <a href="https://github.com/yourusername/secret-whisper-backend" target="_blank" rel="noopener noreferrer">
            <Server size={15}/> Backend Repository
          </a>
        </div>
        
      </div>
    </div>

    {/* Bottom Copyright */}
    <div className="footer-bottom">
      <div className="footer-bottom-content">
        <p>&copy; 2025 Secret Whisper. Made with 💜 by sumon.</p>
      </div>
      
      {/* Version Info */}
      <div className="version-info">
        <small>v2.1.0 • Last updated: Aug 2025</small>
      </div>
    </div>
</footer>

)
}
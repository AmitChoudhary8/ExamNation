import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTelegramPlane, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const socials = [
  { icon:<FaInstagram/>, url:'https://instagram.com', color:'#E4405F' },
  { icon:<FaTelegramPlane/>, url:'https://telegram.org', color:'#0088CC' },
  { icon:<FaWhatsapp/>, url:'https://whatsapp.com', color:'#25D366' },
  { icon:<FaEnvelope/>, url:'mailto:contact@examnation.com', color:'#D44638' }
];
const links = [
  {name:"About Website", path:'/about-us'},
  {name:"Contact Us", path:'/contact-us'},
  {name:"Terms and Conditions", path:'/terms'},
  {name:"Support Us", path:'/support-us'}
];

const Footer = () => (
  <footer className="footer">
    <div className="container footer-content">
      <div className="footer-left">
        <p>Founded by [Your Name/Org]</p>
      </div>
      <div className="footer-right">
        {socials.map((s,i)=>(
          <a key={i} href={s.url} rel="noopener noreferrer" target="_blank" className="footer-social" style={{"--hover-color":s.color}}>
            {s.icon}
          </a>
        ))}
      </div>
    </div>
    <div className="container website-name">
      <h3>ExamNation</h3>
    </div>
    <div className="container footer-links">
      {links.map((l, i)=>(
        <Link key={i} to={l.path} className="footer-link">{l.name}</Link>
      ))}
    </div>
    <div className="container copyright">
      <p>&copy; 2024 ExamNation. All your reserved.</p>
    </div>
  </footer>
);

export default Footer;

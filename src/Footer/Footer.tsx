import React from "react";
import "./Footer.css";
import { ReactComponent as InstagramIcon } from "../assets/icons/instagram.svg";
import { ReactComponent as YouTubeIcon } from "../assets/icons/youtube.svg";

const Footer: React.FC = () => {
	return (
		<footer className="footer" id="footer">
			<p>© {new Date().getFullYear()} Todos os direitos reservados</p>
		</footer>
	);
};

export default Footer;

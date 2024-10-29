import "./Contact.css";
import React, { useState } from "react";
import { ReactComponent as InstagramIcon } from "../assets/icons/instagram.svg";
import { ReactComponent as YouTubeIcon } from "../assets/icons/youtube.svg";
import { Box, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

const Contact: React.FC = () => {
	const { t } = useTranslation();
	const [formData, setFormData] = useState({
		name: "",
		message: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const phoneNumber = "491795204649";

		const message = t("contact.wpp.message", {
			name: formData.name,
			message: formData.message,
		});

		const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

		window.open(whatsappURL, "_blank");
	};

	return (
		<Container className="contact-section" id="contato">
			<h2 className="contact-title">{t("contact.get_in_touch")}</h2>
			<form className="contact-form" onSubmit={handleSubmit}>
				<Box className="form-group">
					<label htmlFor="name">{t("contact.name")}:</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</Box>
				<Box className="form-group">
					<label htmlFor="message">{t("contact.message")}:</label>
					<textarea
						id="message"
						name="message"
						value={formData.message}
						onChange={handleChange}
						required
					></textarea>
				</Box>
				<button type="submit">{t("contact.send_wpp")}</button>
			</form>
			<Box className="social-links">
				<p>{t("contact.follow_me")}:</p>
				<Box>
					<a
						href="https://www.instagram.com/atelier.normando/"
						target="_blank"
						rel="noopener noreferrer"
						className="social-icon"
					>
						<InstagramIcon width={30} height={30} style={{ fill: "#41454e" }} />
					</a>
					{/* <a
						href="https://www.youtube.com/seuUsuarioYouTube"
						target="_blank"
						rel="noopener noreferrer"
						className="social-icon"
					>
						<YouTubeIcon style={{ fill: "#41454e" }} width={30} height={30} />
					</a> */}
				</Box>
			</Box>
		</Container>
	);
};

export default Contact;

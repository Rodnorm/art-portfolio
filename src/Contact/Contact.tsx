import React, { useState } from "react";
import "./Contact.css";
import { ReactComponent as InstagramIcon } from "../assets/icons/instagram.svg";
import { ReactComponent as YouTubeIcon } from "../assets/icons/youtube.svg";

const Contact: React.FC = () => {
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

		// Substitua pelo seu número de telefone (com código de país, mas sem o "+")
		const phoneNumber = "491795204649";

		// Construindo a mensagem para o WhatsApp
		const message = `Nome: ${formData.name}%0AMensagem: ${formData.message}`;
		const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

		// Redirecionar para o WhatsApp
		window.open(whatsappURL, "_blank");
	};

	return (
		<section className="contact-section" id="contato">
			<h2 className="contact-title">Entre em Contato</h2>
			<form className="contact-form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="name">Nome:</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="message">Mensagem:</label>
					<textarea
						id="message"
						name="message"
						value={formData.message}
						onChange={handleChange}
						required
					></textarea>
				</div>
				<button type="submit">Enviar via WhatsApp</button>
			</form>
			<div className="social-links">
				<p>Me siga nas redes sociais:</p>
				<a
					href="https://www.instagram.com/seuUsuarioInstagram"
					target="_blank"
					rel="noopener noreferrer"
					className="social-icon"
				>
					<InstagramIcon width={30} height={30} style={{ fill: "#41454e" }} />
				</a>
				<a
					href="https://www.youtube.com/seuUsuarioYouTube"
					target="_blank"
					rel="noopener noreferrer"
					className="social-icon"
				>
					<YouTubeIcon style={{ fill: "#41454e" }} width={30} height={30} />
				</a>
			</div>
		</section>
	);
};

export default Contact;

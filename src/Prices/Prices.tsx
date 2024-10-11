import React from "react";
import "./Prices.css";

// Definindo o tipo do objeto de preço
type PriceItem = {
	name: string;
	price: string;
	note?: string;
	additional?: string;
	deliveryTime?: string;
};

// Lista de preços
const priceList: PriceItem[] = [
	{
		name: "Retrato a lápis - Tamanho A4 (1 pessoa)",
		price: "30 euros",
		additional: "Pessoa adicional: +15 euros",
		note: "Necessita de duas semanas para ficar pronto. Não acompanha moldura.",
	},
	{
		name: "Retrato a óleo - Tamanho A4 (1 pessoa)",
		price: "80 euros",
		note: "Necessita de um mês para ficar pronto devido à secagem. Não acompanha moldura.",
	},
	{
		name: "Retrato a óleo - Tamanho 60x50 cm (1 pessoa)",
		price: "120 euros",
		additional: "Pessoa adicional: +40 euros",
		note: "Necessita de um mês para ficar pronto devido à secagem. Não acompanha moldura",
	},
	{
		name: "Retrato a óleo de animais - Tamanho A4",
		price: "50 euros por animal",
		note: "Necessita de um mês para ficar pronto devido à secagem. Não acompanha moldura",
	},
	{
		name: "Aquarela Estilo Belle Époque - Tamanho 29x42",
		price: "80 euros",
		note: "Necessita de duas semanas para ficar pronto. Inclui moldura de madeira",
	},
];

const Prices: React.FC = () => {
	return (
		<section className="prices-section" id="precos">
			<h2 className="prices-title">Preços</h2>
			<div className="prices-list">
				{priceList.map((item, index) => (
					<div className="price-item" key={index}>
						<h3>{item.name}</h3>
						<p>Preço: {item.price}</p>
						{item.additional && <p>{item.additional}</p>}
						{item.note && (
							<p>
								<strong>Nota:</strong> {item.note}
							</p>
						)}
						{item.deliveryTime && <p>Tempo de entrega: {item.deliveryTime}</p>}
					</div>
				))}
			</div>
		</section>
	);
};

export default Prices;

import "./App.css";
import About from "./About/About";
import Trabalhos from "./Work/Work";
import Footer from "./Footer/Footer";
import Navbar from "./navbar/Navbar";
import Prices from "./Prices/Prices";
import Contact from "./Contact/Contact";

function App() {
	return (
		<div className="App">
			<Navbar />
			<div className="content">
				<section id="home">
					<div>
						<p className="title">Rodrigo Normando</p>
						<p className="subtitle"> Arte Tradicional</p>
					</div>
				</section>
				<Trabalhos />
				<About />
				<Prices />
				<Contact />
				<Footer />
			</div>
		</div>
	);
}

export default App;

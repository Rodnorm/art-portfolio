import "./i18n";
import "./App.css";
import About from "./About/About";
import Home from "./Home/Home";
import Box from "@mui/material/Box";
import Trabalhos from "./Work/Work";
import Footer from "./Footer/Footer";
import Prices from "./Prices/Prices";
import Contact from "./Contact/Contact";
import PersistentDrawerRight from "./navbar/NavbarMui";

function App() {
	return (
		<Box className="App">
			<PersistentDrawerRight />
			<Box className="content">
				<Home />
				<Trabalhos />
				<About />
				<Prices />
				<Contact />
				<Footer />
			</Box>
		</Box>
	);
}

export default App;

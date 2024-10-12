import React from "react";
import "./Footer.css";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
	const { t } = useTranslation();
	return (
		<Box className="footer" id="footer">
			<Typography>
				© {new Date().getFullYear()} {t("footer.footer_rights")}
			</Typography>
		</Box>
	);
};

export default Footer;

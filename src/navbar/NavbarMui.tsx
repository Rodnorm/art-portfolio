import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import textureImage from "../assets/img/textura.jpg";

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const drawerWidth = 240;

const navLinks = [
	{
		name: "home",
		href: "#home",
	},
	{
		name: "work",
		href: "#trabalhos",
	},
	{
		name: "about",
		href: "#about",
	},
	{
		name: "prices",
		href: "#precos",
	},
	{
		name: "contact",
		href: "#contato",
	},
];

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
	transition: theme.transitions.create(["margin", "width"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	variants: [
		{
			props: ({ open }) => open,
			style: {
				width: `calc(100% - ${drawerWidth}px)`,
				transition: theme.transitions.create(["margin", "width"], {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
				marginRight: drawerWidth,
			},
		},
	],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0, 1),
	...theme.mixins.toolbar,
	justifyContent: "flex-start",
}));

export default function PersistentDrawerRight() {
	const { t, i18n } = useTranslation();
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<Box sx={{ display: "flex", position: "absolute" }}>
			<AppBar
				position="fixed"
				open={open}
				sx={{
					backgroundColor: "transparent",
					boxShadow: "none",
				}}
			>
				<Toolbar
					sx={{
						display: "flex",
						alignSelf: "end",
					}}
				>
					<IconButton
						id="menuIcon"
						aria-label="open drawer"
						edge="end"
						onClick={handleDrawerOpen}
						sx={[open && { display: "none" }]}
						style={{
							color: "rgb(244, 244, 244)",
							backgroundColor: "#848282",
						}}
					>
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						backgroundImage: `url(${textureImage})`,
						backgroundPosition: "center",
						color: "white",
					},
				}}
				variant="persistent"
				anchor="right"
				open={open}
			>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose} style={{ color: "white" }}>
						{theme.direction === "rtl" ? (
							<ChevronLeftIcon />
						) : (
							<ChevronRightIcon />
						)}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					{navLinks.map((link) => (
						<ListItem key={link.href} disablePadding>
							<ListItemButton href={link.href}>
								<ListItemText primary={t(`nav.${link.name}`)} />
							</ListItemButton>
						</ListItem>
					))}
					<ListItem key="en" disablePadding>
						<ListItemButton onClick={() => changeLanguage("en")}>
							<ListItemText primary={t(`nav.en`)} />
						</ListItemButton>
					</ListItem>
					<ListItem key="pt" disablePadding>
						<ListItemButton onClick={() => changeLanguage("pt")}>
							<ListItemText primary={t(`nav.pt`)} />
						</ListItemButton>
					</ListItem>
					<ListItem key="de" disablePadding>
						<ListItemButton onClick={() => changeLanguage("de")}>
							<ListItemText primary={t(`nav.de`)} />
						</ListItemButton>
					</ListItem>
				</List>
			</Drawer>
		</Box>
	);
}

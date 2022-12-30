import { AccountCircle } from "@mui/icons-material"
import AdbIcon from "@mui/icons-material/Adb"
import MenuIcon from "@mui/icons-material/Menu"
import { Stack } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { useSnackbar } from "notistack"
import { useState } from "react"

import * as cfg from "../constants"
import { getOwners } from "../operations/operations"
const pages = ["Home", "Meow", "About"]

function Header({ accounts, setAccounts, setNftOwners }) {
  const isConnected = Boolean(accounts[0])
  const [metamaskCallbacksAlreadySet, setMetamaskCallbacksAlreadySet] =
    useState(false)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  // Check if we are on a supported network
  const checkNetwork = () => {
    const networkId = window.ethereum.networkVersion
    console.log("network:", networkId)

    const network = cfg.supportedNetworks.find((obj) => obj.id === networkId)
    if (network) return true

    const names = cfg.supportedNetworks.map((obj) => obj.name).join(", ")
    enqueueSnackbar(
      `Please switch to one of the supported networks: ${names}`,
      { variant: "warning" }
    )
    return false
  }

  const disconnectWallet = (e) => {
    setAccounts([])
    handleCloseUserMenu()
  }
  const connectWalletSimple = async () => {
    const newAccs = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    const networkOk = checkNetwork()
    setAccounts(newAccs)
    getOwners(setNftOwners) //when we call it accounts are not set yet but
    //it's ok because we don't use them when fetching owners
  }

  const connectWallet = async () => {
    try {
      await connectWalletSimple()
      if (metamaskCallbacksAlreadySet) return
      
      //console.log("ssetting cbs")
      // We reinitialize it whenever the user changes their account.
      //TODO should probably only set up this callback once, but what if user clicks
      //connect, then disconnect, then connect again?
      window.ethereum.on("accountsChanged", ([newAddress]) => {
        console.log("on accountsChanged")
        // `accountsChanged` event can be triggered with an undefined newAddress.
        // This happens when the user removes the Dapp from the "Connected
        // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
        // To avoid errors, we reset the dapp state
        if (newAddress === undefined) {
          setAccounts([])
          return
        }
        //otherwise we'll just connect new account normally
        connectWalletSimple()
      })

      //if the network is changed, just connect again normally
      //TODO see above
      window.ethereum.on("chainChanged", ([]) => {
        console.log("chain chng")
        connectWalletSimple()
      })
      setMetamaskCallbacksAlreadySet(true)
    } catch (err) {
      console.log(err)
    }
  }

  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const settings = [{ text: "Disconnect", onClick: disconnectWallet }]

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            NFKeeTees
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            NFKeeTees
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Stack direction="row" gap={1} sx={{ flexGrow: 0 }}>
            {isConnected ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                    sx={{ p: 0 }}
                  >
                    {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
                <Typography>{`${accounts[0].slice(0, 4)}...${accounts[0].slice(
                  -4
                )}`}</Typography>
              </>
            ) : (
              <Button color="inherit" onClick={connectWallet}>
                Connect
              </Button>
            )}
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.text} onClick={setting.onClick}>
                  <Typography textAlign="center">{setting.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Header

"use client"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

export default function ResponsiveAppBar() {
  const router = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [isClient, setIsClient] = React.useState(false); // إضافة حالة isClient

  React.useEffect(() => {
    setIsClient(true); // تأكيد العمل في بيئة المتصفح
  }, []);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  async function signIn() {
    if (isClient) { // التحقق من وجود المتصفح قبل الوصول إلى localStorage
      localStorage.removeItem("userToken");
      router.push("/login");
    }
  }

  // التحقق من أن الكود يعمل في بيئة العميل قبل محاولة الوصول إلى localStorage
  if (!isClient) {
    return null; // العودة بـ null إذا كان في بيئة الخادم
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Social App
          </Typography>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Social App
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {localStorage.getItem("userToken") ? (
                <>
                  <Typography sx={{ display: "block", px: "10px", textDecoration: "none", color: "black", fontWeight: "600", textAlign: "left" }} component={"a"} >
                    <Link href={`/myProfile`} style={{ display: "block", textDecoration: "none", color: "black", fontWeight: "600" }}>My Posts</Link>
                  </Typography>
                  <Typography sx={{ display: "block", px: "10px", textDecoration: "none", color: "black", fontWeight: "600", textAlign: "left" }} component={"a"} >
                    <Link href={`/ProfileInfo`} style={{ display: "block", textDecoration: "none", color: "black", fontWeight: "600" }}>Edit Profile</Link>
                  </Typography>

                  <Typography onClick={signIn} sx={{ cursor: "pointer", textAlign: "left", display: "block", px: "10px", textDecoration: "none", color: "black", fontWeight: "600" }} component={"a"}  >
                    Sign Out
                  </Typography>
                </>
              ) : (
                <>
                  <Typography sx={{ display: "block", px: "10px", textDecoration: "none", color: "black", fontWeight: "600" }} component={"a"} href='/signup' >
                    Signup
                  </Typography>
                  <Typography sx={{ display: "block", px: "10px", textDecoration: "none", color: "black", fontWeight: "600" }} component={"a"} href={"/login"} >
                    Login
                  </Typography>
                </>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

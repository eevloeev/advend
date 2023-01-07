// Source: https://github.com/mui/material-ui/tree/v5.8.7/docs/data/material/getting-started/templates/dashboard
const abortController = new AbortController()

import {
  Assignment as AssignmentIcon,
  Backup as BackupIcon,
  BarChart as BarChartIcon,
  ChevronLeft as ChevronLeftIcon,
  CloudDownload as CloudDownloadIcon,
  Cloud as CloudIcon,
  Dashboard as DashboardIcon,
  Layers as LayersIcon,
  Menu as MenuIcon,
  Mouse as MouseIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Drawer as MuiDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material"
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"
import { SubmitHandler, useForm } from "react-hook-form"
import { ThemeProvider, createTheme, styled } from "@mui/material/styles"
import { signOut, useSession } from "next-auth/react"
import { useCallback, useEffect, useMemo, useState } from "react"

import DomainsTable from "components/DomainsTable"
import Head from "next/head"
import apiRequest from "utils/apiRequest"
import routes from "const/routes"
import { useSnackbar } from "material-ui-snackbar-provider"

const DRAWER_IS_VISIBLE = false

const MainListItems = (
  <>
    <ListItemButton>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Customers" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItemButton>
  </>
)

const SecondaryListItems = (
  <>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </>
)

const drawerWidth = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}))

const mdTheme = createTheme()

interface FormInputs {
  domain: string
}

export interface Domain {
  id: string
  domain: string
  trafficIncoming: boolean
  trafficOutgoing: boolean
  clicks: number
  isHttps?: boolean
  title?: string
  description?: string
  color?: string
  background?: string
}

const domainErrors = {
  required: "Please enter a domain",
  pattern: "Invalid domain",
  default: "Unknown error",
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormInputs>()
  const snackbar = useSnackbar()
  const [domains, setDomains] = useState<Domain[]>([])
  const [stats, setStats] = useState({
    totalDomains: {
      name: "Total domains",
      value: "",
      icon: <CloudIcon />,
    },
    withIncomingTraffic: {
      name: "With incoming traffic",
      value: "",
      icon: <CloudDownloadIcon />,
    },
    withOutgoingTraffic: {
      name: "With outgoing traffic",
      value: "",
      icon: <BackupIcon />,
    },
    totalClicks: {
      name: "Total clicks",
      value: "",
      icon: <MouseIcon />,
    },
  })

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    apiRequest({ ...routes.insertDomain, data })
      .then(() => {
        handleClose()
        resetField("domain")
        snackbar.showMessage("Domain added successfully!")
        fetchDomains()
      })
      .catch((error) => {
        console.log(error)
        snackbar.showMessage(JSON.parse(error.request.response).message)
      })
  }

  const handleClickOpen = () => {
    setDialogIsOpen(true)
  }

  const handleClose = () => {
    setDialogIsOpen(false)
    reset()
  }

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const domainValidation = useMemo(
    () => ({
      error: !!errors?.domain?.type,
      helperText:
        domainErrors[errors?.domain?.type as keyof typeof domainErrors] ?? "",
    }),
    [errors?.domain?.type]
  )

  const fetchDomains = useCallback(() => {
    apiRequest(routes.getDomains)
      .then((response) => {
        setDomains(response.data.domains)
        setStats((prevState) => ({
          totalDomains: {
            ...prevState.totalDomains,
            value: response.data.domains.length,
          },
          withIncomingTraffic: {
            ...prevState.withIncomingTraffic,
            value: response.data.domains.filter(
              (d: Domain) => d.trafficIncoming
            ).length,
          },
          withOutgoingTraffic: {
            ...prevState.withOutgoingTraffic,
            value: response.data.domains.filter(
              (d: Domain) => d.trafficOutgoing
            ).length,
          },
          totalClicks: {
            ...prevState.totalClicks,
            value: response.data.domains
              .map((d: Domain) => d.clicks)
              .reduce((a: number, b: number) => a + b),
          },
        }))
      })
      .catch(() => {
        snackbar.showMessage(
          "An error occurred while receiving the domain list. Please reload the page."
        )
      })
  }, [apiRequest, setDomains, snackbar])

  const handleDeleteDomain = useCallback(
    (id: string) => {
      apiRequest({ ...routes.deleteDomain(id) })
        .then((response) => {
          fetchDomains()
          snackbar.showMessage(response.data.message)
        })
        .catch((error) => {
          console.log(error)
          snackbar.showMessage(JSON.parse(error.request.response).message)
        })
    },
    [apiRequest, snackbar]
  )

  const handleEditDomain = useCallback(
    (
      id: string,
      updates: object,
      callback?: () => void,
      onError?: (error: any) => void
    ) => {
      apiRequest({ ...routes.editDomain(id), data: updates })
        .then((response) => {
          fetchDomains()
          snackbar.showMessage(response.data.message)
          if (callback) callback()
        })
        .catch((error) => {
          console.log(error)
          snackbar.showMessage(JSON.parse(error.request.response).message)
          if (onError) onError(error)
        })
    },
    [apiRequest, snackbar]
  )

  useEffect(() => {
    fetchDomains()

    return () => {
      abortController.abort()
    }
  }, [])

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            {DRAWER_IS_VISIBLE && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {session?.user?.email}
            </Typography>
            <Button variant="text" color="inherit" onClick={() => signOut()}>
              Sign out
            </Button>
          </Toolbar>
        </AppBar>
        {DRAWER_IS_VISIBLE && (
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              {MainListItems}
              <Divider sx={{ my: 1 }} />
              {SecondaryListItems}
            </List>
          </Drawer>
        )}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container sx={{ py: 4 }}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Typography component="h1" variant="h4">
                  Hello!
                </Typography>
                <Typography
                  color="text.secondary"
                  component="div"
                  variant="subtitle1"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ py: 2 }}>
              <Grid item key={stats.totalDomains.name} xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ display: "flex", flexDirection: "row" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      {stats.totalDomains.icon}
                    </Avatar>
                    <Box>
                      <Typography color="text.secondary" component="div">
                        {stats.totalDomains.name}
                      </Typography>
                      <Typography variant="h5" component="div">
                        {stats.totalDomains.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                item
                key={stats.withIncomingTraffic.name}
                xs={12}
                sm={6}
                md={3}
              >
                <Card>
                  <CardContent sx={{ display: "flex", flexDirection: "row" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      {stats.withIncomingTraffic.icon}
                    </Avatar>
                    <Box>
                      <Typography color="text.secondary" component="div">
                        {stats.withIncomingTraffic.name}
                      </Typography>
                      <Typography variant="h5" component="div">
                        {stats.withIncomingTraffic.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                item
                key={stats.withOutgoingTraffic.name}
                xs={12}
                sm={6}
                md={3}
              >
                <Card>
                  <CardContent sx={{ display: "flex", flexDirection: "row" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      {stats.withOutgoingTraffic.icon}
                    </Avatar>
                    <Box>
                      <Typography color="text.secondary" component="div">
                        {stats.withOutgoingTraffic.name}
                      </Typography>
                      <Typography variant="h5" component="div">
                        {stats.withOutgoingTraffic.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item key={stats.totalClicks.name} xs={12} sm={6} md={3}>
                <Card>
                  <CardContent sx={{ display: "flex", flexDirection: "row" }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      {stats.totalClicks.icon}
                    </Avatar>
                    <Box>
                      <Typography color="text.secondary" component="div">
                        {stats.totalClicks.name}
                      </Typography>
                      <Typography variant="h5" component="div">
                        {stats.totalClicks.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <DomainsTable
              rows={domains}
              handleClickOpen={handleClickOpen}
              handleDeleteDomain={handleDeleteDomain}
              handleEditDomain={handleEditDomain}
            />
          </Container>
        </Box>
      </Box>
      <Dialog open={dialogIsOpen} onClose={handleClose}>
        <DialogTitle>New domain</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet consectetur adipisicing
          </DialogContentText>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Domain name"
              margin="normal"
              variant="outlined"
              inputProps={{
                ...register("domain", {
                  required: true,
                  pattern:
                    /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g,
                }),
              }}
              {...domainValidation}
            />
            <Button
              fullWidth
              size="large"
              variant="contained"
              type="submit"
              sx={{ mt: 2 }}
            >
              Add domain
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}

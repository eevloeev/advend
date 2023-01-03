import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material"
import {
  CheckCircle as CheckCircleIcon,
  Cloud as CloudIcon,
  Code as CodeIcon,
  ExpandMore as ExpandMoreIcon,
  Facebook as FacebookIcon,
  GppGood as GppGoodIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material"
import { signIn, signOut, useSession } from "next-auth/react"

import FeaturesIllustration from "public/assets/images/FeaturesIllustration.jpg"
import Head from "next/head"
import HeroImage from "public/assets/images/hero.svg"
import Image from "next/image"

const projectTitle = "Advend"

const pages = ["Products", "Pricing", "Blog"]

const features = [
  {
    title: "Development",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    icon: <CodeIcon />,
  },
  {
    title: "Hosting",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    icon: <CloudIcon />,
  },
  {
    title: "Security",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    icon: <GppGoodIcon />,
  },
]

const pricings = [
  {
    price: "Free",
    title: "START",
    features: ["1 GB Disk Space", "1 Database", "1 User"],
    best: false,
  },
  {
    price: "$49",
    title: "PRO",
    features: ["10 GB Disk Space", "2 Databases", "5 Users"],
    best: true,
  },
  {
    price: "$99",
    title: "ENTERPRISE",
    features: ["100 GB Disk Space", "5 Databases", "100 Users"],
    best: false,
  },
  {
    price: "?",
    title: "CUSTOM",
    features: ["X GB Disk Space", "X Databases", "X Users"],
    best: false,
  },
]

const questions = [
  {
    id: "question-unlimited-projects",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    title: "What does unlimited projects mean?",
  },
  {
    id: "question-free-updates",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    title: "What does free updates include?",
  },
  {
    id: "question-issue",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    title: "Found an issue with a component?",
  },
  {
    id: "question-support",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    title: "Do you offer technical support?",
  },
  {
    id: "question-refund",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    title: "What's your refund policy?",
  },
]

const categories = [
  { header: "Main", links: ["Home", "Services", "Pricing", "Testimonials"] },
  { header: "About", links: ["Company", "Mission", "Career", "Contact"] },
  { header: "Legal", links: ["Terms", "Privacy", "Licenses", "Support"] },
]

export default function Home() {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>{projectTitle}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no"
        />
      </Head>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Container>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {projectTitle}
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
              {session ? (
                <>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {session?.user?.email}
                  </Typography>
                  <Link href="/dashboard" color="inherit">
                    <Button variant="text" color="inherit">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <Button variant="text" color="inherit" onClick={() => signIn()}>
                  Sign in
                </Button>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <Container sx={{ py: 10 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: 480,
            mx: "auto",
          }}
        >
          <Typography variant="h3" component="h1">
            Best Advertisment Platform In World
          </Typography>
          <Typography
            color="text.secondary"
            variant="subtitle1"
            component="div"
            sx={{ mt: 2 }}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit
            aspernatur voluptatum quisquam quas cupiditate consectetur soluta
            suscipit magnam incidunt nisi.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button size="large" variant="outlined">
              More info
            </Button>
            {session ? (
              <Link href="/dashboard">
                <Button size="large" variant="contained">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Button size="large" variant="contained" onClick={() => signIn()}>
                Get for free
              </Button>
            )}
          </Stack>
          <Box sx={{ maxWidth: 720, mt: 6 }}>
            <Image alt="Hero" src={HeroImage} />
          </Box>
        </Box>
      </Container>
      <Box component="section">
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
            <Grid item xs={12} md={7}>
              <Typography sx={{ mb: 8 }} variant="h4">
                Key Features
              </Typography>
              {features.map((feature) => (
                <Box
                  key={feature.title}
                  sx={{ display: "flex", flexDirection: "row", mb: 6 }}
                >
                  <Avatar sx={{ bgcolor: "primary.main", mr: 3 }}>
                    {feature.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{feature.title}</Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={4}>
              <Image
                alt="FeaturesIllustration"
                src={FeaturesIllustration}
                style={{ borderRadius: 16, maxWidth: "100%", height: "auto" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box component="section">
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Pricing
            </Typography>
            <Typography color="text.secondary" component="div">
              Lorem ipsum dolor sit amet consectetur adipiscing elit
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {pricings.map((pricing) => (
              <Grid key={pricing.title} item xs={12} md={3}>
                <Card
                  sx={{
                    borderColor: pricing.best ? "primary.main" : undefined,
                    position: "relative",
                  }}
                  variant="outlined"
                >
                  <CardContent>
                    {pricing.best && (
                      <Typography
                        sx={{
                          px: 1,
                          lineHeight: 2,
                          borderBottomLeftRadius: 4,
                          position: "absolute",
                          right: 0,
                          top: 0,
                          bgcolor: "primary.main",
                          color: "background.default",
                        }}
                        variant="caption"
                      >
                        Best value
                      </Typography>
                    )}
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      sx={{ letterSpacing: "1.5px", mb: 1 }}
                    >
                      {pricing.title}
                    </Typography>
                    <Typography sx={{ mb: 4 }} variant="h4">
                      {pricing.price}
                    </Typography>
                    <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
                      {pricing.features.map((feature) => (
                        <Box
                          key={feature}
                          sx={{
                            color: "text.secondary",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                          {feature}
                        </Box>
                      ))}
                    </Stack>
                    <Button
                      fullWidth
                      variant={pricing.best ? "contained" : "outlined"}
                    >
                      Buy Now
                    </Button>
                    <Typography
                      component="div"
                      variant="caption"
                      sx={{ mt: 1, color: "text.secondary" }}
                    >
                      * VAT Included
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box component="section">
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ mb: 10 }}>
            <Typography gutterBottom variant="h4">
              Have a&nbsp;
              <Box component="span" sx={{ color: "primary.main" }}>
                Question ?
              </Box>
            </Typography>
            <Typography component="div" variant="h4">
              Look here
            </Typography>
          </Box>
          {questions.map((question) => (
            <Accordion
              key={question.id}
              disableGutters={true}
              elevation={0}
              sx={{
                "&.Mui-expanded:before": {
                  opacity: 1,
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${question.id}-content`}
                id={`${question.id}-header`}
                sx={{ "& .MuiAccordionSummary-content": { my: 3 } }}
              >
                <Typography
                  component="div"
                  sx={{ fontSize: "1rem" }}
                  variant="h6"
                >
                  {question.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pb: 3 }}>
                <Typography color="text.secondary">
                  {question.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>
      <Box component="footer">
        <Container maxWidth="lg">
          <Grid container spacing={3} sx={{ py: 8 }}>
            <Grid item xs={12} md={6}>
              <Typography color="primary" variant="h6">
                {projectTitle}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Placeat, ipsam!
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <IconButton aria-label="Facebook">
                  <FacebookIcon />
                </IconButton>
                <IconButton aria-label="Instagram">
                  <InstagramIcon />
                </IconButton>
                <IconButton aria-label="Twitter">
                  <TwitterIcon />
                </IconButton>
                <IconButton aria-label="LinkedIn">
                  <LinkedInIcon />
                </IconButton>
              </Stack>
            </Grid>
            {categories.map((category) => (
              <Grid key={category.header} item xs={12} md={2}>
                <Stack spacing={1}>
                  <Typography component="div" variant="h6">
                    {category.header}
                  </Typography>
                  {category.links.map((link) => (
                    <Link
                      color="text.secondary"
                      key={link}
                      underline="none"
                      variant="body2"
                    >
                      {link}
                    </Link>
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Divider />
          <Box
            sx={{
              textAlign: "center",
              py: 3,
            }}
          >
            <Typography color="text.secondary" variant="body2">
              2022 © All rights reserved
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  )
}

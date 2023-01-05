import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  IconButton,
  Link,
  Paper,
  Radio,
  RadioGroup,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import { ChangeEvent, useMemo, useRef, useState } from "react"
import { Code as CodeIcon, Delete as DeleteIcon } from "@mui/icons-material"

import AddIcon from "@mui/icons-material/Add"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"
import { Domain } from "pages/dashboard"
import InboxIcon from "@mui/icons-material/Inbox"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useSnackbar } from "material-ui-snackbar-provider"

const BANNER_TITLE_LIMIT = 40
const BANNER_DESCRIPTION_LIMIT = 120

const bannerStyles = [
  {},
  {
    backgroundImage:
      "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
  },
  { backgroundImage: "linear-gradient(to top, #c471f5 0%, #fa71cd 100%)" },
  { backgroundImage: "linear-gradient(to top, #4481eb 0%, #04befe 100%)" },
]

interface HeadCell {
  disablePadding: boolean
  id: string
  label: string
  align?: "center" | "left" | "right"
}

const headCells: HeadCell[] = [
  {
    id: "domain",
    disablePadding: false,
    label: "Domain",
  },
  {
    id: "trafficIncoming",
    disablePadding: false,
    label: "Incoming traffic",
  },
  {
    id: "trafficOutgoing",
    disablePadding: false,
    label: "Outgoing traffic",
  },
]

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
  )
}

interface DomainTableProps {
  rows: Domain[]
  handleClickOpen: () => void
  handleDeleteDomain: (id: string) => void
  handleEditDomain: (
    id: string,
    updates: object,
    callback?: () => void,
    onError?: (error: any) => void
  ) => void
}

export default function DomainsTable(props: DomainTableProps) {
  const { rows, handleClickOpen, handleDeleteDomain, handleEditDomain } = props
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [customizableId, setCustomizableId] = useState("")
  const [domain, setDomain] = useState("")
  const [isHttps, setIsHttps] = useState(false)
  const [snippetDialogIsOpen, setSnippetDialogIsOpen] = useState(false)
  const [customizeDialogIsOpen, setCustomizeDialogIsOpen] = useState(false)
  const snackbar = useSnackbar()
  const refSnippet = useRef<HTMLDivElement>(null)
  const [bannerTitle, setBannerTitle] = useState("Lorem ipsum dolor sit amet")
  const [bannerDescription, setBannerDescription] = useState(
    "Consectetur adipisicing elit. Asperiores reiciendis nemo, sint laborum beatae quidem repellendus quae"
  )
  const [isBannerVisible, setIsBannerVisible] = useState(true)
  const [bannerStyle, setBannerStyle] = useState(1)

  const handleBannerTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBannerTitle(event.target.value)
  }

  const handleBannerDescriptionChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setBannerDescription(event.target.value)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleTrafficIncomingChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.checked
    handleEditDomain(id, { trafficIncoming: newValue })
  }

  const handleTrafficOutgoingChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.checked
    handleEditDomain(id, { trafficOutgoing: newValue })
  }

  const handleSnippetDialogClose = () => {
    setSnippetDialogIsOpen(false)
  }

  const handleSnippetDialogOpen = () => {
    setSnippetDialogIsOpen(true)
  }

  const handleCopySnippet = () => {
    if (refSnippet.current?.innerText) {
      navigator.clipboard.writeText(refSnippet.current.innerText)
    }
    snackbar.showMessage("Copied to clipboard!")
  }

  const handleCustomizeDialogClose = () => {
    setCustomizeDialogIsOpen(false)
  }

  const handleCustomizeDialogOpen = () => {
    setCustomizeDialogIsOpen(true)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const bannerLink = useMemo(
    () => `http${isHttps ? "s" : ""}://${domain}`,
    [isHttps, domain]
  )

  const handleBannerStyleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBannerStyle(parseInt(event.target.value))
  }

  const handleIsHttpsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsHttps(event.target.checked)
  }

  const handleCustomizationSubmit = () => {
    handleEditDomain(
      customizableId,
      {
        title: bannerTitle,
        description: bannerDescription,
        style: bannerStyle,
        isHttps,
      },
      () => {
        handleCustomizeDialogClose()
        snackbar.showMessage("Saved successfully!")
      }
    )
  }

  return (
    <>
      <Dialog open={snippetDialogIsOpen} onClose={handleSnippetDialogClose}>
        <DialogTitle>Code snippet for {domain}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Paste this code snippet inside the head tag on your site.
          </DialogContentText>
          <Box
            ref={refSnippet}
            dangerouslySetInnerHTML={{
              __html: `<pre><span style="color: #008000">&lt;!-- ADVEND SCRIPT --&gt;</span>
&lt;script&gt;
(<span style="color:#0000ff">function</span>(a,d,v,e){
  e.advend=v
  <span style="color:#0000ff">var</span> n=a.createElement(d);
  n.src=<span style="color:#a31515">&#39;${window?.location?.origin}/advend.js&#39;</span>;
  a.body.prepend(n);
})(document,<span style="color:#a31515">&#39;script&#39;</span>,<span style="color:#a31515">&#39;${domain}&#39;</span>,window);
&lt;/script&gt;</pre>`,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopySnippet}>Copy</Button>
          <Button onClick={handleSnippetDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={customizeDialogIsOpen}
        onClose={handleCustomizeDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Customize banner for {domain}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Here you can customize your banner that will appear on other sites
          </DialogContentText>
          <TextField
            label="Title"
            fullWidth
            value={bannerTitle}
            onChange={handleBannerTitleChange}
            variant="outlined"
            inputProps={{ maxlength: BANNER_TITLE_LIMIT }}
            helperText={`Max. ${BANNER_TITLE_LIMIT} characters`}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch checked={isHttps} onChange={handleIsHttpsChange} />
            }
            label="Use HTTPS"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            maxRows={4}
            value={bannerDescription}
            onChange={handleBannerDescriptionChange}
            variant="outlined"
            inputProps={{ maxlength: BANNER_DESCRIPTION_LIMIT }}
            helperText={`Max. ${BANNER_DESCRIPTION_LIMIT} characters`}
            margin="normal"
          />
          <FormLabel>Style</FormLabel>
          <RadioGroup
            row
            value={bannerStyle}
            onChange={handleBannerStyleChange}
          >
            <FormControlLabel value="1" control={<Radio />} label="Pink" />
            <FormControlLabel value="2" control={<Radio />} label="Purple" />
            <FormControlLabel value="3" control={<Radio />} label="Blue" />
          </RadioGroup>
          <Box
            sx={{
              mt: 2,
              height: 200,
              border: "1px solid #000000",
              position: "relative",
            }}
          >
            <Chip
              label="Live demo"
              icon={<VisibilityIcon fontSize="small" />}
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
              }}
            />
            <Box
              onClick={() => setIsBannerVisible((prevState) => !prevState)}
              sx={{
                position: "absolute",
                bottom: isBannerVisible ? 120 : 0,
                right: 20,
                background: "#f4f4f4",
                cursor: "pointer",
                width: 50,
                border: "1px solid #e0e0e0",
                borderBottom: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
              }}
            >
              {isBannerVisible ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 480,
                px: 2,
                maxWidth: "100%",
                height: isBannerVisible ? 120 : 0,
                ...bannerStyles[bannerStyle],
                overflow: "hidden",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Link
                href={bannerLink}
                rel="noopener noreferrer nofollow"
                target="_blank"
                variant="h5"
                sx={{
                  display: "block",
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textDecoration: "none",
                }}
                color={bannerStyle === 3 ? "#ffffff" : "#000000"}
              >
                {bannerTitle.slice(0, BANNER_TITLE_LIMIT).trim()}
              </Link>
              <Link
                href={bannerLink}
                rel="noopener noreferrer nofollow"
                target="_blank"
                variant="body1"
                sx={{
                  display: "block",
                  maxHeight: 48,
                  width: "100%",
                  overflow: "hidden",
                  textDecoration: "none",
                }}
                color={bannerStyle === 3 ? "#ffffff" : "#000000"}
              >
                {bannerDescription.slice(0, BANNER_DESCRIPTION_LIMIT).trim()}
              </Link>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCustomizationSubmit}>Save</Button>
          <Button onClick={handleCustomizeDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
      {rows.length > 0 ? (
        <Box sx={{ width: "100%", my: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography id="userTitle" variant="h5" component="h2">
              My domains
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="text"
              onClick={handleClickOpen}
            >
              Add domain
            </Button>
          </Box>
          <Paper sx={{ mt: 2 }}>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <EnhancedTableHead />
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`

                      return (
                        <TableRow role="checkbox" tabIndex={-1} key={row.id}>
                          <TableCell component="th" id={labelId} scope="row">
                            {row.domain}
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={row.trafficIncoming}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                handleTrafficIncomingChange(row.id, event)
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={row.trafficOutgoing}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                handleTrafficOutgoingChange(row.id, event)
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Customize banner">
                              <IconButton
                                onClick={() => {
                                  setCustomizableId(row.id)
                                  setDomain(row.domain)
                                  setIsHttps(row.isHttps ?? false)
                                  setBannerTitle(row?.title ?? "")
                                  setBannerDescription(row?.description ?? "")
                                  setBannerStyle(row?.style ?? 1)
                                  handleCustomizeDialogOpen()
                                }}
                              >
                                <AutoFixHighIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Get code snippet">
                              <IconButton
                                onClick={() => {
                                  setDomain(row.domain)
                                  handleSnippetDialogOpen()
                                }}
                              >
                                <CodeIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete domain">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteDomain(row.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: 53 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      ) : (
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 10,
          }}
        >
          <InboxIcon color="disabled" fontSize="large" sx={{ mb: 2 }} />
          <Typography component="div" gutterBottom variant="h6">
            You don&apos;t have domains
          </Typography>
          <Typography color="text.secondary">
            Add a new domain to set up ads and start earning
          </Typography>
          <Button
            size="large"
            startIcon={<AddIcon />}
            variant="contained"
            type="submit"
            onClick={handleClickOpen}
            sx={{ mt: 2 }}
          >
            New domain
          </Button>
        </Container>
      )}
    </>
  )
}

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import { ChangeEvent, useRef, useState } from "react"
import { Code as CodeIcon, Delete as DeleteIcon } from "@mui/icons-material"

import AddIcon from "@mui/icons-material/Add"
import { Domain } from "pages/dashboard"
import InboxIcon from "@mui/icons-material/Inbox"
import { useSnackbar } from "material-ui-snackbar-provider"

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
  handleEditDomain: (id: string, updates: object) => void
}

export default function DomainsTable(props: DomainTableProps) {
  const { rows, handleClickOpen, handleDeleteDomain, handleEditDomain } = props
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [domain, setDomain] = useState("")
  const [snippetDialogIsOpen, setSnippetDialogIsOpen] = useState(false)
  const snackbar = useSnackbar()
  const refSnippet = useRef<HTMLDivElement>(null)

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

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
                            <Tooltip title="Code snippet">
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

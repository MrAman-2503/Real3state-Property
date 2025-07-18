const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const excelFile = 'inquiries.xlsx';

// Initialize Excel file with headers if not exists
function initializeExcel() {
  if (!fs.existsSync(excelFile)) {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ['Timestamp', 'Name', 'Email', 'Message']
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Inquiries');
    XLSX.writeFile(wb, excelFile);
  }
}

initializeExcel();

app.post('/submit-inquiry', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const wb = XLSX.readFile(excelFile);
    const ws = wb.Sheets['Inquiries'];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const timestamp = new Date().toISOString();
    data.push([timestamp, name, email, message]);
    const newWs = XLSX.utils.aoa_to_sheet(data);
    wb.Sheets['Inquiries'] = newWs;
    XLSX.writeFile(wb, excelFile);
    res.json({ message: 'Inquiry saved successfully' });
  } catch (error) {
    console.error('Error saving inquiry:', error);
    res.status(500).json({ error: 'Failed to save inquiry' });
  }
});

app.listen(port, () => {
  console.log(`Inquiry backend server running at http://localhost:${port}`);
});

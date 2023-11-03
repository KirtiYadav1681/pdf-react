const mongoose = require('mongoose');

const pdfDetailSchema = new mongoose.Schema({
    pdf:String,
    title:String,
},
{collection : 'PdfDetails'}
);

mongoose.model("PdfDetails", pdfDetailSchema);

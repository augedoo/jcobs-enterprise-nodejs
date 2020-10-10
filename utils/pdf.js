const colors = require('colors');

const companyName = 'J-Cobs Enterprise',
  slogan = 'We give you the best experience in online shopping',
  invoiceDate = new Date().toDateString(),
  invoiceID = '123-45506',
  userName = 'Augustine Amoh Nkansah',
  tel = '0302905956 / 0544662431',
  thankYouMessage = 'Thanks for your patronization.';

exports.generateOrderInvoicePdf = (doc, products, orderDate) => {
  //=====================
  //  * SVGS
  //=====================
  // Grey Underline
  doc
    .moveTo(47.64, 200)
    .lineTo(547.64, 200)
    .lineWidth(0.5)
    .fill('#DDDDDD')
    .moveDown(1); //line
  doc
    .moveTo(47.64, 390)
    .lineTo(547.64, 390)
    .lineWidth(0.5)
    .fill('#DDDDDD')
    .moveDown(1); //line

  //=====================
  //  * Main Content
  //=====================
  // Company name heading
  doc
    .font('Helvetica-Bold')
    .fillColor('#333')
    .fontSize(24)
    .text('J-C', {
      continued: true,
      baseline: 'alphabetic',
    })
    .fontSize(20)
    .text('OBS', {
      continued: true,
      baseline: 'alphabetic',
    })
    .fillColor('#218896')
    .text(' ENTERPRISE', {
      continued: true,
      baseline: 'alphabetic',
    })
    .fillColor('#000')
    .fontSize(16)
    .text(`INVOICE`, {
      align: 'right',
      underline: true,
    })
    .moveDown(0.5);

  // Invoice meta info
  doc
    .fontSize(10)
    .fillColor('#333')
    .font('Helvetica')
    .text(`Invoice #: ${invoiceID}`, {
      align: 'right',
    })
    .moveDown(0.15);
  doc.text(`Invoice Date: ${invoiceDate}`, {
    align: 'right',
  });
  doc
    .text(`Date Ordered: ${new Date().toDateString(orderDate)}`, {
      align: 'right',
    })
    .moveDown(5);

  // Provider and receiver info.
  doc
    .fillColor('#333')
    .font('Helvetica-Bold')
    .fontSize(14)
    .text('Provided by:', {
      align: 'left',
      continued: true,
    })
    .text('Provided to:', {
      align: 'right',
    })
    .moveDown(0.35);
  doc
    .fillColor('#000')
    .font('Helvetica')
    .fontSize(10)
    .text(`${companyName}`, {
      continued: true,
    })
    .text(`${userName}`, {
      align: 'right',
    })
    .moveDown(0.35);
  // Location
  doc.text('Kimberly Ave.').moveDown(0.35);
  doc.text('Nii Nortey Nyandi Street.').moveDown(0.35);
  doc.text('Dzorwuly.').moveDown(0.35);
  doc.text('Accra, Ghana.').moveDown(0.35);
  doc.text(`${tel}`);

  doc.moveDown(4.25);

  // List Heading
  let yPos = doc.y;
  doc
    .rect(42.64, yPos - 12.5, 510, 30)
    .fill('#F8F8F8')
    .font('Helvetica-Bold')
    .fillColor('#555555')
    .fontSize(10)
    .text(`DESCRIPTION`, (x = 47.64), (y = yPos), {
      width: 200,
      height: 30,
      ellipsis: true,
    })
    .text(`QUANTITY`, (x = 300), (y = yPos))
    .text(`PRICE`, (x = 400), (y = yPos))
    .text(`AMOUNT`, (x = 500), (y = yPos), { align: 'right' });

  // doc.font('Helvetica');

  // List Items
  yPos += 30;
  products.forEach((p, index) => {
    doc
      .text(`${p.title}`, (x = 47.64), (y = yPos), {
        width: 200,
        height: 30,
        ellipsis: true,
      })
      .text(`${p.quantity}`, (x = 300), (y = yPos))
      .text(`${parseInt(p.price).toFixed(2)}`, (x = 400), (y = yPos))
      .text(
        `${parseInt(p.price * p.quantity).toFixed(2)}`,
        (x = 500),
        (y = yPos),
        {
          align: 'right',
        }
      );

    const breakpoints = [8, 25, 42, 59, 76, 93, 110, 127, 144, 161, 178, 195]; // Create new pages according to this items list lengths. To add more, just keep on adding 17 to the last number provided.

    if (breakpoints.includes(index)) {
      doc.addPage({
        info: {
          title: 'JCobs Enterprise Invoice',
          author: 'JCobs Enterprise',
        },
        permissions: {
          printing: 'highResolution',
        },
        pdfVersion: '1.6',
        layout: 'portrait',
        size: [595.28, 841.89],
        margins: {
          top: 72,
          bottom: 72,
          left: 47.64,
          right: 47.64,
        },
      });
    }
    doc.on('pageAdded', () => (yPos = 40));

    yPos += 40;
  });

  // Total Amount
  doc
    .rect(42.64, yPos, 510, 30)
    .fill('#eee')
    .font('Helvetica-Bold')
    .fillColor('#555')
    .text(`TOTAL`, (x = 400), (y = yPos + 12))
    .text(
      `${parseInt(
        products
          .map((p) => p.quantity * p.price)
          .reduce((sum, current) => sum + current, 0),
        0
      ).toFixed(2)}`,
      (x = 500),
      (y = yPos + 12),
      {
        align: 'right',
      }
    );

  doc.moveDown(1);

  doc
    .rect(42.64, yPos + 35, 510, 100)
    .fill('#E6E6E6')
    .font('Courier-Bold')
    .fillColor('#1A1A1A')
    .fontSize(20)
    .text(`${thankYouMessage}`, (x = 100), (y = yPos + 75), {
      align: 'center',
      width: 400,
    });

  doc.moveDown();
  doc.end();
};

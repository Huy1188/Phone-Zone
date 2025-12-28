import PDFDocument from 'pdfkit';

function formatMoney(n) {
    const num = Number(n || 0);
    return num.toLocaleString('vi-VN');
}

export function generateInvoicePdf(res, payload) {
    const { order, user, details } = payload;

    // headers để browser hiểu đây là file PDF tải về
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-order-${order.order_id}.pdf"`);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    doc.pipe(res);

    // ===== HEADER =====
    doc.fontSize(18).text('HOA DON BAN HANG', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Ma don: #${order.order_id}`);
    doc.text(`Ngay: ${new Date(order.createdAt).toLocaleString('vi-VN')}`);
    doc.moveDown(0.5);

    // ===== SHOP INFO (tuỳ bạn chỉnh) =====
    doc.fontSize(12).text('Phone Zone');
    doc.fontSize(10).text(`Dia chi: ${order.shipping_address || 'N/A'}`);
    doc.text('Hotline: ...');
    doc.moveDown();

    // ===== CUSTOMER =====
    doc.fontSize(12).text('Thong tin khach hang', { underline: true });
    const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
    doc.fontSize(10).text(`Ten: ${fullName || 'N/A'}`);
    doc.text(`Email: ${user?.email || 'N/A'}`);
    doc.text(`So dien thoai: ${user?.phone || 'N/A'}`);
    doc.text(`Dia chi: ${order?.shipping_address || 'N/A'}`);
    doc.moveDown();

    // ===== TABLE HEADER =====
    doc.fontSize(12).text('Chi tiet don hang', { underline: true });
    doc.moveDown(0.5);

    const startX = 40;
    let y = doc.y;

    // cột
    const col = {
        name: startX,
        price: startX + 260,
        qty: startX + 360,
        total: startX + 430,
    };

    doc.fontSize(10).text('San pham', col.name, y);
    doc.text('Don gia', col.price, y);
    doc.text('SL', col.qty, y);
    doc.text('Thanh tien', col.total, y);
    y += 16;

    doc.moveTo(startX, y).lineTo(555, y).stroke();
    y += 8;

    // ===== TABLE ROWS =====
    let computedTotal = 0;

    details.forEach((it) => {
        const name =
            it?.product_name || // ✅ snapshot từ OrderDetail
            it?.variant?.product?.name || // ✅ fallback từ quan hệ variant -> product
            it?.variant?.sku || // fallback cuối
            `San pham #${it.variant_id || ''}`;

        const variantLabelParts = [];
        if (it?.variant?.color) variantLabelParts.push(it.variant.color);
        if (it?.variant?.rom) variantLabelParts.push(it.variant.rom);
        const variantLabel = variantLabelParts.join(' - ');

        const displayName = variantLabel ? `${name} (${variantLabel})` : name;

        const price = Number(it.price || it.unit_price || 0);
        const qty = Number(it.quantity || 0);
        const lineTotal = price * qty;
        computedTotal += lineTotal;

        doc.fontSize(10).text(String(displayName), col.name, y, { width: 250 });
        doc.text(`${formatMoney(price)} đ`, col.price, y);
        doc.text(String(qty), col.qty, y);
        doc.text(`${formatMoney(lineTotal)} đ`, col.total, y);

        y += 18;

        // nếu xuống gần cuối trang thì add page
        if (y > 760) {
            doc.addPage();
            y = 40;
        }
    });

    doc.moveDown();
    doc.moveTo(startX, y).lineTo(555, y).stroke();
    y += 12;

    // ===== TOTALS =====
    const grandTotal = order.total_money != null ? Number(order.total_money) : computedTotal;

    doc.fontSize(12).text(`Tong cong: ${formatMoney(grandTotal)} đ`, startX, y, {
        align: 'right',
        width: 515,
    });
    y += 22;

    doc.fontSize(10).text(`Trang thai: ${String(order.status || '').toUpperCase()}`, startX, y);

    doc.end();
}

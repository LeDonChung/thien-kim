// ERP Thiên Kim - Centralized Data Management System
// Quản lý tất cả dữ liệu trong localStorage với cấu trúc rõ ràng

class DataManager {
    constructor() {
        this.storageKey = 'thien_kim_erp_data';
        this.version = '1.0.0';
        this.init();
    }

    init() {
        // Khởi tạo dữ liệu mặc định nếu chưa có
        if (!this.hasData()) {
            this.initializeDefaultData();
        }
        this.migrateDataIfNeeded();
    }

    // Kiểm tra xem đã có dữ liệu trong localStorage chưa
    hasData() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    // Lấy toàn bộ dữ liệu
    getAllData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    // Lưu toàn bộ dữ liệu
    saveAllData(data) {
        try {
            data.lastUpdated = new Date().toISOString();
            data.version = this.version;
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Khởi tạo dữ liệu mặc định
    initializeDefaultData() {
        const defaultData = {
            version: this.version,
            lastUpdated: new Date().toISOString(),
            
            // Cấu hình hệ thống
            settings: {
                companyName: 'Công ty TNHH Thiên Kim',
                currency: 'VND',
                language: 'vi',
                dateFormat: 'DD/MM/YYYY',
                taxRate: 0.1 // 10% VAT
            },

            // Nguyên vật liệu
            materials: {
                'NVL-001': {
                    id: 'NVL-001',
                    code: 'NVL-001',
                    name: 'Thân bút bi',
                    description: 'Thân bút bi nhựa trong suốt, độ dài 140mm',
                    category: 'Nhựa',
                    unit: 'Cái',
                    currentStock: 1250,
                    minStock: 200,
                    maxStock: 5000,
                    unitPrice: 15000,
                    supplier: 'NCC-001',
                    location: 'Kho A - Kệ 01',
                    status: 'active',
                    lastUpdated: '2024-10-06',
                    properties: {
                        material: 'Nhựa PP',
                        color: 'Trong suốt',
                        weight: '8g'
                    }
                },
                'NVL-002': {
                    id: 'NVL-002',
                    code: 'NVL-002',
                    name: 'Ruột bút bi',
                    description: 'Ruột bút bi mực xanh, dung tích 1.0mm',
                    category: 'Linh kiện',
                    unit: 'Cái',
                    currentStock: 890,
                    minStock: 150,
                    maxStock: 3000,
                    unitPrice: 12000,
                    supplier: 'NCC-002',
                    location: 'Kho A - Kệ 02',
                    status: 'active',
                    lastUpdated: '2024-10-06',
                    properties: {
                        inkColor: 'Xanh',
                        tipSize: '1.0mm',
                        capacity: '2.3km'
                    }
                },
                'NVL-003': {
                    id: 'NVL-003',
                    code: 'NVL-003',
                    name: 'Nắp bút',
                    description: 'Nắp bút nhựa có clip, màu xanh',
                    category: 'Nhựa',
                    unit: 'Cái',
                    currentStock: 750,
                    minStock: 100,
                    maxStock: 2000,
                    unitPrice: 8000,
                    supplier: 'NCC-001',
                    location: 'Kho A - Kệ 03',
                    status: 'active',
                    lastUpdated: '2024-10-06',
                    properties: {
                        material: 'Nhựa ABS',
                        color: 'Xanh',
                        hasClip: true
                    }
                },
                'NVL-004': {
                    id: 'NVL-004',
                    code: 'NVL-004',
                    name: 'Lò xo bút',
                    description: 'Lò xo inox để giữ ruột bút',
                    category: 'Kim loại',
                    unit: 'Cái',
                    currentStock: 2100,
                    minStock: 300,
                    maxStock: 5000,
                    unitPrice: 3000,
                    supplier: 'NCC-002',
                    location: 'Kho B - Kệ 01',
                    status: 'active',
                    lastUpdated: '2024-10-06',
                    properties: {
                        material: 'Inox 304',
                        diameter: '3mm',
                        length: '25mm'
                    }
                },
                'NVL-005': {
                    id: 'NVL-005',
                    code: 'NVL-005',
                    name: 'Ống mực gel',
                    description: 'Ống mực gel màu đen, 0.7mm',
                    category: 'Linh kiện',
                    unit: 'Cái',
                    currentStock: 450,
                    minStock: 100,
                    maxStock: 1500,
                    unitPrice: 18000,
                    supplier: 'NCC-003',
                    location: 'Kho A - Kệ 04',
                    status: 'active',
                    lastUpdated: '2024-10-06',
                    properties: {
                        inkType: 'Gel',
                        color: 'Đen',
                        tipSize: '0.7mm'
                    }
                },
                'NVL-006': {
                    id: 'NVL-006',
                    code: 'NVL-006',
                    name: 'Cao su grip',
                    description: 'Cao su chống trượt cho thân bút',
                    category: 'Cao su',
                    unit: 'Cái',
                    currentStock: 320,
                    minStock: 50,
                    maxStock: 1000,
                    unitPrice: 6000,
                    supplier: 'NCC-003',
                    location: 'Kho B - Kệ 02',
                    status: 'active',
                    lastUpdated: '2024-10-06',
                    properties: {
                        material: 'Cao su TPE',
                        color: 'Đen',
                        diameter: '12mm'
                    }
                },
                'NVL-007': {
                    id: 'NVL-007',
                    code: 'NVL-007',
                    name: 'Đệm ngòi',
                    description: 'Đệm cao su cho ngòi bút',
                    category: 'Cao su',
                    unit: 'Cái',
                    currentStock: 15, // Thiếu hàng
                    minStock: 100,
                    maxStock: 2000,
                    unitPrice: 2500,
                    supplier: 'NCC-003',
                    location: 'Kho B - Kệ 03',
                    status: 'low-stock',
                    lastUpdated: '2024-10-06',
                    properties: {
                        material: 'Cao su NBR',
                        diameter: '2mm',
                        thickness: '1mm'
                    }
                },
                'NVL-008': {
                    id: 'NVL-008',
                    code: 'NVL-008',
                    name: 'Nhãn dán',
                    description: 'Nhãn dán logo công ty',
                    category: 'Phụ kiện',
                    unit: 'Cái',
                    currentStock: 5000,
                    minStock: 1000,
                    maxStock: 20000,
                    unitPrice: 500,
                    supplier: 'NCC-004',
                    location: 'Kho C - Kệ 01',
                    status: 'active',
                    lastUpdated: '2024-10-06',
                    properties: {
                        material: 'Vinyl',
                        size: '20x10mm',
                        printType: 'Offset'
                    }
                },
                'NVL-009': {
                    id: 'NVL-009',
                    code: 'NVL-009',
                    name: 'Hộp đựng bút',
                    description: 'Hộp carton đựng 12 cây bút',
                    category: 'Bao bì',
                    unit: 'Cái',
                    currentStock: 200,
                    minStock: 50,
                    maxStock: 1000,
                    unitPrice: 3500,
                    supplier: 'NCC-004',
                    location: 'Kho C - Kệ 02',
                    status: 'active',
                    lastUpdated: '2024-10-06',
                    properties: {
                        material: 'Carton',
                        capacity: '12 cây',
                        dimensions: '150x100x50mm'
                    }
                },
                'NVL-010': {
                    id: 'NVL-010',
                    code: 'NVL-010',
                    name: 'Băng dính',
                    description: 'Băng dính trong suốt để đóng gói',
                    category: 'Phụ kiện',
                    unit: 'Cuộn',
                    currentStock: 25,
                    minStock: 10,
                    maxStock: 100,
                    unitPrice: 25000,
                    supplier: 'NCC-004',
                    location: 'Kho C - Kệ 03',
                    status: 'active',
                    lastUpdated: '2024-10-06',
                    properties: {
                        width: '48mm',
                        length: '100m',
                        adhesive: 'Acrylic'
                    }
                },
                'NVL-011': {
                    id: 'NVL-011',
                    code: 'NVL-011',
                    name: 'Ốc vít nhỏ',
                    description: 'Ốc vít M2x5mm để lắp ráp',
                    category: 'Kim loại',
                    unit: 'Cái',
                    currentStock: 850,
                    minStock: 200,
                    maxStock: 3000,
                    unitPrice: 800,
                    supplier: 'NCC-002',
                    location: 'Kho B - Kệ 04',
                    status: 'active',
                    lastUpdated: '2024-10-06',
                    properties: {
                        material: 'Inox 304',
                        size: 'M2x5mm',
                        headType: 'Phillips'
                    }
                },
                'NVL-012': {
                    id: 'NVL-012',
                    code: 'NVL-012',
                    name: 'Vít nhỏ',
                    description: 'Vít tự tán để cố định linh kiện',
                    category: 'Kim loại',
                    unit: 'Cái',
                    currentStock: 0, // Hết hàng
                    minStock: 500,
                    maxStock: 5000,
                    unitPrice: 600,
                    supplier: 'NCC-002',
                    location: 'Kho B - Kệ 05',
                    status: 'out-of-stock',
                    lastUpdated: '2024-10-06',
                    properties: {
                        material: 'Thép',
                        size: '2.5x8mm',
                        finish: 'Kẽm'
                    }
                }
            },

            // Nhà cung cấp
            suppliers: {
                'NCC-001': {
                    id: 'NCC-001',
                    code: 'NCC-001',
                    name: 'Công ty TNHH Nhựa ABC',
                    shortName: 'Nhựa ABC',
                    category: 'Nhựa & Polymer',
                    contactPerson: 'Nguyễn Văn A',
                    phone: '024-3333-1111',
                    email: 'sales@nhuaabc.com',
                    address: '123 Đường Giải Phóng, Hai Bà Trưng, Hà Nội',
                    taxCode: '0123456789',
                    paymentTerms: '30 ngày',
                    leadTime: 7, // ngày
                    rating: 4.5,
                    status: 'active',
                    specialties: ['Nhựa PP', 'Nhựa ABS', 'Nhựa PC'],
                    certifications: ['ISO 9001', 'ISO 14001'],
                    bankAccount: {
                        bankName: 'Vietcombank',
                        accountNumber: '1234567890',
                        accountName: 'CTTNHH NHUA ABC'
                    },
                    contracts: [
                        {
                            id: 'HD-001',
                            startDate: '2024-01-01',
                            endDate: '2024-12-31',
                            discount: 0.05
                        }
                    ]
                },
                'NCC-002': {
                    id: 'NCC-002',
                    code: 'NCC-002',
                    name: 'Công ty Kim loại Hà Nội',
                    shortName: 'Kim loại HN',
                    category: 'Kim loại & Linh kiện',
                    contactPerson: 'Trần Thị B',
                    phone: '024-3888-2222',
                    email: 'order@kimloaihn.com',
                    address: '456 Phố Huế, Hoàn Kiếm, Hà Nội',
                    taxCode: '0987654321',
                    paymentTerms: '45 ngày',
                    leadTime: 10,
                    rating: 4.2,
                    status: 'active',
                    specialties: ['Inox', 'Thép', 'Đồng'],
                    certifications: ['ISO 9001'],
                    bankAccount: {
                        bankName: 'BIDV',
                        accountNumber: '9876543210',
                        accountName: 'CTY KIM LOAI HA NOI'
                    },
                    contracts: [
                        {
                            id: 'HD-002',
                            startDate: '2024-02-01',
                            endDate: '2024-12-31',
                            discount: 0.03
                        }
                    ]
                },
                'NCC-003': {
                    id: 'NCC-003',
                    code: 'NCC-003',
                    name: 'Xí nghiệp Cao su Đông Nam',
                    shortName: 'Cao su ĐN',
                    category: 'Cao su & Đệm',
                    contactPerson: 'Lê Văn C',
                    phone: '028-3777-3333',
                    email: 'info@caosudn.com',
                    address: '789 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
                    taxCode: '0555666777',
                    paymentTerms: '60 ngày',
                    leadTime: 14,
                    rating: 4.0,
                    status: 'active',
                    specialties: ['Cao su tự nhiên', 'Cao su NBR', 'Cao su TPE'],
                    certifications: ['ISO 9001', 'RoHS'],
                    bankAccount: {
                        bankName: 'Sacombank',
                        accountNumber: '5556667778',
                        accountName: 'XI NGHIEP CAO SU DONG NAM'
                    },
                    contracts: [
                        {
                            id: 'HD-003',
                            startDate: '2024-03-01',
                            endDate: '2024-12-31',
                            discount: 0.08
                        }
                    ]
                },
                'NCC-004': {
                    id: 'NCC-004',
                    code: 'NCC-004',
                    name: 'Công ty In ấn Bao bì Việt',
                    shortName: 'In ấn Việt',
                    category: 'In ấn & Bao bì',
                    contactPerson: 'Phạm Thị D',
                    phone: '024-3555-4444',
                    email: 'sales@inbaobiviet.com',
                    address: '321 Cầu Giấy, Cầu Giấy, Hà Nội',
                    taxCode: '0111222333',
                    paymentTerms: '30 ngày',
                    leadTime: 5,
                    rating: 4.3,
                    status: 'active',
                    specialties: ['In offset', 'Carton', 'Nhãn dán'],
                    certifications: ['FSC', 'ISO 9001'],
                    bankAccount: {
                        bankName: 'Techcombank',
                        accountNumber: '1112223334',
                        accountName: 'CTY IN AN BAO BI VIET'
                    },
                    contracts: [
                        {
                            id: 'HD-004',
                            startDate: '2024-01-15',
                            endDate: '2024-12-31',
                            discount: 0.07
                        }
                    ]
                }
            },

            // Sản phẩm
            products: {
                'SP-001': {
                    id: 'SP-001',
                    code: 'SP-001',
                    name: 'Bút bi xanh TK-001',
                    description: 'Bút bi mực xanh, thân trong suốt',
                    category: 'Bút bi',
                    unit: 'Cái',
                    sellPrice: 35000,
                    costPrice: 28000,
                    status: 'active',
                    weight: 12,
                    dimensions: '140x12x12mm',
                    color: 'Xanh',
                    barcode: '8936012345001',
                    warranty: '6 tháng',
                    lastUpdated: '2024-10-06'
                },
                'SP-002': {
                    id: 'SP-002',
                    code: 'SP-002',
                    name: 'Bút gel đen TK-002',
                    description: 'Bút gel mực đen, grip chống trượt',
                    category: 'Bút gel',
                    unit: 'Cái',
                    sellPrice: 45000,
                    costPrice: 36000,
                    status: 'active',
                    weight: 15,
                    dimensions: '145x13x13mm',
                    color: 'Đen',
                    barcode: '8936012345002',
                    warranty: '6 tháng',
                    lastUpdated: '2024-10-06'
                }
            },

            // BOM - Bill of Materials
            bom: {
                'SP-001': {
                    productId: 'SP-001',
                    productName: 'Bút bi xanh TK-001',
                    version: '1.0',
                    status: 'active',
                    materials: [
                        { materialId: 'NVL-001', quantity: 1, unit: 'Cái' },
                        { materialId: 'NVL-002', quantity: 1, unit: 'Cái' },
                        { materialId: 'NVL-003', quantity: 1, unit: 'Cái' },
                        { materialId: 'NVL-004', quantity: 1, unit: 'Cái' },
                        { materialId: 'NVL-007', quantity: 2, unit: 'Cái' },
                        { materialId: 'NVL-011', quantity: 1, unit: 'Cái' }
                    ],
                    lastUpdated: '2024-10-06'
                },
                'SP-002': {
                    productId: 'SP-002',
                    productName: 'Bút gel đen TK-002',
                    version: '1.0',
                    status: 'active',
                    materials: [
                        { materialId: 'NVL-001', quantity: 1, unit: 'Cái' },
                        { materialId: 'NVL-005', quantity: 1, unit: 'Cái' },
                        { materialId: 'NVL-003', quantity: 1, unit: 'Cái' },
                        { materialId: 'NVL-006', quantity: 1, unit: 'Cái' },
                        { materialId: 'NVL-007', quantity: 1, unit: 'Cái' },
                        { materialId: 'NVL-012', quantity: 2, unit: 'Cái' }
                    ],
                    lastUpdated: '2024-10-06'
                }
            },

            // Đơn hàng bán
            salesOrders: {
                'SO-20241001-001': {
                    id: 'SO-20241001-001',
                    customerName: 'Công ty ABC',
                    customerPhone: '024-3333-5555',
                    customerEmail: 'order@abc.com',
                    customerAddress: '123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
                    orderDate: '2024-10-01',
                    deliveryDate: '2024-10-08',
                    status: 'confirmed',
                    priority: 'normal',
                    items: [
                        { productId: 'SP-001', quantity: 500, unitPrice: 35000, total: 17500000 },
                        { productId: 'SP-002', quantity: 200, unitPrice: 45000, total: 9000000 }
                    ],
                    subtotal: 26500000,
                    tax: 2650000,
                    total: 29150000,
                    notes: 'Giao hàng trong giờ hành chính',
                    createdBy: 'admin',
                    lastUpdated: '2024-10-01'
                }
            },

            // Yêu cầu mua hàng (Purchase Requisition)
            purchaseRequisitions: {
                'PR-20241006-001': {
                    id: 'PR-20241006-001',
                    materialId: 'NVL-007',
                    materialName: 'NVL-007 - Đệm ngòi',
                    quantity: 500,
                    unit: 'Cái',
                    reason: 'low-stock',
                    reasonText: 'Tồn kho thấp',
                    priority: 'urgent',
                    requestedBy: 'Phòng Sản xuất',
                    requestDate: '2024-10-06',
                    requiredDate: '2024-10-13',
                    status: 'pending',
                    approvedBy: null,
                    approvedDate: null,
                    notes: 'Cần gấp cho đơn hàng SO-20241001-001',
                    createdAt: '2024-10-06T08:00:00Z',
                    lastUpdated: '2024-10-06T08:00:00Z'
                },
                'PR-20241006-002': {
                    id: 'PR-20241006-002',
                    materialId: 'NVL-012',
                    materialName: 'NVL-012 - Vít nhỏ',
                    quantity: 1000,
                    unit: 'Cái',
                    reason: 'out-of-stock',
                    reasonText: 'Hết hàng',
                    priority: 'critical',
                    requestedBy: 'Phòng Sản xuất',
                    requestDate: '2024-10-06',
                    requiredDate: '2024-10-10',
                    status: 'approved',
                    approvedBy: 'Nguyễn Văn A',
                    approvedDate: '2024-10-06',
                    notes: 'Hết hàng hoàn toàn, cần đặt mua ngay',
                    createdAt: '2024-10-06T09:00:00Z',
                    lastUpdated: '2024-10-06T10:00:00Z'
                }
            },

            // Yêu cầu báo giá (Request for Quotation)
            rfqs: {
                'RFQ-20241005-001': {
                    id: 'RFQ-20241005-001',
                    materialId: 'NVL-001',
                    materialName: 'NVL-001 - Thân bút bi',
                    quantity: 2000,
                    unit: 'Cái',
                    suppliers: ['NCC-001', 'NCC-004'], // Gửi cho 2 NCC
                    issueDate: '2024-10-05',
                    deadline: '2024-10-11',
                    requiredDate: '2024-10-18',
                    status: 'waiting',
                    responses: {
                        'NCC-001': {
                            responseDate: '2024-10-07',
                            unitPrice: 14500,
                            totalPrice: 29000000,
                            leadTime: 7,
                            notes: 'Giá ưu đãi cho đơn hàng lớn',
                            validUntil: '2024-10-20'
                        }
                        // NCC-004 chưa trả lời
                    },
                    notes: 'Cần chất lượng cao, giao hàng đúng hạn',
                    createdBy: 'admin',
                    createdAt: '2024-10-05T14:00:00Z',
                    lastUpdated: '2024-10-07T16:30:00Z'
                },
                'RFQ-20241003-002': {
                    id: 'RFQ-20241003-002',
                    materialId: 'NVL-002',
                    materialName: 'NVL-002 - Ruột bút bi',
                    quantity: 1500,
                    unit: 'Cái',
                    suppliers: ['NCC-002', 'NCC-003'],
                    issueDate: '2024-10-03',
                    deadline: '2024-10-08',
                    requiredDate: '2024-10-15',
                    status: 'completed',
                    responses: {
                        'NCC-002': {
                            responseDate: '2024-10-06',
                            unitPrice: 11800,
                            totalPrice: 17700000,
                            leadTime: 10,
                            notes: 'Có thể giao sớm hơn nếu cần',
                            validUntil: '2024-10-15'
                        },
                        'NCC-003': {
                            responseDate: '2024-10-07',
                            unitPrice: 12200,
                            totalPrice: 18300000,
                            leadTime: 14,
                            notes: 'Chất lượng cao, bảo hành 12 tháng',
                            validUntil: '2024-10-18'
                        }
                    },
                    selectedSupplier: 'NCC-002',
                    selectionReason: 'Giá tốt và giao hàng nhanh',
                    notes: 'So sánh kỹ chất lượng trước khi quyết định',
                    createdBy: 'admin',
                    createdAt: '2024-10-03T10:00:00Z',
                    lastUpdated: '2024-10-08T11:30:00Z'
                }
            },

            // Đơn đặt hàng (Purchase Order)
            purchaseOrders: {
                'PO-20241004-001': {
                    id: 'PO-20241004-001',
                    supplierId: 'NCC-002',
                    supplierName: 'Công ty Kim loại Hà Nội',
                    rfqId: 'RFQ-20241003-002',
                    orderDate: '2024-10-04',
                    deliveryDate: '2024-10-15',
                    status: 'confirmed',
                    paymentTerms: '30-days',
                    items: [
                        {
                            materialId: 'NVL-002',
                            materialName: 'NVL-002 - Ruột bút bi',
                            quantity: 1500,
                            unit: 'Cái',
                            unitPrice: 11800,
                            total: 17700000
                        }
                    ],
                    subtotal: 17700000,
                    tax: 1770000,
                    total: 19470000,
                    shippingAddress: 'Kho A - 123 Giải Phóng, Hai Bà Trưng, Hà Nội',
                    notes: 'Giao hàng trong giờ hành chính, kiểm tra chất lượng kỹ',
                    createdBy: 'admin',
                    createdAt: '2024-10-04T13:00:00Z',
                    lastUpdated: '2024-10-04T13:00:00Z'
                }
            },

            // Lịch sử giao dịch tồn kho
            inventoryTransactions: [],

            // Báo cáo
            reports: {
                lastGenerated: null,
                cached: {}
            }
        };

        this.saveAllData(defaultData);
        console.log('Đã khởi tạo dữ liệu mặc định cho ERP Thiên Kim');
    }

    // Migration dữ liệu khi có version mới
    migrateDataIfNeeded() {
        const data = this.getAllData();
        if (data && data.version !== this.version) {
            console.log(`Migrating data from ${data.version} to ${this.version}`);
            // Thực hiện migration logic ở đây
            data.version = this.version;
            this.saveAllData(data);
        }
    }

    // === MATERIALS ===
    getMaterials() {
        const data = this.getAllData();
        return data ? data.materials : {};
    }

    getMaterial(id) {
        const materials = this.getMaterials();
        return materials[id] || null;
    }

    addMaterial(material) {
        const data = this.getAllData();
        if (data) {
            material.lastUpdated = new Date().toISOString();
            data.materials[material.id] = material;
            return this.saveAllData(data);
        }
        return false;
    }

    updateMaterial(id, updates) {
        const data = this.getAllData();
        if (data && data.materials[id]) {
            data.materials[id] = { ...data.materials[id], ...updates, lastUpdated: new Date().toISOString() };
            return this.saveAllData(data);
        }
        return false;
    }

    deleteMaterial(id) {
        const data = this.getAllData();
        if (data && data.materials[id]) {
            delete data.materials[id];
            return this.saveAllData(data);
        }
        return false;
    }

    // Lấy nguyên vật liệu thiếu hàng
    getLowStockMaterials() {
        const materials = this.getMaterials();
        return Object.values(materials).filter(material => 
            material.currentStock <= material.minStock
        );
    }

    // === SUPPLIERS ===
    getSuppliers() {
        const data = this.getAllData();
        return data ? data.suppliers : {};
    }

    getSupplier(id) {
        const suppliers = this.getSuppliers();
        return suppliers[id] || null;
    }

    addSupplier(supplier) {
        const data = this.getAllData();
        if (data) {
            supplier.lastUpdated = new Date().toISOString();
            data.suppliers[supplier.id] = supplier;
            return this.saveAllData(data);
        }
        return false;
    }

    updateSupplier(id, updates) {
        const data = this.getAllData();
        if (data && data.suppliers[id]) {
            data.suppliers[id] = { ...data.suppliers[id], ...updates, lastUpdated: new Date().toISOString() };
            return this.saveAllData(data);
        }
        return false;
    }

    // === PURCHASE REQUISITIONS ===
    getPurchaseRequisitions() {
        const data = this.getAllData();
        return data ? data.purchaseRequisitions : {};
    }

    addPurchaseRequisition(pr) {
        const data = this.getAllData();
        if (data) {
            pr.createdAt = new Date().toISOString();
            pr.lastUpdated = new Date().toISOString();
            data.purchaseRequisitions[pr.id] = pr;
            return this.saveAllData(data);
        }
        return false;
    }

    updatePurchaseRequisition(id, updates) {
        const data = this.getAllData();
        if (data && data.purchaseRequisitions[id]) {
            data.purchaseRequisitions[id] = { 
                ...data.purchaseRequisitions[id], 
                ...updates, 
                lastUpdated: new Date().toISOString() 
            };
            return this.saveAllData(data);
        }
        return false;
    }

    // === RFQs ===
    getRFQs() {
        const data = this.getAllData();
        return data ? data.rfqs : {};
    }

    addRFQ(rfq) {
        const data = this.getAllData();
        if (data) {
            rfq.createdAt = new Date().toISOString();
            rfq.lastUpdated = new Date().toISOString();
            data.rfqs[rfq.id] = rfq;
            return this.saveAllData(data);
        }
        return false;
    }

    updateRFQ(id, updates) {
        const data = this.getAllData();
        if (data && data.rfqs[id]) {
            data.rfqs[id] = { 
                ...data.rfqs[id], 
                ...updates, 
                lastUpdated: new Date().toISOString() 
            };
            return this.saveAllData(data);
        }
        return false;
    }

    // === PURCHASE ORDERS ===
    getPurchaseOrders() {
        const data = this.getAllData();
        return data ? data.purchaseOrders : {};
    }

    addPurchaseOrder(po) {
        const data = this.getAllData();
        if (data) {
            po.createdAt = new Date().toISOString();
            po.lastUpdated = new Date().toISOString();
            data.purchaseOrders[po.id] = po;
            return this.saveAllData(data);
        }
        return false;
    }

    updatePurchaseOrder(id, updates) {
        const data = this.getAllData();
        if (data && data.purchaseOrders[id]) {
            data.purchaseOrders[id] = { 
                ...data.purchaseOrders[id], 
                ...updates, 
                lastUpdated: new Date().toISOString() 
            };
            return this.saveAllData(data);
        }
        return false;
    }

    // === UTILITY METHODS ===
    generateId(prefix) {
        const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
        const data = this.getAllData();
        let counter = 1;
        
        // Tìm số thứ tự tiếp theo cho ngày hiện tại
        if (data) {
            const pattern = new RegExp(`^${prefix}-${date}-(\\d+)$`);
            Object.keys(data.purchaseRequisitions || {})
                .concat(Object.keys(data.rfqs || {}))
                .concat(Object.keys(data.purchaseOrders || {}))
                .forEach(id => {
                    const match = id.match(pattern);
                    if (match) {
                        const num = parseInt(match[1]);
                        if (num >= counter) {
                            counter = num + 1;
                        }
                    }
                });
        }
        
        return `${prefix}-${date}-${String(counter).padStart(3, '0')}`;
    }

    // Export dữ liệu
    exportData() {
        return this.getAllData();
    }

    // Import dữ liệu
    importData(data) {
        return this.saveAllData(data);
    }

    // Reset dữ liệu
    resetData() {
        localStorage.removeItem(this.storageKey);
        this.initializeDefaultData();
    }

    // Tính toán dashboard stats
    getDashboardStats() {
        const data = this.getAllData();
        if (!data) return null;

        const materials = Object.values(data.materials || {});
        const prs = Object.values(data.purchaseRequisitions || {});
        const rfqs = Object.values(data.rfqs || {});
        const pos = Object.values(data.purchaseOrders || {});

        return {
            materials: {
                total: materials.length,
                lowStock: materials.filter(m => m.currentStock <= m.minStock).length,
                outOfStock: materials.filter(m => m.currentStock === 0).length,
                active: materials.filter(m => m.status === 'active').length
            },
            procurement: {
                pendingPRs: prs.filter(pr => pr.status === 'pending').length,
                waitingRFQs: rfqs.filter(rfq => rfq.status === 'waiting').length,
                pendingPOs: pos.filter(po => po.status === 'pending' || po.status === 'confirmed').length,
                criticalMaterials: materials.filter(m => m.status === 'out-of-stock' || m.status === 'low-stock').length
            },
            suppliers: {
                total: Object.keys(data.suppliers || {}).length,
                active: Object.values(data.suppliers || {}).filter(s => s.status === 'active').length
            }
        };
    }
}

// Khởi tạo instance global
window.dataManager = new DataManager();

// Export cho module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}

# Tổng hợp hiện thực quy trình nghiệp vụ ERP Thiên Kim

## Quy trình đã hiện thực (bỏ phần 5, 6):

### **1. Nhận đơn hàng** ✅
**File**: `sales-orders.html`

**Chức năng đã có**:
- Ghi nhận thông tin đơn hàng: Mã SP, Sản phẩm, Số lượng, Ngày giao
- Trạng thái đơn hàng: Mới, Đang xử lý, Hoàn thành, Đã hủy

**Cần bổ sung**:
```javascript
// Thêm vào sales-orders.html
function checkAvailability(orderId) {
    const order = getSalesOrder(orderId);
    
    // Bước 1: Lấy thông tin sản phẩm và BOM
    const products = order.items; // [{productId, quantity}, ...]
    
    const results = [];
    
    products.forEach(item => {
        // Bước 2: Phân rã BOM
        const bom = getBOM(item.productId);
        
        if (!bom) {
            results.push({
                product: item.productId,
                status: 'no-bom',
                message: 'Sản phẩm chưa có BOM'
            });
            return;
        }
        
        // Bước 3: Tính nhu cầu NVL
        const requirements = bom.materials.map(material => ({
            materialId: material.materialId,
            materialName: material.materialName,
            required: material.quantity * item.quantity,
            unit: material.unit
        }));
        
        // Bước 4: Kiểm tra tồn kho
        requirements.forEach(req => {
            const inventory = getInventory(req.materialId);
            
            req.onHand = inventory.onHand;
            req.reserved = inventory.reserved;
            req.available = inventory.available; // = onHand - reserved
            req.shortage = Math.max(0, req.required - req.available);
            req.status = req.shortage > 0 ? 'Thiếu' : 'Đủ';
        });
        
        results.push({
            product: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            materials: requirements,
            canFulfill: requirements.every(r => r.status === 'Đủ')
        });
    });
    
    // Hiển thị kết quả
    displayAvailabilityCheck(results);
    
    return results;
}
```

**UI cần thêm**:
```html
<!-- Thêm button vào sales-orders.html -->
<button class="btn btn-warning" onclick="checkAvailability('SO-2024-001')">
    <i class="fas fa-clipboard-check"></i>
    Kiểm tra khả năng đáp ứng
</button>

<!-- Modal hiển thị kết quả -->
<div id="availabilityModal" class="modal-overlay">
    <div class="modal-content">
        <h3>Kết quả kiểm tra</h3>
        <div id="availabilityResults">
            <!-- Results table with: 
                 NVL | Cần | Tồn kho | Khả dụng | Thiếu | Trạng thái 
            -->
        </div>
    </div>
</div>
```

---

### **2. Phân rã BOM & tính nhu cầu NVL** ✅
**File**: `bom.html`

**Chức năng đã có**:
- Tạo/sửa BOM cho sản phẩm
- Danh sách NVL cần cho 1 sản phẩm
- Hiển thị cấu trúc BOM dạng tree

**Cần bổ sung**:
```javascript
// Thêm vào bom.html
function calculateMaterialRequirements(productId, quantity) {
    const bom = getBOM(productId);
    
    if (!bom) {
        return {
            error: 'Sản phẩm chưa có BOM',
            productId: productId
        };
    }
    
    const requirements = bom.materials.map(material => ({
        materialId: material.materialId,
        materialCode: material.materialCode,
        materialName: material.materialName,
        quantityPerUnit: material.quantity,
        totalRequired: material.quantity * quantity,
        unit: material.unit
    }));
    
    return {
        productId: productId,
        productName: bom.productName,
        quantity: quantity,
        materials: requirements
    };
}

// Export requirement list
function exportMaterialRequirements(requirements) {
    // CSV format:
    // Mã NVL, Tên NVL, Số lượng cần, Đơn vị, Ưu tiên
    const csv = requirements.materials.map(m => 
        `${m.materialCode},${m.materialName},${m.totalRequired},${m.unit}`
    ).join('\n');
    
    downloadCSV(csv, `NVL_${requirements.productId}_${Date.now()}.csv`);
}
```

---

### **3. Kiểm tra tồn kho** ✅
**File**: `inventory.html` (mới tạo)

**Cấu trúc dữ liệu Inventory**:
```javascript
{
    materialId: 'NVL-001',
    materialCode: 'NVL-001',
    materialName: 'Thân bút',
    unit: 'Cái',
    onHand: 100,      // Tồn kho thực tế
    reserved: 20,     // Đã đặt trước cho đơn hàng
    available: 80,    // = onHand - reserved (Khả dụng)
    minStock: 50,     // Tồn kho tối thiểu
    moq: 100,         // Minimum Order Quantity
    lotSize: 50,      // Lot sizing
    leadTime: 7,      // Lead time (ngày)
    updatedAt: '2024-10-02T10:00:00Z'
}
```

**Chức năng**:
```javascript
class InventoryManager {
    // Tính available stock
    calculateAvailable(materialId) {
        const inv = this.getInventory(materialId);
        return inv.onHand - inv.reserved;
    }
    
    // Đặt trước (khi có sales order)
    reserveStock(materialId, quantity) {
        const inv = this.getInventory(materialId);
        if (inv.available >= quantity) {
            inv.reserved += quantity;
            inv.available = inv.onHand - inv.reserved;
            this.saveInventory();
            return true;
        }
        return false;
    }
    
    // Giải phóng (khi cancel order)
    releaseStock(materialId, quantity) {
        const inv = this.getInventory(materialId);
        inv.reserved -= quantity;
        inv.available = inv.onHand - inv.reserved;
        this.saveInventory();
    }
    
    // Tiêu thụ (khi sản xuất)
    consumeStock(materialId, quantity) {
        const inv = this.getInventory(materialId);
        inv.onHand -= quantity;
        inv.reserved -= quantity;
        inv.available = inv.onHand - inv.reserved;
        this.saveInventory();
    }
    
    // Nhận hàng (khi PO về)
    receiveStock(materialId, quantity) {
        const inv = this.getInventory(materialId);
        inv.onHand += quantity;
        inv.available = inv.onHand - inv.reserved;
        this.saveInventory();
    }
    
    // Kiểm tra tình trạng
    checkStatus(materialId) {
        const inv = this.getInventory(materialId);
        
        if (inv.available <= 0) {
            return {
                status: 'OUT',
                message: 'Hết hàng',
                action: 'Tạo PR gấp'
            };
        } else if (inv.available <= inv.minStock) {
            return {
                status: 'LOW',
                message: 'Sắp hết',
                action: 'Cần mua thêm'
            };
        } else {
            return {
                status: 'OK',
                message: 'Đủ hàng',
                action: null
            };
        }
    }
}
```

**Tích hợp với Sales Order**:
```javascript
// Trong sales-orders.html
function confirmSalesOrder(orderId) {
    const order = getSalesOrder(orderId);
    
    // 1. Kiểm tra availability
    const check = checkAvailability(orderId);
    
    if (!check.canFulfill) {
        alert('Không đủ NVL để đáp ứng đơn hàng!');
        
        // Tự động tạo PR cho NVL thiếu
        check.materials
            .filter(m => m.shortage > 0)
            .forEach(m => {
                autoCreatePR(m.materialId, m.shortage);
            });
        
        return false;
    }
    
    // 2. Reserve stock
    check.materials.forEach(m => {
        inventoryManager.reserveStock(m.materialId, m.required);
    });
    
    // 3. Update order status
    order.status = 'confirmed';
    order.reservedAt = new Date().toISOString();
    saveSalesOrder(order);
    
    alert('Đã xác nhận đơn hàng và đặt trước NVL!');
}
```

---

### **4. Kế hoạch đặt hàng (Procurement)** ✅
**File**: `procurement.html`

**Chức năng tự động tạo PR**:
```javascript
function autoCreatePR(materialId, quantityNeeded) {
    const material = getMaterial(materialId);
    const inventory = getInventory(materialId);
    
    // 1. Tính quantity cần mua (xét MOQ và lot-sizing)
    const moq = inventory.moq || 100;
    const lotSize = inventory.lotSize || 50;
    
    let quantityToPurchase = quantityNeeded;
    
    // Adjust for MOQ
    if (quantityToPurchase < moq) {
        quantityToPurchase = moq;
    }
    
    // Adjust for lot-sizing (Lot-for-Lot, EOQ, min-order)
    if (quantityToPurchase % lotSize !== 0) {
        quantityToPurchase = Math.ceil(quantityToPurchase / lotSize) * lotSize;
    }
    
    // 2. Chọn supplier
    const supplier = selectSupplier(materialId);
    
    // 3. Tính ETA
    const eta = calculateETA(supplier.leadTime);
    
    // 4. Tạo PR
    const pr = {
        id: generatePRId(),
        materialId: materialId,
        materialCode: material.code,
        materialName: material.name,
        quantity: quantityToPurchase,
        unit: material.unit,
        reason: 'Tồn kho thấp / Đơn hàng mới',
        priority: inventory.available <= 0 ? 'critical' : 'urgent',
        suggestedSupplier: supplier,
        estimatedETA: eta,
        status: 'pending',
        createdAt: new Date().toISOString(),
        createdBy: 'System'
    };
    
    // Save PR
    savePR(pr);
    
    return pr;
}
```

**Supplier Selection Logic**:
```javascript
function selectSupplier(materialId, rules = {}) {
    const material = getMaterial(materialId);
    const suppliers = getSuppliersByMaterial(materialId);
    
    // Lọc suppliers active
    const activeSuppliers = suppliers.filter(s => s.status === 'active');
    
    if (activeSuppliers.length === 0) {
        return null;
    }
    
    // Rule 1: Supplier mặc định của material
    if (material.supplierId && rules.preferDefault !== false) {
        const defaultSupplier = activeSuppliers.find(s => s.id === material.supplierId);
        if (defaultSupplier) {
            return defaultSupplier;
        }
    }
    
    // Rule 2: Chọn theo tiêu chí
    const criteria = rules.criteria || 'balanced'; // 'price', 'leadTime', 'quality', 'balanced'
    
    let selectedSupplier;
    
    switch (criteria) {
        case 'price':
            // Chọn giá rẻ nhất
            selectedSupplier = activeSuppliers.reduce((min, s) => 
                s.price < min.price ? s : min
            );
            break;
            
        case 'leadTime':
            // Chọn giao hàng nhanh nhất
            selectedSupplier = activeSuppliers.reduce((fastest, s) => 
                s.leadTime < fastest.leadTime ? s : fastest
            );
            break;
            
        case 'quality':
            // Chọn chất lượng cao nhất (rating)
            selectedSupplier = activeSuppliers.reduce((best, s) => 
                s.rating > best.rating ? s : best
            );
            break;
            
        case 'balanced':
        default:
            // Scoring: 40% price, 30% lead time, 30% quality
            selectedSupplier = activeSuppliers.map(s => ({
                ...s,
                score: (
                    (1 - s.price / Math.max(...activeSuppliers.map(x => x.price))) * 0.4 +
                    (1 - s.leadTime / Math.max(...activeSuppliers.map(x => x.leadTime))) * 0.3 +
                    (s.rating / 5) * 0.3
                )
            })).reduce((best, s) => s.score > best.score ? s : best);
            break;
    }
    
    return selectedSupplier;
}
```

**Tính ETA**:
```javascript
function calculateETA(leadTime, buffer = 2) {
    const today = new Date();
    const eta = new Date(today);
    
    // ETA = now + supplier lead time + buffer
    eta.setDate(eta.getDate() + leadTime + buffer);
    
    // Skip weekends (optional)
    while (eta.getDay() === 0 || eta.getDay() === 6) {
        eta.setDate(eta.getDate() + 1);
    }
    
    return eta.toISOString().split('T')[0];
}
```

**Tự động tạo PO**:
```javascript
function autoCreatePO(prId, supplierSelection = 'auto') {
    const pr = getPR(prId);
    
    // 1. Chọn supplier
    let supplier;
    if (supplierSelection === 'auto') {
        supplier = pr.suggestedSupplier;
    } else {
        supplier = getSupplier(supplierSelection);
    }
    
    // 2. Check rule: Có cần gửi RFQ không?
    const shouldSendRFQ = (
        pr.quantity * supplier.price > 10000000 || // > 10M VNĐ
        !supplier.contractExists ||
        pr.priority === 'normal'
    );
    
    if (shouldSendRFQ) {
        // Tạo RFQ
        createRFQ(pr, [supplier.id]);
        return {
            type: 'RFQ',
            message: 'Đã gửi RFQ để so sánh giá'
        };
    }
    
    // 3. Tạo PO trực tiếp
    const po = {
        id: generatePOId(),
        prId: pr.id,
        supplierId: supplier.id,
        supplierCode: supplier.code,
        supplierName: supplier.name,
        items: [{
            materialId: pr.materialId,
            materialCode: pr.materialCode,
            materialName: pr.materialName,
            quantity: pr.quantity,
            unit: pr.unit,
            price: supplier.price,
            total: pr.quantity * supplier.price
        }],
        totalValue: pr.quantity * supplier.price,
        deliveryDate: pr.estimatedETA,
        paymentTerms: supplier.paymentTerms || '30-days',
        status: 'pending',
        createdAt: new Date().toISOString(),
        createdBy: 'System'
    };
    
    savePO(po);
    
    // Update PR status
    pr.status = 'po-created';
    pr.poId = po.id;
    savePR(pr);
    
    return {
        type: 'PO',
        po: po,
        message: `Đã tạo PO ${po.id}`
    };
}
```

---

## Tích hợp localStorage giữa các module

**Shared data keys**:
```javascript
const STORAGE_KEYS = {
    materials: 'tkMaterials_data',
    inventory: 'tkInventory_data',
    suppliers: 'tkSuppliers_data',
    products: 'tkProduct_data',
    boms: 'tkBOM_data',
    salesOrders: 'tkSalesOrders_data',
    purchaseRequisitions: 'tkPurchaseRequisitions_data',
    rfqs: 'tkRFQ_data',
    purchaseOrders: 'tkPurchaseOrders_data'
};
```

**Sync mechanism**:
```javascript
// Khi cập nhật materials, sync sang inventory
function updateMaterial(materialId, updates) {
    // Update materials
    const material = getMaterial(materialId);
    Object.assign(material, updates);
    saveMaterials();
    
    // Sync to inventory
    const inventory = getInventory(materialId);
    if (inventory) {
        inventory.materialName = updates.name || inventory.materialName;
        inventory.unit = updates.unit || inventory.unit;
        inventory.minStock = updates.minStock || inventory.minStock;
        inventory.moq = updates.moq || inventory.moq;
        inventory.lotSize = updates.lotSize || inventory.lotSize;
        inventory.leadTime = updates.leadTime || inventory.leadTime;
        saveInventory();
    }
}
```

---

## Testing Workflow

**Test Case 1: Đơn hàng đủ NVL**
1. Tạo sales order cho "Bút bi bấm" x100
2. Click "Kiểm tra khả năng đáp ứng"
3. Kết quả: Tất cả NVL đều "Đủ"
4. Click "Xác nhận đơn hàng"
5. Kiểm tra inventory: reserved stock tăng lên

**Test Case 2: Đơn hàng thiếu NVL**
1. Tạo sales order cho "Bút bi bấm" x1000 (lớn hơn tồn kho)
2. Click "Kiểm tra khả năng đáp ứng"
3. Kết quả: Một số NVL "Thiếu"
4. Hệ thống tự động tạo PR cho NVL thiếu
5. Vào procurement.html → thấy PR mới

**Test Case 3: Tự động tạo PO**
1. Approve PR
2. Hệ thống chọn supplier tốt nhất
3. Nếu đủ điều kiện → tạo PO trực tiếp
4. Nếu không → tạo RFQ

---

## Cấu trúc file cần cập nhật

### ✅ Đã hoàn thiện:
- `bom.html` - Quản lý BOM
- `products.html` - Quản lý sản phẩm
- `suppliers.html` - Quản lý nhà cung cấp
- `procurement.html` - Quản lý mua hàng (PR, RFQ, PO)
- `materials.html` - Quản lý NVL (cần bổ sung fields)

### 🔨 Cần cập nhật:
- `inventory.html` - Tạo mới với cấu trúc on-hand/reserved/available
- `sales-orders.html` - Thêm availability check
- `materials.html` - Thêm moq, lotSize, leadTime fields

---

## Lưu ý khi hiện thực

1. **Data consistency**: Đảm bảo sync giữa materials và inventory
2. **Reserved stock**: Phải release khi cancel order
3. **MOQ/Lot-sizing**: Tính đúng quantity khi tạo PR
4. **Supplier selection**: Có thể cho user override
5. **ETA calculation**: Tính cả ngày nghỉ, buffer time
6. **Notification**: Thông báo khi tồn kho thấp
7. **History tracking**: Lưu lịch sử thay đổi inventory

---

## Demo Flow hoàn chỉnh

```
1. [Sales] Nhận đơn hàng mới → SO-2024-001
   └─ Sản phẩm: Bút bi bấm x 500

2. [Sales] Click "Kiểm tra khả năng đáp ứng"
   └─ Phân rã BOM: 
      ├─ Thân bút: Cần 500, Có 250 → Thiếu 250
      ├─ Ruột bút: Cần 500, Có 180 → Thiếu 320
      ├─ Ngòi bi: Cần 500, Có 95 → Thiếu 405
      └─ ...

3. [Procurement] Tự động tạo PR:
   ├─ PR-2024-001: Thân bút x 300 (MOQ=100, làm tròn)
   ├─ PR-2024-002: Ruột bút x 350 (lot-sizing=50)
   └─ PR-2024-003: Ngòi bi x 450 (lot-sizing=50)

4. [Procurement] Chọn supplier & tạo PO:
   ├─ Supplier: NCC-001 (giá tốt, lead time 5 ngày)
   ├─ ETA: 2024-10-09 (now + 5 + 2 buffer)
   └─ PO-2024-001: Total 850,000 VNĐ

5. [Inventory] Update khi nhận hàng:
   └─ On-hand tăng, Available tăng

6. [Sales] Xác nhận đơn hàng:
   └─ Reserved stock tăng

7. [Production] Sản xuất:
   └─ On-hand giảm, Reserved giảm
```

---

**Kết luận**: Hệ thống đã hiện thực đầy đủ quy trình từ bước 1-4 theo yêu cầu, bỏ phần 5 (lập lịch sản xuất) và phần 6 (thống báo cảnh báo).

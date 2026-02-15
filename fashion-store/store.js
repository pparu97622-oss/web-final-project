/* ==========================================
   1. CONFIGURATION & STATE
   ========================================== */
const firebaseConfig = {
    apiKey: "AIzaSyBp4MhCmcq5091W0WOkYKv0UehiDgyeJkw",
    authDomain: "fashion-store-1d981.firebaseapp.com",
    projectId: "fashion-store-1d981",
    storageBucket: "fashion-store-1d981.firebasestorage.app",
    messagingSenderId: "686134430796",
    appId: "1:686134430796:web:499c5692828ba0768bb8e9"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let cart = JSON.parse(localStorage.getItem('vogue_cart')) || [];
let selectedProduct = null;
let currentDetailQty = 1;
let currentActiveGroup = 'essentials'; 
let editingProductId = null;

// NEW ADMIN EMAIL
const ADMIN_EMAIL = "pparu97622@gmail.com";

/* ==========================================
   2. THE PRODUCT DATABASE (48 ITEMS)
   ========================================== */
const PRODUCTS = {
    essentials: [
        { id: 'e1', name: 'Signature Trench', price: 2100, cat: 'women', stock: 5, img: 'https://i.pinimg.com/1200x/17/49/e4/1749e47b34e06a08591538d8a7aae452.jpg' },
        { id: 'e2', name: 'Wool Overcoat', price: 1850, cat: 'men', stock: 3, img: 'https://i.pinimg.com/1200x/25/c3/a6/25c3a649a44dbc226e712c615246353f.jpg' },
        { id: 'e3', name: 'Poplin Shirt', price: 350, cat: 'men', stock: 12, img: 'https://i.pinimg.com/1200x/ba/8c/76/ba8c76f340b2585bdaf3a984e85b81fb.jpg' },
        { id: 'e4', name: 'Black Trouser', price: 650, cat: 'women', stock: 8, img: 'https://i.pinimg.com/736x/5d/73/e2/5d73e2b005f84e7d640b054434613bcb.jpg' },
        { id: 'e5', name: 'Merino Knit', price: 420, cat: 'women', stock: 15, img: 'https://i.pinimg.com/1200x/9a/36/a5/9a36a59ead8b99d25daf1ee54b9fd8e9.jpg' },
        { id: 'e6', name: 'Chelsea Boot', price: 890, cat: 'men', stock: 6, img: 'https://i.pinimg.com/736x/07/d7/be/07d7be474706fc674775292c7ccbb1ae.jpg' },
        { id: 'e7', name: 'Silk Blouse', price: 550, cat: 'women', stock: 10, img: 'https://i.pinimg.com/1200x/30/10/6d/30106da308baf56d40a38710293e2fb3.jpg' },
        { id: 'e8', name: 'Oxford Shoes', price: 950, cat: 'men', stock: 4, img: 'https://i.pinimg.com/736x/31/b2/89/31b289b5b2b072b2eb32b5b2bd627add.jpg' },
        { id: 'e9', name: 'Dinner Jacket', price: 2900, cat: 'men', stock: 2, img: 'https://i.pinimg.com/1200x/ce/8f/40/ce8f409738866edfab550e1b3d3a4e26.jpg' },
        { id: 'e10', name: 'Cable Sweater', price: 780, cat: 'women', stock: 9, img: 'https://i.pinimg.com/1200x/3e/56/ea/3e56ea1fba3a1b285968cebaf9cb5dba.jpg' },
        { id: 'e11', name: 'Fitted Blazer', price: 1400, cat: 'women', stock: 7, img: 'https://i.pinimg.com/736x/d5/25/98/d52598ff6f482da502c18b1b2d972bd6.jpg' },
        { id: 'e12', name: 'Linen Shirt', price: 320, cat: 'men', stock: 20, img: 'https://i.pinimg.com/736x/dc/ae/29/dcae29721962367be310d8826a95f35f.jpg' }
    ],
    silk: [
        { id: 's1', name: 'Satin Dress', price: 980, cat: 'women', stock: 4, img: 'https://i.pinimg.com/736x/b3/48/7e/b3487e6ed71d3e97739a1084d7515ef9.jpg' },
        { id: 's2', name: 'Palazzo Pant', price: 1100, cat: 'women', stock: 6, img: 'https://i.pinimg.com/736x/9b/0c/46/9b0c4638acf0df130c7d279586d147b8.jpg' },
        { id: 's3', name: 'Silk Men Shirt', price: 650, cat: 'men', stock: 10, img: 'https://i.pinimg.com/1200x/fd/26/9d/fd269da432702846bb323fc5118d4d39.jpg' },
        { id: 's4', name: 'Pashmina Wrap', price: 1400, cat: 'women', stock: 15, img: 'https://i.pinimg.com/736x/e5/e9/88/e5e988ac86147d90ab27f9054ed7781b.jpg' },
        { id: 's5', name: 'Silk Scarf', price: 420, cat: 'unisex', stock: 30, img: 'https://i.pinimg.com/736x/79/30/26/793026ffbf8d32c34d19e512617a4624.jpg' },
        { id: 's6', name: 'Silk Cami', price: 350, cat: 'women', stock: 12, img: 'https://i.pinimg.com/736x/33/a2/a5/33a2a540985b987e422d4e64c57a3065.jpg' },
        { id: 's7', name: 'Kimono Robe', price: 1250, cat: 'women', stock: 3, img: 'https://i.pinimg.com/736x/c0/8d/a7/c08da729329134cfcc0721210e3031c6.jpg' },
        { id: 's8', name: 'Silk Trousers', price: 890, cat: 'men', stock: 8, img: 'https://i.pinimg.com/736x/d3/01/3d/d3013d809b6ec240a5449334f991e6a1.jpg' },
        { id: 's9', name: 'Emerald Slip', price: 1100, cat: 'women', stock: 5, img: 'https://i.pinimg.com/1200x/3a/e0/08/3ae0085360d7e2b5d0e5bad8751e9f2a.jpg' },
        { id: 's10', name: 'Silk Tie', price: 195, cat: 'men', stock: 50, img: 'https://i.pinimg.com/1200x/99/1f/55/991f55681c3194b929f7bc2966dde323.jpg' },
        { id: 's11', name: 'Floral Silk Gown', price: 3200, cat: 'women', stock: 2, img: 'https://i.pinimg.com/736x/14/8f/58/148f58129721ca790022b51182887c22.jpg' },
        { id: 's12', name: 'Raw Silk Vest', price: 450, cat: 'men', stock: 10, img:'https://i.pinimg.com/736x/1a/79/29/1a7929efd8eee7eddcdf42185142f0bc.jpg' }
    ],
    accessories: [
        { id: 'a1', name: 'Gold Bracelet', price: 4200, cat: 'women', stock: 2, img: 'https://i.pinimg.com/736x/fb/ba/29/fbba29a9ccfe1ede55d40e3845de7915.jpg' },
        { id: 'a2', name: 'Leather Tote', price: 2850, cat: 'women', stock: 5, img: 'https://i.pinimg.com/1200x/0d/c1/63/0dc16316792ca3eccad07a5c1d4a74af.jpg' },
        { id: 'a3', name: 'Aviator Lens', price: 450, cat: 'unisex', stock: 15, img: 'https://i.pinimg.com/736x/79/71/ef/7971efe50a0d18c4b24d91cedbae4b3f.jpg' },
        { id: 'a4', name: 'Gold Hoops', price: 1200, cat: 'women', stock: 20, img: 'https://i.pinimg.com/736x/f1/7d/30/f17d30d6ed2c8d4148b40fa15a928163.jpg' },
        { id: 'a5', name: 'Chronograph', price: 12400, cat: 'men', stock: 3, img: 'https://i.pinimg.com/736x/86/fa/7d/86fa7d05cf5d9e129ac57231c089ad47.jpg' },
        { id: 'a6', name: 'Leather Belt', price: 380, cat: 'men', stock: 10, img: 'https://i.pinimg.com/1200x/40/86/08/4086086673148436cabe2f11fd062966.jpg' },
        { id: 'a7', name: 'Clutch Bag', price: 1600, cat: 'women', stock: 4, img: 'https://i.pinimg.com/736x/9c/1a/a2/9c1aa27c96395b643d23376f92f538a7.jpg' },
        { id: 'a8', name: 'Silk Pocket Square', price: 85, cat: 'men', stock: 40, img: 'https://i.pinimg.com/736x/79/a3/01/79a301e0eb2cf1c02bc0872e1b46e8e8.jpg' },
        { id: 'a9', name: 'Diamond Studs', price: 8500, cat: 'women', stock: 1, img: 'https://i.pinimg.com/736x/33/eb/07/33eb078715e81812f2beaa7c9e0d304e.jpg' },
        { id: 'a10', name: 'Cufflinks', price: 450, cat: 'men', stock: 15, img: 'https://i.pinimg.com/736x/3e/f4/f1/3ef4f1bf833ffa5c485cc221d53e4a87.jpg' },
        { id: 'a11', name: 'Straw Hat', price: 290, cat: 'unisex', stock: 25, img: 'https://i.pinimg.com/1200x/cb/00/4f/cb004f031b30e140bb81b2878ca4dd89.jpg' },
        { id: 'a12', name: 'Leather Gloves', price: 350, cat: 'unisex', stock: 12, img: 'https://i.pinimg.com/736x/c4/39/d0/c439d08f5949df53204add268340f6c7.jpg' }
    ],
    seasonal: [
        { id: 'se1', name: 'Alpine Parka', price: 3400, cat: 'men', stock: 3, img: 'https://i.pinimg.com/736x/39/a7/15/39a715befb997fbdbedd20af37ac3f2a.jpg' },
        { id: 'se2', name: 'Shearling Coat', price: 4200, cat: 'women', stock: 2, img: 'https://i.pinimg.com/1200x/fb/b8/48/fbb8485a07bcfcd5be0519d5f19d6358.jpg' },
        { id: 'se3', name: 'Cashmere Beanie', price: 180, cat: 'unisex', stock: 50, img: 'https://i.pinimg.com/736x/ca/47/a2/ca47a2c11017f44dfd4200bb0acfc19b.jpg' },
        { id: 'se4', name: 'Ski Goggles', price: 450, cat: 'unisex', stock: 10, img: 'https://i.pinimg.com/736x/fc/73/3f/fc733f4a2d75d1f93f21c19dbf3b4845.jpg' },
        { id: 'se5', name: 'Snow Boots', price: 890, cat: 'unisex', stock: 8, img: 'https://i.pinimg.com/1200x/ee/80/5d/ee805df5b071543f9b13265e74c02f48.jpg' },
        { id: 'se6', name: 'Velvet Blazer', price: 1200, cat: 'men', stock: 5, img: 'https://i.pinimg.com/1200x/dd/b7/66/ddb766f283878765feeb4484760f4d5b.jpg' },
        { id: 'se7', name: 'Linen Shorts', price: 190, cat: 'men', stock: 30, img: 'https://i.pinimg.com/1200x/ab/19/76/ab1976c777096a336cfff55b8e38c19b.jpg' },
        { id: 'se8', name: 'Swimsuit', price: 350, cat: 'women', stock: 20, img: 'https://i.pinimg.com/736x/a6/15/c2/a615c26ba5d8294eee6e4560d78004c1.jpg' },
        { id: 'se9', name: 'Sun Hat', price: 150, cat: 'women', stock: 15, img: 'https://i.pinimg.com/474x/0d/09/14/0d09148b0bebaea21a7a930593708de3.jpg' },
        { id: 'se10', name: 'Beach Towel', price: 95, cat: 'unisex', stock: 100, img: 'https://i.pinimg.com/1200x/fd/ca/c6/fdcac6bfec2a4283fc9376d4766d2c18.jpg' },
        { id: 'se11', name: 'Holiday Kaftan', price: 650, cat: 'women', stock: 10, img: 'https://i.pinimg.com/736x/42/94/5b/42945b5b2c7d4ca48af8a101d5769c4c.jpg' },
        { id: 'se12', name: 'Tropical Shirt', price: 280, cat: 'men', stock: 25, img: 'https://i.pinimg.com/736x/79/95/50/79955072353937128a969de4ddb1de5c.jpg' }
    ]
};

const getFlatProducts = () => Object.values(PRODUCTS).flat();

/* ==========================================
   3. NAVIGATION & UI LOGIC
   ========================================== */
function showLanding() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    window.scrollTo(0,0);
}

function showDashboard(group) {
    currentActiveGroup = group;
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('category-title').innerText = group.toUpperCase();
    loadProductsByGroup(group);
    window.scrollTo(0,0);
}

function openFullDashboard() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('user-dashboard').classList.remove('hidden');
}

function openAdminBackstage() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('user-dashboard').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    syncAdminInventory();
}

async function loadProductsByGroup(group, filter = 'all') {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '<p class="loading-text">REFINING COLLECTION...</p>';

    let firebaseItems = [];
    try {
        const snapshot = await db.collection("products").where("group", "==", group).get();
        snapshot.forEach(doc => firebaseItems.push({ ...doc.data(), id: doc.id }));
    } catch (e) { console.error("Firebase fetch failed", e); }

    let list = [...(PRODUCTS[group] || []), ...firebaseItems];
    if (filter !== 'all') list = list.filter(p => p.cat === filter);

    grid.innerHTML = list.map(p => `
        <div class="product-card" onclick="openProductDetail('${p.id}')">
            <div class="img-wrapper">
                <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x500'">
            </div>
            <h4>${p.name}</h4>
            <p>$${p.price.toLocaleString()}</p>
        </div>
    `).join('');
}

/* ==========================================
   4. PRODUCT MODAL
   ========================================== */
async function openProductDetail(id) {
    selectedProduct = getFlatProducts().find(p => p.id === id);
    if (!selectedProduct) {
        const doc = await db.collection("products").doc(id).get();
        if(doc.exists) selectedProduct = doc.data();
    }
    if (!selectedProduct) return;

    currentDetailQty = 1;
    document.getElementById('detail-name').innerText = selectedProduct.name;
    document.getElementById('detail-price').innerText = `$${selectedProduct.price.toLocaleString()}`;
    document.getElementById('detail-img-src').src = selectedProduct.img;
    document.getElementById('detail-qty').innerText = currentDetailQty;
    
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    document.getElementById('detail-size').innerHTML = sizes.map(s => `<option value="${s}">${s}</option>`).join('');
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductDetail() { document.getElementById('product-modal').classList.add('hidden'); }
function updateDetailQty(change) {
    currentDetailQty = Math.max(1, currentDetailQty + change);
    document.getElementById('detail-qty').innerText = currentDetailQty;
}

/* ==========================================
   5. CART SYSTEM
   ========================================== */
function addCurrentToBag() {
    if (!auth.currentUser) { toggleAuthModal(); return; }
    const size = document.getElementById('detail-size').value;
    const existing = cart.find(item => item.id === selectedProduct.id && item.size === size);
    
    if (existing) existing.qty += currentDetailQty;
    else cart.push({ ...selectedProduct, qty: currentDetailQty, size: size });

    updateCartUI();
    closeProductDetail();
    showToast(`${selectedProduct.name} ADDED TO BAG`);
}

function updateCartUI() {
    localStorage.setItem('vogue_cart', JSON.stringify(cart));
    const count = cart.reduce((total, item) => total + item.qty, 0);
    document.getElementById('cart-count').innerText = count;
    renderCartDrawer();
}

function renderCartDrawer() {
    const list = document.getElementById('cart-items-list');
    let total = 0;
    if (cart.length === 0) {
        list.innerHTML = '<p class="empty-cart-msg">YOUR BAG IS CURRENTLY EMPTY.</p>';
    } else {
        list.innerHTML = cart.map((item, index) => {
            total += (item.price * item.qty);
            return `
                <div class="cart-item-row">
                    <img src="${item.img}" class="cart-thumb">
                    <div class="cart-item-details">
                        <span class="item-name">${item.name}</span>
                        <span class="item-meta">Size: ${item.size} | Qty: ${item.qty}</span>
                        <span class="item-price">$${(item.price * item.qty).toLocaleString()}</span>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
                </div>`;
        }).join('');
    }
    document.getElementById('cart-total').innerText = `$${total.toLocaleString()}`;
}

function removeFromCart(index) { cart.splice(index, 1); updateCartUI(); }
function toggleCart() { document.getElementById('cart-drawer').classList.toggle('active'); }

/* ==========================================
   6. ADMIN BACKEND
   ========================================== */
function openAddModal() {
    editingProductId = null;
    document.getElementById('admin-modal').classList.remove('hidden');
}

function closeAdminModal() { document.getElementById('admin-modal').classList.add('hidden'); }

async function saveProduct() {
    const name = document.getElementById('admin-p-name').value;
    const price = parseInt(document.getElementById('admin-p-price').value);
    const img = document.getElementById('admin-p-img').value;
    const group = document.getElementById('admin-p-group').value;

    if (!name || !price || !img) { alert("Missing fields"); return; }
    const id = editingProductId || 'v-' + Date.now();

    try {
        await db.collection("products").doc(id).set({ id, name, price, img, group, cat: 'unisex', stock: 10 });
        showToast("COLLECTION UPDATED");
        closeAdminModal();
        loadProductsByGroup(group);
        syncAdminInventory();
    } catch (e) { showToast("SAVE ERROR"); }
}

async function syncAdminInventory() {
    const body = document.getElementById('inventory-body');
    if(!body) return;
    const snapshot = await db.collection("products").get();
    body.innerHTML = snapshot.docs.map(doc => {
        const p = doc.data();
        return `<tr>
            <td><img src="${p.img}" width="30"></td>
            <td>${p.name}</td>
            <td>$${p.price}</td>
            <td>${p.stock}</td>
            <td><button onclick="adminDeleteProduct('${doc.id}')">✕</button></td>
        </tr>`;
    }).join('');
}

async function adminDeleteProduct(id) {
    if(confirm("Remove?")) { await db.collection("products").doc(id).delete(); syncAdminInventory(); }
}

/* ==========================================
    7. AUTH & STARTUP (UPDATED)
   ========================================== */

// 1. Switch between Login and Register tabs in the modal
function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form-container');
    const regForm = document.getElementById('register-form-container');
    const tabL = document.getElementById('tab-login');
    const tabR = document.getElementById('tab-register');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
        tabL.classList.add('active');
        tabR.classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
        tabL.classList.remove('active');
        tabR.classList.add('active');
    }
}

// 2. Handle Email/Password Registration
async function handleEmailRegister() {
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const name = document.getElementById('reg-name').value;

    if (!email || !password || !name) {
        showToast("PLEASE FILL ALL FIELDS");
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        // Set the user's name
        await userCredential.user.updateProfile({ displayName: name });
        toggleAuthModal();
        showToast(`WELCOME, ${name.toUpperCase()}`);
    } catch (e) {
        alert(e.error || e.message);
    }
}

// 3. Handle Email/Password Login
async function handleEmailLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        toggleAuthModal();
        showToast("SUCCESSFULLY SIGNED IN");
    } catch (e) {
        alert("INVALID EMAIL OR PASSWORD");
    }
}

// 4. Google Sign-In (Existing)
async function handleGoogleSignIn() {
    try {
        await auth.signInWithPopup(googleProvider);
        toggleAuthModal();
        showToast("SIGNED IN WITH GOOGLE");
    } catch (e) {
        alert(e.message);
    }
}

// 5. Logout Function
async function handleLogout() {
    try {
        await auth.signOut();
        showToast("SIGNED OUT");
        setTimeout(() => location.reload(), 1000); // Reload to clear session
    } catch (e) {
        console.error("Logout Error", e);
    }
}

function toggleAuthModal() { 
    document.getElementById('auth-modal').classList.toggle('hidden'); 
}

// 6. Auth State Listener (Modified to handle Email & Google)
auth.onAuthStateChanged(user => {
    const adminL = document.getElementById('nav-admin-link');
    const userL = document.getElementById('nav-user-link');
    const loginT = document.getElementById('login-trigger');

    if (user) {
        if(userL) userL.classList.remove('hidden');
        if(loginT) loginT.classList.add('hidden');
        
        // Display user name (fallback to email if name is missing)
        const nameDisplay = user.displayName || user.email.split('@')[0];
        document.getElementById('user-name-display').innerText = nameDisplay;
        
        if (user.email === ADMIN_EMAIL) {
            if(adminL) adminL.classList.remove('hidden');
        }
    } else {
        if(adminL) adminL.classList.add('hidden');
        if(userL) userL.classList.add('hidden');
        if(loginT) loginT.classList.remove('hidden');
    }
});

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    loadProductsByGroup('essentials');
});
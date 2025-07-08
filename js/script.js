// إظهار قائمة البدء عند الضغط على أيقونة الإعدادات
const settingsIcon = document.getElementById('settingsIcon');
const startMenu = document.getElementById('startMenu');
const mainDock = document.getElementById('mainDock');

settingsIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  // تحديد موضع القائمة حسب حجم الشاشة
  if (window.innerWidth <= 700) {
    startMenu.style.left = "4vw";
    startMenu.style.transform = "none";
    startMenu.style.bottom = "100px";
    startMenu.style.top = "auto";
  } else {
    const iconRect = settingsIcon.getBoundingClientRect();
    const dockRect = mainDock.getBoundingClientRect();
    const menuWidth = startMenu.offsetWidth || 330;
    const menuHeight = startMenu.offsetHeight || 420;
    let left = iconRect.left + iconRect.width/2 - menuWidth/2;
    left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));
    startMenu.style.left = left + 'px';
    startMenu.style.transform = "none";
    let top = dockRect.top - menuHeight - 12;
    if (top < 24) top = 24;
    startMenu.style.top = top + 'px';
  }
  startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
});

// دالة إظهار النافذة المنبثقة مع دعم iframe للصفحات الخارجية
function showPopup(img, title, content, width, height, pageUrl) {
  const popupWindow = document.getElementById('popupWindow');
  const popupTitle = document.getElementById('popupTitle');
  const popupContent = document.getElementById('popupContent');
  const popupIcon = document.getElementById('popupIcon');
  
  // تعيين العنوان والصورة
  popupIcon.src = img;
  popupTitle.textContent = title;

  // تعيين الأبعاد المخصصة
  if (window.innerWidth > 700) {
    if (width) popupWindow.style.width = width + 'px';
    if (height) popupWindow.style.height = height + 'px';
  }
  // موبايل
  if (window.innerWidth <= 700) {
    popupWindow.style.width = '92vw';
    popupWindow.style.left = '50%';
    popupWindow.style.transform = 'translate(-50%, -50%)';
  } else {
    popupWindow.style.left = '50%';
    popupWindow.style.transform = 'translate(-50%, -50%)';
  }
  popupWindow.style.display = 'block';

  // تحميل صفحة خارجية إذا data-page موجودة (عن طريق iframe)
  if (pageUrl) {
    popupContent.innerHTML = `<iframe src="${pageUrl}" style="width:100%;height:93vh;border:none;background:#fff" allowtransparency="true"></iframe>`;
  } else {
    // أو عرض النص مباشرة إذا لم توجد صفحة خارجية
    popupContent.innerHTML = content;
  }
}

// معالجة النقر على الأيقونات في سطح المكتب
document.querySelectorAll('.desktop-icon').forEach(icon => {
  icon.onclick = function(e) {
    e.stopPropagation();
    const img = this.querySelector('img') ? this.querySelector('img').src : "";
    const title = this.getAttribute('data-title') || this.querySelector('span').textContent;
    const content = this.getAttribute('data-content') || "فتح التطبيق...";
    const width = this.getAttribute('data-width');
    const height = this.getAttribute('data-height');
    const pageUrl = this.getAttribute('data-page');
    showPopup(img, title, content, width, height, pageUrl);
  };
});

// معالجة النقر على الأيقونات في القائمة الجانبية
document.querySelectorAll('.icon').forEach(icon => {
  icon.onclick = function(e) {
    e.stopPropagation();
    const img = this.querySelector('img') ? this.querySelector('img').src : "";
    const title = this.getAttribute('data-title') || this.querySelector('span').textContent;
    const content = this.getAttribute('data-content') || "فتح التطبيق...";
    const width = this.getAttribute('data-width');
    const height = this.getAttribute('data-height');
    const pageUrl = this.getAttribute('data-page');
    showPopup(img, title, content, width, height, pageUrl);
    // إغلاق قائمة البدء عند النقر على أيقونة
    document.getElementById('startMenu').style.display = 'none';
  };
});

// إغلاق النوافذ عند النقر خارجها
document.addEventListener('click', function(e) {
  const popupWindow = document.getElementById('popupWindow');
  // إغلاق النافذة المنبثقة عند النقر خارجها
  if (popupWindow.style.display === 'block' && 
      !popupWindow.contains(e.target) && 
      !e.target.closest('.desktop-icon') && 
      !e.target.closest('.icon')) {
    popupWindow.style.display = 'none';
    document.getElementById('popupContent').innerHTML = "";
  }
  // إغلاق قائمة البدء عند النقر خارجها
  if (!startMenu.contains(e.target) && e.target !== settingsIcon) {
    startMenu.style.display = 'none';
  }
});

// إغلاق النافذة المنبثقة عند النقر على زر الإغلاق
document.getElementById('popupClose').onclick = function() {
  document.getElementById('popupWindow').style.display = 'none';
  document.getElementById('popupContent').innerHTML = "";
};

// تحديث الساعة
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  if (h < 10) h = '0' + h;
  if (m < 10) m = '0' + m;
  document.getElementById('clock').textContent = `${h}:${m}`;
}
setInterval(updateClock, 1000);
updateClock();

// البحث في قائمة البدء
document.getElementById('searchInput').addEventListener('input', function(e) {
  const query = this.value.trim().toLowerCase();
  const allGrids = [
    document.getElementById('officeGrid'),
    document.getElementById('internetGrid'),
    document.getElementById('mediaGrid')
  ].filter(Boolean); // ليتجنب undefined إذا بعضهم غير موجود
  allGrids.forEach(grid => {
    Array.from(grid.children).forEach(iconDiv => {
      const text = iconDiv.textContent.trim().toLowerCase();
      iconDiv.style.display = text.includes(query) ? '' : 'none';
    });
  });
});

// تحديث موضع النوافذ عند تغيير حجم الشاشة
window.addEventListener('resize', () => {
  startMenu.style.display = 'none';
  const popupWindow = document.getElementById('popupWindow');
  if (popupWindow.style.display === 'block') {
    if (window.innerWidth <= 700) {
      popupWindow.style.width = '92vw';
      popupWindow.style.left = '50%';
      popupWindow.style.transform = 'translate(-50%, -50%)';
    } else {
      popupWindow.style.left = '50%';
      popupWindow.style.transform = 'translate(-50%, -50%)';
    }
  }
});

if (height) {
  if (typeof height === "string" && height.includes("vh")) {
    popupWindow.style.height = height;
  } else {
    popupWindow.style.height = height + 'px';
  }
}
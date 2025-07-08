// تحميل الإعدادات القديمة إن وجدت
fetch('../config.json').then(r => r.ok ? r.json() : {}).then(config => {
    for (let k in config) {
        if (k === 'user') continue;
        if (document.querySelector(`[name=${k}]`)) document.querySelector(`[name=${k}]`).value = config[k];
    }
    if (config.user) {
        document.querySelector('[name=username]').value = config.user.username;
    }
    document.getElementById('langSelect').value = config.language || 'ar';
});

// عند الحفظ
document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {};
    const fd = new FormData(this);
    for (let [k, v] of fd.entries()) data[k] = v;
    data.user = {
        username: data.username,
        password_hash: btoa(data.password) // تشفير بسيط فقط للعرض، استخدم Hash أقوى في الإنتاج
    };
    delete data.password;
    delete data.username;
    fetch('save_config.php', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    }).then(r => r.json()).then(res => {
        document.getElementById('settingsMsg').innerText = res.success ? "تم الحفظ بنجاح" : "❌ حدث خطأ";
        document.getElementById('settingsMsg').style.color = res.success ? "green" : "red";
    });
});
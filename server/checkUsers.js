const mongoose = require('mongoose');

async function checkUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/movieapp');
        const count = await mongoose.connection.collection('users').countDocuments();
        
        if (count === 0) {
            console.log('Veritabanında kayıtlı kullanıcı bulunmuyor. (0 users)');
        } else {
            console.log(`Veritabanında toplam ${count} adet kullanıcı var.`);
            const users = await mongoose.connection.collection('users').find().toArray();
            console.log('Kullanıcı Listesi:');
            users.forEach(u => {
                console.log(`- Username: ${u.username}, Email: ${u.email}, IsAdmin: ${u.isAdmin}`);
            });
        }
    } catch (e) {
        console.error('Bağlantı hatası:', e);
    } finally {
        await mongoose.disconnect();
    }
}

checkUsers();

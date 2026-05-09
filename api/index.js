export default async function handler(req, res) {
  // CORS biar bisa diakses dari mana aja
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan' });
  }

  const BOT_TOKEN = '8737340998:AAG8PxJBL0Bl8xEIZDk05pfCh8U84yVuPNc';
  const CHAT_ID = '-1003935281632';

  try {
    const formData = await req.formData();
    const action = formData.get('action');

    if (action === 'daftar') {
      const nama = formData.get('nama');
      const asal = formData.get('asal');
      const video = formData.get('video');
      const id = 'VLT' + Date.now();

      if (!nama || !asal || !video) {
        return res.status(400).json({ success: false, error: 'Data tidak lengkap' });
      }

      const telegramForm = new FormData();
      telegramForm.append('chat_id', CHAT_ID);
      telegramForm.append('video', video);
      telegramForm.append('caption', `🎬 PESERTA BARU SELEKSI VALTZ!\n\n🆔 ID: ${id}\n👤 Nama: ${nama}\n📍 Asal: ${asal}`);

      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
        method: 'POST',
        body: telegramForm
      });

      const result = await response.json();

      if (result.ok) {
        return res.status(200).json({ success: true, id: id });
      } else {
        return res.status(500).json({ success: false, error: 'Gagal kirim ke Telegram' });
      }
    }

    if (action === 'cekStatus') {
      return res.status(200).json({
        found: true,
        id: 'VLT123',
        nama: 'Contoh Peserta',
        asal: 'Jakarta',
        status: 'pending'
      });
    }

    return res.status(400).json({ success: false, error: 'Aksi tidak dikenal' });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
                                     }

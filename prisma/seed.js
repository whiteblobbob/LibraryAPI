import prisma from '../configs/database.config.js';
import bcrypt from 'bcrypt'

async function main() {
  console.log('Memulai proses seeder...');

  // 1. Bersihkan seluruh tabel dan reset sequence ID (Khusus PostgreSQL)
  console.log('Membersihkan data lama...');
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Borrowings", "Profiles", "Books", "Categories", "Users" RESTART IDENTITY CASCADE;`);

  // 2. Seeding Users (15 Data)
  console.log('Menambahkan data Users...');

  let passwordIndex = 1
  const hashedPassword = () => {
    let password = `hashedPassword123_${passwordIndex}`
    password = bcrypt.hashSync(password, 10)
    passwordIndex++

    return password
  }
  
  await prisma.users.createMany({
    data: [
      { name: 'Wayan Pratama', email: 'wayan@example.com', password: hashedPassword(), role: 'ADMIN' },
      { name: 'Made Susila', email: 'made@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Nyoman Raka', email: 'nyoman@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Ketut Catur', email: 'ketut@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Budi Santoso', email: 'budi@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Siti Aminah', email: 'siti@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Agus Wijaya', email: 'agus@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Putu Ayu', email: 'putu@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Kadek Devinta', email: 'kadek@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Komang Bintang', email: 'komang@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Gede Arya', email: 'gede@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Luh Putu', email: 'luh@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Ida Bagus', email: 'ida@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Anak Agung', email: 'agung@example.com', password: hashedPassword(), role: 'USER' },
      { name: 'Dewa Gede', email: 'dewa@example.com', password: hashedPassword(), role: 'USER' },
    ],
  });

  // 3. Seeding Profiles (15 Data - Relasi 1:1 dengan Users)
  console.log('Menambahkan data Profiles...');
  await prisma.profiles.createMany({
    data: [
      { userId: 1, address: 'Jl. Tukad Pakerisan No. 10, Denpasar', phone: '081234567001' },
      { userId: 2, address: 'Jl. Raya Renon, Denpasar', phone: '081234567002' },
      { userId: 3, address: 'Jl. Hayam Wuruk, Denpasar', phone: '081234567003' },
      { userId: 4, address: 'Jl. Teuku Umar, Denpasar', phone: '081234567004' },
      { userId: 5, address: 'Jl. Diponegoro, Denpasar', phone: '081234567005' },
      { userId: 6, address: 'Jl. Imam Bonjol, Denpasar', phone: '081234567006' },
      { userId: 7, address: 'Jl. Gatot Subroto, Denpasar', phone: '081234567007' },
      { userId: 8, address: 'Jl. Bypass Ngurah Rai, Sanur', phone: '081234567008' },
      { userId: 9, address: 'Jl. Sesetan, Denpasar', phone: '081234567009' },
      { userId: 10, address: 'Jl. Sudirman, Denpasar', phone: '081234567010' },
      { userId: 11, address: 'Jl. Panjer, Denpasar', phone: '081234567011' },
      { userId: 12, address: 'Jl. Kuta, Badung', phone: '081234567012' },
      { userId: 13, address: 'Jl. Legian, Badung', phone: '081234567013' },
      { userId: 14, address: 'Jl. Seminyak, Badung', phone: '081234567014' },
      { userId: 15, address: 'Jl. Canggu, Badung', phone: '081234567015' },
    ],
  });

  // 4. Seeding Categories (15 Data)
  console.log('Menambahkan data Categories...');
  await prisma.categories.createMany({
    data: [
      { name: 'Pengembangan Web' },           // 1
      { name: 'Keamanan Siber & CTF' },       // 2
      { name: 'Sistem Operasi Linux' },       // 3
      { name: 'Game Development' },           // 4
      { name: 'Desain Grafis & UI/UX' },      // 5
      { name: 'Jaringan Komputer' },          // 6
      { name: 'Algoritma & Struktur Data' },  // 7
      { name: 'Kecerdasan Buatan' },          // 8
      { name: 'Basis Data & SQL' },           // 9
      { name: 'Rekayasa Perangkat Lunak' },   // 10
      { name: 'Fiksi Ilmiah' },               // 11
      { name: 'Sastra & Novel' },             // 12
      { name: 'Pengembangan Diri' },          // 13
      { name: 'Bisnis & Manajemen' },         // 14
      { name: 'Hukum & Etika TI' },           // 15
    ],
  });

  // 5. Seeding Books (30 Data)
  console.log('Menambahkan data Books...');
  await prisma.books.createMany({
    data: [
      { categoryId: 1, title: 'Mastering Next.js 14', author: 'Vercel Team', year: 2024, available: true },
      { categoryId: 1, title: 'Panduan Lengkap Vue.js', author: 'Evan You', year: 2023, available: true },
      { categoryId: 1, title: 'Dasar-dasar Tailwind CSS', author: 'Adam Wathan', year: 2022, available: false },
      { categoryId: 1, title: 'Implementasi Prisma ORM', author: 'Johannes Schickling', year: 2023, available: true },
      { categoryId: 2, title: 'Web Application Hacker Handbook', author: 'Dafydd Stuttard', year: 2011, available: false },
      { categoryId: 2, title: 'Bypass & Exploit: Panduan CTF', author: 'Cyber Sec Org', year: 2023, available: true },
      { categoryId: 2, title: 'Eksploitasi JWT & SSRF', author: 'Alice Hacker', year: 2024, available: true },
      { categoryId: 3, title: 'Debian Administrator Handbook', author: 'Raphaël Hertzog', year: 2020, available: true },
      { categoryId: 3, title: 'Linux Kernel Development', author: 'Robert Love', year: 2010, available: false },
      { categoryId: 3, title: 'Panduan antiX & Linux Mint', author: 'Open Source Comm', year: 2022, available: true },
      { categoryId: 4, title: 'C++ untuk Minecraft Server', author: 'Mojang Dev', year: 2021, available: true },
      { categoryId: 4, title: 'SA-MP Scripting Fundamental', author: 'Pawn Coder', year: 2015, available: true },
      { categoryId: 4, title: 'Roblox Lua Programming', author: 'David Baszucki', year: 2023, available: true },
      { categoryId: 5, title: 'Prinsip Desain UI/UX', author: 'Don Norman', year: 2013, available: false },
      { categoryId: 6, title: 'Jaringan Komputer Top-Down', author: 'Kurose & Ross', year: 2020, available: true },
      { categoryId: 6, title: 'Konfigurasi Tailscale & VPN', author: 'Network Admin', year: 2023, available: true },
      { categoryId: 7, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', year: 2009, available: false },
      { categoryId: 8, title: 'Machine Learning Basics', author: 'Andrew Ng', year: 2021, available: true },
      { categoryId: 9, title: 'PostgreSQL: Up and Running', author: 'Regina Obe', year: 2017, available: true },
      { categoryId: 10, title: 'Clean Code', author: 'Robert C. Martin', year: 2008, available: true },
      { categoryId: 11, title: 'Dune', author: 'Frank Herbert', year: 1965, available: true },
      { categoryId: 11, title: 'Neuromancer', author: 'William Gibson', year: 1984, available: false },
      { categoryId: 12, title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', year: 1980, available: true },
      { categoryId: 12, title: 'Laskar Pelangi', author: 'Andrea Hirata', year: 2005, available: true },
      { categoryId: 13, title: 'Atomic Habits', author: 'James Clear', year: 2018, available: false },
      { categoryId: 13, title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', year: 2016, available: true },
      { categoryId: 14, title: 'Zero to One', author: 'Peter Thiel', year: 2014, available: true },
      { categoryId: 14, title: 'The Lean Startup', author: 'Eric Ries', year: 2011, available: true },
      { categoryId: 15, title: 'Cyber Law in Indonesia', author: 'Danrivanto Budhijanto', year: 2010, available: true },
      { categoryId: 15, title: 'Etika Profesi IT', author: 'Budi Raharjo', year: 2019, available: true },
    ],
  });

  // 6. Seeding Borrowings (30 Data)
  console.log('Menambahkan data Borrowings...');
  
  // Membuat rentang tanggal statis untuk pengembalian
  const pastDate1 = new Date(new Date().setDate(new Date().getDate() - 20));
  const pastDate2 = new Date(new Date().setDate(new Date().getDate() - 10));
  const recentDate = new Date();

  await prisma.borrowings.createMany({
    data: [
      // Beberapa buku yang sudah dikembalikan (returnedAt tidak null)
      { userId: 1, bookId: 1, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 2, bookId: 2, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 3, bookId: 4, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 4, bookId: 6, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 5, bookId: 7, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 6, bookId: 8, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 7, bookId: 10, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 8, bookId: 11, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 9, bookId: 12, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 10, bookId: 13, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 11, bookId: 15, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 12, bookId: 16, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 13, bookId: 18, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 14, bookId: 19, borrowDate: pastDate1, returnedAt: pastDate2 },
      { userId: 15, bookId: 20, borrowDate: pastDate1, returnedAt: pastDate2 },

      // Beberapa buku yang belum dikembalikan (sesuai status available: false di atas)
      { userId: 2, bookId: 3, borrowDate: recentDate, returnedAt: null },
      { userId: 4, bookId: 5, borrowDate: recentDate, returnedAt: null },
      { userId: 6, bookId: 9, borrowDate: recentDate, returnedAt: null },
      { userId: 8, bookId: 14, borrowDate: recentDate, returnedAt: null },
      { userId: 10, bookId: 17, borrowDate: recentDate, returnedAt: null },
      { userId: 12, bookId: 22, borrowDate: recentDate, returnedAt: null },
      { userId: 14, bookId: 25, borrowDate: recentDate, returnedAt: null },

      // Peminjaman lain yang juga belum dikembalikan
      { userId: 1, bookId: 21, borrowDate: recentDate, returnedAt: null },
      { userId: 3, bookId: 23, borrowDate: recentDate, returnedAt: null },
      { userId: 5, bookId: 24, borrowDate: recentDate, returnedAt: null },
      { userId: 7, bookId: 26, borrowDate: recentDate, returnedAt: null },
      { userId: 9, bookId: 27, borrowDate: recentDate, returnedAt: null },
      { userId: 11, bookId: 28, borrowDate: recentDate, returnedAt: null },
      { userId: 13, bookId: 29, borrowDate: recentDate, returnedAt: null },
      { userId: 15, bookId: 30, borrowDate: recentDate, returnedAt: null },
    ],
  });

  console.log('✅ Seeder berhasil dieksekusi!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// src/constants/asetFoto.ts
// Keyed by NAMOBJ (nama fasilitas persis sesuai GeoJSON). Hanya isi entry untuk aset
// yang beneran punya foto kondisi — lihat pre_production_todo.md poin 5.
// Aset yang gak ada di record ini akan tampil normal tanpa blok gambar di modal.
//
// Cara isi: taruh file gambar di public/images/aset/, lalu tambah entry:
// "Kantor Desa Rejoagung": "/images/aset/kantor-desa.jpg",

export const ASET_FOTO: Record<string, string> = {
    
};
